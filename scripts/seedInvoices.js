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
        // Insert data into the "invoices" table
        const insertedInvoices = await Promise.all(
            invoices.map(
                (invoice) => client.query(`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('${invoice.customer_id}', '${invoice.amount}', '${invoice.status}', '${invoice.date}')
        ON CONFLICT (id) DO NOTHING;`, []))
        );

        console.log(`Seeded ${insertedInvoices.length} invoices`);

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