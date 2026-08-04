const Project = require('../models/Project');
const NGO = require('../models/NGO');

// @desc Create project
// @route POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ adminId: req.user._id });
    if (!ngo && req.user.role !== 'system_admin') return res.status(403).json({ success: false, message: 'You must have an NGO to create projects.' });
    const project = await Project.create({ ...req.body, ngoId: req.body.ngoId || ngo?._id });
    res.status(201).json({ success: true, data: project });
  } catch (error) { next(error); }
};

// @desc Get all projects
// @route GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { ngoId, status, category, state, page = 1, limit = 12 } = req.query;
    const query = {};
    if (ngoId) query.ngoId = ngoId;
    if (status) query.status = status;
    if (category) query.category = category;
    if (state) query['location.state'] = state;
    if (!['system_admin', 'government_officer'].includes(req.user.role)) query.isPublic = true;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('ngoId', 'name location impactScore')
      .populate('schemeId', 'name department');

    res.json({ success: true, data: projects, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// @desc Get single project
// @route GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ngoId', 'name location email phone')
      .populate('schemeId', 'name department benefits');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

// @desc Update project
// @route PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

// @desc Approve/Reject project
// @route PUT /api/projects/:id/status
exports.updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, {
      status,
      ...(status === 'approved' ? { approvedBy: req.user._id, approvedAt: new Date() } : {}),
    }, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

// @desc Add monitoring report
// @route POST /api/projects/:id/reports
exports.addMonitoringReport = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    project.monitoringReports.push({ ...req.body, submittedBy: req.user._id, reportDate: new Date() });
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

// @desc Get projects by NGO
// @route GET /api/projects/ngo/:ngoId
exports.getProjectsByNGO = async (req, res, next) => {
  try {
    const projects = await Project.find({ ngoId: req.params.ngoId })
      .sort({ createdAt: -1 })
      .populate('schemeId', 'name department');
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
};
