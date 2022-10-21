import path from 'path';

export type ShellOption = {
  tempDir: string;
};

function checkPathIsAbsoulte(cwd: string) {
  if (path.isAbsolute(cwd)) {
    throw `路径：${cwd} 必须传入绝对路径`;
  }
}

export class Shell {
  constructor(options: Partial<ShellOption>) {
    Object.assign(this.op, options);
    this.ifDirNotExist(this.op.tempDir, () => {
      this.mkdir(this.op.tempDir);
    });
  }

  op: ShellOption = {
    tempDir: '/temp/appManagerTemp/',
  };

  //所有内容
  content: string[] = [];

  //制表符数量
  deep: number = 0;

  //原生输出
  raw(cmd: string) {
    this.content.push(`${this.getShiltTable()}${cmd}`);
  }

  //获取制表符
  getShiltTable() {
    return Array(this.deep)
      .fill('\t')
      .join('');
  }

  shiftWrapFn(fn: Function) {
    this.deep++;
    fn();
    this.deep--;
  }

  //打印脚本
  toString() {
    return this.content.join('\n');
  }

  print() {
    console.log(this.toString());
  }

  if(cmd: string, fn: Function) {
    this.raw(`if [ ${cmd} ]; then`);
    this.shiftWrapFn(fn);
    this.raw(`fi`);
  }

  /*************************      封装shell命令    *************************** */

  //添加注释
  comment(str: string) {
    this.raw(`# ${str}`);
  }

  //返回文件 下载的绝对路径
  wget(url: string, cwd?: string): string {
    cwd && checkPathIsAbsoulte(cwd);
    const finalPath = cwd ?? this.op.tempDir;
    const filePath = url.split('/').pop();
    this.raw(`wget ${url} -O ${finalPath}`);
    return path.join(finalPath, filePath || '');
  }

  //如果APP没有安装
  ifAppNotInstall(appName: string, installFn: Function) {
    this.if(`! $(command -v ${appName})`, installFn);
  }

  ifDirNotExist(dir: string, fn: Function) {
    this.if(`! -d ${dir}`, fn);
  }

  ifFileNotExist(dir: string, fn: Function) {
    this.if(`! -f ${dir}`, fn);
  }

  mkdir(dir: string) {
    this.raw(`mkdir ${dir}`);
  }

  cd(cwd: string, fn?: Function) {
    this.raw(`cd ${cwd}`);

    if (fn) {
      this.shiftWrapFn(fn);
      this.raw(`cd -`);
    }
  }

  echo(dir: string) {
    this.raw(`echo ${dir}`);
  }

  exit(code: number) {
    this.raw(`exit ${code}`);
  }
}
