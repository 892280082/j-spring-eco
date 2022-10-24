import { ShellOption, Shell } from './Shell';
import { Clazz, LinuxApp } from './LinuxApp';

export type AppManagerOption = {};

export class AppManager {
  constructor(options: Partial<AppManagerOption> & Partial<ShellOption>) {
    Object.assign(this.op, options);
    this.shell = new Shell(options);
  }
  /**
   * 默认配置
   */
  op: AppManagerOption = {};

  /**
   * shell命令
   */
  shell: Shell;

  /**
   * 用户指定的map 用于替换依赖
   */
  targetClazzMap: Map<Clazz<LinuxApp>, Clazz<LinuxApp>> = new Map();

  /**
   * 已经安装好的map 避免重复编写安装代码
   */
  isInstallAppMap: Map<Clazz<LinuxApp>, LinuxApp> = new Map();

  get<T extends LinuxApp>(clazz: Clazz<T>): T {
    //优先使用用户指定的类
    const realClazz = this.targetClazzMap.get(clazz) ?? clazz;

    //优先返回缓存
    if (this.isInstallAppMap.has(realClazz))
      return this.isInstallAppMap.get(realClazz) as T;

    const app = new realClazz();

    app.shell = this.shell;
    app.appManager = this;

    //实例化所有依赖
    app.getDepandenceList().forEach(clazz => this.get(clazz));

    //单例的化 放置缓存
    app.isSingleton() && this.isInstallAppMap.set(clazz, app);

    //如果程序需要安装 则执行安装程序
    if (app.isNeedInstall()) {
      this.shell.ifAppNotInstall(app.getCommdName(), app.install.bind(app));
    }

    return app as T;
  }

  printShellScript(){
    console.log(this.shell.toString());
  }
}
