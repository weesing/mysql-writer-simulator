const util = require('util');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;

let configNames = process.env.NODE_CONFIG || 'default';
configNames = configNames.split(',');
_.each(configNames, function(configName, index) {
    configNames[index] = sprintf('config/config.%s.js', configName);
});

let ConfigBuilder = require('node-config-builder');
const configOptions = {
    configBase: 'config/config.metadata.js',
    configOverlay: configNames
};

let config = ConfigBuilder(configOptions);

console.log('========= Configuration read ==========');
console.log(util.inspect(config));

module.exports = config;