# Wear Zara — Project Report

*A complete overview of the Wear Zara web store: what it is, what it can do, every screen, the backend, security and how it is built. Prepared November 2026.*

---

## 1. What Wear Zara is

Wear Zara is a full-stack online fashion store for men, women and kids. Shoppers browse a catalogue, save items, check out with cash on delivery and track their orders. Store staff run everything from a private admin panel: orders, products, categories, coupons, customers, reviews, messages and newsletter subscribers.

| | |
| --- | --- |
| **Live site** | https://wear-zara.vercel.app |
| **Languages** | English, اردو Urdu (right-to-left), Español |
| **Themes** | Light, dark and automatic (follows the device) |
| **Devices** | Phone, tablet and desktop — every page checked at 390, 768 and 1280–1440 px |
| **Design** | Apple-inspired glass look: frosted panels, pill buttons, system font, soft motion |

### At a glance

| | Count |
| --- | --- |
| Screens (pages) | **38** (22 storefront · 3 account · 13 admin) |
| Overlays & dialogs | 9 (quick view, cookie banner, cookie preferences, confirmations, menus…) |
| API endpoints | **26** route handlers (44 methods) |
| Database tables | **12** models + 1 join table |
| Reusable components | 78 |
| Translated strings | 734 per language × 3 languages |
| Automated browser checks | 61 end-to-end checks, all passing |

---

## 2. What it can do

### For shoppers
- **Browse & discover** — home page with an art-directed hero carousel, flash-sale rail with live countdown, category tiles, best sellers, promo banner, new arrivals and service highlights.
- **Shop page** — filter by category, search by name, sort (newest, price ↑/↓, name), crawlable pagination.
- **Product page** — large image, price with sale discount, rating, category tags, quantity, Add to Bag / Buy Now / wishlist, delivery and returns info, **customer reviews** (read and write) and related products.
- **Quick view** — preview any product in a split sheet without leaving the page.
- **Bag** — change quantities, remove items, clear the bag, apply a coupon, free-delivery progress bar, order summary.
- **Wishlist** — save items, move all to the bag.
- **Bag & wishlist sync** — signed-in shoppers see the same bag and wishlist on every device; a guest's bag is merged into the account on sign-in.
- **Checkout** — sign-in required; address and phone pre-filled from the last order; delivery notes; coupon; cash on delivery; the server re-prices everything before saving the order.
- **Orders** — confirmation page, order history, order details with a live status tracker, self-service cancellation (until shipped), and **guest order tracking** by order number + email.
- **Account** — upload / change / remove a profile photo (auto-cropped in the browser), edit name and phone, change password, delete account, sign out.
- **Help & trust** — FAQ, contact form, shipping, returns, size guide, careers, privacy policy, terms, cookie policy.
- **Newsletter** — subscribe from the footer.
- **Cookie consent** — accept all, decline, or choose categories; change any time from the footer.
- **Language & theme** — switch language from the navbar (remembered for a year) and toggle light/dark.

### For store admins
| Section | What admins can do |
| --- | --- |
| Overview | Revenue, orders (and how many are waiting), customers, products, unread messages, subscribers; recent orders and newest customers |
| Orders | Filter by status, search by number/name/email, open any order, move it through Placed → Processing → Shipped → Delivered or Cancelled |
| Products | Search, create, edit and delete products with live image preview, sale price and categories |
| Categories | Create, rename and delete categories, with product counts |
| Coupons | Create percentage or fixed-amount codes with minimum spend, usage limit and expiry; switch on/off; see usage; delete |
| Customers | List with profile photos, join date, order count and total spent; customer page with their orders, bag, wishlist and messages; delete customers |
| Reviews | Read all reviews and remove inappropriate ones |
| Messages | Contact-form inbox: unread filter, mark read/unread, reply by email, delete |
| Subscribers | Newsletter list, copy all emails, export CSV, remove |

Only emails listed in the `ADMIN_EMAILS` setting can open the admin panel. Anyone else is sent straight to the home page; if a session ends while an admin page is open, the page shows "You're not allowed here" and redirects home after 5 seconds.

---

## 3. All screens

### Storefront (22)
| # | Screen | URL |
| --- | --- | --- |
| 1 | Home | `/` |
| 2 | Shop / category / search results | `/shop` |
| 3 | Product details + reviews | `/product/[id]` |
| 4 | Bag | `/cart` |
| 5 | Wishlist | `/wishlist` |
| 6 | Checkout | `/checkout` |
| 7 | Order confirmation | `/checkout/success` |
| 8 | Track your order | `/track-order` |
| 9 | Sign in | `/login` |
| 10 | Create account | `/signup` |
| 11 | About us (story, numbers, team) | `/about` |
| 12 | Contact | `/contact` |
| 13 | FAQs | `/faq` |
| 14 | Shipping & delivery | `/shipping` |
| 15 | Returns & refunds | `/returns` |
| 16 | Size guide | `/size-guide` |
| 17 | Careers | `/careers` |
| 18 | Privacy policy | `/privacy` |
| 19 | Terms of service | `/terms` |
| 20 | Cookie policy | `/cookies` |
| 21 | Page not found (404) | any unknown URL |
| 22 | Error page | shown if something fails |

### Customer account (3)
| # | Screen | URL |
| --- | --- | --- |
| 23 | Profile (photo, details, password, delete) | `/account` |
| 24 | My orders | `/account/orders` |
| 25 | Order details + tracker + cancel | `/account/orders/[number]` |

### Admin panel (13)
| # | Screen | URL |
| --- | --- | --- |
| 26 | Overview | `/admin` |
| 27 | Orders | `/admin/orders` |
| 28 | Order details + status | `/admin/orders/[number]` |
| 29 | Products | `/admin/products` |
| 30 | New product | `/admin/products/new` |
| 31 | Edit product | `/admin/products/[id]` |
| 32 | Categories | `/admin/categories` |
| 33 | Coupons | `/admin/coupons` |
| 34 | Customers | `/admin/users` |
| 35 | Customer details | `/admin/users/[id]` |
| 36 | Reviews | `/admin/reviews` |
| 37 | Messages | `/admin/messages` |
| 38 | Subscribers | `/admin/subscribers` |

### Overlays & dialogs (9)
Quick-view product sheet · cookie banner · cookie preferences · mobile menu · account menu · language menu · confirmation dialogs (sign out, delete, cancel order, clear bag…) · toast notifications · admin "not allowed" screen.

---

## 4. Backend

### Architecture
- **Next.js 16 App Router** — pages are React Server Components that read the database directly; interactive parts are small client components.
- **Route handlers** (`src/app/api`) — a JSON API for everything the browser changes.
- **Proxy** (`src/proxy.js`) — picks the language (cookie → browser language → English) and serves clean URLs; blocks cross-site write requests to the API.
- **Caching** — home, about, contact, FAQ, bag, wishlist and policy pages are pre-rendered for all three languages; product pages are cached for 5 minutes and refreshed instantly after admin edits.
- **Database** — PostgreSQL on Neon, accessed through Prisma.

### Database (12 models)
| Model | Stores |
| --- | --- |
| `User` | Name, email, bcrypt password hash, phone |
| `Avatar` | Profile photo (kept separately so user queries never load image bytes) |
| `Category` | Name and URL slug |
| `Product` | Name, price, original price, image, rating, review count, categories |
| `CartItem` | A signed-in shopper's bag (product + quantity) |
| `WishlistItem` | A signed-in shopper's saved products |
| `Order` | Number, status, customer and delivery snapshot, coupon, subtotal, discount, shipping, total |
| `OrderItem` | Snapshot of each product at purchase time (name, image, price, quantity) |
| `Coupon` | Code, type (percent/fixed), value, minimum spend, usage limit and count, active flag, expiry |
| `Review` | Rating, title and text — one per customer per product |
| `ContactMessage` | Contact-form messages with read/unread state |
| `NewsletterSubscriber` | Subscriber emails |

Orders keep a snapshot of the customer and products, so they survive product or account deletion.

### API endpoints (26 route handlers)
| Area | Endpoints |
| --- | --- |
| Auth | `GET/POST /api/auth/*` (Auth.js) · `POST /api/auth/register` |
| Account | `PATCH /api/account` · `DELETE /api/account` · `PUT /api/account/password` · `PUT/DELETE /api/account/avatar` · `GET /api/avatar/[userId]` |
| Bag & wishlist | `PUT/DELETE /api/cart` · `POST/DELETE /api/wishlist` · `POST /api/sync` |
| Orders | `POST /api/orders` · `PATCH /api/orders/[number]` (cancel / admin status) · `POST /api/orders/track` |
| Catalogue | `GET/POST /api/products` · `GET/PATCH/DELETE /api/products/[id]` · `GET/POST /api/categories` · `PATCH/DELETE /api/categories/[id]` |
| Coupons | `POST /api/coupons/validate` · `POST /api/admin/coupons` · `PATCH/DELETE /api/admin/coupons/[id]` |
| Reviews | `POST /api/reviews` · `DELETE /api/reviews/[id]` |
| Messages & newsletter | `POST /api/contact` · `POST /api/newsletter` · `PATCH/DELETE /api/admin/messages/[id]` · `DELETE /api/admin/subscribers/[id]` |
| Customers | `DELETE /api/admin/users/[id]` |

### Business rules enforced on the server
- Prices, discounts and shipping are recalculated from the database for every order — the browser's numbers are never trusted.
- Coupons are checked for active status, expiry, usage limit and minimum spend; one use is claimed atomically, so a limited code can't be over-used by simultaneous checkouts. Cancelling an order gives the use back.
- Free delivery over $140, otherwise $9.99. Quantities are capped at 10 per item.
- Customers can cancel only their own orders, and only before they ship.
- Order tracking needs both the order number and the matching email, and never returns the address.

---

## 5. Security

| Protection | How |
| --- | --- |
| Passwords | bcrypt (cost 12); never stored or logged in plain text |
| Sessions | Auth.js signed JWT cookies (HttpOnly, SameSite=Lax) |
| Account enumeration | Same error for unknown email and wrong password |
| Brute force | Sign-in locked for 15 min after 8 failed attempts per email |
| Rate limiting | Sign-up, contact, newsletter, coupon checks, orders, reviews and order tracking |
| Authorisation | Every write checks the session server-side; admin APIs require an admin account |
| Admin area | Server redirect for non-admins + client guard if the session changes |
| CSRF | API rejects cross-site write requests (Origin check) on top of SameSite cookies |
| Security headers | Content-Security-Policy, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; `X-Powered-By` removed |
| Input validation | Shared validators on both client and server; length limits on every field |
| Uploads | Profile photos: images only, max 400 KB, resized in the browser |
| Open redirects | Post-login redirects only allow same-site paths |
| Privacy | Cookie consent with categories; customer data visible to admins only |
| Dependencies | Next.js and Auth.js upgraded to patched versions (npm audit) |

---

## 6. Design & experience

- **Design system** — colour tokens for light and dark mode, frosted-glass surfaces, pill buttons, one shared component library (buttons, inputs, custom dropdowns, switches, modals, toasts, badges, avatars, skeleton loaders).
- **Responsive** — mobile-first layouts; bottom-sheet dialogs on phones; scrolling pill navigation for account/admin on small screens; no sideways scrolling on any page.
- **Images** — art-directed hero images (different crop or photo for phone, tablet and desktop), responsive product images through Unsplash's CDN, no watermarked photos.
- **Right-to-left** — Urdu mirrors the whole layout, arrows and sliders; hero photos are mirrored so text never covers faces; Urdu uses the Noto Naskh font.
- **Accessibility** — semantic landmarks, skip link, keyboard-friendly dialogs and dropdowns, labelled icon buttons, live regions for notifications, reduced-motion support.
- **SEO** — per-page titles and descriptions in each language, Open Graph image, sitemap, robots.txt, product structured data (price and rating), language alternates.

---

## 7. Quality checks

| Check | Result |
| --- | --- |
| ESLint | 0 errors, 0 warnings |
| Production build | Passes (115 pre-rendered pages) |
| End-to-end journey (38 checks) | All pass — guest shopping, coupons, sign-up with bag merge, checkout, cancel, profile photo, contact, newsletter, every admin section, languages, sign-out, access control |
| Second-round checks (23 checks) | All pass — security headers, CSRF block, rate limiting, policy pages, cookie consent, reviews, order tracking |
| Layout audit | 0 horizontal-overflow issues across every page at phone, tablet and desktop widths |
| Translations | All 734 keys present in English, Urdu and Spanish |

---

## 8. Running and deploying

1. Set `DATABASE_URL`, `AUTH_SECRET` and `ADMIN_EMAILS` (see `.env.example`).
2. `npm install` → `npm run db:migrate` → `npm run db:seed` → `npm run dev`.
3. On Vercel, the same three environment variables are required. Database changes are applied with `npm run db:migrate`.

---

## 9. Suggested next steps

- Card payments (Stripe) and transactional emails (order confirmation, shipping updates, password reset).
- Product variants (sizes, colours, stock levels) and multiple images per product.
- Saved addresses and order invoices (PDF).
- A shared rate-limit store (e.g. Upstash Redis) for multi-region deployments.
- Upgrade to Prisma 7 to clear the remaining advisories in Prisma's CLI tooling.
- The Wear Zara mobile app, reusing this API.
