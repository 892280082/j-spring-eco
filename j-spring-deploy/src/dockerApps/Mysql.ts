import { DockerServeApp, DockerServerOption } from './Docker';

export type MysqlOption = {
  logDir: string;
  dataDir: string;
  configDir: string;
  rootPassword: string;
};

export class Mysql extends DockerServeApp {
  public start(op: DockerServerOption & MysqlOption): void {
    this.stop(op.containerName);
    this.getHelperFromOption(op)
      .ammount(op.logDir, '/logs')
      .ammount(op.configDir, '/etc/mysql/conf')
      .ammount(op.dataDir, '/var/lib/mysql')
      .env('MYSQL_ROOT_PASSWORD', op.rootPassword)
      .excute();
  }
  getImageName(): string {
    return 'mysql:5.5';
  }
  printVersion(): void {}
}
