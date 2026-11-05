# Changelog

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
