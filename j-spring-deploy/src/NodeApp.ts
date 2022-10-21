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
}
