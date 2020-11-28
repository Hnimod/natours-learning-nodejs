const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const dbString = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('-----Database connected!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async (collectionName, data) => {
  try {
    await collectionName.create(data, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async (collectionName) => {
  try {
    await collectionName.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT
const importTours = async () => {
  await importData(Tour, tours);
};

const importReviews = async () => {
  await importData(Review, reviews);
};

const importUsers = async () => {
  await importData(User, users);
};

// DELETE
const deleteTours = async () => {
  await deleteData(Tour);
};

const deleteReviews = async () => {
  await deleteData(Review);
};

const deleteRUsers = async () => {
  await deleteData(User);
};

if (process.argv[2] === '--import') {
  if (process.argv[3] === '--tours') return importTours();
  if (process.argv[3] === '--reviews') return importReviews();
  if (process.argv[3] === '--users') return importUsers();
} else if (process.argv[2] === '--delete') {
  if (process.argv[3] === '--tours') return deleteTours();
  if (process.argv[3] === '--reviews') return deleteReviews();
  if (process.argv[3] === '--users') return deleteRUsers();
}
