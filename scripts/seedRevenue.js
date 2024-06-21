const { revenue } = require('../app/lib/placeholder-data.js');

async function seedRevenue(client) {
    try {
        // Create the "revenue" table if it doesn't exist
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS revenue (
            month VARCHAR(4) NOT NULL UNIQUE,
            revenue INT NOT NULL
        );`, []);

        console.log(`Created "revenue" table`);

        // Truncate table
        await client.query(`TRUNCATE TABLE revenue`, []);
        // Insert data into the "revenue" table
        var insertQuery = 'INSERT INTO revenue (month, revenue) VALUES ';
        revenue.map((ele, index) => {
            insertQuery += `('${ele.month}', '${ele.revenue}')`
            if (index !== revenue.length - 1) {
                insertQuery += ', '
            }
        })

        const insertedRevenue = await client.query(insertQuery, [])

        console.log(`Seeded ${insertedRevenue.rowCount} revenue`);

        return {
            createTable,
            revenue: insertedRevenue,
        };
    } catch (error) {
        console.error('Error seeding revenue:', error);
        throw error;
    }
}

module.exports = {
    seedRevenue
}