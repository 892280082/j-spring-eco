import { spring, Component, SpringStarter, Value } from 'j-spring'
import { ClazzExtendsMap } from 'j-spring/dist/SpringFactry'
import { WinstonLog } from '../src'


@Component()
class Application implements SpringStarter {



    isSpringStater(): boolean {
        return true;
    }

    async doStart(clazzMap: ClazzExtendsMap): Promise<any> {

        console.log("启动了");

    }

}

const config = {
    'j-spring': {
        log: {
            state: 'on',
            level: 'debug',
            fileName:'ww.log'
        }
    }
}

spring.loadConfig(config).loadLogger(WinstonLog).bind(Application).invokeStarter();