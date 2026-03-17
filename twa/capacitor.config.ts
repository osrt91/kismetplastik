import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kismetplastik.app",
  appName: "Kısmet Plastik",
  webDir: "../out",

  // Live site configuration — loads PWA from the production server
  // Remove this block to use local build (webDir) instead
  server: {
    url: "https://www.kismetplastik.com/test/tr",
    cleartext: false,
    // Allow navigation within the app scope
    allowNavigation: [
      "www.kismetplastik.com",
      "kismetplastik.com",
      "supabase.kismetplastik.com",
    ],
  },

  ios: {
    // Status bar
    preferredContentMode: "mobile",
    backgroundColor: "#FAFAF7",
    scrollEnabled: true,

    // WKWebView configuration
    allowsLinkPreview: true,
    contentInset: "automatic",
    limitsNavigationsToAppBoundDomains: true,

    // Scheme for deep linking
    scheme: "kismetplastik",
  },

  android: {
    // Not used — Android uses TWA (Bubblewrap) instead
    // This config is here only for reference/completeness
    backgroundColor: "#FAFAF7",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: "#FAFAF7",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      spinnerColor: "#0A1628",
    },
    StatusBar: {
      // Navy brand color
      backgroundColor: "#0A1628",
      style: "LIGHT",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
