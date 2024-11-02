const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../model/productModel');
// const app = require('../app');

dotenv.config({ path: './config.env' });

const DBLocal = process.env.DATABASE_LOCAL;
mongoose
  .connect(DBLocal)
  .then(() => console.log(`DB connection is successful`))
  .catch((error) => {
    console.error(
      `DB connection is not successful ${error}`,
    );
  });

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Product.create(products);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
// deleteData();
importData();
