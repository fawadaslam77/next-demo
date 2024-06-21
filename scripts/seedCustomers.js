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
        var insertQuery = 'INSERT INTO customers (id, name, email, image_url) VALUES ';
        customers.map((ele, index) => {
            insertQuery += `('${ele.id}', '${ele.name}', '${ele.email}', '${ele.image_url}')`
            if (index !== customers.length - 1) {
                insertQuery += ', '
            }
        })
        insertQuery += ' ON CONFLICT (id) DO NOTHING;'
        const insertedCustomers = await client.query(insertQuery, [])
        console.log(`Seeded ${insertedCustomers.rowCount} customers`);

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