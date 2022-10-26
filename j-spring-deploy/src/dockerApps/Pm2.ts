import { DockerServeApp, DockerServerOption } from './Docker';

/**
Dockerfile
FROM node:18-alpine3.15
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org
VOLUME ['/app']
WORKDIR /app
 */

type Pm2Option = {
  cwd: string;
  index: string;
};

export class Pm2 extends DockerServeApp {
  public start(op: DockerServerOption & Pm2Option): void {
    this.stop(op.containerName);
    this.getHelperFromOption(op)
      .ammountWithWork(op.cwd, '/app')
      .excute(`pm2-runtime ${op.index}`);
  }
  getImageName(): string {
    return '892280082/pm2:v2';
  }
  printVersion(): void {
    this.getHelper()
      .rm()
      .excute('node -v');
  }
  // start(op: {
  //   name: string;
  //   cwd: string;
  //   file: string;
  //   ports?: [number, number];
  //   network?: NetWorkResult;
  //   dockerHelper?: DockerHelper;
  // }) {
  //   //执行文件
  //   const targetFile = path.join('/app', op.file);
  //   this.shell.raw(`docker stop ${op.name}`);
  //   const h = this.getHelper()
  //     .name(op.name)
  //     .rm()
  //     .background()
  //     .bindNetwork(op.network)
  //     .merge(op.dockerHelper)
  //     .ammountWithWork(op.cwd, '/app');
  //   if (op.ports) {
  //     h.port(op.ports[0], op.ports[1]);
  //   }
  //   h.excute(`pm2-runtime ${targetFile}`);
  // }
}
