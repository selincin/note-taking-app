const fs = require('fs');

const envConfigFile = `export interface IEnvironment {
  production: boolean;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  API_NOTES: string;
}

export const baseEnvironment: IEnvironment = {
  production: true,
  SUPABASE_URL: '${process.env['SUPABASE_URL']}',
  SUPABASE_KEY: '${process.env['SUPABASE_KEY']}',
  API_NOTES: '/rest/v1/notes',
};
`;

const targetPath = './src/environments/environment.base.ts';

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);