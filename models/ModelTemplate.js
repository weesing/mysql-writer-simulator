const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const uuid = require('uuid');
const moment = require('moment');

let __generateRandomRow = function (model) {
    return model.create({
        id: uuid.v4(),
        contentTime: moment().format('llll'),
        contentString: "String " + Math.random(),
        contentNumber: Math.random(),
        contentJSON: {
            "text": "String " + Math.random(),
            "time": moment().format('llll')
        }
    });
};

let ModelTemplate = function (sequelize, schemaName) {
    return {
        createFunction: __generateRandomRow,
        model: sequelize.define(schemaName, {
            'id': {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            'contentTime': {
                type: DataTypes.DATE,
                allowNull: true
            },
            'contentString': {
                type: DataTypes.STRING,
                defaultValue: "My String Value"
            },
            'contentNumber': {
                type: DataTypes.FLOAT,
                defaultValue: 0.0
            },
            'contentJSON': {
                type: DataTypes.JSON,
                allowNull: true
            }
        })
    }
};

module.exports = ModelTemplate;