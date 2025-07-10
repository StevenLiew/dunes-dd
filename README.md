# Dune Awakening Deep Desert Interactive Map

A fan-made, fully-featured **interactive map** for the _Dune: Awakening_ game, built with **React, Tailwind CSS, and Vite**. This map allows users to view, manage, and customize map sectors, options, and storm timings, providing a crucial tool for navigating Arrakis.

---

## ✨ Features

- **View-only mode:** Publicly accessible for all users to explore the map.
- **Management interface:** Secure portal for editing map options, sector restrictions, and the storm schedule.
- **Interactive grid:** Features clear sector labels and relevant icons for easy identification.
- **Customizable options:** Define specific restrictions per map row to tailor the experience.
- **Real-time countdown:** Always know when the next storm is approaching with an accurate timer.
- **Data persistence:** All map data is securely stored and managed via a **Supabase backend**.

---

## 🚀 Technologies

This project leverages a modern web development stack to deliver a fast and responsive experience:

- **React:** For building the dynamic user interface.
- **Tailwind CSS:** For rapid and efficient styling.
- **Vite:** As a fast build tool and development server.
- **TypeScript:** For enhanced code quality and type safety.
- **Supabase:** Providing a robust backend for database and authentication.
- **Lucide-react:** For a collection of beautiful and customizable icons.
- **React Router DOM:** For declarative routing within the application.

---

## 📁 Project Structure

```
.env
.gitignore
eslint.config.js
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
.bolt/
  ├─ config.json
  └─ prompt
public/
  ├─ Alexin.webp
  ├─ Argosaz.webp
  ├─ Dyvetz.webp
  ├─ Ecaz.webp
  ├─ Hagal.webp
  ├─ Hurata.webp
  ├─ Imota.webp
  ├─ Kenola.webp
  ├─ Lindaren.webp
  ├─ Maros.webp
  ├─ Mikarrol.webp
  ├─ Moritani.webp
  ├─ Mutelli.webp
  ├─ Novebruns.webp
  ├─ Richese.webp
  ├─ Sor.webp
  ├─ Spinette.webp
  ├─ Taligari.webp
  ├─ Thorvald.webp
  ├─ Tseida.webp
  ├─ Varota.webp
  ... (more image assets)
src/
  ... (source code for React components, logic, etc.)
```

---

## ⚙️ Setup & Development

Follow these steps to get a local copy of the project up and running:

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd dune-awakening-map
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run development server:**

    ```bash
    npm run dev
    ```

4.  **Build for production:**

    ```bash
    npm run build
    ```

---

## 🔑 Environment Variables

Before running the application, create a `.env` file in the root of your project and populate it with the following:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_PASSWORD=your-management-password
```

**Note:** Replace `your-supabase-url`, `your-supabase-anon-key`, and `your-management-password` with your actual Supabase project URL, public anon key, and a secure password for accessing the management interface, respectively.

---

## ⚖️ License

This is a **fan-made project** and is **not affiliated with Funcom or Legendary Entertainment**. All rights to the _Dune: Awakening_ game and its intellectual property are reserved by their respective owners.
