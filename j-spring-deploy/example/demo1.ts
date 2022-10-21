import { AppManager, Pnpm, Pm2 } from '../src';

const appManager = new AppManager({});

const pnpm = appManager.get(Pnpm);

pnpm.printVersion();

pnpm.installDep({ cwd: '/etc/node', prod: true, ignoreScript: true });

appManager.shell.print();
