'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const _ = require('lodash');
const util = require('util');

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
console.log('Initializing Sequelize...');
db.sequelize = sequelize;
console.log('Sequelize initialized.');

db.initModels = function (modelsSettings) {
    let ModelTemplate = require('../../models/ModelTemplate');
    let sequelizeModelsInfo = [];
    let modelNames = _.keys(modelsSettings);
    console.log('Attempting to initialize models');
    _.each(modelNames, function (modelName) {

        let modelTemplate = new ModelTemplate(sequelize, modelName);
        console.log('******** Model ' + modelName + ' initialized.');
        sequelizeModelsInfo.push({
            modelName: modelName,
            modelTemplate: modelTemplate
        });

        db[modelName] = modelTemplate.model;
    });

    console.log('Performing syncing with MySQL database');
    return new Promise(function (resolve, reject) {
        db.sequelize.sync()
            .then(function (syncResult) {
                console.log('################ Syncing completed. #################');
                return resolve(sequelizeModelsInfo);
            })
            .catch(function (err) {
                console.log('Error occured while syncing with MySQL database!');
                return reject(err);
            });
    
    });
};

module.exports = db;


