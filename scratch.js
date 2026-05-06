import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log(env.VITE_AI_API_KEY, env.VITE_OPENAI_API_KEY, env.VITE_AI_BASE_URL);
