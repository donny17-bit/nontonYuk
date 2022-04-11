const redis = require("redis");

const client = redis.createClient({
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD,
  // host: "127.0.0.1",
  // port: 6379,
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're now connected db redis ...");
  });
})();

module.exports = client;
