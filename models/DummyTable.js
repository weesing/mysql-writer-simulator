const Sequelize = require('sequelize');
const uuidv4 = require('uuid').v4;

let DummyTable = function (sequelize) {
    return sequelize.define('DummyTable', {
        'id': {
            type: Sequelize.UUIDV4,
            defaultValue: uuidv4(),
            primaryKey: true
        },
        'contentString': {
            type: Sequelize.STRING,
            defaultValue: "My String Value"
        },
        'contentNumber': {
            type: Sequelize.NUMBER,
            defaultValue: Math.random()
        },
        'contentJSONB': {
            type: Sequelize.JSONB,
            allowNull: true
        }
    });
};


module.exports = DummyTable;