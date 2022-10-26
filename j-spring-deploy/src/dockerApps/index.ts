import { AppManager } from '../AppManager';
import { Git } from './Git';
import { Pnpm } from './Pnpm';
import { NodeBuilder } from './NodeBuilder';
import { Pm2 } from './Pm2';
import { DockerNetwork } from './DockerNetwork';
import { Docker } from './Docker';
import { Nginx } from './Nginx';
import { Mysql } from './Mysql';

export * from './Docker';

export function getDockerApp(appManager: AppManager) {
  const docker = appManager.get(Docker);
  const git = appManager.get(Git);
  const pnpm = appManager.get(Pnpm);
  const builder = appManager.get(NodeBuilder);
  const pm2 = appManager.get(Pm2);
  const dockerNetwork = appManager.get(DockerNetwork);
  const nginx = appManager.get(Nginx);
  const mysql = appManager.get(Mysql);
  return {
    git,
    pnpm,
    builder,
    pm2,
    dockerNetwork,
    docker,
    nginx,
    mysql,
  };
}

export const dockerAppp = {
  Git,
  Pnpm,
  NodeBuilder,
  Pm2,
  DockerNetwork,
  Docker,
  Nginx,
  Mysql,
};
