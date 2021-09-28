const {Mutex} = require('async-mutex');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const {REPORT_GENERATION_ERROR} = require('./errors');

const mutex = new Mutex();

const generateReport = async (options) => {
    const {
        lighthouseConfig,
        lighthouseFlags,
        reportTargetURL,
        puppeteerConfig
    } = options;
    return mutex.runExclusive(async () => {
        const browser = await puppeteer.launch(puppeteerConfig);
        lighthouseFlags.port = new URL(browser.wsEndpoint()).port;

        const lighthouseReport = await lighthouse(reportTargetURL, lighthouseFlags, lighthouseConfig);

        await browser.close();
        return lighthouseReport.report;
    }).then(JSON.parse).catch(error => {
        console.error(error);
        return Promise.reject({
            msg: 'Error during report generation',
            code: REPORT_GENERATION_ERROR,
            payload: error}
        );
    })
};

module.exports = generateReport;