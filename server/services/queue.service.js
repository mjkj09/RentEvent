const amqp = require('amqplib');
const emailService = require('./email.service');
const requestService = require('./request.service');

let connection = null;
let channel = null;
let isConnected = false;

const connect = async () => {
    try {
        const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

        connection = await amqp.connect(rabbitmqUrl);
        channel = await connection.createChannel();

        // Declare email queue with durability
        await channel.assertQueue('email_queue', {
            durable: true
        });

        // Set up consumer for email queue
        await setupEmailConsumer();

        isConnected = true;

        // Handle connection errors
        connection.on('error', (err) => {
            isConnected = false;
        });

        connection.on('close', () => {
            isConnected = false;
        });

    } catch (error) {
        isConnected = false;
        throw error;
    }
};

const setupEmailConsumer = async () => {
    try {
        await channel.consume('email_queue', async (msg) => {
            if (msg) {
                try {
                    const data = JSON.parse(msg.content.toString());

                    if (data.type === 'venue_inquiry') {
                        await processVenueInquiry(data);
                    }

                    // Acknowledge message
                    channel.ack(msg);
                } catch (error) {
                    // Reject message and don't requeue to avoid infinite loops
                    channel.nack(msg, false, false);
                }
            }
        }, {
            noAck: false
        });
    } catch (error) {
        throw error;
    }
};

const processVenueInquiry = async (data) => {
    try {
        const { requestId, ...emailData } = data;

        // Send main inquiry email to venue owner
        const mainEmailResult = await emailService.sendVenueInquiry(emailData);

        // Send confirmation email to sender
        const confirmationResult = await emailService.sendInquiryConfirmation(emailData);

        // Update request with email status
        await requestService.updateEmailStatus(
            requestId,
            mainEmailResult.success,
            mainEmailResult.success ? null : mainEmailResult.error
        );

    } catch (error) {
        // Update request with error status
        if (data.requestId) {
            try {
                await requestService.updateEmailStatus(
                    data.requestId,
                    false,
                    error.message
                );
            } catch (updateError) {
                // Error updating request status
            }
        }

        throw error;
    }
};

const queueVenueInquiry = async (data) => {
    try {
        if (!isConnected) {
            await connect();
        }

        const message = {
            type: 'venue_inquiry',
            ...data
        };

        const messageBuffer = Buffer.from(JSON.stringify(message));

        const queued = channel.sendToQueue('email_queue', messageBuffer, {
            persistent: true
        });

        if (!queued) {
            throw new Error('Failed to queue message');
        }

    } catch (error) {
        // Fallback: try to send email directly if queue fails
        try {
            await processVenueInquiry(data);
        } catch (directError) {
            throw directError;
        }
    }
};

const disconnect = async () => {
    try {
        if (channel) {
            await channel.close();
        }
        if (connection) {
            await connection.close();
        }
        isConnected = false;
    } catch (error) {
        // Error disconnecting from RabbitMQ
    }
};

// Initialize connection on module load
const initializeQueue = async () => {
    try {
        await connect();
    } catch (error) {
        // Don't throw here, let the app start even if RabbitMQ is not available
    }
};

// Auto-initialize
initializeQueue();

// Graceful shutdown
process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnect();
    process.exit(0);
});

module.exports = {
    connect,
    disconnect,
    queueVenueInquiry
};
