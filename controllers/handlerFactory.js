const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const APIFeatures = require('../utilities/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Couldnot find the document with that ID', 404));
    }

    res.status(204).json({});
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Couldnot find the document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      message: 'success',
      data: { tour: newDoc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Couldnot find the document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldsLimit()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: { doc },
    });
  });
