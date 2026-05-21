# TrailVista Expeditions — PRD

## Original Problem Statement
Build a production-quality **Phase 1 (frontend-only)** website for "TrailVista Expeditions" — a premium Himalayan trekking, travel package, and expedition booking platform. The UI must feel cinematic, editorial, and trustworthy — inspired by "CLIMB BEYOND LIMITS" style hero references. No backend, auth, payments, or admin in this phase.

## Architecture
- **Stack**: React 19 + React Router 7 + Tailwind CSS + Framer Motion + react-fast-marquee + Lucide React + shadcn/ui primitives
- **Theme system**: ThemeContext (localStorage-persisted dark/light)
- **Data**: Local dummy data in `src/data/treksData.js` (treks, reviews, blog posts, destinations, categories)
- **Routing**: 15 routes (13 unique pages + dynamic `/trek/:id`, `/destinations/:id`, `/categories/:id`)

## User Personas
- Beginner trekkers / college students discovering their first Himalayan trek
- Adventure enthusiasts comparing fixed departures
- Corporate / family groups looking for custom trips
- Experienced trekkers seeking high-altitude expeditions

## Core Requirements (Static)
- Cinematic full-screen hero with layered editorial typography
- Floating glassmorphism navbar with dropdowns (Destinations / Categories)
- Light/dark theme toggle (persisted)
- Trek discovery → filter/sort → detail → enquiry flow
- Animated horizontal gallery + review marquees (subtle, professional)
- Sticky booking sidebar on trek detail
- Enquiry / brochure modals with success state
- 25k+ trekkers, 4.9 rating, safety-first trust signals

## What's Been Implemented (2026-05-21)
- ✅ Cinematic layered hero: CLIMB (solid) / BEYOND (outline) / LIMITS (glacier accent) over parallaxed Himalayan mountain image
- ✅ Floating glassmorphism navbar w/ dropdowns + light/dark theme toggle
- ✅ All 13 pages: Home, AllTreks, TrekDetail, Expeditions, Departures, Destinations, Categories, About, Safety, Blog, Gallery, Reviews, Contact
- ✅ 10 dummy treks with realistic prices/itineraries/altitudes/dates
- ✅ Trek filtering + sorting (region, difficulty, duration, price, season)
- ✅ Enquiry modal w/ success state, Contact form w/ success state
- ✅ Gallery masonry + category filter + lightbox modal
- ✅ Animated gallery + review marquees with pause-on-hover
- ✅ Sticky booking card on TrekDetail with consistent CTA stack (Book Now / Send Enquiry / WhatsApp + Brochure 2-col)
- ✅ Footer with newsletter input, social links, contact info
- ✅ Mobile responsive + hamburger menu
- ✅ 43/43 testing-agent checks passed, 0 console errors

## Prioritized Backlog

### P0 — Not started (Phase 2 candidates)
- [ ] Supabase backend integration (auth, treks, bookings, enquiries)
- [ ] Razorpay payment integration for booking flow
- [ ] n8n automation for enquiry/booking notifications

### P1
- [ ] Admin dashboard (trek CRUD, booking management, enquiry inbox)
- [ ] Brochure download modal + actual PDF generation
- [ ] Email/SMS confirmation flow

### P2 (UX polish)
- [ ] Keyboard + ARIA support on navbar dropdowns
- [ ] Date-picker for enquiry travel month (vs hardcoded options)
- [ ] Hero copy/image variants per season (December = winter focus, etc.)
- [ ] Blog detail pages (currently listing only)
- [ ] Video testimonial player on Reviews page (currently placeholders)
- [ ] Real Google Maps embed on Contact page (currently placeholder)

## Next Tasks
1. Validate visual output with user; gather feedback on hero / brand feel
2. On approval, scope Phase 2: Supabase schema + auth + Razorpay booking flow
3. Plan n8n workflows for enquiry → WhatsApp / email handoff
