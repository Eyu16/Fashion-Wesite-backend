const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Product must have a name'],
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Product must have a description'],
    },

    summary: {
      type: String,
      required: [true, 'Product must have a summary'],
    },

    price: {
      type: Number,
      required: [true, 'Product must have a price'],
    },
    category: String,
    collectionName: String,
    image: {
      type: String,
      required: [true, 'Product must have an image'],
    },
    detailImage: {
      type: String,
      required: [true, 'Product must have an detail image'],
    },
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
    gender: {
      type: String,
      required: [true, 'Product must belong to a gender'],
      enum: ['Men', 'Women', 'Unisex'],
    },
    overview: {
      type: Boolean,
      default: false,
    },
    productDetails: {
      type: Object,
      required: [true, 'Product Must have product details'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    hasBackendImage: {
      type: Boolean,
      default: false,
    },
    resourceUrl: {
      type: String,
      default: '',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// productSchema.virtual('resourceUrl').get(() => {
//   return '{{URL}}';
// });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
