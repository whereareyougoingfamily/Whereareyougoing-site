# Where Are You Going — site files

## What's here
- `index.html` — the whole site (hero, story, interviews, get help, get involved)
- `styles.css` — all styling
- `script.js` — mobile menu, donate button, form handling

## Before you deploy — 3 things to hook up

1. **Donate button (Stripe)**
   In `script.js`, find `STRIPE_LINKS` near the top and replace the placeholder
   URLs with real Stripe Payment Links for $25 / $50 / $100 / custom.
   Create these at https://dashboard.stripe.com/payment-links

2. **Forms (help requests + volunteer signups)**
   Right now, submitting either form just shows a confirmation message —
   nothing is actually sent anywhere yet.
   To fix that:
   - Sign up at https://formspree.io (free tier is fine to start)
   - Create a form, copy the endpoint URL it gives you
   - In `script.js`, uncomment the `fetch()` block inside `handleFormSubmit`
     and paste your endpoint into `FORM_ENDPOINT`
   - Comment out or remove the "local-only placeholder" block below it

3. **Photos**
   The `.photo-block` and `.story-photo` divs are gradient placeholders
   marking where real photos go. Swap them for `<img>` tags with real
   interview photos when you have them.

## Before launch — fill in "Who we are"
Near the bottom of the page (before the footer) there's a `#trust` section
with placeholder text in brackets — e.g. `[add city/region here]`,
`[Add legal/nonprofit status...]`. Replace all of these with real details:
who operates the foundation, your legal/nonprofit status, where you
operate, and how someone could verify you (a GuideStar/Charity Navigator
link once you have one). This matters a lot for a site collecting help
requests and donations.

## Still needed before launch
- **Privacy Policy, Terms, Accessibility pages** — the footer links to
  `privacy.html`, `terms.html`, `accessibility.html`, but these files
  don't exist yet. At minimum, the Privacy Policy should say what happens
  to information submitted through the "I need help" and "Share your
  answer" forms.
- **Shared answers on the homepage** — the "Share your answer" form
  collects submissions (once you hook it to Formspree, see below), but
  actually featuring selected answers back on the homepage needs a
  moderation step and a small backend or CMS — this isn't wired up yet.

## Deploying on Cloudflare Pages
1. Push these three files (plus this README, optional) to a GitHub repo
2. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages**
   → **Connect to Git** → select the repo
3. Build settings: no build command needed, output directory = `/` (root)
4. Once deployed, go to the Pages project → **Custom domains** →
   add `whereareyougoing.family` (it'll connect instantly since the domain
   is already on this Cloudflare account)
