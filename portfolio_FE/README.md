# 🤔 **Overview**
This project is a frontend implemented using **Astro** and **React**. It employs modern web development practices to deliver a visually engaging and interactive user experience. Key components include reusable UI elements built with **React** and styled using **TailwindCSS** for utility-first styling.
The main goal of the application is to provide a responsive and interactive interface that dynamically renders content based on configuration and user interaction, ensuring accessibility across devices and platforms.

### 🏓 **Table of contents:**
- [Overview](#Overview)
- [Features](#Features)
- [Tech stack](#Tech)
- [Development notes](#Development-notes)
- [BubbaUI](#BubbaUI)
- [Astro](#Astro)
- [License](#License)


### 🐣 **Features**
##### Modern UI Design:
- Terminal/pixel-art aesthetic with Catppuccin color scheme
- Interactive components: mini terminal, pixel eagle mascot, text-roll effects, tech stack glow blob
- Responsive layout using [TailwindCSS](https://tailwindcss.com/) across all screen sizes

##### 🧑‍✈️ **Nav bar**
- A sticky navigation bar built using Astro, React and Tailwind with:
	- Collapsible sidebar with links to `Projects`, `About` and `Contact`
	- Social media icons for GitHub and LinkedIn
	- Pixel eagle animation walking across the banner

### ⚙️ **Tech**
- Astro: Static site generator that inegrates seamlessly with React components.
- React: for building reusable and dynamic UI components.
- TailwindCSS: Utility-first CSS framework for consistent, responsive styling.
- PostCSS & Autoprefixer: To ensure CSS compatebility across browsers.
- Vite: For fast development server for optimal performance.

### 📂 **Folder layout**
```text
/src/
  ├── components/
  │    ├── HibubbaIO/
  │    │    ├── BorderBeam.tsx        # Moving border effect on project cards
  │    │    ├── HoverBlobs.tsx        # Interactive hoverable element
  │    │    ├── StaticBlobs.tsx       # Static visual components
  │    ├── Banner.astro               # Sticky header with nav and eagle
  │    ├── CardProjects.tsx           # Project cards with lightbox carousel
  │    ├── CommonHead.astro           # Shared <head> used in BaseLayout
  │    ├── ContactForm.tsx            # Contact form with backend integration
  │    ├── EasterEggs.tsx             # Console ASCII art, CRT mode, rm -rf glitch
  │    ├── MiniTerminal.tsx           # Interactive terminal on the homepage
  │    ├── MusicPlayer.tsx            # Audio player component
  │    ├── PixelEagle.tsx             # Pixel art eagle mascot animation
  │    ├── Sidebar.astro              # Fixed sidebar with nav links and CV downloads
  │    ├── SidebarNav.tsx             # Sidebar navigation with text-roll effect
  │    ├── SidebarToggle.tsx          # Hamburger menu toggle (mobile)
  │    ├── TechStack.tsx              # Tech stack grid with glow blob effect
  │    ├── TextRoll.tsx               # Character roll animation for links
  │
  ├── styles/
  │    ├── @fontsource                # Font imports
  │    ├── global.css                 # Global styles, animations, CRT mode
  │
  ├── data/
  │    ├── projects.ts                # Project data (titles, images, tags, links)
  │
  ├── pages/
  │    ├── index.astro                # Homepage with ASCII art and terminal
  │    ├── projects.astro             # Projects page
  │    ├── about.astro                # About page with bento grid
  │    ├── contact.astro              # Contact page
  │    ├── 404.astro                  # Custom 404 page
  │
  ├── layouts/
  │    ├── BaseLayout.astro           # Reusable layout wrapping all pages
```


### **Development notes**
- Astro enables server-side rendering (SSR) and integrates seamlessly with React.
- TailwindCSS configuration is defined in `tailwind.config.cjs`

### 🌈 **BubbaUI**
- Imported React/TS components from [Bubba UI](https://bubba-ui-one.vercel.app/) — `BorderBeam`, `HoverBlobs`, `StaticBlobs`, and `ParticleBg`.

---

## 🧞 Commands

All commands are run from `portfolio_FE/`:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installs dependencies                       |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview build locally before deploying      |

### License
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

