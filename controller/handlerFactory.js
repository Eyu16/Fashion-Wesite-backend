const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeaturs = require('../utils/apiFeatures');

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.originalUrl);
    const features = new ApiFeaturs(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const documents = await features.query;
    const { protocol } = req;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/images`;
    documents.forEach((document) => {
      if (document?.hasBackendImage)
        document.resourceUrl = baseUrl;
    });
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents,
      },
    });
  });
};

exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { protocol } = req;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/images`;
    const document =
      (await Model.findOne({ slug: id })) ||
      (await Model.findById(id));

    if (document?.hasBackendImage)
      document.resourceUrl = baseUrl;
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
};
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!document)
      return next(
        new AppError(
          'No collection has been found with this id',
          404,
        ),
      );
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document)
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
  });
};
