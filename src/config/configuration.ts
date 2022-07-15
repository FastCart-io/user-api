export default () => ({
  port: parseInt(process.env.PORT, 10) || 2727,
  database: {

    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USERNAME,
    passwd: process.env.MONGO_PASS,
    dbname: process.env.MONGO_DATABASE
  },
  jwt: { secret: process.env.JWT_SECRET },
  client: {}
});
