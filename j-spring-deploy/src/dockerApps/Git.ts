import path from 'path';
import { Shell } from '../Shell';
import { DockerApp } from './Docker';

type GitMeta = {
  projectName: string;
  git: string;
  projectPath: string;
};

type GitOption = {
  cwd: string;
  git: string;
  user?: string;
  password?: string;
};

export class GitCloneResult {
  constructor(
    public readonly projectName: string,
    public readonly projectPath: string,
    public readonly shell: Shell
  ) {}

  safeCopy(source: string, targetDir: string) {
    this.shell.copy(this.safeJoin(source), targetDir);
  }

  safeJoin(targetPath: string) {
    const realPath = path.join(this.projectPath, targetPath);
    this.shell.ifPathNotExist(realPath, () => {
      this.shell.exit(1, `git: ${realPath} path not exist `);
    });
    return realPath;
  }
}

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
      .excute('--version');
  }

  private analyGitOption(op: GitOption): GitMeta {
    //项目名称
    const projectName = op.git
      .split('/')
      .pop()
      ?.split('.')[0];

    if (!projectName) {
      throw `git error:无法解析项目名`;
    }

    //实际clone地址
    let git = op.git;

    //git路径增加用户名和密码
    if (op.git.indexOf('https://') === 0 && op.user && op.password) {
      git = op.git.replace(
        'https://',
        `https://${encodeURIComponent(op.user)}:${encodeURI(op.password)}@`
      );
    }

    //项目实际路径
    const projectPath = path.join(op.cwd, projectName);
    return { projectName, git, projectPath };
  }

  clone(op: GitOption): GitCloneResult {
    const { projectPath } = this.analyGitOption({ ...op });
    this.shell.ifDirExist(projectPath, () => {
      this.shell.rm(projectPath);
    });
    return this.cloneOrPull(op);
  }

  /***
   * 克隆或者更新API
   */
  cloneOrPull(op: GitOption): GitCloneResult {
    const { projectName, projectPath, git } = this.analyGitOption(op);

    //存在项目更新
    this.shell.ifDirExist(
      projectPath,
      () => {
        this.getHelper()
          .rm()
          .ammountRoot()
          .ammount(projectPath, '/git')
          .excute('pull');
      },
      () => {
        this.getHelper()
          .rm()
          .ammountRoot()
          .ammount(op.cwd, '/git')
          .excute(`clone '${git}'`);
      }
    );

    return new GitCloneResult(projectName, projectPath, this.shell);
  }
}
