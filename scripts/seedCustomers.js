const { customers } = require('../app/lib/placeholder-data.js');

async function seedCustomers(client) {
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, []);

        // Create the "customers" table if it doesn't exist
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            image_url VARCHAR(255) NOT NULL
      );`, []);

        console.log(`Created "customers" table`);

        // Truncate table
        await client.query(`TRUNCATE TABLE customers`, []);
        // Insert data into the "customers" table
        const insertedCustomers = await Promise.all(
            customers.map(
                (customer) => client.query(`
        INSERT INTO customers (id, name, email, image_url)
        VALUES ('${customer.id}', '${customer.name}', '${customer.email}', '${customer.image_url}')
        ON CONFLICT (id) DO NOTHING;`, []))
        );

        console.log(`Seeded ${insertedCustomers.length} customers`);

        return {
            createTable,
            customers: insertedCustomers,
        };
    } catch (error) {
        console.error('Error seeding customers:', error);
        throw error;
    }
}

module.exports = {
    seedCustomers
}