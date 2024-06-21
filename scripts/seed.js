const DbConnect = require('./dbConfig');
const { seedUsers } = require('./seedUsers');
const { seedInvoices } = require('./seedInvoices');
const { seedCustomers } = require('./seedCustomers');
const { seedRevenue } = require('./seedRevenue');
const { sql } = require('@vercel/postgres');

async function main() {
  const client = sql

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
  await client.end();
  return 'success'
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});

