import { AppManager, DockerApp } from '../src';

const appManager = new AppManager({});

const git = appManager.get(DockerApp.Git);
const pnpm = appManager.get(DockerApp.Pnpm);
const builder = appManager.get(DockerApp.NodeBuilder);
const pm2 = appManager.get(DockerApp.Pm2);

const jkDemo = git.cloneOrPull({
  cwd: '/git',
  git: 'https://gitee.com/woaianqi/jk-demo.git',
  user: 'woaianqi',
  password: 'qweasd123!~',
});

pnpm.installDep(jkDemo.projectPath);

builder.build(jkDemo.projectPath);

pm2.start({
  cwd: jkDemo.projectPath,
  file: 'dist/index.js',
  localPort: 8080,
  dockerPort: 3000,
});

appManager.shell.print();
