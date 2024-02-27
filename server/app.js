const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create
app.post('/insert', (request, response) => {
    const { orderId, auth_token, token_exp_date, auth_amount, created_date} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewOrder(orderId, auth_token, token_exp_date, auth_amount, created_date);

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});

// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
        .then(data => response.json({ data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});

app.get('/getAllOrders', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.getAllOrders();
        response.json({ success: true, data: result });
    } catch (error) {
        response.json({ success: false, error: error.message });
    }
});

// update

// delete

app.listen(process.env.PORT, () => console.log('app is running'));
