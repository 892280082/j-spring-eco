import { AppManager } from '../AppManager';
import { Git } from './Git';
import { Pnpm } from './Pnpm';
import { NodeBuilder } from './NodeBuilder';
import { Pm2 } from './Pm2';

export * from './Docker';

export function getDockerAppInstance(appManager: AppManager) {
  const git = appManager.get(Git);
  const pnpm = appManager.get(Pnpm);
  const builder = appManager.get(NodeBuilder);
  const pm2 = appManager.get(Pm2);
  return {
    git,
    pnpm,
    builder,
    pm2,
  };
}
