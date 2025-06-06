const router = require('express').Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');
const { validateCompany, validateCompanyUpdate } = require('../middleware/validation.middleware');

// All routes require authentication
router.use(verifyToken);

// Company CRUD operations
router.post('/', validateCompany, companyController.createCompany);
router.get('/my-company', companyController.getMyCompany);
router.put('/my-company', validateCompanyUpdate, companyController.updateMyCompany);
router.delete('/my-company', companyController.deleteMyCompany);

// Utility routes
router.post('/switch-to-renter', companyController.switchToRenter);
router.get('/check-exists', companyController.checkCompanyExists);

// Admin routes
router.get('/all', verifyToken, hasRole(['admin']), companyController.getAllCompanies);
router.get('/:id', verifyToken, hasRole(['admin']), companyController.getCompanyById);

module.exports = router;