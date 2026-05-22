import html
import logging
import os
import smtplib
from email.message import EmailMessage
from typing import Any

logger = logging.getLogger(__name__)

SUPPORT_EMAIL = os.environ.get("SMTP_SUPPORT_EMAIL", "support@trailvista.com")
SUPPORT_PHONE = os.environ.get("SMTP_SUPPORT_PHONE", "+91 98765 43210")
BRAND_SITE = os.environ.get("TRAILVISTA_SITE_URL", "https://trailvista.com")


def _smtp_configured() -> bool:
    required = ("SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM_EMAIL")
    missing = [key for key in required if not os.environ.get(key)]
    if missing:
        logger.warning("SMTP not configured, missing: %s", ", ".join(missing))
        return False
    return True


def _esc(value: Any) -> str:
    return html.escape(str(value) if value is not None else "")


def _format_amount(amount: Any, currency: str) -> str:
    try:
        value = float(amount)
    except (TypeError, ValueError):
        return f"{amount} {currency}"
    if currency.upper() == "INR":
        return f"₹{value:,.0f}"
    return f"{value:,.2f} {currency}"


def _trek_label(booking_details: dict[str, Any]) -> str:
    return (
        booking_details.get("trek_name")
        or booking_details.get("trek_id")
        or "TrailVista Trek"
    )


def _build_email_content(booking_details: dict[str, Any]) -> tuple[str, str, str]:
    customer_name = booking_details.get("customer_name") or "Explorer"
    customer_email = booking_details.get("customer_email", "")
    trek_name = booking_details.get("trek_name") or ""
    trek_id = booking_details.get("trek_id", "")
    trek_label = _trek_label(booking_details)
    amount_display = _format_amount(
        booking_details.get("amount"),
        booking_details.get("currency", "INR"),
    )
    currency = booking_details.get("currency", "INR")
    order_id = booking_details.get("razorpay_order_id", "—")
    payment_id = booking_details.get("razorpay_payment_id", "—")
    booking_status = booking_details.get("booking_status", "confirmed")
    payment_status = booking_details.get("payment_status", "paid")
    booked_at = booking_details.get("booked_at", "—")

    trek_line = f"{trek_name} ({trek_id})" if trek_name and trek_id else trek_label

    subject = f"TrailVista Booking Confirmed - {trek_label}"

    text_body = f"""TRAILVISTA EXPEDITIONS
Booking Confirmed

Hi {customer_name},

Thank you for booking with TrailVista Expeditions. Your payment was received and your trek booking is confirmed.

BOOKING SUMMARY
---------------
Status:          {booking_status.title()}
Payment status:  {payment_status.title()}
Trek:            {trek_line}
Amount paid:     {amount_display}
Currency:        {currency}
Booked at:       {booked_at}

PAYMENT REFERENCE
-----------------
Razorpay order id:   {order_id}
Razorpay payment id: {payment_id}

CUSTOMER
--------
Email: {customer_email}

WHAT'S NEXT
-----------
Our expedition team will contact you with batch details, packing checklist, and meeting point instructions.

SUPPORT
-------
Email: {SUPPORT_EMAIL}
Phone: {SUPPORT_PHONE}
Website: {BRAND_SITE}

Please keep this email for your records.

— TrailVista Expeditions
Himalayan trekking & expeditions
"""

    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{_esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#e2e8f0;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e2e8f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#020617 0%,#0c4a6e 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;">TrailVista Expeditions</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:1px;">
                TRAIL<span style="color:#38bdf8;">VISTA</span>
              </h1>
              <p style="margin:12px 0 0;font-size:14px;color:#cbd5e1;">Himalayan trekking &amp; expeditions</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#ecfdf5;border:1px solid #86efac;border-radius:10px;padding:14px 18px;text-align:center;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#166534;letter-spacing:0.5px;text-transform:uppercase;">
                      ✓ Booking Confirmed
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:16px;color:#0f172a;">Hi {_esc(customer_name)},</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                Thank you for choosing <strong style="color:#0f172a;">TrailVista Expeditions</strong>.
                Your payment was received successfully and your trek booking is now confirmed.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background-color:#f8fafc;padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#0284c7;text-transform:uppercase;letter-spacing:0.5px;">Booking summary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;width:42%;border-bottom:1px solid #f1f5f9;">Trek</td>
                  <td style="padding:12px 20px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">{_esc(trek_line)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Amount paid</td>
                  <td style="padding:12px 20px;font-size:14px;font-weight:700;color:#ea580c;border-bottom:1px solid #f1f5f9;">{_esc(amount_display)} <span style="font-weight:500;color:#64748b;">({_esc(currency)})</span></td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Booking status</td>
                  <td style="padding:12px 20px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;text-transform:capitalize;">{_esc(booking_status)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Payment status</td>
                  <td style="padding:12px 20px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;text-transform:capitalize;">{_esc(payment_status)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Booked at</td>
                  <td style="padding:12px 20px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;">{_esc(booked_at)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Customer email</td>
                  <td style="padding:12px 20px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;">{_esc(customer_email)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="background-color:#f8fafc;padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#0284c7;text-transform:uppercase;letter-spacing:0.5px;">Payment reference</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Razorpay order id</td>
                  <td style="padding:12px 20px;font-size:13px;font-family:Consolas,monospace;color:#0f172a;border-bottom:1px solid #f1f5f9;">{_esc(order_id)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#64748b;">Razorpay payment id</td>
                  <td style="padding:12px 20px;font-size:13px;font-family:Consolas,monospace;color:#0f172a;">{_esc(payment_id)}</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0369a1;">What happens next?</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
                      Our expedition team will reach out with departure details, fitness guidelines, and a packing checklist for your trek.
                    </p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#c2410c;">Need assistance?</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
                      Email <a href="mailto:{_esc(SUPPORT_EMAIL)}" style="color:#0284c7;text-decoration:none;font-weight:600;">{_esc(SUPPORT_EMAIL)}</a>
                      &nbsp;·&nbsp; Call {_esc(SUPPORT_PHONE)}
                    </p>
                    <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">Please keep this email for your records.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#020617;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                © TrailVista Expeditions · <a href="{_esc(BRAND_SITE)}" style="color:#38bdf8;text-decoration:none;">{_esc(BRAND_SITE)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return subject, text_body, html_body


def _send_message(msg: EmailMessage, from_email: str, to_email: str) -> None:
    host = os.environ["SMTP_HOST"]
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASS"]

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=20) as server:
            server.login(user, password)
            server.send_message(msg, from_addr=from_email, to_addrs=[to_email])
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(user, password)
            server.send_message(msg, from_addr=from_email, to_addrs=[to_email])


def send_booking_confirmation_email(to_email: str, booking_details: dict[str, Any]) -> bool:
    """Send booking confirmation email. Never raises — returns True on success."""
    if not to_email or not to_email.strip():
        logger.warning("booking confirmation email skipped: empty recipient")
        return False

    if not _smtp_configured():
        return False

    from_email = os.environ["SMTP_FROM_EMAIL"]
    from_name = os.environ.get("SMTP_FROM_NAME", "TrailVista Expeditions")
    recipient = to_email.strip()

    try:
        subject, text_body, html_body = _build_email_content(booking_details)

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = recipient
        message.set_content(text_body, charset="utf-8")
        message.add_alternative(html_body, subtype="html", charset="utf-8")

        _send_message(message, from_email, recipient)
        logger.info("booking confirmation email sent to=%s", recipient)
        return True
    except Exception as exc:
        logger.error("booking confirmation email failed to=%s error=%s", to_email, exc)
        return False
