import { DockerApp, DockerHelper } from './Docker';
import path from 'path';

/**
Dockerfile
FROM node:18-alpine3.15
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org
VOLUME ['/app']
WORKDIR /app
 */

export class Pm2 extends DockerApp {
  getImageName(): string {
    return '892280082/pm2:v2';
  }
  printVersion(): void {
    this.getHelper()
      .rm()
      .excute('node -v');
  }
  start(op: {
    name: string;
    cwd: string;
    file: string;
    ports: [number, number];
    dockerHelper?: DockerHelper;
  }) {
    const targetFile = path.join('/app', op.file);

    this.shell.raw(`docker stop ${op.name}`);

    this.getHelper()
      .name(op.name)
      .rm()
      .background()
      .merge(op.dockerHelper)
      .ammountWithWork(op.cwd, '/app')
      .port(op.ports[0], op.ports[1])
      .excute(`pm2-runtime ${targetFile}`);

    this.shell.raw(`docker ps`);
  }
}
