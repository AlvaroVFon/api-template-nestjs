export const EnvConfig = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'postgres',
  dbPort: process.env.DB_PORT || '5432',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || '6379',
});
