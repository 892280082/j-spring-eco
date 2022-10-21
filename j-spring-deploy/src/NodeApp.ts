import { Clazz, LinuxApp } from './LinuxApp';

export class Node extends LinuxApp {
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'node';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [];
  }
  printVersion(): void {
    this.shell.raw('node -v');
  }
  install(): void {
    this.shell.comment('not implements');
  }
}

export class Npm extends LinuxApp {
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'npm';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Node];
  }
  printVersion(): void {
    this.shell.raw('npm -v');
  }
  install(): void {}
}

export class Cnpm extends LinuxApp {
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'cnpm';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Npm];
  }
  printVersion(): void {
    this.shell.raw(`cnpm -v`);
  }
  install(): void {
    this.shell.raw(
      `npm install cnpm -g --registry=https://registry.npm.taobao.org`
    );
  }
}

export class Pnpm extends LinuxApp {
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'pnpm';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Cnpm];
  }
  printVersion(): void {
    this.shell.raw(`pnpm -v`);
  }
  install(): void {
    this.shell.raw(`cnpm install pnpm -g`);
  }

  installDep(op: { cwd: string; prod: boolean; ignoreScript: boolean }): void {
    const { shell } = this;
    const { cwd, prod, ignoreScript } = op;
    shell.ifDirNotExist(cwd, () => {
      shell.echo(`dir:${cwd} not exist`);
      shell.exit(1);
    });
    shell.ifFileNotExist(`${cwd}/package.json`, () => {
      shell.echo(`dir:${cwd} not find package.json`);
      shell.exit(1);
    });
    shell.cd(cwd, () => {
      shell.raw(
        `pnpm install ${prod ? '--prod' : ''} ${
          ignoreScript ? '--ignore-scripts' : ''
        } `
      );
    });
  }
}

export class Pm2 extends LinuxApp {
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'pm2';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Node];
  }
  printVersion(): void {
    this.shell.raw('pm2 -v');
  }
  install(): void {}
}
