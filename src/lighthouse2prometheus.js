const {Histogram} = require("prom-client");

const metricsConfigurations = {
    /*'cumulative-layout-shift': {
        name: 'cumulative_layout_shift',
        help: 'Cumulative Layout Shift'
    },
    'first-contentful-paint-3g': {
        name: 'first_contentful_paint_3g',
        help: 'First Contentful Paint 3g',
    },*/
    'first-contentful-paint': {
        name: 'first_contentful_paint',
        help: 'First Contentful Paint',
        buckets: [1800, 3000],
        converter: (auditRecord) => auditRecord.numericValue
    },
    'first-meaningful-paint': {
        name: 'first_meaningful_paint',
        help: 'First Meaningful Paint',
        buckets: [2000, 4000],
        converter: (auditRecord) => auditRecord.numericValue
    },
    'interactive': {
        name: 'interactive',
        help: 'Time To Interactive',
        buckets: [3800, 7300],
        converter: (auditRecord) => auditRecord.numericValue
    },
    'largest-contentful-paint': {
        name: 'largest_contentful_paint',
        help: 'Largest Contentful Paint',
        buckets: [2500, 4000],
        converter: (auditRecord) => auditRecord.numericValue
    },
    /*'max-potential-fid': {
        name: 'max_potential_fid',
        help: 'Max Potential Fid',
    },
    'speed-index': {
        name: 'speed_index',
        help: 'Speed Index',
    },
    'total-blocking-time': {
        name: 'total_blocking_time',
        help: 'Total Blocking Time',
    }*/
};

const defaultMetrics = Object.keys(metricsConfigurations).reduce((metrics, metricConfigurationKey) => {
    metrics[metricConfigurationKey] = new Histogram(metricsConfigurations[metricConfigurationKey]);
    return metrics;
}, {});

const lighthouseAuditsToPrometheusObservations = (audits) => {
    return Object.fromEntries(
        Object.entries(audits).map(([key, value]) => {
            return [key, metricsConfigurations[key].converter(value)]
        })
    );
};

module.exports = {
    metricsConfigurations,
    lighthouseAuditsToPrometheusObservations,
    defaultMetrics,
};
