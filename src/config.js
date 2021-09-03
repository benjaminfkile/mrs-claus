module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    STRIPE_KEY: process.env.STRIPE_KEY,
    STRIPE_TEST_KEY: process.env.STRIPE_TEST_KEY
}