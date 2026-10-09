require('dotenv').config();
const mysql = require('mysql2/promise');

function getSslConfig() {
  if (process.env.DB_SSL === 'false' || process.env.DB_SSL === '0') {
    return undefined;
  }
  if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1' || process.env.DB_CA) {
    const ssl = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    };
    if (process.env.DB_CA) {
      ssl.ca = process.env.DB_CA;
    }
    return ssl;
  }
  // Remote host in production defaults to TLS/SSL
  if (process.env.NODE_ENV === 'production' && process.env.DB_HOST && !['127.0.0.1', 'localhost'].includes(process.env.DB_HOST)) {
    return {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    };
  }
  return undefined;
}

const poolConfig = {
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ssl: getSslConfig()
};

let pool;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL || process.env.MYSQL_URL, poolConfig);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'jis_db',
    ...poolConfig
  });
}

module.exports = pool;
