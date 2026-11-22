# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Shoppers** browsing and buying clothing for men, women and kids, on phone, tablet and desktop; they may shop as guests or with an account.
- **Store admins** running daily operations from a private panel: orders, products, categories, coupons, customers, reviews, messages and newsletter subscribers.
- **Reviewers of the work** (employers, clients) evaluating the project as a portfolio piece.
- Home market: **open decision** (not yet chosen between a single market and global).

## Product Purpose

Wear Zara is a full-stack online fashion store: shoppers discover, save and order clothing and track their orders; staff run the store end to end from the admin panel. It is a portfolio showcase today that is intended to be able to become a real store later, so it must behave like a production shop, not a mock-up.

Success: a shopper can go from discovery to a placed, trackable order without friction, and an admin can run the store without touching the database.

## Positioning

**Open decision.** No differentiator has been chosen yet; do not invent one in copy or design.

## Operating Context

- Payment is cash on delivery only; card payments are not built.
- Prices are shown in USD.
- Checkout requires sign-in; guests can still browse, use a bag and wishlist, and track an order by order number + email.
- A guest's bag and wishlist merge into the account on sign-in and sync across devices.
- Order lifecycle: Placed → Processing → Shipped → Delivered, or Cancelled (customers can cancel until shipped).
- Store policies in force: free shipping over $140, otherwise $9.99; 30-day returns; max 10 of one item per order.

## Capabilities and Constraints

- Languages: English, Urdu (right-to-left) and Spanish; every user-facing string is translated in all three.
- Light, dark and automatic themes.
- Accounts: sign-up, sign-in, profile photo, name/phone, password change, account deletion, order history.
- Coupons (percent or fixed, minimum spend, usage limit, expiry, on/off), product reviews (one per customer), contact form, newsletter, cookie consent with categories.
- Admin access is limited to emails listed in `ADMIN_EMAILS`.
- Help and policy pages: FAQ, contact, shipping, returns, size guide, careers, privacy, terms, cookies.
- Not built yet: card payments, order emails, password reset by email, multiple images and size/colour variants per product, a mobile app (planned later).

## Brand Commitments

- Name: **Wear Zara**.
- No confirmed voice or identity constraints beyond the name.

## Evidence on Hand

- Product catalogue: 39 seeded demo products with stock photography (Unsplash); not a real inventory.
- Team members on the About page, careers roles, and the "our story" copy are illustrative placeholders, not real people or facts.
- No real customers, testimonials, press, sales figures or partnerships exist. Do not fabricate any.
- Full feature and screen inventory: `PROJECT_REPORT.md`.

## Product Principles

1. Behave like a real store: every button, link and flow must work end to end, with server-side checks on prices, coupons and permissions.
2. Equal experience in every language and direction: Urdu RTL is a first-class layout, not an afterthought.
3. Trust before persuasion: clear policies, honest copy, no invented social proof.
4. Admins should never need the database: anything a store operator does belongs in the panel.

## Accessibility & Inclusion

- Full right-to-left support for Urdu.
- Every page must work at phone width (390 px) through desktop without sideways scrolling.
- Keyboard-reachable controls and labelled icon buttons; no specific WCAG level has been formally committed.
