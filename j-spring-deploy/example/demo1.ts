import { AppManager, Pnpm } from '../src';

const appManager = new AppManager({});

const pnpm = appManager.get(Pnpm);

pnpm.printVersion();

appManager.shell.print();
