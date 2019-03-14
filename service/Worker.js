const _ = require('lodash');
const Promise = require('bluebird');

var Worker = function (options) {
    let instance = this;
    instance.frequency = _.get(options, 'frequency');
    instance.sequelizeModel = _.get(options, 'sequelizeModel');
    instance.stopSignal = false;
};

Worker.prototype.createRow = function () {
    let instance = this;
    console.log(instance.sequelizeModel);
    return instance.sequelizeModel.createFunction(instance.sequelizeModel.model);
};

Worker.prototype.loop = function () {
    let instance = this;
    setTimeout ( function () {
        if (instance.stopSignal) {
            instance.stopSignal = false;
            return;
        }

        instance.createRow();
        instance.loop();

    }, instance.frequency * 1000);
};

Worker.prototype.stop = function () {
    let instance = this;
    instance.stopSignal = true;
};

module.exports = Worker;