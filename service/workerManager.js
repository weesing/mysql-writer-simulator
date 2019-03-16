let config = require('../config');
let _ = require('lodash');
let Worker = require('./Worker');

let workerManager = {};

workerManager.start = function () {
    let modelsSettings = _.get(config, 'settings.models', {});

    let sequelizeClient = require('../service/mySqlSequelizeClient');
    return sequelizeClient.initModels(modelsSettings)
        .then(function (sequelizeModelsInfo) {

            console.log('All Sequelize Models initialized');
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

        })
};

module.exports = workerManager;