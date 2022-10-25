import { AppManager, getDockerAppInstance } from '../src';

const appManager = new AppManager({});

const { git, pnpm, pm2 } = getDockerAppInstance(appManager);

const jkDemo = git.cloneOrPull({
  cwd: '/git',
  git: 'https://gitee.com/woaianqi/jk-demo.git',
  user: 'woaianqi',
  password: 'qweasd123!~',
});

pnpm.installDep(jkDemo.projectPath, { tecentProxy: true, autoBuild: true });

pm2.start({
  name: 'jkDemo',
  cwd: jkDemo.projectPath,
  file: 'dist/index.js',
  ports: [8080, 3000],
});

pm2.start({
  name: 'jkDemo2',
  cwd: jkDemo.projectPath,
  file: 'dist/index.js',
  ports: [8090, 3000],
});

appManager.printShellScript();

// appManager.publishBySSH({
//   host: '192.168.42.168',
//   username: 'root',
//   password: 'redhat',
// });
