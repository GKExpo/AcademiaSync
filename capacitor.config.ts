import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.academiasync.app',
  appName: 'AcademiaSync',
  webDir: 'dist',
  server: {
    cleartext: false,
    allowNavigation: [
      'academiasync-backend.shardulk091.workers.dev'
    ]
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#ffffff",
      style: "LIGHT"
    }
  }
};


export default config;
