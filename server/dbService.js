const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection ({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    
    async insertNewOrder(orderId, auth_token, token_exp_date, auth_amount, created_date) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO orders (orderId, auth_token, token_exp_date, auth_amount, created_date, status) VALUES (?, ?, ?, ?, ?, 'pending');";

                connection.query(query, [orderId, auth_token, token_exp_date, auth_amount, created_date], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllOrders() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM orders;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }  
   
    async getAuthAmountByOrderId(orderId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT auth_amount FROM orders WHERE orderId = ?;";
                console.log('getAuthAmountByOrderId Query:', query);
                connection.query(query, [orderId], (err, results) => {
                    if (err) {
                        console.error('getAuthAmountByOrderId Error:', err.message);
                        reject(new Error(err.message));
                    }
                    console.log('getAuthAmountByOrderId Response:', results);
                    resolve(results);
                });
            });
            console.log('getAuthAmountByOrderId Result:', response); 
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE orders SET status = ? WHERE orderId = ?;";
    
                connection.query(query, [status, orderId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }    
}

module.exports = DbService;