const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
        connectTimeout: 60000,
        lazyConnect: true
    }
});

let isRedisConnected = false;

redis.on("error", (err) => {
    isRedisConnected = false;
    throw new Error("❌ Redis error:", err.message);
});

redis.on("connect", () => {
    console.log("✅ Connected to Redis");
    isRedisConnected = true;
});

redis.on("disconnect", () => {
    console.log("⚠️ Redis disconnected");
    isRedisConnected = false;
});

redis.on("ready", () => {
    console.log("🚀 Redis ready for commands");
    isRedisConnected = true;
});

// Connect Redis
(async () => {
    try {
        await redis.connect();
    } catch (error) {
        console.error("❌ Failed to connect to Redis:", error.message);
    }
})();

module.exports = { redis, 
    getStatus:()=>isRedisConnected };