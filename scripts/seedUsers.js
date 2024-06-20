const { users } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcryptjs');

async function seedUsers(client) {
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, []);
        // Create the "users" table if it doesn't exist
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );`, []);

        console.log(`Created "users" table`);

        // Truncate table
        await client.query(`TRUNCATE TABLE users`, []);
        // Insert data into the "users" table
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const query = `INSERT INTO users (id, name, email, password)
                VALUES ('${user.id}', '${user.name}', '${user.email}', '${hashedPassword}')
                ON CONFLICT (id) DO NOTHING;`

                console.log(query)
                return client.query(query, []);
            }),
        );

        console.log(`Seeded ${insertedUsers.length} users`);

        return {
            createTable,
            users: insertedUsers,
        };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}

module.exports = {
    seedUsers
}