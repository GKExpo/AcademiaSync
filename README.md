# AcademiaSync Frontend

This is the frontend for AcademiaSync, built with React, Vite, Tailwind CSS, and Capacitor.

## API Configuration
We have migrated the backend from Render to Cloudflare Workers.

The production URL is:
``nhttps://academiasync-backend.shardulk091.workers.dev
``n
## Local Setup
1. Install dependencies:
`ash
npm install
``n
2. Run development server:
`ash
npm run dev
``n
## Environment Variables
Create a .env file based on .env.example.
``nVITE_API_URL=https://academiasync-backend.shardulk091.workers.dev
``n
## Android / Capacitor Development
1. Sync web assets to Android:
`ash
npx cap sync android
``n2. Run the app directly on the device:
`ash
npx cap run android
``n
