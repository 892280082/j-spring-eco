import { AppManager, getDockerAppInstance } from '../src';

const appManager = new AppManager({});

const { git, pnpm, builder, pm2 } = getDockerAppInstance(appManager);

const jkDemo = git.cloneOrPull({
  cwd: '/git',
  git: 'https://gitee.com/woaianqi/jk-demo.git',
  user: 'woaianqi',
  password: 'qweasd123!~',
});

pnpm.installDep(jkDemo.projectPath);

builder.build(jkDemo.projectPath);

pm2.start({
  name: 'jkDemo',
  cwd: jkDemo.projectPath,
  file: 'dist/index.js',
  localPort: 8080,
  dockerPort: 3000,
});

appManager.printShellScript();

appManager.publishBySSH({
  host: '192.168.42.168',
  username: 'root',
  password: 'redhat',
});
