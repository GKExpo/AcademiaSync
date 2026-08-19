import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.academiasync.app',
  appName: 'AcademiaSync',
  webDir: 'dist',
  server: {
    cleartext: false,
    allowNavigation: [
      'academiasync-backend.onrender.com'
    ]
  }
};


export default config;
