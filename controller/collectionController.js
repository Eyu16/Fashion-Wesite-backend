const Collection = require('../model/collectionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeaturs = require('../utils/apiFeatures');

exports.getAllCollections = catchAsync(
  async (req, res, next) => {
    const features = new ApiFeaturs(
      Collection.find(),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const collections = await features.query;
    res.status(200).json({
      status: 'success',
      results: collections.length,
      data: {
        collections,
      },
    });
  },
);

exports.getCollection = catchAsync(
  async (req, res, next) => {
    const { collectionId } = req.params;
    const collection =
      await Collection.findById(collectionId);
    res.status(200).json({
      status: 'success',
      data: {
        collection,
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

exports.updateCollection = catchAsync(
  async (req, res, next) => {
    const { collectionId } = req.params;
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      req.body,
      { new: true, runValidators: true },
    );
    if (!collection)
      return next(
        new AppError(
          'No collection has been found with this id',
          404,
        ),
      );
    res.status(200).json({
      status: 'success',
      data: {
        collection,
      },
    });
  },
);

exports.deleteCollection = catchAsync(
  async (req, res, next) => {
    const { collectionId } = req.params;
    const collection =
      await Collection.findByIdAndDelete(collectionId);
    // res.status()
    if (!collection)
      return next(
        new AppError(
          'No collection has been found with that id',
          404,
        ),
      );
    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);
// exports.deleteCollection = c
