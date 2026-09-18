import { IEnvironment, baseEnvironment } from './environment.base';

export const environment: IEnvironment = {
  ...baseEnvironment,
  production: false,
};