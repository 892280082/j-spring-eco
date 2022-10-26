import { Clazz, LinuxApp } from '../LinuxApp';
import { NetWorkResult } from './DockerNetwork';

export class DockerHelper {
  imageName: string;

  constructor(private readonly dockerApp: DockerApp | undefined) {
    if (dockerApp) {
      this.content.push('docker run');
      this.imageName = dockerApp.getImageName();
    }
  }

  content: string[] = [];

  private addCmd(cmd: string): DockerHelper {
    this.content.push(cmd);
    return this;
  }

  public static create() {
    return new DockerHelper(null as any);
  }

  merge(otherHelper: DockerHelper | undefined) {
    otherHelper && otherHelper.content.forEach(line => this.content.push(line));
    return this;
  }

  it() {
    return this.addCmd('-it');
  }

  background() {
    return this.addCmd('-d');
  }

  rm() {
    return this.addCmd('--rm');
  }

  name(n: string) {
    return this.addCmd(`--name ${n}`);
  }
  ammount(local: string, docker?: string) {
    return this.addCmd(`-v ${local}:${docker ?? local}`);
  }

  ammountRoot() {
    return this.ammount('${HOME}', '/root');
  }

  addWork(dir: string) {
    this.addCmd(`-w ${dir}`);
    return this;
  }

  bindNetwork(network: NetWorkResult) {
    if (network) {
      this.addCmd(`--network ${network.name}`);
    }
    return this;
  }

  ammountWithWork(cwd: string, docker: string) {
    this.ammount(cwd, docker);
    return this.addWork(docker);
  }

  env(key: string, value: string) {
    return this.addCmd(`-e ${key}=${value}`);
  }

  envObject(obj: { [keyof in string]: string }) {
    for (let p in obj) {
      this.env(p, obj[p]);
    }
    return this;
  }

  port(localPort: number, dockerPort?: number) {
    return this.addCmd(`-p ${localPort}:${dockerPort ?? localPort}`);
  }

  portList(ports: [number, number?][]) {
    ports.forEach(p => this.port(p[0], p[1]));
    return this;
  }

  excute(cmd?: string) {
    this.addCmd(`${this.imageName} ${cmd ?? ''}`);
    this.dockerApp?.shell.raw(this.content.join(' '));
  }
}

/**
 * 定义 docker 及安装
 */
export class Docker extends LinuxApp {
  isNeedInstall(): boolean {
    return true;
  }
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'docker';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [];
  }
  printVersion(): void {
    this.shell.raw(`docker -v`);
  }
  install(): void {
    this.shell.raw(
      `curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun`
    );
  }
  stop(dockerName: string) {
    this.shell.rawWithIgnoreError(`docker stop ${dockerName}`);
  }
}

/**
 * 由docker实现的APP 只需要继承dockerApp即可
 *
 * 不需要安装
 */
export abstract class DockerApp extends LinuxApp {
  //单例
  isSingleton(): boolean {
    return true;
  }
  //无需安装
  isNeedInstall(): boolean {
    return false;
  }
  //无安装逻辑
  install(): void {}
  //必须依赖Docker
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Docker];
  }
  //无命令名称 因为docker应用无法在环境变量获取名称
  getCommdName(): string {
    return '';
  }

  getHelper(): DockerHelper {
    return new DockerHelper(this);
  }

  abstract getImageName(): string;

  showRunDockerList() {
    this.shell.raw(`docker ps`);
  }
}

export type DockerServerOption = {
  imageName?: string;
  containerName: string;
  ports?: [number, number?][];
  network?: NetWorkResult;
  dockerHelper?: DockerHelper;
  env?: { [keyof in string]: string };
};

export abstract class DockerServeApp extends DockerApp {
  protected getHelperFromOption(op: DockerServerOption): DockerHelper {
    const h = this.getHelper()
      .rm()
      .background();
    if (op.imageName) {
      h.imageName = op.imageName;
    }
    h.name(op.containerName);
    h.portList(op.ports ?? []);
    h.envObject(op.env ?? {});
    if (op.network) {
      h.bindNetwork(op.network);
    }
    if (op.dockerHelper) {
      h.merge(op.dockerHelper);
    }
    return h;
  }

  public stop(containerName: string): void {
    this.shell.rawWithIgnoreError(`docker stop ${containerName}`);
  }

  public showActiveContainer(): void {
    this.shell.raw(`docker ps`);
  }

  public abstract start(op: DockerServerOption): void;
}
