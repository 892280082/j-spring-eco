import { DockerServeApp, DockerServerOption } from './Docker';

export type NginxOption = {
  logDir: string;
  configFile: string;
  configDir: string;
};

export class Nginx extends DockerServeApp {
  public start(op: DockerServerOption & NginxOption): void {
    this.stop(op.containerName);
    this.getHelperFromOption(op)
      .ammount(op.logDir, '/var/log/nginx/')
      .ammount(op.configDir, '/etc/nginx/conf.d')
      .ammount(op.configFile, '/etc/nginx/nginx.conf')
      .excute();
  }
  getImageName(): string {
    return 'frekele/nginx:1.10.3';
  }
  printVersion(): void {}
}
