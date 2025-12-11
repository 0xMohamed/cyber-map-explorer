# Cyber Map Explorer

> **Experimental Static Visualization Demo**  
> _A creative UI/UX concept for interactive, cyberpunk-inspired map visualizations._

---

## Overview

**Cyber Map Explorer** is a non-commercial, exploratory frontend showcase for creative map-based visualizations. It demonstrates advanced UI/UX concepts, interactive visual elements, and frontend engineering skills using a cyberpunk-inspired theme. The project is a static, client-side demo and not a production application.

- **Purpose:**
  - Explore creative, animated, and interactive map UI/UX patterns.
  - Showcase frontend engineering and design skills.
  - Serve as an experimental concept, not for commercial or production use.

## Demo Video

[![Watch the Demo on Vimeo](https://i.postimg.cc/132Kmzvj/image.png)](https://vimeo.com/1145456806)

---

## Features (Extracted from Code)

- **Interactive Map Visualization**

  - Uses [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) for 3D map rendering.
  - Custom map style and animated transitions (fly-to, pitch, bearing, zoom).
  - Towers (landmarks) visualized as animated, glowing points and custom icons.
  - Click any tower to smoothly fly to its location and view details.

- **Tower Details & Popups**

  - Cyberpunk-styled popup displays image, name, and description for each tower.
  - Glitch and neon effects on text and UI elements.
  - Responsive and animated popup transitions.

- **Tower Management (Demo Only)**

  - Add, edit, or delete towers via a sidebar form (client-side only; changes are not persistent).
  - Form auto-fills map parameters (coordinates, pitch, bearing, zoom) from current map view.
  - Demo UUID generation for new towers.

- **Custom Navigation Bar**

  - Scrollable, animated nav bar listing all towers.
  - Clicking a nav item triggers map fly-to and popup.

- **Cyberpunk Visual Theme**

  - Animated SVG noise overlays.
  - Neon, glitch, and shadow effects throughout.
  - Custom SVG cursor.
  - Responsive design for desktop and mobile.

- **Audio Feedback**
  - Click and close actions play cyberpunk-inspired sound effects.

---

## Tech Stack (Detected)

- **Frontend:**

  - [Mapbox GL JS](https://www.npmjs.com/package/mapbox-gl) (`^3.11.0`)
  - [Vite](https://vitejs.dev/) (build tool, dev server)
  - Vanilla JavaScript (ES Modules)
  - CSS (custom, with Orbitron font)
  - HTML5

- **Assets:**
  - SVG icons, cyberpunk cursor
  - MP3 sound effects
  - Remote and local image assets

---

## Project Structure & Key Modules

- `/index.html`  
  Main entry point. Loads the map, panels, popups, navigation, and cyberpunk theme elements.

- `/src/main.js`  
  Core logic for map initialization, tower management, UI interactivity, and event handling.

- `/src/data/towers.js`  
  Example GeoJSON data for towers (landmarks), including coordinates, images, and descriptions.

- `/src/utils.js`  
  Utility functions for DOM class manipulation.

- `/src/style.css`  
  Custom cyberpunk-inspired styles, glitch/neon effects, and responsive layout.

- `/public/images/`  
  Custom SVG cursor and image assets.

- `/public/sounds/`  
  MP3 sound effects for UI feedback.

---

## Pages & UI Modules

- **Map Section:**

  - Fullscreen, interactive 3D map with animated transitions and custom style.

- **Navigation Bar:**

  - Horizontally scrollable list of towers. Click to focus map and open popup.

- **Tower Popup:**

  - Shows tower image, name, and description with glitch/neon effects.
  - Close button with sound and animated transitions.

- **Menu Bar:**

  - Buttons for toggling add/edit tower panel and deleting/editing current tower (demo only).

- **Cyberpunk Panel:**

  - Form for adding or editing towers. Auto-fills map view parameters. All changes are client-side and non-persistent.

- **Animated Noise Overlay:**

  - SVG filter for animated noise effect over the UI.

- **Custom Cursor:**
  - SVG cursor styled for cyberpunk effect.

---

## How to Run the Project

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
2. **Start the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
3. **Open your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

> **Note:** You must provide your own Mapbox access token. Set it in a `.env` file as `VITE_MAPBOX_TOKEN=your_token_here`.

---

## Additional Insights

- **All data and changes are local and in-memory only.** There is no backend or data persistence.
- **Project is a static demo:** All features are for demonstration and exploration only.
- **No authentication, user accounts, or commercial features.**
- **Highly visual, animation-heavy, and themed for creative inspiration.**
- **Designed and developed as a concept before discovering similar projects online.**

---

## License & Usage

This project is for educational, demonstration, and inspiration purposes only. Not for commercial use.

---

## Credits

- Concept, design, and implementation by the project author.
- Map data and imagery via Mapbox and referenced sources in the code.

---

> _If you use or reference this project, please credit the original author and respect the non-commercial intent._
