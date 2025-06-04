const companyRepository = require('../repositories/company.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

class CompanyService {
    async createCompany(ownerId, companyData) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    async getCompanyByOwnerId(ownerId) {
        try {
            const company = await companyRepository.findByOwnerId(ownerId);
            if (!company) {
                throw new AppError('Company not found', 404);
            }
            return company;
        } catch (error) {
            throw error;
        }
    }

    async updateCompany(ownerId, updateData) {
        try {
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

            const updatedCompany = await companyRepository.updateByOwnerId(ownerId, updateData);
            return updatedCompany;
        } catch (error) {
            throw error;
        }
    }

    async deleteCompany(ownerId) {
        try {
            const company = await companyRepository.findByOwnerId(ownerId);
            if (!company) {
                throw new AppError('Company not found', 404);
            }

            await companyRepository.deleteByOwnerId(ownerId);

            // Update user role back to renter
            await userRepository.updateById(ownerId, { role: 'renter' });

            return { message: 'Company deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async switchToRenter(ownerId) {
        try {
            const user = await userRepository.findById(ownerId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Update user role to renter
            await userRepository.updateById(ownerId, { role: 'renter' });

            return { message: 'User role switched to renter successfully' };
        } catch (error) {
            throw error;
        }
    }

    async getCompanyById(companyId) {
        try {
            const company = await companyRepository.findById(companyId);
            if (!company) {
                throw new AppError('Company not found', 404);
            }
            return company;
        } catch (error) {
            throw error;
        }
    }

    async getAllCompanies(page = 1, limit = 10) {
        try {
            return await companyRepository.getAllCompanies(page, limit);
        } catch (error) {
            throw error;
        }
    }

    async verifyCompany(companyId) {
        try {
            const company = await companyRepository.findById(companyId);
            if (!company) {
                throw new AppError('Company not found', 404);
            }

            return await companyRepository.verifyCompany(companyId);
        } catch (error) {
            throw error;
        }
    }

    async checkCompanyExists(ownerId) {
        try {
            const company = await companyRepository.findByOwnerId(ownerId);
            return !!company;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new CompanyService();