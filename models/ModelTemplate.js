const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const uuid = require('uuid');
const moment = require('moment');
const util = require("util");

let ModelTemplate = function (sequelize, schemaName) {
    let instance = this;
    instance.sequelize = sequelize;
    instance.schemaName = schemaName;
    instance.createdNbRows = 0;
    instance.model = sequelize.define(schemaName, {
        'id': {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        'uuid': {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        };
    });
};

ModelTemplate.prototype.generateRandomRow = function () {
    let newUUID = uuid.v4();
    instance.createdNbRows += 1;
    return instance.model.create({
        id: newUUID,
        contentTime: moment().format('llll'),
        contentString: "String " + Math.random(),
        contentNumber: Math.random(),
        contentJSON: {
            "text": "String " + Math.random(),
            "time": moment().format('llll')
        }
    })
    .then(function (newEntry) {
        console.log("Row created " + util.inspect(newEntry));
    })
};

ModelTemplate.prototype.readRandomRow = function (model) {
    let findId = Math.floor(Math.random() * instance.createdNbRows);
    console.log('Attempting to read id ' + findId);
    return instance.model.findAll({
        where: {
            id: findId
        }
    });
};

module.exports = ModelTemplate;