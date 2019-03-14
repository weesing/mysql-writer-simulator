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

db.initModels = function (modelsSettings) {
    let modelTemplate = require('../../models/ModelTemplate');
    let sequelizeModels = [];
    let modelNames = _.keys(modelsSettings);
    _.each(modelNames, function (modelName) {

        let modelResult = modelTemplate(sequelize, modelName);
        sequelizeModels.push({
            modelName: modelName,
            modelResult: modelResult
        });

        db[modelName] = modelResult.sequelizeModel;
    });

    db.sequelize = sequelize;
    db.sequelize.sync();

    return sequelizeModels;
};

module.exports = db;


