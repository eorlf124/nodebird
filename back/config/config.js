const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "nodebird",
    "host": "lw.dsmynas.com",
    "port": "54330",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "nodebird",
    "host": "lw.dsmynas.com",
    "port": "54330",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "nodebird",
    "host": "lw.dsmynas.com",
    "port": "54330",
    "dialect": "mysql"
  }
}
