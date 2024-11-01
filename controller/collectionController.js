const Collection = require('../model/collectionModel');
const catchAsync = require('../utils/catchAsync');

exports.getCollections = catchAsync(
  async (req, res, next) => {
    const collections = await Collection.find();
    res.status(200).json({
      status: 'success',
      results: collections.length,
      data: {
        collections,
      },
    });
  },
);

exports.createCollection = catchAsync(
  async (req, res, next) => {
    const collection = await Collection.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        collection,
      },
    });
  },
);
