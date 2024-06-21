// This fb config should be kept seprate for seeding database to aviod ES6 import issues

const { Client } = require('pg');
const { db } = require('@vercel/postgres');

const DbConnect = async () => {
    let client;
    if (process.env.NEXT_ENV === 'development') {
        client = new Client({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'next-demo',
        });
    } else {
        client = db; // Use the imported Vercel Postgres client options
    }

    try {
        console.log(`Connecting to ${process.env.NEXT_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`);
        await client.connect();
        console.log(`Connected to ${process.env.NEXT_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`);
        return client;
    } catch (err) {
        console.error(`Error connecting to ${process.env.NEXT_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`, err);
        throw err;
    }
};

module.exports = DbConnect;