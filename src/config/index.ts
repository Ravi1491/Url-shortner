import 'dotenv/config';

const { NODE_ENV } = process.env;

const env = NODE_ENV || 'development';

export const applicationConfig = {
  app: {
    env: process.env.NODE_ENV,
    isProduction: env === 'base',
    isDevelopment: env === 'development',
    port: process.env.NODE_ENV === 'development' ? '5600' : '3000',
  },

  db: {
    url: process.env.DB_URL,
  },

  jwt: {
    secret: process.env.SERVER_AUTH_JWT_SECRET || 'secret',
    cookieKey: 'url_jwt_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    issuer: process.env.JWT_ISSUER || 'url_shortener',
  },
};
