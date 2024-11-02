const mongoose = require('mongoose');
const slugify = require('slugify');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Collection must have a name'],
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [
        true,
        'Collection must have a description',
      ],
    },
    season: {
      type: Date,
      default: Date.now(),
    },
    designerName: {
      type: [String],
      validate: {
        validator: function (designers) {
          return designers.length > 0;
        },
        message: 'Collection must have at list a desiger!',
      },
    },
    categories: [String],
    releaseDate: {
      type: Date,
      default: Date.now(),
    },
    tags: [String],
    material: [String],
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingCount: {
      type: Number,
      default: 1,
    },
    images: {
      type: [String],
      required: [true, 'Collection Must have Pictures'],
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 15;
        },
        message:
          'A collection have minimum of 4 and maximum of 15 images',
      },
    },
    filmImages: {
      type: [String],
      required: [true, 'Collection Must have Pictures'],
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 15;
        },
        message:
          'A collection have minimum of 4 and maximum of 15 images',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {},
);

collectionSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Collection = mongoose.model(
  'Collection',
  collectionSchema,
);

module.exports = Collection;
