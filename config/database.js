import { Sequelize } from "sequelize";

const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    dialect: "sqlite",
    storage: "./db/contacts_dev.sqlite",
    logging: console.log,
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

const sequelize = new Sequelize(config[env]);

export default sequelize;
