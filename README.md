# web-programming-project
Credits: [React Bits](https://reactbits.dev/) supplied the visual effects and navigation components.

## Project structure

The app source lives under `src/`.

- `src/index.html` is the single HTML entry. `src/main.jsx` starts React and defines the routes.
- `src/pages/` holds the route views, and `src/components/` holds shared components. React Bits effects and their styles live together in `src/components/fx/`.
- `src/styles/` holds the base and homepage styles, including the Tailwind configuration.
- `src/assets/`, `src/context/`, and `src/hooks/` hold images, shared state, and hooks.

Run `npm run dev`, `npm run build`, or `npm run preview` from the project folder. Vite writes the production site to `dist/`.

## How the app works

- `src/main.jsx` contains the page routes and shows a skeleton while a page loads.
- `AuthActions.jsx` supplies the same Sign up and Log in links on desktop and mobile. Both routes use `AccountPage.jsx` for the placeholders.
- `ThemeSwitch.jsx` flips a single dark-mode setting. Tailwind's `dark:` classes change the colors, and the browser remembers the choice.
- `DeferredContent.jsx` waits until a homepage effect is close to view before loading it.

## React Bits handoff

The app already had GSAP. ScrollReveal uses its bundled ScrollTrigger plugin, and BubbleMenu uses GSAP for its opening transition. This integration adds no dependencies.

### Added or changed

- `src/components/fx/` contains CardNav and the effect pairs. The full modified BubbleMenu is in `src/components/fx/BubbleMenu/BubbleMenu.jsx`.
- The theme provider and hooks connect the navigation and homepage components to the selected theme.
- `src/assets/` is the source image folder. `brand/` holds AidConnect branding, `photos/` holds stock photography, and `logos/` holds the three available platform marks. The Volunteer Circle and Takatof use wordmarks.
- `src/components/fx/GradientASCII/NotFoundEffect.jsx` and its CSS are the ready-to-use 404 view. The existing 404 route stays with its owner.

### Vendor modifications

ScrollExpand changes its visual title and hint from ordinary divs to decorative divs.

```diff
- <div ref={titleRef} className="scroll-expand__title">
+ <div aria-hidden="true" ref={titleRef} className="scroll-expand__title">
- <div ref={hintRef} className="scroll-expand__hint">
+ <div aria-hidden="true" ref={hintRef} className="scroll-expand__hint">
```

`// MODIFIED(1)` The overlay h2 supplies the accessible heading.

```diff
+ overlayRef.current.inert = inn < 0.6; // MODIFIED(2)
- <div ref={overlayRef} className="scroll-expand__overlay">
+ <div inert="" ref={overlayRef} className="scroll-expand__overlay">
```

BubbleMenu's eight numbered modifications are marked in the full file. LogoLoop, ScrollReveal, PixelTrail, and GradientASCII use their existing APIs. Each vendor stylesheet is wrapped in `@layer components`, before the utilities layer. The theme provider applies the root class in `useLayoutEffect`. The color hook observes that class and reads the computed values after it changes.

### Usage for page owners

- **404** — Import and render `NotFoundEffect` from `../components/fx/GradientASCII/NotFoundEffect.jsx` in `src/pages/NotFoundPage.jsx`. It already contains the page heading, Home link, fallback card, and lazy canvas.
- **About** — Use ScrollReveal for one actual h2, with plain text and an accessible fallback heading. If using GradientASCII in an optional header, place copy on a solid surface and keep that route to one WebGL effect.
- **404 PixelTrail alternative** — Use the same reduced-motion and fine-pointer gate as `OrganizationTrail` in `src/components/HomeExtras.jsx`. Use it in place of GradientASCII to keep one canvas.
- **Dashboard** — No decorative effects are needed.

The existing photo hero is shared by both themes in this checkout. The Home update preserves that layout. The paused and reduced-motion platform strips use a wrapped list to keep all links reachable. Logo assets remain named by slug and load through the Vite glob.
