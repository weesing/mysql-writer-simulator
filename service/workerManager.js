let config = require('../config');
let _ = require('lodash');
let Worker = require('./worker');

let workerManager = {};

workerManager.start = function () {
    let sequelizeClient = require('../service/mySqlSequelizeClient');
    let modelsSettings = _.get(config, 'settings.models', {});
    let sequelizeModelsInfo = sequelizeClient.initModels(modelsSettings);

    _.each(sequelizeModelsInfo, function (sequelizeModelInfo) {
        let modelName = sequelizeModelInfo.modelName;
        let sequelizeModel = sequelizeModelInfo.modelResult;
        let modelInfo = _.get(config, 'settings.models.' + modelName);
        if (!_.isNil(modelInfo)) {
            let workerInstance = new Worker({
                frequency: modelInfo.createFrequency,
                sequelizeModel: sequelizeModel
            });
            workerInstance.loop();
        }
    })
};

module.exports = workerManager;