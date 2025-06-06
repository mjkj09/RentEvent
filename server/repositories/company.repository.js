const Company = require('../models/company.model');

exports.create = async (companyData) => {
    const company = new Company(companyData);
    return await company.save();
};

exports.findByOwnerId = (ownerId) =>
    Company.findOne({ owner: ownerId }).populate('owner', 'name surname email role').exec();

exports.findByNip = (nip) =>
    Company.findOne({ nip }).exec();

exports.findById = (id) =>
    Company.findById(id).populate('owner', 'name surname email role').exec();

exports.updateByOwnerId = (ownerId, updateData) =>
    Company.findOneAndUpdate(
        { owner: ownerId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
    ).populate('owner', 'name surname email role').exec();

exports.deleteByOwnerId = (ownerId) =>
    Company.findOneAndDelete({ owner: ownerId }).exec();

exports.getAllCompanies = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const companies = await Company.find()
        .populate('owner', 'name surname email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

    const total = await Company.countDocuments();

    return {
        companies,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};
