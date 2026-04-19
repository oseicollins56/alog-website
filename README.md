# ALOG — Your Complete Property Partner

A unified single-brand website for **ALOG Group** featuring three property-industry divisions:

- **ALOG Interiors** — residential & commercial interior design
- **ALOG Construction** — new builds, renovations, extensions
- **ALOG Realty** — buy/rent properties across Ghana

Built with vanilla **HTML5**, **CSS3** and **JavaScript** — no build step, no frameworks.

---

## Project Structure

```
ALOG/
├── index.html              # Main landing page (hero, 3 services, contact preview)
├── interior.html           # Interior Design division
├── construction.html       # Construction division
├── realestate.html         # Real Estate division (property search & filters)
├── contact.html            # Contact form with division selector
├── css/
│   └── styles.css          # Unified stylesheet (navy + gold theme, fully responsive)
├── js/
│   └── main.js             # Nav, scroll-reveal, lightbox, filters, form validation
└── assets/                 # Any local media (empty — site uses hosted imagery)
```

## Features

- Sticky translucent navigation with mobile hamburger
- Hero sections with background imagery and stats
- Interactive property filter (search, type, status, bedrooms) on the Realty page
- Lightbox gallery with keyboard navigation (Esc, ←, →)
- Client-side contact form validation (required fields, email, phone patterns)
- Scroll-reveal animations via `IntersectionObserver`
- Back-to-top button, smooth scrolling
- Two embedded video loops (homepage + construction page)
- Fully responsive (mobile, tablet, desktop)

## Running Locally

No build step. Just open `index.html` directly, or serve with any static server:

```bash
# Python 3
python3 -m http.server 8000

# or Node's "serve"
npx serve .
```

Then visit <http://localhost:8000>.

---

## Pushing to GitHub

Run these commands from inside the `ALOG/` folder. Replace `your-username` and `your-repo-name`.

### First time push (new repo)

```bash
# 1. Initialise git
git init
git branch -M main

# 2. Stage and commit
git add .
git commit -m "Initial commit: ALOG unified property website"

# 3. Create the repo on GitHub (either via the web UI, or via gh CLI):
gh repo create your-username/alog-website --public --source=. --remote=origin
# — OR — if you created it manually on github.com:
git remote add origin https://github.com/your-username/alog-website.git

# 4. Push
git push -u origin main
```

### Pushing updates later

```bash
git add .
git commit -m "Describe what you changed"
git push
```

### Hosting for free via GitHub Pages

Once pushed:

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*
3. Choose branch **main** and folder **/ (root)**
4. Save — your site will be live at `https://your-username.github.io/alog-website/` in 1–2 minutes

---

## Customising

- **Brand colours** — edit CSS variables at the top of `css/styles.css`
- **Property listings** — add/edit `<article class="prop-card">` blocks in `realestate.html`. The filter reads from `data-*` attributes
- **Contact form handler** — the form currently only validates client-side. To actually send emails, point the `<form>` `action` at your backend or a service like Formspree/EmailJS

---

## License

© 2026 ALOG Group. All rights reserved.
