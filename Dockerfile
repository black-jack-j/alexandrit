FROM alpine

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY *.json yarn.lock ./


RUN yarn install --production --pure-lockfile

COPY src ./src/
COPY *.js ./

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

ENV TARGET_HOST=""
ENV TARGET_PORT=""
ENV METRICS_PORT=3000
ENV ALEXANDRIT_CONFIG_FILE=""

USER pptruser


EXPOSE 3000

ENTRYPOINT node /app/cli.js --url="http://$TARGET_HOST:$TARGET_PORT" --port "$METRICS_PORT" --no-sandbox