const amqp = require('amqplib');
const emailService = require('./email.service');
const requestService = require('./request.service');

let connection = null;
let channel = null;
let isConnected = false;

const connect = async () => {
    try {
        const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        console.log('🐰 Connecting to RabbitMQ:', rabbitmqUrl);

        connection = await amqp.connect(rabbitmqUrl);
        channel = await connection.createChannel();

        // Declare email queue with durability
        await channel.assertQueue('email_queue', {
            durable: true
        });

        // Set up consumer for email queue
        await setupEmailConsumer();

        isConnected = true;
        console.log('✅ Connected to RabbitMQ and email queue is ready');

        // Handle connection errors
        connection.on('error', (err) => {
            console.error('❌ RabbitMQ connection error:', err);
            isConnected = false;
        });

        connection.on('close', () => {
            console.log('🔌 RabbitMQ connection closed');
            isConnected = false;
        });

    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ:', error);
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
                    console.log('📨 Processing email job:', data.type);

                    if (data.type === 'venue_inquiry') {
                        await processVenueInquiry(data);
                    }

                    // Acknowledge message
                    channel.ack(msg);
                } catch (error) {
                    console.error('❌ Error processing email job:', error);
                    // Reject message and don't requeue to avoid infinite loops
                    channel.nack(msg, false, false);
                }
            }
        }, {
            noAck: false
        });

        console.log('👂 Email consumer is listening for jobs...');
    } catch (error) {
        console.error('❌ Failed to set up email consumer:', error);
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

        console.log('✅ Venue inquiry emails processed successfully');

    } catch (error) {
        console.error('❌ Error processing venue inquiry:', error);

        // Update request with error status
        if (data.requestId) {
            try {
                await requestService.updateEmailStatus(
                    data.requestId,
                    false,
                    error.message
                );
            } catch (updateError) {
                console.error('❌ Failed to update request email status:', updateError);
            }
        }

        throw error;
    }
};

const queueVenueInquiry = async (data) => {
    try {
        if (!isConnected) {
            console.log('🔄 RabbitMQ not connected, attempting to connect...');
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

        if (queued) {
            console.log('📨 Venue inquiry queued successfully');
        } else {
            throw new Error('Failed to queue message');
        }

    } catch (error) {
        console.error('❌ Failed to queue venue inquiry:', error);

        // Fallback: try to send email directly if queue fails
        console.log('🔄 Attempting direct email sending as fallback...');
        try {
            await processVenueInquiry(data);
            console.log('✅ Direct email sending succeeded');
        } catch (directError) {
            console.error('❌ Direct email sending also failed:', directError);
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
        console.log('🔌 Disconnected from RabbitMQ');
    } catch (error) {
        console.error('❌ Error disconnecting from RabbitMQ:', error);
    }
};

// Initialize connection on module load
const initializeQueue = async () => {
    try {
        await connect();
    } catch (error) {
        console.error('❌ Failed to initialize RabbitMQ on startup:', error);
        // Don't throw here, let the app start even if RabbitMQ is not available
    }
};

// Auto-initialize
initializeQueue();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT, closing RabbitMQ connection...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, closing RabbitMQ connection...');
    await disconnect();
    process.exit(0);
});

module.exports = {
    connect,
    disconnect,
    queueVenueInquiry
};