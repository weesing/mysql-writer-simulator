'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const _ = require('lodash');
const childProcess = require('child_process');
const sprintf = require('sprintf-js').sprintf;
const util = require('util');

var NODE_ENV = process.env['NODE_ENV'];

var modelsDir = path.join(process.cwd(), 'models');

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

var jsFiles = listJsFiles(modelsDir);
_.each(jsFiles, function (jsFilePath) {
    if (jsFilePath == currentFilePath) {
        return;
    }

    let Model = require(jsFilePath);
    let model = Model(sequelize);
    // var model = sequelize['import'](jsFilePath);

    db[model.name] = model;
});

// Object.keys(db).forEach(function (modelName) {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

db.sequelize = sequelize;
// db.Sequelize = Sequelize;
db.sequelize.sync();

// Categorize database attributes according to recognized types
// db.attributesByType = filterAllAttributesByType();

function listJsFiles(directoryPath) {
    var directoryEntries = fs.readdirSync(directoryPath);

    var subdirectories = [];
    var jsFiles = [];

    _.each(directoryEntries, function (directoryEntry) {
        var fullDirectoryEntryPath = path.join(directoryPath, directoryEntry);
        if (fs.statSync(fullDirectoryEntryPath).isDirectory()) {
            subdirectories.push(fullDirectoryEntryPath);
        }
        else {
            if (/\.js$/.test(directoryEntry)) {
                jsFiles.push(fullDirectoryEntryPath);
            }
        }
    });


    _.each(subdirectories, function (subdirectory) {
        jsFiles = jsFiles.concat(listJsFiles(subdirectory))
    });

    return jsFiles;
}

/**
 * Comb through sequelize Models and build lookup Sets based on attribute type
 * @param dataTypes
 * @param tableName
 * @returns {*}
 */
// function filterAllAttributesByType() {
//
//     const ignoreList = [
//         'createdBy',
//         'createdAt',
//         'ose',
//         'akana',
//         'deletedBy',
//         'deletedAt',
//         'updatedBy',
//         'updatedAt',
//         'dtrImage',
//         'gitRepositoryUrlInternal',
//         'akanaAppId',
//         'akanaApiId',
//         'module',
//         'nectarPortalType',
//         'transactionId',
//         'trackingId',
//         'operation',
//         'id',
//         'serviceId',
//         'projectId',
//         'scanReport',
//         'scanReportId',
//         'objectIdentifier',
//         'originalEntry',
//         'updatedEntry',
//         'resourceUsages',
//         'objectType'
//     ];
//
//     var foundAttributes = {strings: new Map, jsons: new Map, others: new Map};
//
//     _.each(db.sequelize.models, function (model) {
//
//         _.each(model.attributes, function (attribute) {
//
//             if (_.includes(ignoreList, attribute.field))
//                 return;
//
//             var bin = undefined;
//             var subType = 'none';
//
//             switch (attribute.type.key) {
//                 case 'TEXT':
//                 case 'STRING':
//                 case 'CHAR':
//                     bin = foundAttributes.strings;
//
//                     if (_.get(attribute, "validate.isUrl"))
//                         subType = 'url';
//                     else if (_.get(attribute, "validate.isEmail"))
//                         subType = 'email';
//                     else if (_.get(attribute, "validate.isIP"))
//                         subType = 'ip';
//
//                     break;
//                 case 'JSON':
//                 case 'JSONB':
//                     bin = foundAttributes.jsons;
//                     break;
//                 default:
//                     bin = foundAttributes.others;
//             }
//             bin.set(attribute.field, subType);
//         });
//     });
//
//     return foundAttributes;
// }

module.exports = db;


