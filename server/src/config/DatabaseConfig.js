import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Destructure environment variables
const {
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

// Initialize Sequelize
const Database = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Disable SSL validation
    },
  },
});

// Test the connection
const testConnection = async () => {
  try {
    await Database.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
testConnection();

//Sync database
// const syncDatabase = async () => {
//   try {
//     await Database.sync({ force: false }); // Set force: true to reset tables
//     console.log('Database synced successfully.');
//   } catch (error) {
//     console.error('Error syncing database:', error);
//   }
// };

// syncDatabase();

// Add global hook for trimming input strings
Database.addHook('beforeValidate', (instance) => {
  for (const key in instance.dataValues) {
    if (typeof instance.dataValues[key] === 'string') {
      instance.dataValues[key] = instance.dataValues[key].trim();
    }
  }
});

export default Database;