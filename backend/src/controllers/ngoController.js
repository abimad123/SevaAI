const NGO = require('../models/NGO');
const User = require('../models/User');

// @desc Create NGO
// @route POST /api/ngo
exports.createNGO = async (req, res, next) => {
  try {
    const existing = await NGO.findOne({ adminId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You already have an NGO registered.' });

    const ngo = await NGO.create({ ...req.body, adminId: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { ngoId: ngo._id });

    res.status(201).json({ success: true, data: ngo });
  } catch (error) { next(error); }
};

// @desc Get all NGOs (with filters)
// @route GET /api/ngo
exports.getNGOs = async (req, res, next) => {
  try {
    const { search, category, state, status, page = 1, limit = 12, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = {};
    if (status) query.status = status;
    else query.status = 'active';
    if (state) query['location.state'] = state;
    if (category) query.focusAreas = { $in: [category] };
    if (search) query.$text = { $search: search };

    const total = await NGO.countDocuments(query);
    const ngos = await NGO.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('adminId', 'name email');

    res.json({ success: true, data: ngos, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// @desc Get single NGO
// @route GET /api/ngo/:id
exports.getNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id).populate('adminId', 'name email').populate('verifiedBy', 'name');
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    res.json({ success: true, data: ngo });
  } catch (error) { next(error); }
};

// @desc Update NGO
// @route PUT /api/ngo/:id
exports.updateNGO = async (req, res, next) => {
  try {
    let ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    if (ngo.adminId.toString() !== req.user._id.toString() && req.user.role !== 'system_admin')
      return res.status(403).json({ success: false, message: 'Not authorized to update this NGO.' });
    ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: ngo });
  } catch (error) { next(error); }
};

// @desc Verify NGO (Government / Admin)
// @route PUT /api/ngo/:id/verify
exports.verifyNGO = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' or 'rejected'
    const ngo = await NGO.findByIdAndUpdate(req.params.id,
      { status, verifiedBy: req.user._id, verifiedAt: new Date() },
      { new: true }
    );
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    res.json({ success: true, data: ngo, message: `NGO ${status === 'active' ? 'verified' : 'rejected'} successfully.` });
  } catch (error) { next(error); }
};

// @desc Get my NGO
// @route GET /api/ngo/my
exports.getMyNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ adminId: req.user._id });
    if (!ngo) return res.status(404).json({ success: false, message: 'No NGO found for your account.' });
    res.json({ success: true, data: ngo });
  } catch (error) { next(error); }
};

// @desc Get NGO stats
// @route GET /api/ngo/:id/stats
exports.getNGOStats = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const Document = require('../models/Document');
    const ngoId = req.params.id;
    const [projectStats, docCount] = await Promise.all([
      Project.aggregate([
        { $match: { ngoId: require('mongoose').Types.ObjectId.createFromHexString(ngoId) } },
        { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget.total' }, totalBeneficiaries: { $sum: '$impact.beneficiariesReached' } } }
      ]),
      Document.countDocuments({ ngoId }),
    ]);
    res.json({ success: true, data: { projectStats, docCount } });
  } catch (error) { next(error); }
};
