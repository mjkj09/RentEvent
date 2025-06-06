const requestRepo = require('../repositories/request.repository');
const venueRepo = require('../repositories/venue.repository');
const userRepo = require('../repositories/user.repository');
const queueService = require('./queue.service');
const AppError = require('../utils/AppError');

exports.createRequest = async (requestData, senderId) => {
    // Get venue details
    const venue = await venueRepo.findByIdWithOwner(requestData.venue);
    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    if (!venue.isActive) {
        throw new AppError('This venue is not available for booking', 400);
    }

    // Get sender details
    const sender = await userRepo.findById(senderId);
    if (!sender) {
        throw new AppError('Sender not found', 404);
    }

    // Prevent self-requests
    if (venue.owner._id.toString() === senderId.toString()) {
        throw new AppError('You cannot send a request to your own venue', 400);
    }

    // Validate guest count
    if (requestData.expectedGuestCount > venue.capacity) {
        throw new AppError(`Guest count (${requestData.expectedGuestCount}) exceeds venue capacity (${venue.capacity})`, 400);
    }

    // Check if user has phone number (fix the issue mentioned)
    const senderPhone = requestData.senderPhone || sender.phone;
    if (!senderPhone) {
        throw new AppError('Phone number is required', 400);
    }

    // Create request data
    const newRequestData = {
        venue: venue._id,
        sender: senderId,
        receiver: venue.owner._id,
        senderName: requestData.senderName,
        senderEmail: requestData.senderEmail,
        senderPhone: senderPhone,
        eventDate: requestData.eventDate || null,
        eventType: requestData.eventType,
        expectedGuestCount: requestData.expectedGuestCount,
        message: requestData.message,
        status: 'pending'
    };

    // Create request
    const request = await requestRepo.insert(newRequestData);

    // Populate the created request
    const populatedRequest = await requestRepo.findById(request._id);

    // Queue email sending
    try {
        await queueService.queueVenueInquiry({
            requestId: populatedRequest._id,
            venue: {
                _id: venue._id,
                name: venue.name,
                category: venue.category,
                capacity: venue.capacity,
                location: venue.location
            },
            sender: {
                _id: sender._id,
                name: sender.name,
                surname: sender.surname,
                email: sender.email
            },
            receiver: {
                _id: venue.owner._id,
                name: venue.owner.name,
                surname: venue.owner.surname,
                email: venue.owner.email
            },
            senderName: newRequestData.senderName,
            senderEmail: newRequestData.senderEmail,
            senderPhone: newRequestData.senderPhone,
            eventDate: newRequestData.eventDate,
            eventType: newRequestData.eventType,
            expectedGuestCount: newRequestData.expectedGuestCount,
            message: newRequestData.message
        });

        console.log('✅ Email queued for request:', populatedRequest._id);
    } catch (emailError) {
        console.error('❌ Failed to queue email for request:', populatedRequest._id, emailError);
        // Don't fail the request creation if email fails
    }

    return populatedRequest;
};

exports.getSentRequests = async (userId, options = {}) => {
    const requests = await requestRepo.findSentByUser(userId, options);
    const total = await requestRepo.countSentByUser(userId, options.status);

    return {
        requests,
        pagination: {
            page: options.page || 1,
            limit: options.limit || 10,
            total,
            pages: Math.ceil(total / (options.limit || 10))
        }
    };
};

exports.getReceivedRequests = async (userId, options = {}) => {
    const requests = await requestRepo.findReceivedByUser(userId, options);
    const total = await requestRepo.countReceivedByUser(userId, options.status);

    return {
        requests,
        pagination: {
            page: options.page || 1,
            limit: options.limit || 10,
            total,
            pages: Math.ceil(total / (options.limit || 10))
        }
    };
};

exports.getUnreadCount = async (userId) => {
    return await requestRepo.getUnreadCount(userId);
};

exports.getRequestById = async (requestId, userId) => {
    const request = await requestRepo.findById(requestId);

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if user has access to this request
    const userIdStr = userId.toString();
    const senderIdStr = request.sender._id.toString();
    const receiverIdStr = request.receiver._id.toString();

    if (userIdStr !== senderIdStr && userIdStr !== receiverIdStr) {
        throw new AppError('Unauthorized to view this request', 403);
    }

    // Check if request is visible to user (not soft deleted)
    if (userIdStr === senderIdStr && request.deletedBySender) {
        throw new AppError('Request not found', 404);
    }

    if (userIdStr === receiverIdStr && request.deletedByReceiver) {
        throw new AppError('Request not found', 404);
    }

    return request;
};

exports.markAsRead = async (requestId, userId) => {
    const request = await requestRepo.findById(requestId);

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Only receiver can mark as read
    if (request.receiver._id.toString() !== userId.toString()) {
        throw new AppError('Unauthorized to mark this request as read', 403);
    }

    return await requestRepo.markAsRead(requestId, userId);
};

exports.markAllAsRead = async (userId) => {
    return await requestRepo.markAllAsRead(userId);
};

exports.updateRequestStatus = async (requestId, status, userId) => {
    const request = await requestRepo.findById(requestId);

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if user has permission to update status
    const userIdStr = userId.toString();
    const senderIdStr = request.sender._id.toString();
    const receiverIdStr = request.receiver._id.toString();

    if (userIdStr !== senderIdStr && userIdStr !== receiverIdStr) {
        throw new AppError('Unauthorized to update this request', 403);
    }

    // Validate status transitions
    if (status === 'cancelled' && userIdStr !== senderIdStr) {
        throw new AppError('Only sender can cancel a request', 403);
    }

    if (status === 'responded' && userIdStr !== receiverIdStr) {
        throw new AppError('Only receiver can mark request as responded', 403);
    }

    return await requestRepo.update(requestId, { status });
};

exports.deleteRequest = async (requestId, userId) => {
    const request = await requestRepo.findById(requestId);

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if user has permission to delete
    const userIdStr = userId.toString();
    const senderIdStr = request.sender._id.toString();
    const receiverIdStr = request.receiver._id.toString();

    if (userIdStr !== senderIdStr && userIdStr !== receiverIdStr) {
        throw new AppError('Unauthorized to delete this request', 403);
    }

    return await requestRepo.deleteForUser(requestId, userId);
};

exports.updateEmailStatus = async (requestId, emailSent, emailError = null) => {
    return await requestRepo.updateEmailStatus(requestId, emailSent, emailError);
};