const fs = require('fs');

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseKey = process.env['SUPABASE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL or SUPABASE_KEY environment variable is missing!');
  process.exit(1);
}

const envConfigFile = `export interface IEnvironment {
  production: boolean;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  API_NOTES: string;
}

export const baseEnvironment: IEnvironment = {
  production: true,
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_KEY: ${JSON.stringify(supabaseKey)},
  API_NOTES: '/rest/v1/notes',
};
`;

const targetPath = './src/environments/environment.base.ts';

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);