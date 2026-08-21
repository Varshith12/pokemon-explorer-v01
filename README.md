# Pokémon Explorer

A modern and responsive Pokémon Explorer built with **React**, **TypeScript**, and **Vite** using the **PokéAPI**.

The application allows users to search, filter, explore, and view detailed information about Pokémon through a clean and interactive interface.

## Features

- Browse Pokémon in a responsive card-based layout
- Search Pokémon by name
- Filter Pokémon by type
- View detailed Pokémon information
- Display Pokémon images, IDs, names, and types
- Responsive design for desktop, tablet, and mobile
- Loading states while fetching API data
- Error handling for failed API requests and invalid searches
- Empty state for unavailable search results
- Interactive hover effects and modern UI
- Dark-themed interface
- Load More functionality for exploring additional Pokémon

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Lucide React
- PokéAPI
- GitHub
- Vercel

## API Used

This project uses the public **PokéAPI**.

**API Base URL:**

`https://pokeapi.co/api/v2/`

The application uses Pokémon endpoints to retrieve Pokémon lists and detailed Pokémon information.

No API key or authentication is required.

## Installation

Clone the repository:

```bash
git clone https://github.com/Varshith12/pokemon-explorer-v01.git
```

Navigate to the project directory:

```bash
cd pokemon-explorer-v01
```

Install dependencies:

```bash
npm install
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Project Structure

```text
src/
├── components/
├── services/
├── types/
├── App.tsx
├── main.tsx
└── ...
```

## Challenges Faced

- Integrating data from the PokéAPI
- Managing asynchronous API requests
- Handling loading and error states
- Implementing Pokémon search and type filtering
- Creating a responsive card-based interface
- Presenting detailed Pokémon information in an intuitive way
- Managing UI interactions and API-driven state

## Future Improvements

- Persistent favorites using localStorage
- Improved dark/light theme switching
- Pokémon comparison functionality
- Sorting by statistics such as HP, Attack, and Speed
- URL-based Pokémon detail pages
- Keyboard accessibility improvements
- Additional animations and UI enhancements

## Live Demo

https://pokemonexplorerv01-vosf--5173--017acfb7.local-corp.webcontainer.io/

## GitHub Repository

https://github.com/Varshith12/pokemon-explorer-v01
