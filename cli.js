#!/usr/bin/env node

const minimist = require('minimist');
const fs = require('fs');
const runExporter = require('./index');

const CLIOptions = {
    alias: {
        p: 'port',
        c: 'config',
    },
    default: {
        p: 3031,
    },
};

const parsedOptions = minimist(process.argv.slice(2), CLIOptions);

if (!parsedOptions['url']) {
    console.error('specify \"url\" parameter: --url <url>');
    process.exit(1);
}

const getOption = (key, options) => {
    return Array.isArray(options[key]) ? options[key][-1] : options[key];
}

const configLocationArg = getOption('config', parsedOptions);
const configLocationEnv = process.env.ALEXANDRIT_CONFIG_FILE

const configLocation = configLocationArg || configLocationEnv;

const defaultConfig = {
    "lighthouseFlags": {
        "logLevel": "info",
        "disableDeviceEmulation": true,
        "chromeFlags": ["--disable-mobile-emulation", "--headless"]
    },
    "lighthouseConfig": {
        "extends": "lighthouse:default",
        "settings": {
            "emulatedFormFactor": "desktop"
        }
    },
    "puppeteerConfig": {
        "args": ["--no-sandbox"]
    }
}

let config;
try {
    const userDefinedConfig = JSON.parse(fs.readFileSync(configLocation, 'utf-8'));
    config = Object.assign({}, defaultConfig, userDefinedConfig);
} catch (error) {
    config = {...defaultConfig};
}

const url = getOption('url', parsedOptions);
const port = getOption('port', parsedOptions);
const metricsUrl = getOption('metrics-url', parsedOptions) || '/metrics'

const options = {
    ...config,
    reportTargetURL: url,
    port,
    url: metricsUrl,
};

console.log(options);

runExporter(options);



