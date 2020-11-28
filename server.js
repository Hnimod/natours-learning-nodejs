const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('-----Uncaught Exception. App closing...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbString = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('-----Database connected!!!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`-----App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('-----Unhandled Rejection. App closing...');
  server.close(() => {
    process.exit(1);
  });
});
