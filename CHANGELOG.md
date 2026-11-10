# Changelog

## 2026-11-10 — Signup, volunteer profiles, and homepage updates

**Author** Hassan El-Tawil

- Added phone numbers and optional website URLs to volunteer and organization signup. Signup and profile settings use a searchable country calling-code dropdown and a separate phone number field with a gray example. Login keeps the email and password fields.
- Added editable phone and website fields to both dashboards' profile settings. Volunteers can also add a bio, up to eight tags, and a PDF CV up to 5 MB. Signed-in profile details persist per account in the same browser. Uploaded files last until refresh.
- Added a dedicated volunteer profile view for organizations reviewing their own pending or reviewed applications. It shows the volunteer's photo, bio, tags, location, phone, website, downloadable CV, and completed-shift count. In the current demo, volunteer edits update the profile shown on existing applications.
- Added a 1–5 star rating after an organization confirms a volunteer for one of its listings. Each organization can update its own rating, and the profile shows the average and rating count. The completed-shift count combines recorded demo history with confirmed, uncancelled shifts whose scheduled end time has passed. Ratings reset on refresh.
- Replaced the catalog's dashboard link with Log in and Sign up for signed-out visitors. Listing cards show Log in to join, while signed-in volunteers can reserve or apply.
- Added the full-page posting form from `Post/Edit-Oppurtunity-Form`, with an Opportunity/Shift toggle, a posting confirmation, and an Add another action. The organization dashboard links to it.
- Added Edit, Close, and Delete to My opportunities. Closing preserves applications and linked shifts. Deleting removes the opportunity and its applications and makes its linked shifts standalone.
- Updated the homepage to show the three latest open shifts or opportunities, including newly posted organization listings. Signed-in users can also visit the homepage. Listings reset on refresh in the demo.
- Reduced likely sources of startup layout shifts by loading the homepage with the app, matching the navigation and mission placeholders to their final layouts, and avoiding late font swaps. Updated image fetch priority markup for React 18.
- Enabled the regional organization carousel and expanding photo animation on mobile. The carousel supports swiping and playback controls. The photo uses a shorter scroll distance and stable viewport height on mobile. Both respect reduced-motion preferences.
- Improved visible keyboard focus and dashboard focus after navigation. Routed role-specific login links to the working login form, added a recovery link on missing pages, and announced demo contact submissions to screen readers.
- Fixed rendering for About and Contact us, restored scrolling on opportunity details opened from the dashboard, removed the dashboard demo role switch, and made the sidebar logo circular with a fixed size.


## 2026-11-08 — Separate opportunities and shifts

The organization dashboard greets the active demo organization and offers separate Add opportunity and Add shift actions. Shifts can stand alone or link to an opportunity. Demo account IDs identify listing owners and applicants.

## 2026-11-07 — Create demo shifts

Added a Create shift action with a date, start and end times, capacity, and signup type. The shift appears in the catalog and organization calendar, and volunteers see its time range once confirmed.

## 2026-11-07 — Fixed desktop logo sizing

Kept the centered navbar logo at 28 pixels so CardNav's image sizing cannot stretch or clip it.

## 2026-11-07 — Shift calendars and hours chart

Added a monthly calendar to each dashboard and replaced the volunteer progress bars with a labeled column chart. The volunteer calendar shows confirmed shifts, and the organization calendar shows posted opportunities.

## 2026-11-07 — Volunteer and organization dashboard demos

Added two lazy-loaded dashboards using shared Tailwind components and sample data. Volunteers can reserve spots or apply, organizations can review applications and post demo opportunities, and confirmed shifts appear on both sides. The volunteer dashboard includes a sample hours chart and completed shifts.

## 2026-11-07 — Consolidated app styling in Tailwind

Moved the remaining homepage, navigation, photo-credit, and loading styles into Tailwind utilities. The startup HTML links the Tailwind stylesheet directly so the skeleton can appear before React. React Bits keeps its component styles for the effects.

## 2026-11-07 — Quieter mobile header and opportunity cards

Made Sign up the only filled account action, simplified the menu and theme controls, and replaced bright card shadows with a subtle border.

## 2026-11-07 — Aligned desktop and mobile navigation

Placed the hamburger on the left, centered the logo, and grouped Sign up and Log in on the right on both layouts. Mobile menu links now animate in from the left.

## 2026-11-07 — Account links and simpler app structure

Added shared Sign up and Log in buttons and consolidated the account placeholders into one page component. The theme switch now displays a sun or moon. Removed the unused authentication stub and layout wrapper, and simplified route loading and navigation.

## 2026-11-07 — Simplified dark mode

Replaced the animated theme switch with a labeled button. Theme styling uses Tailwind's `dark:` variant, and the toggle still saves the selected mode.

## 2026-11-07 — Replaced layout CSS with Tailwind utilities

Moved homepage sections, opportunity cards, secondary pages, the contact form, and the shared layout to Tailwind utilities. Removed the corresponding stylesheet rules and unused template styles. Custom animation, photo-credit interactions, and React Bits styles remain in CSS.

## 2026-11-07 — Earlier photo reveal

The second homepage photo starts loading sooner and begins expanding before the section reaches the top of the screen. The animation follows scrolling more closely and gives the finished panel more time in view.

## 2026-11-07 — Tailwind theme colors

Moved light and dark theme colors and logo filters to Tailwind utilities. The existing toggle still controls and remembers the selected theme.

## 2026-11-07 — Consolidated source folders

Moved the HTML entry, pages, shared components, and styles under `src/`. React Bits components now live in `src/components/fx/`. Updated Vite, Tailwind source paths, and imports, and removed unused effect copies.

## 2026-11-07 — Faster startup on slow connections

- Deferred the homepage carousel, expanding photo, and decorative effects until their sections approach the viewport. The photo and carousel reserve space while they load.
- Lowered the fetch priority of secondary images, reduced secondary homepage photos from about 1,050 KB to 593 KB, and reduced the navigation logo from 192 KB to under 2 KB.

- Replaced generic loading bars with navigation and card placeholders at startup, a hero placeholder for Home, and a card grid for All Opportunities.
- Added a theme-aware skeleton directly to the HTML so it appears while JavaScript downloads. Lazy routes retain their own loading skeleton.
- Split desktop navigation from startup code, made web fonts nonblocking, and added smaller responsive WebP hero images.

## 2026-11-07 — Theme-aware opportunity panel

The homepage photo panel and its Browse opportunities button now follow the site's light and dark themes.

## 2026-11-06 — Login button color

Changed the desktop navigation’s account button to the site’s forest green.

## 2026-11-06 — Accessibility and wider homepage

- Widened homepage content on large screens to give cause cards and the organization carousel more room.
- Improved route focus, heading levels, the sitewide skip link, and contact field autocomplete.
- Added a compact, keyboard-accessible carousel playback control and respected reduced motion by default.

## 2026-11-06 — Browse opportunities by cause

Homepage cause cards now animate on hover and open the matching opportunities view. Causes without sample listings show an empty state and a link back to the full catalog.

## 2026-11-06 — Homepage updates and slow-connection loading

| Area | What changed | Why it improves the project |
| --- | --- | --- |
| Page loading | Split routes into on-demand bundles and added a loading skeleton in the main content area. | The site loads the requested page while keeping navigation available. |
| Homepage photos | Added image skeletons and lazy loading for secondary photos and the wordmark. Kept the hero photo at high priority. | Large images farther down the page can wait while the main photo loads. |
| Branding and credits | Replaced the homepage wordmark with a transparent SVG and moved photo credits into hover and focus overlays on pointer devices. | The wordmark blends into both themes and credits remain accessible. |
| Opportunities | Featured three listings on the homepage and kept all seven on the catalog page. Added staggered entrances, card hover styling, and a green hover state for the hero's posting button. | Visitors can scan the featured listings and browse the full catalog separately. |
| Causes and organizations | Hid the cause gallery scrollbar, enabled continuous LogoLoop playback, added Lebanese organizations, and applied theme colors to the available SVG marks. | The galleries keep their scroll behavior and show more local organizations. |

## 2026-11-06 — Hero image attribution in alt text

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Moved the hero photographer credit into the descriptive alt text and removed the visible badge. | The credit is available with the image description while the hero is visually clear. |
| `pages/home.css` | Removed the unused hero badge styles. | The shared photo caption styling remains available for other photos. |
| `CHANGELOG.md` | Recorded the hero attribution change. | Teammates can trace the update. |

## 2026-11-06 — Consolidated source assets

**Author** Hassan El-Tawil

| File or folder | What changed | Why it improves the project |
| --- | --- | --- |
| `src/assets/brand/` and `src/assets/photos/` | Moved AidConnect artwork and stock photos out of the root assets folder. | All source images now live under one directory, grouped by purpose. |
| `pages/HomePage.jsx` | Updated image imports to the new folders. | Vite can resolve the homepage images after the move. |
| `components/Navbar.jsx` | Updated the desktop logo import. | CardNav uses the shared brand asset. |
| `components/AdaptiveNavbar.jsx` | Updated the mobile logo import. | BubbleMenu uses the same brand asset as desktop. |
| `README.md` | Documented the three asset categories. | Teammates know where to put new images. |
| `CHANGELOG.md` | Recorded the move and import changes. | Teammates can trace the old and new paths. |

## 2026-11-06 — Visible photo credits and homepage accessibility

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Added linked photographer credits to the hero and cause images and used h3 headings for the causes. | Readers can see attribution without hovering and navigate the gallery by heading. |
| `components/HomeExtras.jsx` | Added credits and descriptions for the photo band and organization panel, and hid the decorative effect from assistive technology. | Screen readers can describe the photo without announcing the canvas. |
| `components/PhotoCredit.jsx` | Added a reusable linked figure caption. | Credits use consistent semantic markup. |
| `src/main.jsx` | Added a skip link and focusable main landmark. | Keyboard users can bypass the navbar. |
| `pages/home.css` | Styled visible credits, the photo panel, and the skip link. | Attribution and keyboard navigation remain usable across screen sizes. |
| `index.html` | Updated the title, description, and social preview metadata. | Search engines and link previews have clearer homepage information. |
| `CHANGELOG.md` | Recorded the accessibility and attribution changes. | Teammates can trace the update. |

## 2026-11-06 — Distinct homepage photos

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Assigned separate photos to the expanding band and organization panel. | The food-packing photo appears only in its cause card. |
| `components/HomeExtras.jsx` | Updated the expanding photo's alt text. | The description matches the new image. |
| `assets/volunteer-food-distribution.jpg` | Added [Lagos Food Bank Initiative's volunteer photo](https://www.pexels.com/photo/happy-volunteers-carrying-boxes-8061641/). | The expanding band shows volunteers distributing food. |
| `assets/community-donation-sorting.jpg` | Added [Julia M Cameron's donation sorting photo](https://www.pexels.com/photo/people-sorting-donations-6994963/). | The organization panel shows a different volunteer activity. |
| `CHANGELOG.md` | Recorded the image changes and sources. | Teammates can trace the asset credits. |

## 2026-11-06 — Refined homepage summary and organization panel

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Grouped the three demo figures in a definition list and supplied a photo for the organization panel. | The numbers are easier to scan and the CTA has a relevant visual. |
| `components/HomeExtras.jsx` | Used the photo as the panel's base layer. | The panel has a complete appearance even when PixelTrail is off. |
| `pages/home.css` | Replaced lime backgrounds with theme-aware surfaces and styled the stats and photo. | Both sections blend with the page in either theme. |
| `CHANGELOG.md` | Recorded the design update. | Teammates can trace the changes. |

## 2026-11-06 — React Bits integration handoff

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Added the demo summary, mission reveal, and mid-page photo band while retaining the hero and cause gallery. | The homepage follows the requested content order. |
| `components/HomeExtras.jsx` | Updated LogoLoop, added ScrollExpand, and gated the lazy PixelTrail to desktop fine pointers with motion enabled. | Platform links and photo content remain usable with reduced motion. |
| `components/AdaptiveNavbar.jsx` | Added a breakpoint-based choice between CardNav and BubbleMenu. | Each viewport has one main navigation. |
| `components/ThemeSwitch.jsx` | Connected the switch to shared theme state. | The button and visual effects respond to the same preference. |
| `src/main.jsx` | Mounted the adaptive navbar and theme provider. | Theme and navigation work across routes. |
| `src/context/ThemeContext.jsx` | Applied the root theme class in a layout effect. | Colors are available before paint. |
| `src/hooks/useMediaQuery.js` | Added a live media query subscription. | Navigation and effects respond to device changes. |
| `src/hooks/useReducedMotion.js` | Added a shared reduced-motion hook. | Effects can honor the system preference consistently. |
| `src/hooks/useCssVar.js` | Added computed token reads that refresh when the theme class changes. | WebGL effects receive resolved colors. |
| `src/components/fx/LogoLoop/LogoLoop.jsx`, `LogoLoop.css` | Added the shared loop source and layered styles. | Tailwind can override the vendor styling. |
| `src/components/fx/ScrollReveal/ScrollReveal.jsx`, `ScrollReveal.css` | Added the shared reveal and layered styles. | The mission heading can use Tailwind typography. |
| `src/components/fx/ScrollExpand/ScrollExpand.jsx`, `ScrollExpand.css` | Added the expanding photo and made its hidden controls inert. | Keyboard users only reach the photo CTA after it appears. |
| `src/components/fx/PixelTrail/PixelTrail.jsx`, `PixelTrail.css` | Added the shared decorative pointer effect and layered styles. | The organization CTA can lazy-load the effect away from its text. |
| `src/components/fx/BubbleMenu/BubbleMenu.jsx`, `BubbleMenu.css` | Added router links, keyboard focus management, a theme action slot, and layered styles. | The mobile menu supports keyboard and touch navigation. |
| `src/components/fx/GradientASCII/GradientASCII.jsx`, `GradientASCII.css` | Added the shared ASCII effect and layered styles. | The 404 owner can reuse the effect. |
| `src/components/fx/GradientASCII/NotFoundEffect.jsx`, `NotFoundEffect.css` | Added a standalone 404 implementation for handoff. | The 404 owner can integrate it without rebuilding the effect. |
| `src/assets/logos/nahno.png`, `anera.svg`, `volunteers-ae.png` | Moved the existing platform marks to the requested source asset folder. | The directory can discover the marks by slug. |
| `pages/home.css` | Ordered CSS layers and styled the new mobile menu and effect sections. | Tailwind utilities can override vendor defaults and text remains readable. |
| `README.md` | Added credits, numbered modification snippets, and integration notes. | Teammates can review or reuse the effects. |
| `CHANGELOG.md` | Recorded each integration file. | Teammates can trace the work. |

## 2026-11-06 — Hero photo, cause gallery, and account routes

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Put the donation photo in the hero, moved the cedar wordmark to the middle, and added ten causes in a scrollable gallery. | The homepage gives the photo and brand their own space and lets visitors browse more causes without a long grid. |
| `pages/home.css` | Replaced the hero gradient with a flat overlay, tightened the wordmark crop, and styled the gallery, card lift, distinct colors, and Home card hit area. | Hero copy stays readable, five cards fit on wide screens, and hover motion respects reduced-motion preferences. |
| `components/HomeExtras.jsx` | Removed the standalone donation photo section. | The photo has one home in the hero. |
| `components/OpportunityGrid.jsx` | Added four mock listings in Tripoli, Sidon, Zahle, and Byblos, with distinct cause colors and a hover lift. | Visitors can compare examples from more parts of Lebanon. |
| `components/Navbar.jsx` | Added the Home card, renamed Contact us, and linked posting to organization registration. | Navigation labels and account destinations are clearer. |
| `components/react-bits/CardNav.jsx` | Allowed a card-specific class for the Home tile. | The entire Home tile can act as one link. |
| `components/Footer.jsx` | Renamed Contact to Contact us. | The footer uses the same wording as the navbar. |
| `pages/ContactPage.jsx` | Renamed the page eyebrow to Contact us. | The destination matches its link label. |
| `components/ThemeSwitch.jsx` | Styled the sun black on white and the moon white on black. | The current theme is easier to recognize. |
| `pages/JoinPages.jsx` | Added role choices for Login and Register and an Under progress message on each portal. | Volunteers and organizations can reach their own placeholders. |
| `src/main.jsx` | Added volunteer and organization registration routes. | Both choices open valid pages. |
| `assets/coastal-cleanup.jpg` | Replaced the photo with a [beach cleanup scene](https://www.pexels.com/photo/people-on-beach-holding-white-sack-9035238/). | The Environment card shows cleanup work. |
| `assets/food-packing.jpg` | Replaced the close-up with a [wider food packing photo](https://www.pexels.com/photo/people-preparing-food-rations-in-the-box-6590928/). | The Food support card shows a group working together. |
| `assets/student-tutoring.jpg` | Added a [library tutoring photo](https://www.pexels.com/photo/teacher-and-student-in-a-library-8342278/). | The Education card shows reading support. |
| `assets/community-health.jpg` | Added a [health screening photo](https://www.pexels.com/photo/healthcare-professional-checking-patient-blood-pressure-35645526/). | The Health card has a relevant image. |
| `assets/animal-welfare.jpg` | Added a [rescue shelter photo](https://www.pexels.com/photo/volunteer-feeding-rescued-dogs-at-animal-shelter-35231857/). | The Animal welfare card shows hands-on shelter work. |
| `assets/community-gardening.jpg` | Added a [community garden photo](https://www.pexels.com/photo/community-gardening-project-in-bloomington-39778110/). | The Community support card shows people caring for a shared space. |
| `assets/senior-support.jpg` | Added a [senior support photo](https://www.pexels.com/photo/elderly-caregiver-assisting-senior-woman-at-home-29372727/). | The Senior support card has a relevant image. |
| `assets/arts-workshop.jpg` | Added an [art workshop photo](https://www.pexels.com/photo/people-in-an-art-workshop-6146655/). | The Arts and culture card shows a group activity. |
| `assets/youth-sports.jpg` | Added a [youth soccer photo](https://www.pexels.com/photo/children-playing-soccer-2898317/). | The Youth sports card shows a familiar activity. |
| `assets/accessibility-support.jpg` | Added a [wheelchair assistance photo](https://www.pexels.com/photo/a-woman-pushing-a-wheelchair-with-man-8415522/). | The Accessibility card has a relevant image. |
| `CHANGELOG.md` | Recorded the changes and stock photo sources. | Teammates can trace the update and credits. |

## 2026-11-06 — Full-width photography and matching themes

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Added the cedar wordmark beside the hero copy and three illustrated cause entries. | The hero identifies AidConnect and each cause has a concrete visual example. |
| `components/HomeExtras.jsx` | Made the donation photo full width from the start of ScrollExpand and in its static fallback. | The photo reaches both sides on desktop, mobile, and reduced-motion settings. |
| `pages/home.css` | Applied shared palette variables to the hero, sections, and footer, and added the wordmark crop and photo sizing. | The page reads as one continuous canvas in both themes. |
| `src/index.css` | Defined beige and deep-green theme palettes with matching text, borders, and surfaces. | Shared components switch colors together. |
| `components/Navbar.jsx` | Connected CardNav to the shared palette. | The floating navbar matches the selected theme. |
| `components/Footer.jsx` | Connected the footer background and text to the shared palette. | The footer continues the page canvas. |
| `assets/aidconnect-wordmark-sheet.jpg` | Added the supplied wordmark sheet and displayed only the AidConnect row. | The original cedar branding appears in the hero. |
| `assets/coastal-cleanup.jpg` | Added [Inna Rabotyagina’s beach cleanup photo](https://www.pexels.com/photo/people-carrying-black-trash-bag-while-walking-on-the-shore-of-a-beach-8018592/). | The Environment cause shows a shoreline cleanup. |
| `assets/food-packing.jpg` | Added [Gustavo Fring’s donation packing photo](https://www.pexels.com/photo/a-man-packing-donations-7156159/). | The Food support cause shows supplies being packed. |
| `assets/student-tutoring.jpg` | Added [Ahmet Kurt’s classroom photo](https://www.pexels.com/photo/teacher-helping-student-with-homework-in-classroom-35745582/). | The Education cause shows one-on-one learning support. |
| `CHANGELOG.md` | Recorded the asset and theme changes. | Teammates can trace the update and photo sources. |

## 2026-11-06 — Regional LogoLoop styling

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `components/HomeExtras.jsx` | Replaced the regional cards with a logo strip and configured a faster leftward loop, larger marks, edge fades, and hover emphasis. | The section reads as a moving logo carousel and keeps its pause control and reduced-motion layout. |
| `CHANGELOG.md` | Recorded the regional carousel update. | Teammates can trace the styling change. |

## 2026-11-06 — Floating navigation and consistent gradients

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/home.css` | Fixed CardNav to the top of the homepage during scrolling and shared one forest-green gradient between the hero and expanding photo. | Navigation stays within reach and the image sections use the same fade. |
| `src/index.css` | Replaced the old blue template gradients with solid forest and lime colors. | Shared surfaces follow the AidConnect palette. |
| `CHANGELOG.md` | Recorded the navigation and palette changes. | Teammates can trace the update. |

## 2026-11-06 — Remove the homepage demo strip

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Removed the three-item demo strip. | The homepage moves directly from the hero to the featured listings. |
| `pages/home.css` | Removed the unused strip styles and color variable. | The stylesheet stays focused on the current layout. |
| `CHANGELOG.md` | Recorded the removal. | Teammates can trace the change. |

## 2026-11-06 — ASCII hero, CardNav, and logo carousel

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Replaced the hero photo background with the supplied GradientASCII effect and removed the duplicate quick-links menu. | The hero gains a distinct visual identity while the main actions stay readable. |
| `components/react-bits/GradientASCII.jsx` | Added the supplied React Bits renderer. | It draws the animated ASCII background and respects reduced motion. |
| `components/react-bits/GradientASCII.css` | Added the supplied canvas layout. | The effect covers the hero without taking up space in the content layout. |
| `components/Navbar.jsx` | Made CardNav the main navbar, applied the forest-green palette, and set the AidConnect logo dimensions. | The selected menu is available on every route, and the logo stays proportionate across screen widths. |
| `components/HomeExtras.jsx` | Enabled the regional carousel with a pause control and a static list for reduced motion. | Visitors can scan the rotating brands or stop the motion and browse all five links. |
| `assets/logos/nahno.png` | Added the logo from Nahno's official site. | The carousel identifies Nahno visually. |
| `assets/logos/anera.svg` | Added the logo from Anera's official site. | The carousel identifies Anera visually. |
| `assets/logos/volunteers-ae.png` | Added the site icon from Volunteers.ae. | The carousel identifies Volunteers.ae visually. |
| `pages/home.css` | Added the hero contrast layer, carousel spacing, and explicit logo sizing. | The text remains legible and the navbar and carousel have stable dimensions. |
| `CHANGELOG.md` | Recorded the visual and navigation changes. | Teammates can trace the update. |

## 2026-11-06 — React Bits and regional volunteering resources

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Placed the reveal heading, quick-links menu, expanding photo, regional directory, and pointer effect in their homepage sections. | Visitors can discover roles, shortcuts, and independent regional resources. |
| `components/HomeExtras.jsx` | Configured the supplied components, official regional links, optional local logo files, and motion-aware alternatives. | The directory works with text labels and the page stays usable on touch devices and with reduced motion. |
| `components/OpportunityGrid.jsx` | Added pastel cause chips and sticker-style cards. | Visitors can distinguish causes at a glance. |
| `pages/home.css` | Added scoped lime accents, chip colors, card borders, logo styles, and typography. | AidConnect gets a consistent visual update while course templates retain their existing styles. |
| `components/react-bits/ScrollReveal.jsx` and `ScrollReveal.css` | Added the supplied text reveal and supported a heading ID. | The animated heading still labels its section. |
| `components/react-bits/ScrollExpand.jsx` and `ScrollExpand.css` | Added the supplied expanding image frame. | The volunteer photo can expand with normal page scroll. |
| `components/react-bits/LogoLoop.jsx` and `LogoLoop.css` | Added the supplied component with a static list mode for the directory. | All five links remain visible and stationary. |
| `components/react-bits/PixelTrail.jsx` and `PixelTrail.css` | Added the supplied pointer effect. | The organization section has a local decorative interaction. |
| `components/react-bits/CardNav.jsx` and `CardNav.css` | Added the supplied quick-links menu. | Visitors can open grouped links without changing the main navbar. |
| `index.html` | Added the supplied font stylesheet with system fallbacks in CSS. | The homepage uses the requested display and body fonts when available. |
| `package.json` | Added GSAP and Hugeicons dependencies used by the supplied components. | The reveal and menu can build through Vite. |
| `package-lock.json` | Recorded the dependency versions. | Team installs can resolve the same dependency tree. |
| `CHANGELOG.md` | Recorded the component and style integration. | Teammates can trace the changes. |

## 2026-11-06 — Responsive navbar account actions

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `components/Navbar.jsx` | Added a mobile menu disclosure and kept the theme switch visible in the bar. | Links and account actions fit on narrow screens without clipping. |
| `components/AuthActions.jsx` | Added outlined Login and solid Register for guests, with Dashboard and Log out for the future signed-in state. | Account actions have a clear hierarchy and stay readable over the homepage photo. |
| `components/ThemeSwitch.jsx` | Added an accessible sun and moon switch with reduced-motion styling and saved preferences. | Visitors can recognize and keep their preferred theme. |
| `src/context/AuthContext.jsx` | Added a temporary guest adapter for the shared auth interface. | The navbar runs before the shared authentication work lands. |
| `index.html` | Restored the saved or system theme before React loads. | The page opens in the expected theme without a startup flash. |
| `pages/home.css` | Registered the new components with Tailwind and adjusted hero spacing for the compact bar. | The new utilities compile and the hero aligns with the mobile navbar. |
| `CHANGELOG.md` | Recorded the navbar and theme updates. | Teammates can trace the changes. |

## 2026-11-06 — Homepage content and account entry

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Split the headline at its sentence boundary, replaced the role questions with action links, and added five sections below the hero. | Visitors can understand how AidConnect works, see sample roles, and choose what to do next. |
| `components/Navbar.jsx` | Added a Login link and a Dark mode toggle inside the shared container. | Account entry is available from every page and the site offers an alternate reading palette. |
| `pages/JoinPages.jsx` | Added a login portal chooser and a guest registration placeholder. | Visitors reach working destinations while authentication and registration are being built. |
| `src/main.jsx` | Registered the login chooser and registration routes. | The navigation and guest posting links have valid destinations. |
| `pages/home.css` | Added a green-tinted hero scrim, set a 70vh minimum hero height, and added dark colors for AidConnect content. | Hero copy has stronger contrast and visitors can reach the new content sooner. |
| `CHANGELOG.md` | Recorded the homepage and account entry updates. | Teammates can trace the changes. |

## 2026-11-06 — Direct login portal links

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Pointed both role buttons directly to their login portal routes. | Volunteers and organizations reach the right portal in one click. |
| `pages/JoinPages.jsx` | Replaced the demo signup and intermediary page with a shared login placeholder. | Both audiences get a consistent portal page while authentication is pending. |
| `src/main.jsx` | Registered the volunteer and organization login URLs with role-specific titles. | Each portal has a distinct route ready for later integration. |
| `CHANGELOG.md` | Recorded the portal changes. | Teammates can trace the update. |

## 2026-11-06 — Volunteer and organization paths

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Added separate volunteer and organization links. | Visitors can choose the path that matches their role. |
| `pages/JoinPages.jsx` | Added a demo volunteer signup, an organization information page, and a future portal placeholder. | Visitors can try signup and see where organization login will be available. |
| `src/main.jsx` | Registered the signup, organization, and portal routes. | Each destination supports direct links and client-side navigation. |
| `pages/home.css` | Registered the new views with Tailwind and applied the existing palette. | The pages share the site's styling. |
| `CHANGELOG.md` | Recorded the new routes and views. | Teammates can trace the changes. |

## 2026-11-06 — Shared layout and homepage actions

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `components/Container.jsx` | Added a shared Tailwind wrapper with responsive horizontal padding. | The navbar, hero, and footer align without clipping at the edges. |
| `components/Navbar.jsx` | Switched to the shared container. | The header aligns with the hero and footer. |
| `pages/HomePage.jsx` | Used the supplied hero copy, capped the text width, positioned the photo to the right, and added React Router links to Opportunities and Contact. | The photo stays visible and visitors can browse roles or contact the team. |
| `components/Footer.jsx` | Used the shared container and footer color token, and added a Home link. | The footer aligns with the page and makes Home easy to find. |
| `pages/home.css` | Added Tailwind brand tokens and replaced the hero gradient with a flat dark overlay. | The buttons and footer share the site palette, and white text is easier to read over the image. |
| `CHANGELOG.md` | Recorded the layout and navigation changes. | Teammates can trace the update. |

## 2026-11-06 — Footer navigation layout

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `components/Footer.jsx` | Added a charcoal footer with AidConnect navigation above a divider and the copyright and JavaJunkies credit below it. | The footer mirrors the reference layout and gives visitors working links to key pages. |
| `pages/home.css` | Registered the footer with Tailwind and removed the previous white footer styles. | The footer uses utilities that compile with the current Tailwind v4 setup. |
| `CHANGELOG.md` | Recorded the footer redesign. | Teammates can trace the styling and navigation changes. |

## 2026-11-05 — Footer team credit

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `components/Footer.jsx` | Changed the credit to “Made by JavaJunkies”. | The footer clearly identifies the team that built AidConnect. |
| `CHANGELOG.md` | Recorded the footer wording update. | Teammates can trace the change. |

## 2026-11-05 — Full-height hero and homepage header

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/home.css` | Made the hero fill the available space above the footer. Enlarged the AidConnect brand and used bolder links with a top photo fade. | The photo meets the white footer without a dark gap, and the navigation reads clearly over the image. |
| `CHANGELOG.md` | Recorded the homepage layout and header update. | Teammates can trace the changes. |

## 2026-11-05 — White footer fix

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `src/index.css` | Removed the legacy dark footer background that overrode Tailwind. | The white background now shows behind the near-black footer text. |
| `CHANGELOG.md` | Recorded the footer fix. | Teammates can see which rule caused the conflict. |

## 2026-11-05 — Featured listings on Opportunities

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Removed the featured section and its grid import. | The homepage opens with the hero and avoids repeating the listings. |
| `pages/OpportunitiesPage.jsx` | Moved the featured heading and layout to the existing opportunities route, using the same three cards. | Visitors can find the whole section in one place through the navbar. |
| `CHANGELOG.md` | Recorded the move. | Teammates can trace the change. |

## 2026-11-05 — Photo credit on hover

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Removed the visible credit badge and put the photo description and photographer credit in the image tooltip. Kept the descriptive alt text. | The photo stays clear while the credit is available on hover. |
| `pages/home.css` | Removed the badge styles and let the hero text layer pass pointer events through to the photo. | The tooltip can appear across the image. |
| `CHANGELOG.md` | Recorded the attribution update. | Teammates can trace the change. |

## 2026-11-05 — Opportunities page and white footer

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Removed the hero button and reused the shared grid for featured listings. | The hero stays focused on its headline while visitors can still preview roles. |
| `components/OpportunityGrid.jsx` | Moved the mock listings and their cards into a shared component. | Both pages display the same details from one source. |
| `pages/OpportunitiesPage.jsx` | Added a dedicated page for browsing the sample volunteer roles. | Visitors have a direct page for comparing opportunities. |
| `components/Navbar.jsx` | Added Find opportunities to the persistent navigation. | Visitors can reach the listings from any page. |
| `src/main.jsx` | Registered the React Router route at `/opportunities`. | The page supports direct links and in-app navigation. |
| `pages/home.css` | Applied a white footer and near-black text with Tailwind, enabled utility generation for the new page and grid, and removed the old hero button styles. | The footer is easier to read and the shared grid keeps its responsive layout. |
| `CHANGELOG.md` | Recorded the page, navigation, and footer updates. | Teammates can trace the changes. |

## 2026-11-05 — Homepage button hover colors

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/home.css` | Applied Tailwind hover variants for white backgrounds and forest-green text on the main button and homepage navigation links. | The color change makes it clear which control the pointer is over. |
| `CHANGELOG.md` | Recorded the hover styling update. | Teammates can trace the change. |

## 2026-11-05 — Shorter homepage hero

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Removed the introductory hero paragraph. | The headline and Find opportunities link are easier to scan. |
| `pages/home.css` | Removed the unused paragraph styling. | The stylesheet contains only styles the homepage uses. |
| `CHANGELOG.md` | Recorded the hero copy update. | Teammates can trace the change. |

## 2026-11-05 — Transparent homepage navigation

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/home.css` | Made the homepage navbar transparent over the hero photo and replaced the blue link highlight with an underline. | The hero photo continues behind the navigation, and the active link stays identifiable without a blue fill. |
| `CHANGELOG.md` | Recorded the navigation update. | Teammates can trace the change. |

## 2026-11-05 — Hero photo hover credit

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Added the photographer credit as a hover tooltip on the hero photo. | Visitors can see the credit on hover, while screen readers get a description of the photo. |
| `CHANGELOG.md` | Recorded the hover credit update. | Teammates can trace the change. |

## 2026-11-05 — Homepage typography and full-bleed hero

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Separated the hero copy from the full-width photo layer and kept the visible stock photo credit. | The photo can fill the hero while the heading and main action stay aligned with the page content. |
| `pages/home.css` | Switched to a modern system sans-serif stack and added full-cover image styling with a responsive dark overlay. | The type is easier to scan, and the overlay keeps text readable across the photo on mobile and desktop. |
| `CHANGELOG.md` | Recorded this update under Hassan El-Tawil. | Teammates can trace the layout and typography decisions. |

## 2026-11-05 — AidConnect homepage

**Author** Hassan El-Tawil

| File | What changed | Why it improves the project |
| --- | --- | --- |
| `pages/HomePage.jsx` | Replaced the starter content with a photo-led hero, a Find opportunities link, and three labeled mock listings. Added comments explaining the mock data, reusable card, and temporary section link. | Visitors can understand the board and compare roles by cause, location, time commitment, and tasks. The link works while the standalone list route is pending. |
| `pages/home.css` | Added homepage styles and scoped Tailwind utility generation to the homepage. | The layout stacks on narrow screens, uses the AidConnect palette, and preserves the existing base styles of other pages. |
| `components/Navbar.jsx` | Replaced the placeholder mark with the imported AidConnect logo and made the brand link back to the homepage. | The board has a recognizable identity and a direct way back home from other pages. |
| `components/Footer.jsx` | Replaced the placeholder branding with AidConnect and JavaJunkies. | The footer identifies the project and its team. |
| `assets/aidconnect-logo.jpg` | Moved the supplied logo from `public/aidconnect-logo.jpg` into `assets/` for a Vite import. | Vite can bundle and fingerprint the image as part of the build. |
| `assets/volunteers-packing-donations.jpg` | Added a licensed stock photo by [Gustavo Fring on Pexels](https://www.pexels.com/photo/people-packing-donations-7156163/). | The hero shows a concrete example of volunteer work, with a visible photo credit on the page. |
| `index.html` | Set the browser title and description to describe AidConnect. | Browser tabs and page metadata identify the volunteer board. |
| `package.json` | Added Tailwind CSS and its Vite integration as development dependencies. | The project can compile Tailwind utilities during development and production builds. |
| `package-lock.json` | Recorded the resolved Tailwind dependencies. | Installs can use the recorded versions. |
| `vite.config.js` | Registered the Tailwind Vite plugin. | Vite compiles the homepage stylesheet as part of the existing build. |
| `CHANGELOG.md` | Added a file-by-file record of the homepage work. | Teammates can see what changed and why. |

The production build passed and bundled both images. The browser check did not confirm image rendering.
