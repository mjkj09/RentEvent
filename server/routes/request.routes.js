const router = require('express').Router();
const ctrl = require('../controllers/request.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Create new request (venue inquiry)
router.post('/', ctrl.createRequest);

// Get user's sent requests
router.get('/sent', ctrl.getSentRequests);

// Get user's received requests
router.get('/received', ctrl.getReceivedRequests);

// Get unread count for notifications
router.get('/unread-count', ctrl.getUnreadCount);

// Mark all requests as read
router.patch('/mark-all-read', ctrl.markAllAsRead);

// IMPORTANT: Keep specific routes BEFORE the /:id route to avoid conflicts
// Get specific request by ID - this should be LAST among GET routes
router.get('/:id', ctrl.getRequestById);

// Mark specific request as read
router.patch('/:id/mark-read', ctrl.markAsRead);

// Update request status
router.patch('/:id/status', ctrl.updateRequestStatus);

// Delete request (soft delete)
router.delete('/:id', ctrl.deleteRequest);

module.exports = router;