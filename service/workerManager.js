let config = require('../config');
let _ = require('lodash');
let Worker = require('./Worker');

let workerManager = {};

workerManager.start = function () {
    let modelsSettings = _.get(config, 'settings.models', {});

    let sequelizeClient = require('../service/mySqlSequelizeClient');
    let sequelizeModelsInfo = sequelizeClient.initModels(modelsSettings);

    _.each(sequelizeModelsInfo, function (sequelizeModelInfo) {
        let modelName = sequelizeModelInfo.modelName;
        let modelTemplate = sequelizeModelInfo.modelTemplate;
        let modelSettings = _.get(config, 'settings.models.' + modelName);
        if (!_.isNil(modelSettings)) {
            let workerInstance = new Worker({
                createFrequency: modelSettings.createFrequency,
                readFrequency: modelSettings.readFrequency,
                modelTemplate: modelTemplate
            });
            workerInstance.start();
        }
    });
};

module.exports = workerManager;