# web-programming-project
Credits: [React Bits](https://reactbits.dev/) supplied the visual effects and navigation components.

## React Bits handoff

The app already had GSAP. ScrollReveal uses its bundled ScrollTrigger plugin, and BubbleMenu uses GSAP for its opening transition. This integration adds no dependencies.

### Added or changed

- `src/components/fx/{LogoLoop,ScrollReveal,ScrollExpand,PixelTrail,BubbleMenu,GradientASCII}/` contains the effect pairs. The full modified BubbleMenu is in `src/components/fx/BubbleMenu/BubbleMenu.jsx`.
- `src/hooks/{useMediaQuery,useReducedMotion,useCssVar}.js`, `src/context/ThemeContext.jsx`, `src/main.jsx`, `components/{ThemeSwitch,AdaptiveNavbar,HomeExtras}.jsx`, and `pages/{HomePage.jsx,home.css}` wire up the theme, navigation, and homepage.
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

- **404** — Import and render `NotFoundEffect` from `../src/components/fx/GradientASCII/NotFoundEffect.jsx` in `pages/NotFoundPage.jsx`. It already contains the page heading, Home link, fallback card, and lazy canvas.
- **About** — Use ScrollReveal for one actual h2, with plain text and an accessible fallback heading. If using GradientASCII in an optional header, place copy on a solid surface and keep that route to one WebGL effect.
- **404 PixelTrail alternative** — Use the same reduced-motion and fine-pointer gate as `OrganizationTrail` in `components/HomeExtras.jsx`. Use it in place of GradientASCII to keep one canvas.
- **Dashboard** — No decorative effects are needed.

The existing photo hero is shared by both themes in this checkout. The Home update preserves that layout. The paused and reduced-motion platform strips use a wrapped list to keep all links reachable. Logo assets remain named by slug and load through the Vite glob.
