# Netflix Clone 🎬

A high-fidelity, production-grade Netflix clone built with React, TypeScript, and Tailwind CSS. This project replicates the core user experience of Netflix, from the cinematic landing page to the dynamic browsing and trailer playback functionality.

![Netflix Clone Preview](https://github.com/ujjawal8461/netflix-clone/raw/main/public/preview.png) *(Note: Add your own preview image path here)*

## 🚀 Overview

This project was developed to demonstrate advanced frontend engineering skills, including complex UI/UX implementation, state management, and seamless API integration. It features a fully responsive design, a custom authentication flow, and dynamic content fetching from the TMDB API.

## ✨ Features

-   **Cinematic Landing Page**: A pixel-perfect recreation of the Netflix entry point, featuring the signature curved divider and hero sections.
-   **Multi-Profile Authentication**: A custom authentication system that supports multiple user profiles, allowing for a personalized experience.
-   **Dynamic Content Discovery**: Automatically fetches trending, top-rated, and genre-specific movies and TV shows from the TMDB API.
-   **Interactive UI Components**:
    -   **Dynamic Rows**: Horizontal scrolling rows with vertical poster layouts.
    -   **Movie Modal**: Detailed pop-ups with movie summaries, ratings, and release dates.
    -   **Search Functionality**: Real-time search across the TMDB database.
-   **Trailer Playback**: Integrated YouTube player using `react-youtube` and `movie-trailer` to find and play official trailers instantly.
-   **My List**: Save your favorite movies and shows to a persistent personal list.
-   **Category-Specific Pages**: Dedicated routing for different genres and content types.
-   **Premium Aesthetics**:
    -   Sleek dark mode design.
    -   Smooth micro-animations and hover effects.
    -   Skeleton loading states for a seamless user experience.
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.

## 🛠️ Tech Stack

-   **Core**: [React](https://reactjs.org/) (Vite)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (for type safety and robust code)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (for utility-first, responsive design)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **API Client**: [Axios](https://axios-http.com/)
-   **State Management**: React Context API
-   **External APIs**: [TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api)
-   **Media**: `react-youtube`, `movie-trailer`
-   **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
-   **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ujjawal8461/netflix-clone.git
    cd netflix-clone
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your TMDB API Key:
    ```env
    VITE_TMDB_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Build for production**:
    ```bash
    npm run build
    ```

## 👨‍💻 What I Did

-   **Architecture**: Designed a scalable component-based architecture using React and TypeScript.
-   **UI/UX Implementation**: Built high-fidelity UI components from scratch, ensuring pixel-perfect alignment with the original Netflix design.
-   **API Integration**: Architected a robust API layer to fetch and filter data from TMDB, handling various content categories.
-   **Auth System**: Developed a custom authentication and profile selection logic to simulate a real-world subscription service experience.
-   **Optimization**: Implemented performance best practices, including lazy loading and skeleton screens, to ensure fast load times and a premium feel.
-   **Deployment**: Configured the project for seamless deployment with Vercel, including analytics integration.

---

*Enjoy the cinematic experience!* 🍿
