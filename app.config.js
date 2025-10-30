const fs = require('fs');
const path = require('path');

// Load .env when present (development). This keeps secrets out of source control when .env is gitignored.
try {
  const dotenvPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }
} catch (e) {
  // ignore
}

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',
    },
  };
};
