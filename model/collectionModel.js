const mongoose = require('mongoose');

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
    season: Date,
    designerName: {
      type: [String],
      required: [
        true,
        'Collection Must have designer name',
      ],
    },
    categories: [String],
    releaseDate: Date,
    tags: [String],
    material: [String],
    rating: Number,
    ratingsAverage: Number,
    ratingCount: Number,
    images: {
      type: [String],
      required: [true, 'Collection Must have Pictures'],
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 15;
        },
        message:
          'A collection have minimum of 5 and maximum of 15 images',
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
          'A collection have minimum of 5 and maximum of 15 images',
      },
    },
  },
  {},
);

const Collection = mongoose.model(
  'Collection',
  collectionSchema,
);

module.exports = Collection;
