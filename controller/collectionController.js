const Collection = require('../model/collectionModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const ApiFeaturs = require('../utils/apiFeatures');

exports.getAllCollections = factory.getAll(Collection);

exports.getCollection = factory.getOne(Collection);

exports.createCollection = factory.createOne(Collection);

exports.updateCollection = factory.updateOne(Collection);

exports.deleteCollection = factory.deleteOne(Collection);
