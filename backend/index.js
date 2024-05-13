const express = require('express');
const path = require('path');
const shortid = require('shortid');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
        key_id: 'KEY_ID',
        key_secret: 'KEY_SECRET'
});

const SECRET = '12345678';

app.get('/logo.svg', (req, res) => {
        res.sendFile(path.join(__dirname, 'logo.svg'));
});

app.post('/', (req, res) => {
        const shasum = crypto.createHmac('sha256', SECRET);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
                fs.writeFileSync('payment1.json', JSON.stringify(req.body, null, 4));
                console.log('Valid request, payment processed');
        } else {
                console.log('Invalid signature, request not processed');
        }

        res.json({ status: 'ok' });
});

app.post('/razorpay', async (req, res) => {
        const { amount, currency } = req.body;
        const payment_capture = 1;

        const options = {
                amount: `${amount}00`,
                currency,
                receipt: shortid.generate(),
                payment_capture
        };

        try {
                const response = await razorpay.orders.create(options);
                res.json({
                        id: response.id,
                        currency: response.currency,
                        amount: response.amount
                });
        } catch (error) {
                console.error('Error creating Razorpay order:', error);
                res.status(500).json({ error: 'Internal Server Error' });
        }
});

app.listen(1337, () => {
        console.log('Server running on http://localhost:1337');
});