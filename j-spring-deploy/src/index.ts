export * from './AppManager';
export * from './LinuxApp';
export * from './Shell';
export * from './dockerApps/Docker';

import { AppManager } from './AppManager';
import { Git } from './dockerApps/Git';
import { Pnpm } from './dockerApps/Pnpm';
import { NodeBuilder } from './dockerApps/NodeBuilder';
import { Pm2 } from './dockerApps/Pm2';
export const DockerApp = {
  Git,
  Pnpm,
  NodeBuilder,
  Pm2,
};
export function getDockerAppInstance(appManager:AppManager){
  const git = appManager.get(DockerApp.Git);
const pnpm = appManager.get(DockerApp.Pnpm);
const builder = appManager.get(DockerApp.NodeBuilder);
const pm2 = appManager.get(DockerApp.Pm2);
  return {
    git,
    pnpm,
    builder,
    pm2
  }
}