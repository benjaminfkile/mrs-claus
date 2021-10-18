module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_KEY: process.env.STRIPE_KEY,
    STRIPE_TEST_KEY: process.env.STRIPE_TEST_KEY
}