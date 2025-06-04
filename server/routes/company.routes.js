const router = require('express').Router();
const companyController = require('../controllers/company.controller');
const { verifyToken } = require('../middleware/auth.middleware');
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

// Admin routes (could be protected with additional admin middleware)
router.get('/all', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.patch('/:id/verify', companyController.verifyCompany);

module.exports = router;