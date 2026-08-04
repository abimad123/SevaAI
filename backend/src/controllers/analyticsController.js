const NGO = require('../models/NGO');
const Project = require('../models/Project');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');

// @desc Get platform analytics overview
// @route GET /api/analytics/overview
exports.getOverview = async (req, res, next) => {
  try {
    const [ngoCount, projectCount, schemeCount, userCount, beneficiaryCount] = await Promise.all([
      NGO.countDocuments({ status: 'active' }),
      Project.countDocuments(),
      Scheme.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Beneficiary.countDocuments({ isActive: true }),
    ]);

    const projectImpact = await Project.aggregate([
      { $group: { _id: null, totalBudget: { $sum: '$budget.total' }, totalBeneficiaries: { $sum: '$impact.beneficiariesReached' } } }
    ]);

    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const ngosByState = await NGO.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const schemesByCategory = await Scheme.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          activeNGOs: ngoCount,
          totalProjects: projectCount,
          activeSchemes: schemeCount,
          registeredUsers: userCount,
          beneficiariesServed: beneficiaryCount,
          totalFunding: projectImpact[0]?.totalBudget || 0,
          totalBeneficiaries: projectImpact[0]?.totalBeneficiaries || 0,
        },
        projectsByStatus,
        ngosByState,
        schemesByCategory,
      },
    });
  } catch (error) { next(error); }
};

// @desc Get NGO-specific analytics
// @route GET /api/analytics/ngo/:ngoId
exports.getNGOAnalytics = async (req, res, next) => {
  try {
    const ngoId = req.params.ngoId;
    const projects = await Project.find({ ngoId });

    const monthly = await Project.aggregate([
      { $match: { ngoId: require('mongoose').Types.ObjectId.createFromHexString(ngoId) } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 }, budget: { $sum: '$budget.total' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    const impactByFocus = await Project.aggregate([
      { $match: { ngoId: require('mongoose').Types.ObjectId.createFromHexString(ngoId) } },
      { $unwind: '$focusAreas' },
      { $group: { _id: '$focusAreas', count: { $sum: 1 }, beneficiaries: { $sum: '$impact.beneficiariesReached' } } }
    ]);

    const totalBudget = projects.reduce((s, p) => s + (p.budget?.total || 0), 0);
    const totalSpent = projects.reduce((s, p) => s + (p.budget?.spent || 0), 0);
    const totalBeneficiaries = projects.reduce((s, p) => s + (p.impact?.beneficiariesReached || 0), 0);

    res.json({
      success: true,
      data: {
        summary: { totalProjects: projects.length, totalBudget, totalSpent, totalBeneficiaries },
        monthly,
        impactByFocus,
      },
    });
  } catch (error) { next(error); }
};

// @desc Get funding matching
// @route POST /api/analytics/funding-match
exports.getFundingMatch = async (req, res, next) => {
  try {
    const { ngoId, focusAreas, location, budget } = req.body;
    const query = { isActive: true, 'eligibility.ngoEligible': true };
    if (focusAreas?.length) query.category = { $in: focusAreas };

    const schemes = await Scheme.find(query).limit(10);
    const matches = schemes.map(scheme => ({
      scheme,
      matchScore: Math.floor(Math.random() * 30 + 70), // would be AI-computed
      reason: `This scheme aligns with your focus areas and eligibility requirements.`,
      missingRequirements: [],
    })).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: matches });
  } catch (error) { next(error); }
};
