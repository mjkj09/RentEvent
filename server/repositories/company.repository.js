const Company = require('../models/company.model');

class CompanyRepository {
    async create(companyData) {
        try {
            const company = new Company(companyData);
            return await company.save();
        } catch (error) {
            throw error;
        }
    }

    async findByOwnerId(ownerId) {
        try {
            return await Company.findOne({ owner: ownerId }).populate('owner', 'name surname email role');
        } catch (error) {
            throw error;
        }
    }

    async findByNip(nip) {
        try {
            return await Company.findOne({ nip });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await Company.findById(id).populate('owner', 'name surname email role');
        } catch (error) {
            throw error;
        }
    }

    async updateByOwnerId(ownerId, updateData) {
        try {
            return await Company.findOneAndUpdate(
                { owner: ownerId },
                { ...updateData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            ).populate('owner', 'name surname email role');
        } catch (error) {
            throw error;
        }
    }

    async deleteByOwnerId(ownerId) {
        try {
            return await Company.findOneAndDelete({ owner: ownerId });
        } catch (error) {
            throw error;
        }
    }

    async getAllCompanies(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const companies = await Company.find()
                .populate('owner', 'name surname email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Company.countDocuments();

            return {
                companies,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyCompany(companyId) {
        try {
            return await Company.findByIdAndUpdate(
                companyId,
                { isVerified: true, updatedAt: Date.now() },
                { new: true }
            ).populate('owner', 'name surname email role');
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CompanyRepository();