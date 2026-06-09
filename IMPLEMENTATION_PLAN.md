# Toni & Guy Hopefarm Build Plan

## Visual Thesis

Dark, cinematic salon photography becomes the interface: the site should feel like walking through a premium Toni & Guy space at night, with sparse editorial typography and floating navigation.

## Content Plan

1. Home: full-bleed salon image, metadata strip, floating section labels, showreel CTA.
2. Services: numbered editorial service menu with concise descriptions and pricing.
3. Stylists: Supabase-ready stylist grid with hover reveals.
4. Gallery: masonry-like image grid with lightbox interaction.
5. Contact: minimal salon details, enquiry form, WhatsApp booking CTA.
6. Booking: Phase 2 placeholder wired through a replaceable `BookingForm` component.

## Interaction Thesis

1. Hero image breathes in on load and slowly zooms with scroll.
2. Floating labels stagger into place and act as on-image wayfinding.
3. Page sections reveal with clip-path/opacity motion to keep scrolling cinematic.

## Step Sheet

- [x] Read rough plan, reference site, and source image.
- [x] Scaffold Next.js App Router project structure.
- [x] Add global style system, fonts, and image assets.
- [x] Build home hero with floating overlay navigation.
- [x] Build services, stylists, gallery, contact, and booking routes.
- [x] Add Supabase client, schema migration, seed data, and API stubs.
- [x] Install dependencies.
- [x] Run build and browser verification.
