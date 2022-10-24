import { DockerApp } from './Docker';

export class NodeBuilder extends DockerApp {
  getImageName(): string {
    return 'node:18-alpine3.15';
  }
  printVersion(): void {
    this.getHelper()
      .rm()
      .print()
      .excute('-v');
  }

  build(cwd: string) {
    this.getHelper()
      .rm()
      .print()
      .ammountRoot()
      .ammountWithWork(cwd, '/app')
      .excute(`npm run build`);
  }
}
