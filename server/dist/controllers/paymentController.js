"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatus = exports.handleStripeWebhook = exports.createCheckoutSession = exports.createPaymentLink = void 0;
const database_1 = __importDefault(require("../config/database"));
const stripe_1 = __importStar(require("../config/stripe"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTransporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// NEW: Payment Links method (recommended)
const createPaymentLink = async (req, res) => {
    const { taskType, content } = req.body;
    const userId = req.user.userId;
    try {
        // First, create a temporary essay record (pending payment)
        const essayResult = await database_1.default.query('INSERT INTO essays (user_id, task_type, content, status) VALUES ($1, $2, $3, $4) RETURNING id', [userId, taskType, content, 'pending_payment']);
        const essayId = essayResult.rows[0].id;
        // Get user info for email
        const userResult = await database_1.default.query('SELECT email, name FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        // Determine price based on task type
        const priceConfig = taskType === 'task1' ? stripe_1.PRICES.TASK1 : stripe_1.PRICES.TASK2;
        // Create Payment Link instead of session
        const paymentLink = await stripe_1.default.paymentLinks.create({
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.FRONTEND_URL}/payment/success?essay_id=${essayId}`
                }
            },
            line_items: [{
                    price: `${priceConfig.amount}_price_${Date.now()}`,
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: priceConfig.name,
                            description: `Professional feedback for your IELTS ${taskType === 'task1' ? 'Task 1' : 'Task 2'} essay`,
                        },
                        unit_amount: priceConfig.amount,
                    },
                    quantity: 1,
                }],
        });
        // Create payment record
        await database_1.default.query('INSERT INTO payments (user_id, essay_id, amount, currency, status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4, $5, $6)', [userId, essayId, priceConfig.amount / 100, 'usd', 'pending', paymentLink.id]);
        res.json({
            paymentUrl: paymentLink.url,
            essayId
        });
    }
    catch (error) {
        console.error('Create payment link error:', error);
        res.status(500).json({ error: 'Failed to create payment link' });
    }
};
exports.createPaymentLink = createPaymentLink;
// OLD: Checkout Sessions (deprecated but kept for compatibility)
const createCheckoutSession = async (req, res) => {
    const { taskType, content } = req.body;
    const userId = req.user.userId;
    try {
        // First, create a temporary essay record (pending payment)
        const essayResult = await database_1.default.query('INSERT INTO essays (user_id, task_type, content, status) VALUES ($1, $2, $3, $4) RETURNING id', [userId, taskType, content, 'pending_payment']);
        const essayId = essayResult.rows[0].id;
        // Get user info for email
        const userResult = await database_1.default.query('SELECT email, name FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        // Determine price based on task type
        const priceConfig = taskType === 'task1' ? stripe_1.PRICES.TASK1 : stripe_1.PRICES.TASK2;
        // Create Stripe checkout session
        const session = await stripe_1.default.checkout.sessions.create({
            customer_email: user.email,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: priceConfig.name,
                            description: `Professional feedback for your IELTS ${taskType === 'task1' ? 'Task 1' : 'Task 2'} essay`,
                        },
                        unit_amount: priceConfig.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?essay_id=${essayId}`,
            metadata: {
                essayId: essayId,
                userId: userId,
                taskType: taskType,
            },
        });
        // Create payment record
        await database_1.default.query('INSERT INTO payments (user_id, essay_id, amount, currency, status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4, $5, $6)', [userId, essayId, priceConfig.amount / 100, 'usd', 'pending', session.payment_intent]);
        res.json({ sessionId: session.id, essayId });
    }
    catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await handleSuccessfulPayment(session);
                break;
            case 'checkout.session.expired':
                const expiredSession = event.data.object;
                await handleExpiredPayment(expiredSession);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Failed to process webhook' });
    }
    res.json({ received: true });
};
exports.handleStripeWebhook = handleStripeWebhook;
async function handleSuccessfulPayment(session) {
    const essayId = session.metadata?.essayId;
    const userId = session.metadata?.userId;
    if (!essayId || !userId) {
        console.error('Missing metadata in successful payment');
        return;
    }
    try {
        await database_1.default.query('BEGIN');
        // Update essay status
        await database_1.default.query('UPDATE essays SET status = $1 WHERE id = $2', ['pending', essayId]);
        // Update payment status
        await database_1.default.query('UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE essay_id = $2 AND stripe_payment_intent_id = $3', ['completed', essayId, session.payment_intent]);
        // Get user info for email
        const userResult = await database_1.default.query('SELECT email, name FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        // Send confirmation email
        await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Essay Submission Confirmed',
            html: `
        <h2>Essay Submission Confirmed</h2>
        <p>Hi ${user.name},</p>
        <p>Your IELTS essay has been successfully submitted for review. Our examiners will review your essay and provide detailed feedback within 24-48 hours.</p>
        <p>You can track the status of your submission in your dashboard.</p>
        <p>Thank you for choosing our service!</p>
      `,
        });
        await database_1.default.query('COMMIT');
        console.log('Successfully processed payment for essay:', essayId);
    }
    catch (error) {
        await database_1.default.query('ROLLBACK');
        console.error('Error processing successful payment:', error);
        throw error;
    }
}
async function handleExpiredPayment(session) {
    const essayId = session.metadata?.essayId;
    if (!essayId) {
        console.error('Missing essay ID in expired payment');
        return;
    }
    try {
        // Update payment status to failed
        await database_1.default.query('UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE essay_id = $2 AND stripe_payment_intent_id = $3', ['failed', essayId, session.payment_intent]);
        console.log('Payment expired for essay:', essayId);
    }
    catch (error) {
        console.error('Error handling expired payment:', error);
    }
}
const getPaymentStatus = async (req, res) => {
    const { paymentId } = req.params;
    try {
        const result = await database_1.default.query('SELECT status, amount, currency, created_at FROM payments WHERE id = $1', [paymentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ error: 'Failed to get payment status' });
    }
};
exports.getPaymentStatus = getPaymentStatus;
