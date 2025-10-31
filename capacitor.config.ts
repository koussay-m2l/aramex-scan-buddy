import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bb8e7726fadb4e6391bdbb5bef0d5cd9',
  appName: 'aramex-scan-buddy',
  webDir: 'dist',
  server: {
    url: 'https://bb8e7726-fadb-4e63-91bd-bb5bef0d5cd9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
