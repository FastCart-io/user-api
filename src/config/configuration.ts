export default () => ({
  port: parseInt(process.env.PORT, 10) || 2727,
  database: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USERNAME,
    passwd: process.env.MONGO_PASS,
    dbname: process.env.MONGO_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  client: {},
  cache: {
    host: process.env.REDIS_HOST,
    prot: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS
  }
});
