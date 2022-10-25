import { DockerApp } from './Docker';

type PnpmInstallDep = {
  prod: boolean; //只安装生产依赖
  noOption: boolean; //不安装可选项
  otherArgs: string; //追加自定义参数
  cnpmProxy: boolean; //淘宝代理
  tecentProxy: boolean; //腾讯代理
  taobaoProxy: boolean; //淘宝代理
  store: string; //缓存目录
  autoBuild: boolean;
};

/***
Dockerfile
FROM node:18-alpine3.15
VOLUME ['/app','/pnpm-store']
RUN npm install pnpm -g --registry https://mirrors.cloud.tencent.com/npm/
RUN pnpm config set store-dir /pnpm-store
WORKDIR /app
 */
export class Pnpm extends DockerApp {
  //存储地

  getImageName(): string {
    return '892280082/pnpm:v3';
  }

  printVersion(): void {
    this.shell.raw(`pnpm version:`);
    this.getHelper()
      .rm()
      .ammountRoot()
      .excute(`pnpm -v`);
  }

  getRunFormatArg(op: PnpmInstallDep): string {
    const str = [];
    !op.autoBuild && str.push('--ignore-scripts');
    op.prod && str.push('--prod');
    op.noOption && str.push('--no-optional');
    //使用代理
    if (op.cnpmProxy) {
      str.push('--registry https://r.cnpmjs.org/');
    } else if (op.tecentProxy) {
      str.push('--registry https://mirrors.cloud.tencent.com/npm/');
    } else if (op.taobaoProxy) {
      str.push('--registry https://registry.npmmirror.com/');
    }
    str.push(op.otherArgs);
    return str.join(' ');
  }

  //安装依赖
  installDep(cwd: string, option?: Partial<PnpmInstallDep>) {
    const op: PnpmInstallDep = {
      prod: false,
      noOption: false,
      otherArgs: '',
      cnpmProxy: false,
      taobaoProxy: false,
      tecentProxy: false,
      store: '${HOME}/pnpm-store',
      autoBuild: false,
    };

    Object.assign(op, option);

    const { shell } = this;

    shell.ifDirExist(
      cwd,
      () => {
        this.getHelper()
          .rm()
          .ammount(cwd, '/app')
          .ammount(op.store, '/pnpm-store')
          .excute(`pnpm install ${this.getRunFormatArg(op)}`);
      },
      () => {
        shell.exit(100, `pnpm error:${cwd} not exist!`);
      }
    );
  }
}
