import { DockerApp } from './Docker';

export class NetWorkResult {
  constructor(public readonly name: string) {}
}

export class DockerNetwork extends DockerApp {
  getImageName(): string {
    return '';
  }
  printVersion(): void {
    throw '';
  }
  createNetwork(network: string) {
    this.shell.rawWithIgnoreError(`docker network create ${network}`);
    return new NetWorkResult(network);
  }

  useHostNetwork() {
    return new NetWorkResult('host');
  }
}
