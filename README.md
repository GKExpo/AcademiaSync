# AcademiaSync Frontend

This is the frontend for AcademiaSync, built with React, Vite, Tailwind CSS, and Capacitor.

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
The primary variable is the API URL:
``nVITE_API_URL=http://localhost:8787
``n(Use http://localhost:8787 for local Wrangler Hono backend).

## Android / Capacitor Development
This project uses Capacitor to build into a native Android app.

1. Sync web assets to Android:
`ash
npx cap sync android
``n
2. Open Android Studio:
`ash
npx cap open android
``n
## USB Debugging Testing
If you have a physical Android device connected via USB debugging:
1. Ensure device is recognized via ADB:
`ash
adb devices
``n2. Run the app directly on the device:
`ash
npx cap run android
``n
Make sure your local backend is running on a reachable IP (not just localhost) if you want the physical device to access it over the local network, or use ADB reverse proxy:
`ash
adb reverse tcp:8787 tcp:8787
``n
