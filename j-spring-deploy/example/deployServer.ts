import { getDockerApp, AppManager, DockerHelper } from '../src';

export const appManager = new AppManager({});

const { git, dockerNetwork, pnpm, pm2, nginx, mysql } = getDockerApp(
  appManager
);

//克隆或者更新项目地址
export const jkDemo = git.cloneOrPull({
  cwd: '/git',
  git: 'https://gitee.com/woaianqi/jk-demo.git',
  user: 'woaianqi',
  password: 'qweasd123!~',
});

//创建桥接网络
export const network = dockerNetwork.createNetwork('testjob');

//安装依赖并构建
pnpm.installDep(jkDemo.projectPath, { tecentProxy: true, autoBuild: true });

//启动一个mysql
mysql.start({
  containerName: 'mysql2',
  network,
  logDir: '/appLogs/mysql/log',
  dataDir: '/mysql/data',
  ports: [[6606, 3306]],
  configDir: jkDemo.safeJoin('deploy/mysql/conf'),
  rootPassword: 'dsfgzxczsdfasefrasd234',
});

//启动node服务 冗余1
pm2.start({
  containerName: 'jkDemo',
  network,
  env: { containerName: 'jkDemo' },
  cwd: jkDemo.projectPath,
  index: 'dist/index.js',
});

//启动node服务 冗余2
pm2.start({
  containerName: 'jkDemo2',
  network,
  env: { containerName: 'jkDemo2' },
  cwd: jkDemo.projectPath,
  index: 'dist/index.js',
});

//启动Nginx
nginx.start({
  containerName: 'nginx2',
  network,
  ports: [[80]],
  logDir: '/appLogs/nginx/log',
  configFile: jkDemo.safeJoin('deploy/nginx/nginx.conf'),
  configDir: jkDemo.safeJoin('deploy/nginx/conf'),
});

pm2.showActiveContainer();

appManager.printShellScript();

appManager.publishBySSH({
  host: '192.168.42.168',
  username: 'root',
  password: 'redhat',
});
