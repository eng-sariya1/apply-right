import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173/',
        chromeWebSecurity: false,
        defaultCommandTimeout: 8001,
        screenshotsFolder: 'cypress/screenshots',
        videosFolder: 'cypress/videos',
        video: true,
        screenshotOnRunFailure: true,
        reporter: 'cypress-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'spec, mocha-junit-reporter, mochawesome',
            mochawesomeReporterOptions: {
                reportDir: 'cypress/results/mochawesome',
                overwrite: false,
                html: false,
                json: true,
                timestamp: 'yyyy-mm-dd_HH-MM-ss',
            },
            mochaJunitReporterReporterOptions: {
                mochaFile: 'cypress/results/junit/test-results-[hash].xml',
                toConsole: true,
            },
        },
        setupNodeEvents(on, config) {
            return config;
        },
    },
});
