const _ = require('lodash');
const Promise = require('bluebird');

let Worker = function (options) {
    let instance = this;
    instance.createFrequency = _.get(options, 'createFrequency');
    instance.readFrequency = _.get(options, 'readFrequency');
    instance.modelTemplate = _.get(options, 'modelTemplate');
    instance.stopCreateSignal = false;
    instance.stopReadSignal = false;
};

Worker.prototype.createRow = function () {
    let instance = this;
    return instance.modelTemplate.generateRandomRow();
};

Worker.prototype.createLoop = function () {
    let instance = this;
    if ( _.isNil(instance.createFrequency) || instance.createFrequency <= 0) {
        return;
    }
    setTimeout ( function () {
        if (instance.stopCreateSignal) {
            instance.stopCreateSignal = false;
            return;
        }

        instance.createRow();
        instance.createLoop();
    }, instance.createFrequency * 1000);
    return;
};

Worker.prototype.readRow = function () {
    let instance = this;
    return instance.modelTemplate.readRandomRow();
    return;
}

Worker.prototype.readLoop = function () {
    let instance = this;
    if ( _.isNil(instance.readFrequency) || instance.readFrequency <= 0) {
        return;
    }
    setTimeout ( function () {
        if (instance.stopReadSignal) {
            instance.stopReadSignal = false;
            return;
        }

        instance.readRow();
        instance.readLoop();
    }, instance.readFrequency * 1000);
    return;
}

Worker.prototype.start = function () {
    let instance = this;
    instance.createLoop();
}

Worker.prototype.stop = function () {
    let instance = this;
    instance.stopCreateSignal = true;
    instance.stopReadSignal = true;
};

module.exports = Worker;