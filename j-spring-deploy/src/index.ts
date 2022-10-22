export * from './AppManager';
export * from './LinuxApp';
export * from './Shell';
export * from './apps/Docker';

import { Git } from './apps/Git';
import { Pnpm } from './apps/Pnpm';
import { NodeBuilder } from './apps/NodeBuilder';
import { Pm2 } from './apps/Pm2';
export const DockerApp = {
  Git,
  Pnpm,
  NodeBuilder,
  Pm2,
};
