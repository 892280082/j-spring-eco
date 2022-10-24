import { DockerApp } from './Docker';

type PnpmInstallDep = {
  prod: boolean; //只安装生产依赖
  noOption: boolean; //不安装可选项
  otherArgs: string;
};

export class Pnpm extends DockerApp {
  //存储地

  getImageName(): string {
    return 'nospy/pnpm:14-alpine';
  }

  printVersion(): void {
    this.shell.raw(`pnpm version:`);
    this.getHelper()
      .rm()
      .print()
      .ammountRoot()
      .excute(`pnpm -v`);
  }

  getRunFormatArg(option?: Partial<PnpmInstallDep>): string {
    const op: PnpmInstallDep = {
      prod: false,
      noOption: false,
      otherArgs: '',
    };

    Object.assign(op, option);
    const str = ['--ignore-scripts']; //只做编译工作 一个docker 一个任务
    op.prod && str.push('--prod');
    op.noOption && str.push('--no-optional');
    str.push(op.otherArgs);
    return str.join(' ');
  }

  //安装依赖
  installDep(cwd: string, option?: Partial<PnpmInstallDep>) {
    const { shell } = this;
    shell.ifDirExist(
      cwd,
      () => {
        this.getHelper()
          .rm()
          .print()
          .ammountRoot()
          .ammount(cwd, '/app')
          .excute(`pnpm install ${this.getRunFormatArg(option)}`);
      },
      () => {
        shell.exit(100, `Pnpm:cwd ${cwd} not exist!`);
      }
    );
  }
}
