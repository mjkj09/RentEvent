const companyRepository = require('../repositories/company.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

exports.createCompany = async (ownerId, companyData) => {
    // Check if user exists and is eligible to create a company
    const user = await userRepository.findById(ownerId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Check if user already has a company
    const existingCompany = await companyRepository.findByOwnerId(ownerId);
    if (existingCompany) {
        throw new AppError('User already has a company registered', 400);
    }

    // Check if NIP is already taken
    const nipExists = await companyRepository.findByNip(companyData.nip);
    if (nipExists) {
        throw new AppError('Company with this NIP already exists', 400);
    }

    // Create company
    const company = await companyRepository.create({
        ...companyData,
        owner: ownerId
    });

    // Update user role to owner if not already
    if (user.role !== 'owner') {
        await userRepository.updateById(ownerId, { role: 'owner' });
    }

    return company;
};

exports.getCompanyByOwnerId = async (ownerId) => {
    const company = await companyRepository.findByOwnerId(ownerId);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
};

exports.updateCompany = async (ownerId, updateData) => {
    // Check if user owns a company
    const existingCompany = await companyRepository.findByOwnerId(ownerId);
    if (!existingCompany) {
        throw new AppError('Company not found', 404);
    }

    // If NIP is being updated, check if it's not taken by another company
    if (updateData.nip && updateData.nip !== existingCompany.nip) {
        const nipExists = await companyRepository.findByNip(updateData.nip);
        if (nipExists) {
            throw new AppError('Company with this NIP already exists', 400);
        }
    }

    return await companyRepository.updateByOwnerId(ownerId, updateData);
};

exports.deleteCompany = async (ownerId) => {
    const company = await companyRepository.findByOwnerId(ownerId);
    if (!company) {
        throw new AppError('Company not found', 404);
    }

    await companyRepository.deleteByOwnerId(ownerId);

    // Update user role back to renter
    await userRepository.updateById(ownerId, { role: 'renter' });

    return { message: 'Company deleted successfully' };
};

exports.switchToRenter = async (ownerId) => {
    const user = await userRepository.findById(ownerId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Update user role to renter
    await userRepository.updateById(ownerId, { role: 'renter' });

    return { message: 'User role switched to renter successfully' };
};

exports.getCompanyById = async (companyId) => {
    const company = await companyRepository.findById(companyId);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
};

exports.getAllCompanies = async (page = 1, limit = 10) => {
    return await companyRepository.getAllCompanies(page, limit);
};

exports.checkCompanyExists = async (ownerId) => {
    const company = await companyRepository.findByOwnerId(ownerId);
    return !!company;
};