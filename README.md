# alexandrit
Lighthouse metrics provisioner in the prometheus format (scratch version). Runs server on the specified port (3031 by default), 
uses puppeteer to calculate metrics in prometheus format and returns it on ```/metrics``` endpoint.

# Installation

---
```bash
> npm i -g alexandrit
```

# How to use

---
You should provide URL of web app to observe and optionally specify ```config.json``` 
which specifies **puppeteer** and **lighthouse** options.
```bash
> alexandrit <--url url-to-provision> \
            [--config=path to config.json] \
            [--port=port on which to listen ]
```
## List of supported metrics (to be updated)
1. First Contentful Paint
2. First Meaningful Paint
3. Interactive (Time to Interactive)
4. Largest Contentful Paint
## Configuration
Currently, you can only configure alexandrit using CLI option or environment variable ```ALEXANDRIT_CONFIG_FILE```
which specify path to the config file in json format (going to change to the yml).
### config file structure
```json
{
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
``` 
