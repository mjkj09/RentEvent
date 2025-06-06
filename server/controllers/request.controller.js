const requestService = require('../services/request.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.createRequest = async (req, res, next) => {
    try {
        const request = await requestService.createRequest(req.body, req.user.id);
        return successResponse(res, 'Venue inquiry sent successfully', request, 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getSentRequests = async (req, res, next) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status
        };

        const result = await requestService.getSentRequests(req.user.id, options);
        return successResponse(res, 'Sent requests retrieved successfully', result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getReceivedRequests = async (req, res, next) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status,
            unreadOnly: req.query.unreadOnly === 'true'
        };

        const result = await requestService.getReceivedRequests(req.user.id, options);
        return successResponse(res, 'Received requests retrieved successfully', result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await requestService.getUnreadCount(req.user.id);
        return successResponse(res, 'Unread count retrieved successfully', { unreadCount: count });
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getRequestById = async (req, res, next) => {
    try {
        const request = await requestService.getRequestById(req.params.id, req.user.id);
        return successResponse(res, 'Request retrieved successfully', request);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const request = await requestService.markAsRead(req.params.id, req.user.id);
        return successResponse(res, 'Request marked as read', request);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        await requestService.markAllAsRead(req.user.id);
        return successResponse(res, 'All requests marked as read');
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const request = await requestService.updateRequestStatus(req.params.id, status, req.user.id);
        return successResponse(res, `Request marked as ${status}`, request);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.deleteRequest = async (req, res, next) => {
    try {
        await requestService.deleteRequest(req.params.id, req.user.id);
        return successResponse(res, 'Request deleted successfully');
    } catch (error) {
        return errorResponse(res, error);
    }
};