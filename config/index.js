const util = require('util');

let ConfigBuilder = require('node-config-builder');
const configOptions = {
    configBase: 'config/config.metadata.js',
    configOverlay: 'config/' + process.env.NODE_CONFIG + '.js'
};

let config = ConfigBuilder(configOptions);

console.log('========= Configuration read ==========');
console.log(util.inspect(config));

module.exports = config;