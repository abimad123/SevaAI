const Scheme = require('../models/Scheme');

// @desc Get all schemes (with filters)
// @route GET /api/schemes
exports.getSchemes = async (req, res, next) => {
  try {
    const { search, category, level, state, isActive = true, page = 1, limit = 12 } = req.query;
    const query = { isActive };
    if (category) query.category = category;
    if (level) query.level = level;
    if (state) query.$or = [{ state }, { state: null }, { level: 'central' }];
    if (search) query.$text = { $search: search };

    const total = await Scheme.countDocuments(query);
    const schemes = await Scheme.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: schemes, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// @desc Get single scheme
// @route GET /api/schemes/:id
exports.getScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

// @desc Create scheme (Admin / Gov Officer)
// @route POST /api/schemes
exports.createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

// @desc Update scheme
// @route PUT /api/schemes/:id
exports.updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

// @desc Delete scheme
// @route DELETE /api/schemes/:id
exports.deleteScheme = async (req, res, next) => {
  try {
    await Scheme.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Scheme deactivated.' });
  } catch (error) { next(error); }
};

// @desc Get scheme categories summary
// @route GET /api/schemes/categories
exports.getCategories = async (req, res, next) => {
  try {
    const stats = await Scheme.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
};
