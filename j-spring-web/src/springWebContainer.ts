import express from 'express';
import { Component, Value, SpringStarter, Logger } from 'j-spring';
import { ExpressApp, ExpressServer } from './springReflectType';
import { loadConfiguration } from './springWebBeanProcessor';
import { ClazzExtendsMap } from 'j-spring/dist/SpringFactry';

@Component()
export class SpringWebStarter implements SpringStarter {
  @Value({ path: 'j-spring-web.port', force: false })
  port: number = 3000;

  //日志
  log: Logger;

  async doStart(clazzMap: ClazzExtendsMap): Promise<any> {
    const app = express();

    clazzMap.addBean(ExpressApp, app, '添加express实例');

    loadConfiguration(app);

    const startWeb = () =>
      new Promise((ok, _err) => {
        const expressServer = app.listen(this.port, () => {
          // tslint:disable-next-line:no-console
          console.log(`server started at http://localhost:${this.port}`);
          ok('ok');
        });
        clazzMap.addBean(
          ExpressServer,
          expressServer,
          '添加express-server实例'
        );
      });
    await startWeb();
  }

  isSpringStater(): boolean {
    return true;
  }
}
