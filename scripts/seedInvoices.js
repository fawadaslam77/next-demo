const { invoices } = require('../app/lib/placeholder-data.js');

async function seedInvoices(client) {
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, []);

        // Create the "invoices" table if it doesn't exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS invoices (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            customer_id UUID NOT NULL,
            amount INT NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
        );`, []);


        console.log(`Created "invoices" table`);

        // Truncate table
        await client.query(`TRUNCATE TABLE invoices`, []);

        var insertQuery = 'INSERT INTO invoices (customer_id, amount, status, date) VALUES ';
        invoices.map((ele, index) => {
            insertQuery += `('${ele.customer_id}', '${ele.amount}', '${ele.status}', '${ele.date}')`
            if (index !== invoices.length - 1) {
                insertQuery += ', '
            }
        })
        insertQuery += ' ON CONFLICT (id) DO NOTHING;'

        const insertedInvoices = await client.query(insertQuery, [])
        console.log(`Seeded ${insertedInvoices.rowCount} invoices`);

        return {
            createTable,
            invoices: insertedInvoices,
        };
    } catch (error) {
        console.error('Error seeding invoices:', error);
        throw error;
    }
}

module.exports = {
    seedInvoices
}