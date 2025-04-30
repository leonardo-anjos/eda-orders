import app from './app';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`[api] order-service UP`);
    });
  } catch (error) {
    console.error(`[api] order-service DOWN`, error);
    process.exit(1);
  }
})();