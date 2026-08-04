require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sevaai');
  console.log('Connected to MongoDB');
};

const User = require('../models/User');
const NGO = require('../models/NGO');
const Scheme = require('../models/Scheme');
const Project = require('../models/Project');
const Beneficiary = require('../models/Beneficiary');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([User.deleteMany(), NGO.deleteMany(), Scheme.deleteMany(), Project.deleteMany(), Beneficiary.deleteMany()]);
  console.log('Cleared existing data');

  // Create Users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@sevaai.in', password: 'Admin@123', role: 'system_admin', isActive: true, isVerified: true },
    { name: 'Priya Sharma', email: 'ngo@sevaai.in', password: 'NGO@123', role: 'ngo_admin', isActive: true, isVerified: true, location: { state: 'Maharashtra', district: 'Pune', city: 'Pune' } },
    { name: 'Rajesh Kumar', email: 'govt@sevaai.in', password: 'Govt@123', role: 'government_officer', department: 'Ministry of Social Justice', isActive: true, isVerified: true, location: { state: 'Delhi' } },
    { name: 'Anita Singh', email: 'volunteer@sevaai.in', password: 'Vol@123', role: 'volunteer', isActive: true, location: { state: 'Rajasthan', city: 'Jaipur' } },
    { name: 'Ram Prasad', email: 'citizen@sevaai.in', password: 'Cit@123', role: 'citizen', isActive: true, language: 'hi', location: { state: 'Uttar Pradesh', district: 'Varanasi' } },
  ]);
  console.log('Created users:', users.length);

  // Create NGO
  const ngo = await NGO.create({
    name: 'Shiksha Pragati Foundation',
    registrationNumber: 'MH/2019/0001234',
    registrationType: 'trust',
    pan: 'AAPTS1234B',
    establishedYear: 2019,
    description: 'Shiksha Pragati Foundation works to improve quality education access for underprivileged children in rural Maharashtra and Rajasthan. We run 15+ learning centers and have impacted 5000+ children.',
    mission: 'Quality education for every child regardless of socioeconomic background.',
    vision: 'An India where every child has access to quality education and opportunities.',
    focusAreas: ['education', 'skill_development', 'children', 'rural_development'],
    location: { address: '42, Koregaon Park', city: 'Pune', district: 'Pune', state: 'Maharashtra', pincode: '411001' },
    operationalStates: ['Maharashtra', 'Rajasthan', 'Gujarat'],
    contactPerson: { name: 'Priya Sharma', designation: 'Executive Director', email: 'ngo@sevaai.in', phone: '9876543210' },
    email: 'contact@shikshapraga.org',
    phone: '9876543210',
    website: 'https://shikshapraga.org',
    teamSize: 45,
    volunteerCount: 120,
    beneficiaryCount: 5000,
    annualBudget: 5000000,
    fundingRequirement: 2000000,
    status: 'active',
    adminId: users[1]._id,
    verifiedBy: users[0]._id,
    verifiedAt: new Date(),
    impactScore: 82,
    tags: ['education', 'rural', 'children', 'maharashtra'],
    previousProjects: [
      { name: 'Digital Classrooms 2022', description: 'Setup digital classrooms in 10 rural schools', year: 2022, impact: '2000 students benefited', fundingAmount: 1500000 },
      { name: 'Teacher Training Program', description: 'Trained 200 government school teachers in modern pedagogy', year: 2023, impact: '200 teachers, 8000 students', fundingAmount: 800000 },
    ],
  });

  await User.findByIdAndUpdate(users[1]._id, { ngoId: ngo._id });
  console.log('Created NGO:', ngo.name);

  // Create Schemes
  const schemes = await Scheme.create([
    {
      name: 'PM Poshan Shakti Nirman (Mid-Day Meal Scheme)',
      schemeCode: 'GOI-EDU-001',
      department: 'Ministry of Education',
      ministry: 'Ministry of Education',
      level: 'central',
      description: 'The PM Poshan Shakti Nirman scheme aims to improve nutritional status of school-age children and increase enrollment, retention and attendance in government and government-aided schools across India. NGOs can partner to manage meal distribution.',
      shortDescription: 'Free nutritious meals for government school children to improve enrollment and health.',
      category: 'education',
      focusAreas: ['education', 'nutrition', 'children'],
      eligibility: { description: 'Government/aided schools, NGOs partnering with schools', targetGroup: ['children', 'schools'], ngoEligible: true },
      benefits: { description: 'Government funding for meals, kitchen infrastructure grants', financialAmount: 100000, financialType: 'grant', nonFinancialBenefits: ['Kitchen setup', 'Training support'] },
      applicationProcess: { description: 'Apply through state education department', steps: ['Register on NIC portal', 'Submit NGO profile', 'School partnership letter', 'Approval from district collector'] },
      requiredDocuments: ['NGO registration certificate', 'FCRA certificate if applicable', 'School partnership agreement', 'Financial statements'],
      deadline: { isOngoing: true },
      fundingAmount: 100000,
      tags: ['midday meal', 'nutrition', 'education', 'school'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'Samagra Shiksha Abhiyan',
      schemeCode: 'GOI-EDU-002',
      department: 'Department of School Education and Literacy',
      ministry: 'Ministry of Education',
      level: 'central',
      description: 'Samagra Shiksha is an integrated scheme for school education extending from pre-school to class XII. The scheme covers the entire gamut of school education and brings convergence of erstwhile Sarva Shiksha Abhiyan (SSA), Rashtriya Madhyamik Shiksha Abhiyan (RMSA) and Teacher Education (TE).',
      shortDescription: 'Integrated scheme for school education from pre-school to class XII.',
      category: 'education',
      focusAreas: ['education', 'skill_development', 'girls_education', 'rural_development'],
      eligibility: { description: 'NGOs working in education sector, CSO partners', targetGroup: ['children', 'schools', 'teachers'], ngoEligible: true },
      benefits: { description: 'Grants for educational infrastructure, digital classrooms, teacher training', financialAmount: 500000, financialType: 'grant' },
      requiredDocuments: ['NGO registration', 'Impact reports', 'Bank statements', 'MoU with government'],
      deadline: { isOngoing: true },
      fundingAmount: 500000,
      tags: ['school education', 'digital', 'teacher training'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'MGNREGS (Mahatma Gandhi National Rural Employment Guarantee Scheme)',
      schemeCode: 'GOI-RD-001',
      department: 'Ministry of Rural Development',
      level: 'central',
      description: 'MGNREGS provides at least 100 days of guaranteed wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work. NGOs can assist in awareness creation and wage employment facilitation.',
      shortDescription: '100 days of guaranteed employment for rural households.',
      category: 'rural_development',
      focusAreas: ['rural_development', 'livelihood', 'poverty_alleviation'],
      eligibility: { description: 'Rural households with adult members', targetGroup: ['rural_poor', 'labourers'], incomeLimit: 50000, ngoEligible: false },
      benefits: { description: 'Minimum wage employment for 100 days/year', financialAmount: 267, financialType: 'other', nonFinancialBenefits: ['Unemployment allowance', 'Asset creation'] },
      requiredDocuments: ['Job card', 'Aadhaar card', 'Bank account'],
      deadline: { isOngoing: true },
      fundingAmount: 0,
      tags: ['employment', 'rural', 'mgnrega', 'wages'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'PM Poshan (Anganwadi) - Women and Child Development',
      schemeCode: 'GOI-WCD-001',
      department: 'Ministry of Women and Child Development',
      level: 'central',
      description: 'The POSHAN Abhiyaan (National Nutrition Mission) aims to reduce stunting, under-nutrition, anaemia and low birth weight babies in children, adolescent girls, pregnant women and lactating mothers. NGOs play a critical role in community mobilization.',
      shortDescription: 'National Nutrition Mission targeting women, children, and adolescent girls.',
      category: 'women_empowerment',
      focusAreas: ['women_empowerment', 'children', 'health', 'nutrition'],
      eligibility: { description: 'Women, children under 6, pregnant & lactating mothers', targetGroup: ['women', 'children', 'mothers'], ngoEligible: true },
      benefits: { description: 'Supplementary nutrition, health checkups, counselling', financialAmount: 50000, financialType: 'grant' },
      requiredDocuments: ['Aadhaar', 'Pregnancy registration card', 'NGO registration for partners'],
      deadline: { isOngoing: true },
      fundingAmount: 50000,
      tags: ['nutrition', 'women', 'child', 'health', 'anganwadi'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'PM Awas Yojana - Gramin (Rural Housing)',
      schemeCode: 'GOI-RD-002',
      department: 'Ministry of Rural Development',
      level: 'central',
      description: 'PM Awas Yojana - Gramin aims to provide pucca houses with basic amenities to all rural households living in kutcha/dilapidated houses. NGOs can assist beneficiaries in applying and construction monitoring.',
      shortDescription: 'Housing for all rural poor - pucca house construction assistance.',
      category: 'housing',
      focusAreas: ['housing', 'rural_development', 'poverty_alleviation'],
      eligibility: { description: 'BPL families in rural areas without permanent housing', targetGroup: ['rural_poor', 'bpl_families'], ngoEligible: false },
      benefits: { description: 'Construction assistance up to ₹1.2 lakh in plains, ₹1.3 lakh in NE/hilly areas', financialAmount: 120000, financialType: 'grant' },
      requiredDocuments: ['BPL card', 'Land ownership proof', 'Aadhaar', 'Bank account'],
      deadline: { isOngoing: true },
      fundingAmount: 120000,
      tags: ['housing', 'pmay', 'rural', 'bpl'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'Skill India Mission - PMKVY',
      schemeCode: 'GOI-SKILL-001',
      department: 'Ministry of Skill Development and Entrepreneurship',
      level: 'central',
      description: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is the flagship scheme of the Ministry of Skill Development & Entrepreneurship aimed to enable a large number of Indian youth to take up industry-relevant skill training. Training Partners including NGOs can become certified training providers.',
      shortDescription: 'Free skill training with certification for youth employment.',
      category: 'skill_development',
      focusAreas: ['skill_development', 'livelihood', 'youth', 'employment'],
      eligibility: { description: 'Youth between 18-35 years, school/college dropouts', targetGroup: ['youth', 'school_dropouts'], ageMin: 18, ageMax: 35, ngoEligible: true },
      benefits: { description: 'Free training, certification, placement support, monetary reward on completion', financialAmount: 8000, financialType: 'other', nonFinancialBenefits: ['Industry certification', 'Placement support', 'RPL recognition'] },
      requiredDocuments: ['Aadhaar', '10th certificate', 'Bank account', 'Affidavit (for dropouts)'],
      deadline: { isOngoing: true },
      fundingAmount: 8000,
      tags: ['skill', 'youth', 'employment', 'pmkvy', 'training'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'National Health Mission (NHM)',
      schemeCode: 'GOI-HEALTH-001',
      department: 'Ministry of Health and Family Welfare',
      level: 'central',
      description: 'National Health Mission aims to achieve universal access to equitable, affordable and quality healthcare services. NGOs are key implementation partners for healthcare delivery in remote areas.',
      shortDescription: 'Universal healthcare access especially for rural and vulnerable populations.',
      category: 'health',
      focusAreas: ['health', 'rural_development', 'women_empowerment', 'children'],
      eligibility: { description: 'All citizens, especially BPL families; NGOs as healthcare partners', targetGroup: ['all_citizens', 'rural_poor', 'women', 'children'], ngoEligible: true },
      benefits: { description: 'Free healthcare, ASHA support, hospital care, medicines', financialAmount: 200000, financialType: 'grant', nonFinancialBenefits: ['Training', 'Equipment', 'Infrastructure'] },
      requiredDocuments: ['Health card', 'Aadhaar', 'BPL card (if applicable)'],
      deadline: { isOngoing: true },
      fundingAmount: 200000,
      tags: ['health', 'nhm', 'asha', 'rural health', 'mother child'],
      isActive: true,
      createdBy: users[0]._id,
    },
    {
      name: 'CSR Funding - Education & Skill Development Focus',
      schemeCode: 'CSR-EDU-001',
      department: 'Ministry of Corporate Affairs',
      ministry: 'Ministry of Corporate Affairs',
      level: 'central',
      description: 'Under Section 135 of Companies Act 2013, companies with prescribed net worth/turnover must spend 2% of average net profit on CSR activities. Education and skill development are priority areas.',
      shortDescription: 'Corporate CSR funds for NGOs in education and skill development sectors.',
      category: 'education',
      focusAreas: ['education', 'skill_development', 'livelihood', 'environment'],
      eligibility: { description: 'NGOs with valid 80G/12A registration, proven track record', targetGroup: ['ngos'], ngoEligible: true, requiredCertifications: ['80G', '12A', 'DARPAN registration'] },
      benefits: { description: 'Variable CSR funding based on company, typically ₹5L - ₹5Cr', financialAmount: 5000000, financialType: 'grant' },
      requiredDocuments: ['12A certificate', '80G certificate', 'FCRA (if applicable)', 'DARPAN registration', 'Annual reports', 'Audited financials'],
      deadline: { isOngoing: true },
      fundingAmount: 5000000,
      tags: ['csr', 'corporate', 'education', 'funding'],
      isActive: true,
      createdBy: users[0]._id,
    },
  ]);
  console.log('Created schemes:', schemes.length);

  // Create Projects
  const projects = await Project.create([
    {
      title: 'Digital Learning Centers - Rural Maharashtra',
      ngoId: ngo._id,
      schemeId: schemes[1]._id,
      description: 'Setting up 5 digital learning centers in rural areas of Pune and Nashik districts with computers, internet, and trained teachers.',
      objectives: ['Setup 5 fully-equipped learning centers', 'Train 20 local teachers', 'Reach 1000 students in first year', 'Create digital literacy curriculum'],
      targetGroup: 'Children aged 8-16 in rural Maharashtra',
      category: 'education',
      focusAreas: ['education', 'digital_literacy', 'rural_development'],
      location: { state: 'Maharashtra', district: 'Pune', city: 'Pune', villages: ['Khed', 'Junnar', 'Ambegaon'] },
      timeline: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
      budget: { total: 1500000, spent: 900000, currency: 'INR', breakdown: [{ category: 'Equipment', amount: 800000 }, { category: 'Personnel', amount: 400000 }, { category: 'Operations', amount: 300000 }] },
      funding: [{ source: 'Samagra Shiksha Abhiyan', type: 'government_grant', amount: 1000000, status: 'received' }, { source: 'Infosys CSR', type: 'csr', amount: 500000, status: 'received' }],
      impact: { beneficiariesTargeted: 1000, beneficiariesReached: 780, impactScore: 78 },
      status: 'active',
      approvedBy: users[2]._id,
      approvedAt: new Date('2023-12-15'),
      tags: ['digital', 'education', 'rural', 'maharashtra'],
      isPublic: true,
    },
    {
      title: 'Women Skill Development - Rajasthan',
      ngoId: ngo._id,
      schemeId: schemes[5]._id,
      description: 'Three-month skill training program for women in Jaipur and Jodhpur districts covering tailoring, handicrafts, and digital literacy.',
      objectives: ['Train 200 women in vocational skills', 'Achieve 80% placement rate', 'Setup 2 production units'],
      targetGroup: 'Women aged 18-45 in rural Rajasthan',
      category: 'skill_development',
      focusAreas: ['women_empowerment', 'skill_development', 'livelihood'],
      location: { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
      timeline: { startDate: new Date('2024-04-01'), endDate: new Date('2024-09-30') },
      budget: { total: 800000, spent: 200000, currency: 'INR' },
      funding: [{ source: 'PMKVY', type: 'government_grant', amount: 600000, status: 'approved' }],
      impact: { beneficiariesTargeted: 200, beneficiariesReached: 45, impactScore: 45 },
      status: 'active',
      tags: ['women', 'skill', 'rajasthan', 'livelihood'],
      isPublic: true,
    },
  ]);
  console.log('Created projects:', projects.length);

  // Create Beneficiaries
  await Beneficiary.create([
    { name: 'Sunita Devi', age: 32, gender: 'female', phone: '9876543201', location: { village: 'Khed', district: 'Pune', state: 'Maharashtra', pincode: '410501' }, category: ['bpl', 'women'], incomeLevel: 'bpl', language: 'hi', associatedNGOs: [{ ngoId: ngo._id, projectId: projects[0]._id, serviceReceived: 'Digital literacy training' }] },
    { name: 'Ramesh Yadav', age: 12, gender: 'male', phone: '9876543202', location: { village: 'Junnar', district: 'Pune', state: 'Maharashtra', pincode: '410502' }, category: ['bpl', 'children'], incomeLevel: 'bpl', language: 'hi', associatedNGOs: [{ ngoId: ngo._id, projectId: projects[0]._id, serviceReceived: 'Digital education program' }] },
  ]);
  console.log('Created beneficiaries');

  console.log('\n🌱 Seed data created successfully!\n');
  console.log('Demo Accounts:');
  console.log('  Admin:     admin@sevaai.in   / Admin@123');
  console.log('  NGO:       ngo@sevaai.in     / NGO@123');
  console.log('  Govt:      govt@sevaai.in    / Govt@123');
  console.log('  Volunteer: volunteer@sevaai.in / Vol@123');
  console.log('  Citizen:   citizen@sevaai.in / Cit@123\n');

  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
