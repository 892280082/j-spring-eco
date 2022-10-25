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
    // this.ifDirNotExist(this.op.tempDir, () => {
    //   this.mkdir(this.op.tempDir);
    // });
  }

  op: ShellOption = {
    tempDir: '/temp/appManagerTemp/',
  };

  //所有内容
  content: string[] = ['#!/bin/bash'];

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
    return this.content.join('\n').replaceAll('\\', '/');
  }

  print() {
    console.log(this.toString());
  }

  if(cmd: string, fn: Function, elseFn?: Function) {
    this.raw(`if [ ${cmd} ]; then`);
    this.shiftWrapFn(fn);
    if (elseFn) {
      this.raw(`else`);
      this.shiftWrapFn(elseFn);
    }
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

  ifAppInstall(appName: string, installFn: Function, elseFn?: Function) {
    this.if(`$(command -v ${appName})`, installFn, elseFn);
  }

  ifAppNotInstall(appName: string, installFn: Function) {
    this.if(`! $(command -v ${appName})`, installFn);
  }

  ifDirExist(dir: string, fn: Function, elseFn?: Function) {
    this.if(`-d ${dir}`, fn, elseFn);
  }

  ifDirNotExist(dir: string, fn: Function) {
    this.if(`! -d ${dir}`, fn);
  }

  ifFileExist(dir: string, fn: Function, elseFn?: Function) {
    this.if(`-f ${dir}`, fn, elseFn);
  }

  ifFileNotExist(dir: string, fn: Function) {
    this.if(`! -f ${dir}`, fn);
  }

  mkdir(dir: string) {
    this.raw(`mkdir ${dir}`);
  }
  rm(target: string) {
    this.raw(`rm -rf ${target}`);
  }

  copy(source: string, targetDir: string) {
    this.ifDirExist(
      targetDir,
      () => {
        this.rm(targetDir);
      },
      () => {
        this.mkdir(targetDir);
      }
    );

    //源 是目录
    this.ifDirExist(
      source,
      () => {
        //递归复制目录
        this.raw(`cp -R ${source} ${targetDir}`);
      },
      () => {
        //源如果是文件
        this.ifFileExist(
          source,
          () => {
            //复制文件
            this.raw(`cp ${source} ${targetDir}`);
          },
          () => {
            //报错
            this.exit(1, `file not exist ${source}`);
          }
        );
      }
    );
  }

  cd(cwd: string, fn?: Function) {
    this.raw(`cd ${cwd}`);

    if (fn) {
      this.shiftWrapFn(fn);
      this.raw(`cd -`);
    }
  }

  echo(dir: string) {
    this.raw(`echo '${dir}'`);
  }

  exit(code: number, msg?: string) {
    if (msg) {
      this.echo(msg);
    }
    this.raw(`exit ${code}`);
  }
}
