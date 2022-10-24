import { DockerApp } from './Docker';

export class NodeBuilder extends DockerApp {
  getImageName(): string {
    return 'node:18-alpine3.15';
  }
  printVersion(): void {
    this.getHelper()
      .rm()
      .excute('-v');
  }

  build(cwd: string) {
    this.getHelper()
      .rm()
      .ammountRoot()
      .ammountWithWork(cwd, '/app')
      .excute(`npm run build`);
  }
}
