import path from 'path';
import { DockerApp } from './Docker';

export type CloneResult = {
  projectName: string; //项目名
  projectPath: string; //项目路径
};

export class Git extends DockerApp {
  //单例
  isSingleton(): boolean {
    return false;
  }
  getImageName(): string {
    return 'alpine/git';
  }

  printVersion(): void {
    this.getHelper()
      .rm()
      .print()
      .excute('--version');
  }

  /***
   * 克隆或者更新API
   */
  cloneOrPull(op: {
    cwd: string;
    git: string;
    user?: string;
    password?: string;
  }): CloneResult {
    //项目名称
    const projectName = op.git
      .split('/')
      .pop()
      ?.split('.')[0];

    if (!projectName) {
      throw `git error:无法解析项目名`;
    }

    //git路径增加用户名和密码
    if (op.git.indexOf('https://') === 0 && op.user && op.password) {
      op.git = op.git.replace('https://', `https://${op.user}:${op.password}@`);
    }

    //项目实际路径
    const projectPath = path.join(op.cwd, projectName).replaceAll('\\', '/');

    //存在项目更新
    this.shell.ifDirExist(
      projectPath,
      () => {
        this.getHelper()
          .rm()
          .print()
          .ammountRoot()
          .ammount(projectPath, '/git')
          .excute('pull');
      },
      () => {
        this.getHelper()
          .rm()
          .print()
          .ammountRoot()
          .ammount(op.cwd, '/git')
          .excute(`clone ${op.git}`);
      }
    );

    return {
      projectName,
      projectPath,
    };
  }
}
