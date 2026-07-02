export const projects = [
  {
    projectTitle: "repoz",
    description:
      "CLI tool that shows what changed across your Git repos since you last sat down. Compares local state with GitHub, groups by time slots, and surfaces uncommitted work, no config needed.",
    tags: ["Bash", "GitHub CLI", "jq", "Git"],
    image: "/pictures/repoz.png",
    link: "https://github.com/Gaurgle/repoz",
  },
  {
    projectTitle: "notez",
    description:
      "Local-first CLI note-taking tool. Notes live in your project directory, mirrored to a home folder via symlinks. Interactive todo manager with subtasks, tree navigator with vim keys, daily logs, all in one Rust binary.",
    tags: ["Rust", "ratatui", "CLI"],
    image: ["/pictures/notez-local.png", "/pictures/notez-global.png", "/pictures/todoz-local.png", "/pictures/todoz-global.png"],
    link: "https://github.com/Gaurgle/notez-cli",
    featured: true,
    featuredOrder: 3,
    details: {
      long:
        "Notes that live where the work lives: in the project directory, mirrored to a " +
        "global home via symlinks so nothing is ever lost. The todoz TUI handles todos " +
        "with subtasks, priorities and vim-style navigation.",
      highlights: [
        "Single static Rust binary, no runtime dependencies",
        "Local-first with symlink mirroring to a global index",
        "Interactive TUI: tree navigation, subtasks, colored priority flags",
        "Daily logs and per-project public/private notes",
      ],
    },
  },
  {
    projectTitle: "noiz",
    description:
      "Terminal noise generator for focus. Real-time stereo noise synthesis (white, pink, brown) with binaural brainwave presets, rain overlay, and a minimal TUI. Everything generated in real-time, no samples needed.",
    tags: ["Rust", "cpal", "ratatui", "DSP", "Audio"],
    image: "/pictures/noiz.png",
    link: "https://github.com/Gaurgle/noiz",
    featured: true,
    featuredOrder: 4,
    details: {
      long:
        "A focus tool that synthesizes its sound instead of playing samples: white, pink " +
        "and brown noise generated in real time, with binaural brainwave presets and a " +
        "rain overlay, all driven from a minimal terminal UI.",
      highlights: [
        "Real-time stereo DSP straight to the audio device via cpal",
        "Binaural beat presets (focus, calm, deep work)",
        "Procedural rain overlay, no audio files anywhere",
        "Tiny ratatui interface with live parameter control",
      ],
    },
  },
  {
    projectTitle: "spaze",
    description:
      "Terminal-first, self-hostable team chat in a single static Rust binary. Inline #note and #todo capture through a slash-command parser, GitHub OAuth identity, server-side full-text search, and a ratatui TUI where mouse, vim, and buttons are all first-class.",
    tags: ["Rust", "ratatui", "SQLite", "TUI"],
    image: null,
    wip: true,
    link: "https://github.com/Gaurgle/spaze",
  },
  {
    projectTitle: "glanze",
    description:
      "macOS menu-bar app for ambient awareness of running AI coding-agent sessions. Agent-agnostic by design, with v1 support for Claude Code and adapters for other agent CLIs that drop in without touching the menu-bar app.",
    tags: ["Swift", "macOS"],
    image: null,
    wip: true,
    link: "#",
  },
  {
    projectTitle: "Wireless Testing App",
    description:
      "Android app for testing Bluetooth LE and LE Audio devices. Lua scripting engine for custom test sequences, GATT discovery and real-time device communication.",
    tags: ["Kotlin", "Jetpack Compose", "BLE", "Lua", "MVVM"],
    image: ["/pictures/BLE app 1.png", "/pictures/BLE app 2.png"],
    link: "#",
    featured: true,
    featuredOrder: 1,
    details: {
      long:
        "An Android tool that talks to real hardware: it connects to BLE and LE Audio " +
        "devices, digs through GATT services and characteristics live, and runs " +
        "automated test sequences through an embedded Lua engine - predictable " +
        "behavior out of unpredictable radios.",
      highlights: [
        "Embedded Lua engine scripts entire test sequences",
        "Full GATT discovery with live characteristic read/write/notify",
        "Serialized operation queue: thread-safe, deterministic hardware I/O",
        "Jetpack Compose UI on a clean MVVM core",
      ],
    },
  },
  {
    projectTitle: "Wireless Test Platform",
    description:
      "REST API for BLE and LE Audio test session management and result storage. Real-time SSE events, Svelte + TypeScript frontend, containerized with Docker.",
    tags: ["Kotlin", "Ktor", "PostgreSQL", "Docker", "Svelte", "TypeScript"],
    image: [
      "/pictures/WTP 1 Screenshot 2026-03-31 at 23.16.18.png",
      "/pictures/WTP 2 Screenshot 2026-03-31 at 23.16.58.png",
      "/pictures/WTP 3 Screenshot 2026-03-31 at 23.18.22.png",
    ],
    link: "#",
    featured: true,
    featuredOrder: 2,
    details: {
      long:
        "The backend for the bench: a Ktor REST API that manages BLE test sessions and " +
        "stores results in PostgreSQL, streaming live progress over SSE to a Svelte + " +
        "TypeScript frontend. The whole path from device on the bench to data in the " +
        "database.",
      highlights: [
        "Ktor REST API with test-session lifecycle management",
        "Real-time run progress via server-sent events",
        "PostgreSQL persistence, containerized with Docker",
        "Svelte + TypeScript dashboard frontend",
      ],
    },
  },
  {
    projectTitle: "Audio Watermark",
    description:
      "Desktop tool that embeds imperceptible, cryptographically signed watermarks into audio. Survives compression, editing, and format conversion with real-time spectrogram visualization.",
    tags: ["C++20", "JUCE", "DSP", "CMake"],
    image: [
      "/pictures/WM 1 Screenshot 2026-03-31 at 23.27.01.png",
      "/pictures/WM 2 Screenshot 2026-03-31 at 23.27.58.png",
    ],
    link: "#",
  },
  {
    projectTitle: "Portfolio",
    description:
      "This site. A fullstack portfolio built with Spring Boot (Kotlin), Astro, React, and TailwindCSS, backed by PostgreSQL on Render.",
    tags: ["Kotlin", "Spring Boot", "Astro", "React", "Tailwind", "PostgreSQL"],
    image: [
      "/pictures/Portfolio 1 Screenshot 2026-03-31 at 20.15.34.png",
      "/pictures/Portfolio 2 Screenshot 2026-03-31 at 23.19.40.png",
      "/pictures/Portfolio 3 Screenshot 2026-03-31 at 23.18.59.png",
    ],
    link: "https://github.com/gaurgle/DevOps_Portfolio/",
    demoUrl: "https://andreasroos.vercel.app",
  },
  {
    projectTitle: "Booking Program",
    description:
      "A booking system for a small guesthouse, built as a group project. Spring Boot with Hibernate and a Thymeleaf web interface.",
    tags: ["Spring Boot", "Hibernate", "Thymeleaf", "MySQL"],
    image: "/pictures/bookingProgram.png",
    link: "https://github.com/cfrank3N/booking-program",
  },
  {
    projectTitle: "Webshop",
    description:
      "Product management web shop with Spring Boot, JavaScript, and Fake Store API integration. Includes auth and error handling.",
    tags: ["Spring Boot", "JavaScript", "REST API"],
    image: "/pictures/webshop.png",
    link: "https://github.com/Gaurgle/web-shop-aaa",
  },
  {
    projectTitle: "15 Game",
    description:
      "Puzzle game in Java with Swing. Features a built-in audio converter and player for in-game music and effects.",
    tags: ["Java", "Swing", "Audio"],
    image: "/pictures/15game.png",
    link: "https://github.com/Gaurgle/15-game/",
    songSrc: "/audio/Game15_1.0.wav",
  },
  {
    projectTitle: "Yacht Strike",
    description:
      "Battleship in the command line. Multiplayer. Has the best soundtrack.",
    tags: ["Java", "CLI", "Multiplayer"],
    image: "/pictures/Yachstrike.png",
    link: "https://github.com/Gaurgle/YachtStrikeVGAndreasRoos",
    songSrc: "/audio/wavYachtTheme.wav",
  },
  {
    projectTitle: "Quiz Game",
    description:
      "Multiplayer quiz game using serialization, local database and ServerSocket for concurrency. Comes with its own cute soundtrack.",
    tags: ["Java", "Sockets", "Multiplayer"],
    image: "/pictures/QuizGame1.png",
    link: "https://github.com/cfrank3N/quiz-game",
    songSrc: "/audio/quizThemeSong.wav",
  },
];
