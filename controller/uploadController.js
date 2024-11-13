const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'The uploaded file is not an image!',
        400,
      ),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const parseProductData = (req) => {
  req.body.price = req.body.price
    ? parseFloat(req.body.price)
    : null;
  req.body.rating = req.body.rating
    ? parseFloat(req.body.rating)
    : null;
  req.body.ratingsAverage = req.body.ratingsAverage
    ? parseFloat(req.body.ratingsAverage)
    : null;
  req.body.ratingCount = req.body.ratingCount
    ? parseInt(req.body.ratingCount, 10)
    : null;
  req.body.overview = req.body.overview === 'true'; // Will be false if undefined
  req.body.productDetails = req.body.productDetails
    ? JSON.parse(req.body.productDetails)
    : {};
};

const parseCollectionData = (req) => {
  req.body.rating = req.body.rating
    ? parseFloat(req.body.rating)
    : null;
  req.body.ratingsAverage = req.body.ratingsAverage
    ? parseFloat(req.body.ratingsAverage)
    : null;
  req.body.ratingCount = req.body.ratingCount
    ? parseInt(req.body.ratingCount, 10)
    : null;
  req.body.releaseDate = req.body.releaseDate
    ? new Date(req.body.releaseDate)
    : null;

  // Parse boolean values, checking if they are set to "true" or "false" strings
  req.body.overview = req.body.overview === 'true';

  // Parse array fields
  req.body.designerName = req.body.designerName
    ? JSON.parse(req.body.designerName)
    : [];
  req.body.categories = req.body.categories
    ? JSON.parse(req.body.categories)
    : [];
  req.body.tags = req.body.tags
    ? JSON.parse(req.body.tags)
    : [];
  req.body.materials = req.body.materials
    ? JSON.parse(req.body.materials)
    : [];
};

exports.uploadProductPhoto = upload.fields([
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'detailImage',
    maxCount: 1,
  },
]);

exports.resizeProductImage = catchAsync(
  async (req, res, next) => {
    console.log(req.body);
    if (!req.files.image || !req.files.detailImage)
      return next();
    parseProductData(req);
    const image = `image-${Date.now()}.jpeg`;
    const detailImage = `detailImage-${Date.now()}.jpeg`;

    await sharp(req.files.image[0].buffer)
      .resize(300, 450)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/${image}`);

    await sharp(req.files.detailImage[0].buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/${detailImage}`);

    req.body.image = image;
    req.body.detailImage = detailImage;
    req.body.hasBackendImage = true;
    next();
  },
);

// const multerCollectionStorage = multer.memoryStorage({});

// const multerCollectionFiler = (req, file, cb) => {
//   if(file.)
// };
// const uploadCollections = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

exports.uploadCollectionPhotos = upload.fields([
  {
    name: 'images',
    maxCount: 15,
  },
  {
    name: 'filmImages',
    maxCount: 15,
  },
]);

exports.resizeCollectionPhotos = catchAsync(
  async (req, res, next) => {
    req.body.images = [];
    req.body.filmImages = [];

    if (!req.files.images || !req.files.filmImages)
      return next();
    parseCollectionData(req);

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `images-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(900, 700)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/${filename}`);
        req.body.images.push(filename);
      }),
    );

    await Promise.all(
      req.files.filmImages.map(async (file, i) => {
        const filename = `filmImages-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(500, 333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/${filename}`);
        req.body.filmImages.push(filename);
      }),
    );

    req.body.hasBackendImage = true;
    console.log(req.body);

    next();
  },
);
