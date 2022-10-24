import { ShellOption, Shell } from './Shell';
import { Clazz, LinuxApp } from './LinuxApp';
import fs from 'fs-extra';
import appRootPath from 'app-root-path';
import path from 'path';
import { NodeSSH, Config as SSH_CONFIG } from 'node-ssh';
import { SSHWrap } from './SSHWrap';
import { to } from 'to-await';

export type AggregationOption = {
  build?: Partial<BuildOption>;
  shell?: Partial<ShellOption>;
};

export type BuildOption = {
  dist: string;
  remoteDir: string;
};

export class AppManager {
  constructor(options: AggregationOption) {
    this.shell = new Shell(options.shell ?? {});
    const defaultBuildOption: BuildOption = {
      dist: './publish',
      remoteDir: '/temp',
    };
    this.build = Object.assign(defaultBuildOption, options.build ?? {});
  }

  /**
   * 构建选项
   */
  build: BuildOption;

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

  printShellScript() {
    console.log(this.shell.toString());
  }

  /** 保存文件 */
  putFile(filePath: string, op?: { removeIt: boolean }) {
    let content = this.shell.toString();
    if (op?.removeIt) {
      content = content.replaceAll(' -it ', ' ');
    }
    fs.outputFileSync(filePath, content, {
      encoding: 'utf-8',
    });
  }

  async publishBySSH(sshConfig: SSH_CONFIG) {
    const [err, ssh] = await to(new NodeSSH().connect(sshConfig));
    if (err) {
      console.log(`登录错误!`);
      throw err;
    }
    await this.publish(ssh);
  }

  async publish(ssh?: NodeSSH) {
    const publishPath = appRootPath.resolve(this.build.dist);
    if (fs.pathExistsSync(publishPath)) {
      fs.emptyDirSync(publishPath);
    }
    fs.ensureDirSync(publishPath);

    //本地执行文件
    const shellFileName = `shell${~~(Math.random() * 1000000000)}.sh`;
    const localShellFilePath = path.join(publishPath, shellFileName);

    //远程执行文件
    const remoteDir = this.build.remoteDir;
    const remoteShellFile = `${remoteDir}/${shellFileName}`;

    //创建shell文件 去除交互
    this.putFile(localShellFilePath, { removeIt: true });
    if (ssh) {
      const sshwarp = new SSHWrap(ssh);

      await sshwarp.execute(
        `if [ ! -d /${remoteDir} ]; then mkdir ${remoteDir}; fi`,
        '创建运行目录'
      );

      await sshwarp.sendFile(
        localShellFilePath,
        remoteShellFile,
        '发送执行脚本文件'
      );

      //console.log('执行脚本:');
      const [err] = await to(sshwarp.exec(`sh ${remoteShellFile}`, []));

      err && console.log(`存在警告或错误:${err}`);

      await sshwarp.execute(`exit 0`, '登出');

      process.exit(0);
    }
  }
}
