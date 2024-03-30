import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'maskbc.salescrm.app',
  appName: 'SalesCRMApp',
  webDir: 'www',
  server: {
    "androidScheme": 'http'
  }
};

export default config;
