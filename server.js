const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (error) => {
  console.log('UncaughtException shutting down...');
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
const DBLocal = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then(() => console.log(`DB connection is successful`))
  .catch((error) => {
    console.error(
      `DB connection is not successful ${error}`,
    );
  });

const server = app.listen(
  process.env.PORT,
  '0.0.0.0',
  () => {
    console.log(
      `Server has started successfully on port ${process.env.PORT}`,
    );
  },
);

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection shutting down...');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
