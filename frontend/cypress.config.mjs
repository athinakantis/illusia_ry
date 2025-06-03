import { defineConfig } from "cypress";
import { config } from "process";
import { loadEnv } from "vite";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const viteEnv = loadEnv('', process.cwd(), '');
      config.env = {
        ...config.env,
        CYPRESS_USER_EMAIL: viteEnv.VITE_CYPRESS_USER_EMAIL,
        CYPRESS_USER_PASSWORD: viteEnv.VITE_CYPRESS_USER_PASSWORD,
        CYPRESS_ADMIN_EMAIL: viteEnv.VITE_CYPRESS_ADMIN_EMAIL,
        CYPRESS_ADMIN_PASSWORD: viteEnv.VITE_CYPRESS_ADMIN_PASSWORD,
      };
      return config;
    },
    baseUrl: 'http://localhost:5173', // Assuming this is your Vite dev server port
  },
});
console.log(config);