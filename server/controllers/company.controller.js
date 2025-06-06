const companyService = require('../services/company.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.createCompany = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const companyData = req.body;

        const company = await companyService.createCompany(ownerId, companyData);

        return successResponse(res, 'Company created successfully', company, 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getMyCompany = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const company = await companyService.getCompanyByOwnerId(ownerId);

        return successResponse(res, 'Company retrieved successfully', company);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.updateMyCompany = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const updateData = req.body;

        const company = await companyService.updateCompany(ownerId, updateData);

        return successResponse(res, 'Company updated successfully', company);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.deleteMyCompany = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const result = await companyService.deleteCompany(ownerId);

        return successResponse(res, result.message);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.switchToRenter = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const result = await companyService.switchToRenter(ownerId);

        return successResponse(res, result.message);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const company = await companyService.getCompanyById(id);

        return successResponse(res, 'Company retrieved successfully', company);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getAllCompanies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await companyService.getAllCompanies(page, limit);

        return successResponse(res, 'Companies retrieved successfully', result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.checkCompanyExists = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const exists = await companyService.checkCompanyExists(ownerId);

        return successResponse(res, 'Company existence checked', { exists });
    } catch (error) {
        return errorResponse(res, error);
    }
};