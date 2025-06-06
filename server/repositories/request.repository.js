const Request = require('../models/request.model');

exports.insert = (data) =>
    new Request(data).save();

exports.findById = (id) =>
    Request.findById(id)
        .populate('venue', 'name category capacity location')
        .populate('sender', 'name surname email')
        .populate('receiver', 'name surname email')
        .exec();

// Get sent requests for a user (as sender)
exports.findSentByUser = (userId, options = {}) => {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const query = {
        sender: userId,
        deletedBySender: false
    };

    if (status) {
        query.status = status;
    }

    return Request.find(query)
        .populate('venue', 'name category capacity location')
        .populate('receiver', 'name surname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
};

// Get received requests for a user (as receiver/owner)
exports.findReceivedByUser = (userId, options = {}) => {
    const { page = 1, limit = 10, status, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const query = {
        receiver: userId,
        deletedByReceiver: false
    };

    if (status) {
        query.status = status;
    }

    if (unreadOnly) {
        query.isReadByReceiver = false;
    }

    return Request.find(query)
        .populate('venue', 'name category capacity location')
        .populate('sender', 'name surname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
};

// Count sent requests
exports.countSentByUser = (userId, status = null) => {
    const query = {
        sender: userId,
        deletedBySender: false
    };

    if (status) {
        query.status = status;
    }

    return Request.countDocuments(query);
};

// Count received requests
exports.countReceivedByUser = (userId, status = null) => {
    const query = {
        receiver: userId,
        deletedByReceiver: false
    };

    if (status) {
        query.status = status;
    }

    return Request.countDocuments(query);
};

// Get unread count for user
exports.getUnreadCount = (userId) =>
    Request.countDocuments({
        receiver: userId,
        isReadByReceiver: false,
        deletedByReceiver: false
    });

// Update request
exports.update = (id, data) =>
    Request.findByIdAndUpdate(id, data, { new: true })
        .populate('venue', 'name category capacity location')
        .populate('sender', 'name surname email')
        .populate('receiver', 'name surname email')
        .exec();

// Update request by condition
exports.updateByCondition = (condition, data) =>
    Request.updateMany(condition, data);

// Mark request as read
exports.markAsRead = (requestId, userId) =>
    Request.findOneAndUpdate(
        {
            _id: requestId,
            receiver: userId
        },
        {
            isReadByReceiver: true,
            readAt: new Date(),
            updatedAt: new Date()
        },
        { new: true }
    );

// Mark all requests as read for user
exports.markAllAsRead = (userId) =>
    Request.updateMany(
        {
            receiver: userId,
            isReadByReceiver: false,
            deletedByReceiver: false
        },
        {
            isReadByReceiver: true,
            readAt: new Date(),
            updatedAt: new Date()
        }
    );

// Soft delete request (hide for specific user)
exports.deleteForUser = async (requestId, userId) => {
    const request = await Request.findById(requestId);

    if (!request) {
        return null;
    }

    if (request.sender.toString() === userId.toString()) {
        request.deletedBySender = true;
    } else if (request.receiver.toString() === userId.toString()) {
        request.deletedByReceiver = true;
    } else {
        throw new Error('Unauthorized to delete this request');
    }

    request.updatedAt = new Date();
    return request.save();
};

// Update email sending status
exports.updateEmailStatus = (requestId, emailSent, emailError = null) => {
    const updateData = {
        emailSent,
        emailSentAt: emailSent ? new Date() : null,
        updatedAt: new Date()
    };

    if (emailError) {
        updateData.emailError = emailError;
    }

    return Request.findByIdAndUpdate(
        requestId,
        updateData,
        { new: true }
    );
};

// Get request statistics for user
exports.getRequestStats = async (userId) => {
    const sentStats = await Request.aggregate([
        { $match: { sender: userId, deletedBySender: false } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const receivedStats = await Request.aggregate([
        { $match: { receiver: userId, deletedByReceiver: false } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const unreadCount = await exports.getUnreadCount(userId);

    return {
        sent: sentStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, { pending: 0, responded: 0, cancelled: 0 }),
        received: receivedStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, { pending: 0, responded: 0, cancelled: 0 }),
        unreadCount
    };
};

// Find requests for a specific venue
exports.findByVenue = (venueId, options = {}) => {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const query = { venue: venueId };

    if (status) {
        query.status = status;
    }

    return Request.find(query)
        .populate('sender', 'name surname email')
        .populate('receiver', 'name surname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
};