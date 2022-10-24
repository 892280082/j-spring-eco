import { DockerApp } from './Docker';
import path from 'path';

export class Pm2 extends DockerApp {
  getImageName(): string {
    return '892280082/pm2:node18';
  }
  printVersion(): void {
    this.getHelper()
      .rm()
      .print()
      .excute('node -v');
  }
  start(op: {
    cwd: string;
    file: string;
    localPort: number;
    dockerPort: number;
  }) {
    const targetFile = path.join('/app', op.file).replaceAll('\\', '/');
    this.getHelper()
      .rm()
      .print()
      .ammountRoot()
      .ammountWithWork(op.cwd, '/app')
      .port(op.localPort, op.dockerPort)
      .excute(`pm2-runtime ${targetFile}`);
  }
}
