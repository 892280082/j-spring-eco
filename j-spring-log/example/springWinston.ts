import { spring, Component, SpringStarter, Logger, Autowired } from 'j-spring'
import { ClazzExtendsMap } from 'j-spring/dist/SpringFactry'
import { WinstonLog } from '../src'


@Component()
class Application implements SpringStarter {

    @Autowired()
    log:Logger;


    isSpringStater(): boolean {
        return true;
    }

    async doStart(clazzMap: ClazzExtendsMap): Promise<any> {

        this.log.info('我启动成功了哦');

        this.log.warn('这样其实不太好吧')

        console.log("启动了");

    }

}

const config = {
    'j-spring': {
        log: {
            level: 'debug',
            fileName:'ww.log'
        }
    }
}

spring.loadConfig(config).loadLogger(WinstonLog).bind(Application).invokeStarter();