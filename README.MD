# Premier Football Academy

## Student Information

**Student Name:** Lukholo NondywanaS

**Student Number:** ST10525675
**Module:** WEDE5020 – Web Development

**Institution:** Rosebank College – NMB Campus

**Year:** 2026

## Project Description

Premier Football Academy is a fictional football academy website.

The website provides information about the academy, its services and how visitors can contact the organisation.

## Website Goals

The main goals of the website are:

* Provide information about the academy.
* Explain the services offered.
* Allow visitors to make enquiries.
* Provide contact information.
* Create a professional online presence.

## Website Pages

The website contains five pages:

1. Home
2. About Us
3. Services
4. Enquiry
5. Contact

## Technologies

The website uses:

* HTML
* CSS
* JavaScript

Visual Studio Code is used for development.

Git and GitHub are used for version control.

## Key Features

The website includes:

* Navigation menu
* Five HTML pages
* Enquiry form
* Contact information
* Structured content
* Responsive viewport settings
* CSS styling

## Sitemap

Home
├── About Us
├── Services
├── Enquiry
└── Contact

## Timeline

Week 1: Organisation research

Week 2: Proposal

Week 3: Sitemap and wireframes

Week 4: Content and assets

Week 5: HTML development

Week 6: Navigation and styling

Week 7: Testing

Week 8: GitHub and submission

## Changelog

### Version 1.0

* Created project folder.
* Created five HTML pages.
* Added navigation.
* Added basic website content.
* Added CSS.
* Added enquiry form.
* Added contact page.

### Version 2.0 — Part 2: CSS Styling and Responsive Design

**Corrections from Part 1 feedback:**

* Restructured every page to use semantic `<header>`, `<nav>`, `<main>` and `<footer>` elements. The Part 1 stylesheet already targeted these elements, but the HTML had no matching tags, so those rules were never actually being applied.
* Added a `<meta name="description">` to each page and an `aria-current="page"` / `.active` class on the current navigation link for accessibility and usability.
* Added a "Programme" field to the Enquiry form, matching the field listed in the Part 1 proposal but missing from the original form.
* Added a skip-to-content link for keyboard and screen-reader users.

**CSS styling for desktop:**

* Rebuilt `CSS/style.css` from scratch using CSS custom properties (`:root` variables) for the colour scheme, spacing and shadows, so the whole site can be re-themed by editing one place.
* Applied a consistent typography scale (`--fs-h1` to `--fs-small`) using `font-family`, `font-size`, `line-height` and `letter-spacing`.
* Built the header/navigation with Flexbox, the Home page highlights and Services grid with CSS Grid (`repeat(auto-fit, minmax(...))`), and the About/Services intros with a two-column Flexbox layout.
* Added visual styling (`box-shadow`, `border`, `border-radius`) and interactive states (`:hover`, `:focus-visible`, `:active`) on links, buttons and form fields.

**Responsive design:**

* Added a hero section on the Home page using the HTML `<picture>` element with `srcset`/`media` conditions, serving a 600px, 1000px or 1600px-wide image depending on screen size.
* Added `srcset`/`sizes` responsive images to the About and Services pages (500w/900w).
* Resized and compressed all photos (originals were 1.2–2MB each; new versions are all under 200KB) to improve load time.
* Set breakpoints at `900px` (tablet) and `600px` (mobile) using media queries: navigation stacks, two-column sections become single-column, hero height and spacing reduce for smaller screens.
* Used relative units (`rem`, `%`, `vh`, `ch`, `clamp()`) throughout instead of fixed pixel values so type and spacing scale with the viewport.
* Tested the site at desktop (1440px), tablet (820px) and mobile (390px) widths — screenshots saved in `/screenshots`.

### Version 3.0 - Part 3: Enhancing Functionality and SEO

**Corrections from Part 2 feedback:**

* (Add the specific feedback points from your Part 2 marks here and describe how each was fixed.)

**Interactive elements and dynamic content (`JS/script.js`, `JS/data.js`):**

* Services page: programme cards are now built dynamically from a data file, with search, level filter and sort by name or price. Static HTML cards remain in the page for search engines and users without JavaScript.
* FAQ accordion (Services), photo gallery with keyboard-accessible lightbox (About), scroll-reveal animations and a mobile menu toggle. Animations are disabled for users who prefer reduced motion.
* Interactive Leaflet map with marker and popup (Contact). Leaflet is stored locally in `lib/leaflet`; map tiles come from OpenStreetMap.
* DOM manipulation: character counters, live programme descriptions, programme pre-selected from the URL (`enquiry.html?programme=...`), start-date limits set from today's date, and an auto-updating footer year.

**Forms and validation:**

* `enquiry.html`: validates name, email, optional South African phone number, programme, number of players (1-6) and start date (future, within 12 months), and message length. After a successful submit it responds with the monthly fee, a 10% discount for 2+ players, places available, next intake date and whether the start date fits.
* `contact.html`: validates name, email, optional phone, message type, subject and message length. After submit it compiles the details into an email and lets the user send it to the recipient set in `script.js` (`RECIPIENT`) using a mailto link.
* Both forms use the `action` attribute and submit with AJAX (`fetch`) so the page does not reload. For this project the action URL is the free test endpoint `jsonplaceholder.typicode.com`; a live site would use its own server or a form service.

**SEO:**

* Keyword research: primary keywords are "football academy Gqeberha", "youth football training", "football coaching Port Elizabeth", "skills development" and "football programmes Nelson Mandela Bay". They are used in titles, descriptions, headings and body text.
* Unique title and meta description per page, meta keywords, canonical links, Open Graph tags, one `<h1>` per page with a logical H2/H3 order, descriptive image file names and alt text, clean readable page URLs, and internal links between all pages.
* Local SEO: JSON-LD `SportsClub` structured data with address, coordinates, opening hours and area served.
* `robots.txt`, `sitemap.xml`, favicon and a custom `404.html`.
* Off-page plan (not code): list the academy on Google Business Profile and local directories, request links from local schools and clubs, and post updates on the social media pages linked in the footer. Social links currently point to placeholder pages.
* Page speed: images resized and compressed (hero served at 600/1000/1600px), lazy loading below the fold, `fetchpriority` on the hero, scripts loaded with `defer`, Leaflet loaded only on the Contact page.
* Security: Content Security policy and referrer policy meta tags, `rel="noopener noreferrer"` on external links, user input written to the page with `textContent`, hidden honeypot field against spam bots, input length limits, and HTTPS through GitHub Pages.

**Deployment:**

* Deployed on GitHub Pages: https://lukholo-nondywana.github.io/ST10525675-WEDE5020-POE/

## Screenshot Evidence (Part 2)

Desktop, tablet and mobile screenshots of every page are saved in the `screenshots/` folder:

* `index-desktop.png`, `index-tablet.png`, `index-mobile.png`
* `about-desktop.png`, `about-tablet.png`, `about-mobile.png`
* `service-desktop.png`, `service-tablet.png`, `service-mobile.png`
* `enquiry-desktop.png`, `enquiry-tablet.png`, `enquiry-mobile.png`
* `contact-desktop.png`, `contact-tablet.png`, `contact-mobile.png`

## References

World Wide Web Consortium (W3C). HTML and CSS specifications. https://www.w3.org/

Mozilla Developer Network (MDN). CSS Flexbox, Grid, media queries and responsive images documentation. https://developer.mozilla.org/

Leaflet. Leaflet JavaScript library. https://leafletjs.com/

OpenStreetMap contributors. Map data. https://www.openstreetmap.org/

Schema.org. Structured data vocabulary. https://schema.org/

FIFA.

Pexels.

Unsplash.

IIE WEDE5020 Module Guide.
