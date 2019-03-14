const _ = require('lodash');
const Promise = require('bluebird');
const sprintf = require('sprintf-js').sprintf;

/**
 * Utility to search database using Sequelize and produce paginated results.
 * @type Object
 * @exports util/SequelizeUtil
 */
var sequelizeUtil = {};

/**
 *
 * @param model
 * @param {Object} options Options to pass to Sequelize findAndCountAll() function.
 * @param {number} [options.pageNumber = 0] - Page Number
 * @param {number} [options.size = 10] - Size of Page
 * @returns {PaginationResult} Returns paginated results
 */
sequelizeUtil.findAndPage = function (model, options) {
    if (!options) {
        options = {};
    }

    var pageNumber = _.parseInt(options.pageNumber || 0);

    // Clamp size to a reasonable value
    var size = _.parseInt(options.size || 10);

    var queryOptions = _.assign({}, _.omit(options, ['pageNumber', 'size']), {limit: size, offset: pageNumber * size});

    console.log(queryOptions);

    return model.findAndCountAll(queryOptions)
        .then(function (result) {
            var totalElements = result.count;
            var totalPages = Math.ceil(totalElements / size);
            return Promise.map(result.rows, function (entity) {
                if (_.isFunction(entity.get)) {
                    entity = entity.get({plain: true});
                }

                if (_.isFunction(options.mappingCallback)) {
                    entity = options.mappingCallback(entity);
                }
                return entity;
            }).then(function (rows) {
                /**
                 * @typedef {Object} PaginationResult
                 * @property {number} totalPages - Total number of Pages
                 * @property {number} totalElements - Total number of Elements matching search criteria
                 * @property {number} size - Size of page
                 * @property {number} content - Entries for this page
                 * @property {number} number - Page Number
                 * @property {boolean} first - Is this page the first page
                 * @property {Object} sort - Sort criteria
                 * @property {boolean} last - Is this page the last page
                 * @property {number} numberOfElements - Number of Elements in this page
                 */
                rows = _.reject(rows, _.isNil);
                return {
                    'totalPages': totalPages,
                    'totalElements': totalElements,
                    'size': size,
                    'content': rows,
                    'number': pageNumber,
                    'first': pageNumber == 0,
                    'sort': options.sort || null,
                    'last': pageNumber == totalPages,
                    'numberOfElements': rows.length
                };
            });
        });
};

sequelizeUtil.findAll = function (model, options) {
    if (!options) {
        options = {};
    }

    return model.findAll(options)
        .then(function (result) {
            return result;
        });
};

/**
 * Constructs search clauses using case-insensitive, wild-card pre+postfixed strings
 * @param options
 * @returns {Array}
 */
sequelizeUtil.getSearchClauses = function (options) {
    var search = options.search;

    var searchableAttributes = options.searchableAttributes;
    var orClauses = [];

    if (!_.isNil(search) && search !== '') {
        if (!/%/.test(search)) {
            search = '%' + search + '%';
        }
        _.each(searchableAttributes, function (searchableAttribute) {
            var clause = {};
            _.set(clause, searchableAttribute + '.$iLike', search);
            orClauses.push(clause);
        });

    } else {
        _.each(searchableAttributes, function (searchableAttribute) {
            var searchableAttributeKey = searchableAttribute + 'Search';
            var attributeSearchTerm = options[searchableAttributeKey];
            if (!_.isNil(attributeSearchTerm) && attributeSearchTerm !== '') {
                if (!/%/.test(attributeSearchTerm)) {
                    attributeSearchTerm = '%' + attributeSearchTerm + '%';
                }

                var clause = {};
                _.set(clause, searchableAttribute + '.$iLike', attributeSearchTerm);
                orClauses.push(clause);
            }
        });
    }

    return orClauses;
};

/**
 * Constructs search clauses based on exact matches
 * @param options
 * @returns {Array}
 */
sequelizeUtil.getExactSearchClauses = function (options) {

    var searchableAttributes = options.searchableAttributes;
    var outputClauses = [];
    var search = options.search;

    // Use the same search term for all searchableAttributes
    if (!_.isNil(search) && search !== '') {
        _.each(searchableAttributes, function (searchableAttribute) {

            var clause = {};
            _.set(clause, searchableAttribute, search);
            outputClauses.push(clause);
        });

    } else {
        // Use separate search terms for all searchableAttributes
        _.each(searchableAttributes, function (searchableAttribute) {
            var searchableAttributeKey = searchableAttribute + 'Search';
            var attributeSearchTerm = options[searchableAttributeKey];
            if (!_.isNil(attributeSearchTerm)) {

                var clause = {};
                _.set(clause, searchableAttribute, attributeSearchTerm);
                outputClauses.push(clause);
            }
        });
    }

    return outputClauses;
};

module.exports = sequelizeUtil;