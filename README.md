# alexandrit
Lighthouse metrics provisioner in the prometheus format (scratch version)

---
# How to install
```bash
> npm i -g alexandrit
```

# How to use
You should provide URL of web app to observe and optionally specify ```config.json``` 
which specifies **puppeteer** and **lighthouse** options.
```bash
> alexandrit <--url url-to-provision> \
            [--config=path to config.json] \
            [--port=port on which to listen ]
```
---
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
