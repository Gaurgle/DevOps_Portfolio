# 🤔 **Overview**
This project is a frontend implemented using **Astro** and **React**. It employs modern web development practices to deliver a visually engaging and interactive user experience. Key components include reusable UI elements built with **React** and styled using **TailwindCSS** for utility-first styling.
The main goal of the application is to provide a responsive and interactive interface that dynamically renders content based on configuration and user interaction, ensuring accessibility across devices and platforms.

### 🏓 **Table of contents:**
- [Overview](#Overview)
- [Features](#Features)
- [Tech stack](#Tech)
- [Developmjent notes](#Develompentnotes)
- [BubbaUI](#BubbaUI)
- [Astro](#Asatro)
- [License](#Licsnse)


### 🐣 **Features**
##### Modern UI Design:
- Utilizes React components like `HoverBlob` and `StaticBlobs` to add interactivity and animations for hoover effects and transitions.
- Responsive layout implemented using [TailwindCSS](https://tailwindcss.com/) to maintain useability on all screen sizes.

##### 🧑‍✈️ **Nav bar**
- A sticky navigation bar built using Astro, React and Tailwind. It dynamically renders:
	- Links to `Projects`, `About` and `Contact`
	- Sociial media thumbnails for GitHub and LinkedIn.
- Hover effects and animations for links and social icons are handled through the `HoverBlobs` component.

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
  │    │    ├── BorderBeam.tsx		 # Moving border effect
  │    │    ├── HoverBlobs.tsx       # Interactive hoverable element
  │    │    ├── StaticBlobs.tsx      # Static visual components
  │    ├── Banner.astro              # Banner component, includes navigation
  │    ├── CardProjects.tsx          # Creates cards for projects 
  │    ├── CommonHead.astro          # Shared head used in BaseLayout.astro
  │    ├── ContactForm.tsx           # Creates the contact form
  │    ├── Sidebar.astro             # Creates the sidebar component
  │    ├── SidebarToggle.tsx         # Handles the sidebar toggle button
  │
  ├── styles/
  │    ├── @fontsource				 # importing fonts
  │    ├── global.css              	 # CSS styles
  │
  ├── pages/
  │    ├── index.astro               # Homepage
  │    ├── projects.astro            # Projects page
  │    ├── about.astro               # About page
  │    ├── contact.astro             # Contact page
  │
  ├── public/
  │    ├── icons/
  │    │    ├── github.svg           # GitHub icon used in the navbar
  │    │    ├── linkedin.svg         # LinkedIn icon used in the navbar
  │
  ├── layouts/
  │    ├── BaseLayout.astro          # Reusable layout wrapping all pages
```


### **Develompent notes**
- Astro enables server-side rendering (SSR) and integrates seamlessly with React.
- TailwindCSS configuration is defined in `tailwind.config.cjs`

### 🌈 **BubbaUI**
- Imported React and TS/JS components from Bubba UI like `Animated Blobs` and `Particle Background` from [Bubba UI](https://bubba-ui-one.vercel.app/) for 



# **Astro:**

## Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```


## 🚀 **Project Structure**

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


### License
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

