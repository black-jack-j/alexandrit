const http = require('http');
const generateReport = require('./src/report-generator');
const {Registry} = require('prom-client');
const {defaultMetrics, lighthouseAuditsToPrometheusObservations, metricsConfigurations} = require('./src/lighthouse2prometheus');

const runExporter = (options) => {
    const {port, url} = options;
    const register = new Registry();

    options.lighthouseConfig.settings = {
        ...options.lighthouseConfig.settings,
        onlyAudits: [...Object.keys(metricsConfigurations)],
        output: ['json']
    };

    Object.values(defaultMetrics).forEach(metric => register.registerMetric(metric));

    http.createServer(async (request, response) => {
        if (request.url === url) {
            try {
                const lighthouseAudits = (await generateReport(options)).audits;

                const prometheusObservations = lighthouseAuditsToPrometheusObservations(lighthouseAudits);

                Object.entries(prometheusObservations).forEach(([key, value]) => {
                    defaultMetrics[key].observe(value);
                });
            } finally {
                response.end(await register.metrics());
            }
        }
    }).listen(port);
}

module.exports = runExporter;
