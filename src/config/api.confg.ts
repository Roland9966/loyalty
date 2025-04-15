// src/config/api.config.ts
type Environment = 'development' | 'test' | 'production';

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const configs: Record<Environment, ApiConfig> = {
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
  },
  test: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
  },
  production: {
    baseURL: 'https://api.yourdomain.com/api', // Valódi éles környezet URL-je
    timeout: 15000,
  },
};

// Alapértelmezett környezet: development vagy a NODE_ENV értéke
const env = (process.env.NODE_ENV || 'development') as Environment;

export default configs[env];