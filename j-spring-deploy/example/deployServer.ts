import { getDockerApp, AppManager, DockerHelper } from '../src';

export const appManager = new AppManager({});

/**
 * 获取部署APP 依赖docker
 * 只要使用任意app，都会在脚本头部添加安装docker的依赖shell脚本，方便一键部署。
 */
const { git, dockerNetwork, pnpm, pm2, nginx, mysql } = getDockerApp(
  appManager
);

//第一步：克隆或者更新项目地址
export const jkDemo = git.cloneOrPull({
  cwd: '/git',
  git: 'https://gitee.com/woaianqi/jk-demo.git',
  user: 'woaianqi',
  password: 'qweasd123!~',
});

//第二步：安装依赖并构建
pnpm.installDep(jkDemo.projectPath, { tecentProxy: true, autoBuild: true });

//第三步：创建桥接网络
export const network = dockerNetwork.createNetwork('testjob');

//第四步：启动一个mysql
mysql.start({
  containerName: 'mysql2',
  network,
  logDir: '/appLogs/mysql/log',
  dataDir: '/mysql/data',
  ports: [[6606, 3306]],
  configDir: jkDemo.safeJoin('deploy/mysql/conf'),
  rootPassword: 'dsfgzxczsdfasefrasd234',
});

//第五步：启动node服务 冗余1
pm2.start({
  containerName: 'jkDemo',
  network,
  dockerHelper: DockerHelper.create().ammount('/appLogs/jkDemo', '/log'), //追加额外的目录挂载
  env: { containerName: 'jkDemo' }, //对node项目添加环境变量， 用于API提示数据来源。
  cwd: jkDemo.projectPath,
  index: 'dist/index.js',
});

//启动node服务 冗余2
pm2.start({
  containerName: 'jkDemo2',
  network,
  dockerHelper: DockerHelper.create().ammount('/appLogs/jkDemo2', '/log'),
  env: { containerName: 'jkDemo2' },
  cwd: jkDemo.projectPath,
  index: 'dist/index.js',
});

//第六步：启动Nginx
nginx.start({
  containerName: 'nginx2',
  network,
  ports: [[80]],
  logDir: '/appLogs/nginx/log',
  configFile: jkDemo.safeJoin('deploy/nginx/nginx.conf'),
  configDir: jkDemo.safeJoin('deploy/nginx/conf'),
});

//第七步：展示活跃的docker容器
pm2.showActiveContainer();

//第八步：控制台打印输出的shell脚本
appManager.printShellScript();

//第九步：发送到对方服务器部署
appManager.publishBySSH({
  host: '192.168.42.168',
  username: 'root',
  password: 'redhat',
});
