'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const _ = require('lodash');

const config = require('../../config');
const db = { databaseDaos: { } };

var mySqlConfig = config.mysql;
_.set(mySqlConfig, 'dialect', 'mysql');
const currentFilePath = path.join(__dirname, __filename);

var logDBMessages = false;
mySqlConfig.logging = function (message, ms) {
    console.log(message);

    if (mySqlConfig.logMessages) {
        if (_.size(_.split(message, 'START TRANSACTION;')) > 1) {
            logDBMessages = true;
        }

        if (logDBMessages) {
            console.log('***** [DB Transaction] ' + message + ': Took ' + ms + 'ms');
        }

        if (_.size(_.split(message, 'COMMIT;')) > 1) {
            logDBMessages = false;
        }
    }
};
mySqlConfig.benchmark = true;

var sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, mySqlConfig);
db.sequelize = sequelize;

db.initModels = function (modelsSettings) {
    let ModelTemplate = require('../../models/ModelTemplate');
    let sequelizeModelsInfo = [];
    let modelNames = _.keys(modelsSettings);
    _.each(modelNames, function (modelName) {

        let modelTemplate = new ModelTemplate(sequelize, modelName);
        sequelizeModelsInfo.push({
            modelName: modelName,
            modelTemplate: modelTemplate
        });

        db[modelName] = modelTemplate.model;
    });

    db.sequelize.sync();

    return sequelizeModelsInfo;
};

module.exports = db;


