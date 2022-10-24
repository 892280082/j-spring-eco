import { NodeSSH } from 'node-ssh';

export class SSHWrap {
  constructor(public readonly ssh: NodeSSH) {}

  private async exit() {
    this.ssh.execCommand('exit', { cwd: '/' });
  }

  async execute(cmd: string, remark: string, options?: { cwd: string }) {
    const cwd = options?.cwd ?? '/';
    console.log(`${remark} => ${cwd}:${cmd}`);
    const result = await this.ssh.execCommand(cmd, { cwd });
    if (result.code !== 0) {
      console.log(`运行错误:${JSON.stringify(result)}`);
      await this.exit();
      process.exit(1);
    }
    console.log(result.stdout);
  }

  async sendFile(localFile: string, targetFile: string, remark: string) {
    console.log(`${remark}:${localFile} => ${targetFile}`);
    await this.ssh.putFile(localFile, targetFile);
  }

  async exec(cmd: string, args: string[], cwd?: string) {
    const runCwd = cwd ?? '/';
    console.log(`${runCwd}:${cmd}`);
    return await this.ssh.exec(cmd, args, {
      cwd: runCwd,
      stream: 'stdout',
      onStdout(chunk) {
        console.log(chunk.toString('utf8'));
      },
      onStderr(chunk) {
        console.log(chunk.toString('utf8'));
      },
    });
  }
}
