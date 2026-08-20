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
      overlaysWebView: true,
      backgroundColor: "#ffffff",
      style: "LIGHT"
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "ic_splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: false,
      splashImmersive: false
    }
  }
};


export default config;
