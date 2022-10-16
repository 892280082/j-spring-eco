import {
  Autowired,
  BeanDefine,
  BeanPostProcessor,
  Component,
  createDebugLogger,
  getBeanDefineByBean,
} from 'j-spring';
import { Controller } from './springWebAnnotation';
import { ControllerBeanConfiguration } from './springWebRouterDelegate';
import {
  ExpressLoad,
  isExpressConfiguration,
  SpringWebExceptionHandler,
  isSpringWebExceptionHandler,
} from './springWebExtends';
import { SpringWebExceptionHandlerConfigration } from './springWebConfiguration';
import {
  paramEnhanceInterceptorList,
  isParamEnhanceInterceptor,
} from './paramEnhanceInterceptor';
import {
  isRouterEnhanceInterceptor,
  routeEnhanceInterceptor,
} from './routerEnhanceInterceptor';

const logger = createDebugLogger('WebBeanProcessor:');

//解析的bean集合
const configureBeanList = new Set<ExpressLoad>();

//运行结束时清空
export const loadConfiguration = (app: any) => {
  let i = 0;
  configureBeanList.forEach(config => {
    const bd = getBeanDefineByBean(config);
    if (bd) {
      logger(`${++i}:  express 配置类:${bd.clazz.name}`);
    } else if (config instanceof ControllerBeanConfiguration) {
      logger(`${++i}: controller 路由解析类:${config.bd.clazz.name}`);
    }
    config.load(app);
  });
  configureBeanList.clear();
};

/**
 * 用于设置express的配置
 *
 */
@Component()
export class ExpressAppEnhanceBeanProcessor implements BeanPostProcessor {
  getSort(): number {
    return 99;
  }

  count: 0;

  postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
    return bean;
  }

  postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {
    if (isExpressConfiguration(bean)) {
      configureBeanList.add(bean);
    }

    return bean;
  }
}

/**
 * 用于设置express的路由
 */
@Component()
export class ControllerBeanProcessor implements BeanPostProcessor {
  @Autowired({ type: isSpringWebExceptionHandler, force: false })
  exceptionHanlder: SpringWebExceptionHandler = new SpringWebExceptionHandlerConfigration();

  getSort(): number {
    return 100;
  }

  postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
    return bean;
  }

  postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object {
    if (beanDefine.hasAnnotation(Controller)) {
      configureBeanList.add(
        new ControllerBeanConfiguration(
          bean,
          beanDefine,
          () => this.exceptionHanlder
        )
      );
    }

    return bean;
  }
}

/**
 * 用于设置express router中参数的处理器
 */
@Component()
export class SpringParamterBeanPostProcessor implements BeanPostProcessor {
  getSort(): number {
    return 100;
  }
  postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
    return bean;
  }
  postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {
    if (isParamEnhanceInterceptor(bean)) {
      paramEnhanceInterceptorList.push(bean);
    }
    return bean;
  }
}
/***
 * 结果处理后置处理器
 */

@Component()
export class SpringResultOperatePostProcessor implements BeanPostProcessor {
  getSort(): number {
    return 100;
  }
  postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
    return bean;
  }
  postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {
    if (isRouterEnhanceInterceptor(bean)) {
      routeEnhanceInterceptor.push(bean);
    }
    return bean;
  }
}
