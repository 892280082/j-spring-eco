import {
  ControllerBeanProcessor,
  ExpressAppEnhanceBeanProcessor,
  SpringParamterBeanPostProcessor,
} from './springWebBeanProcessor';
import { SpringWebStarter } from './springWebContainer';

export {
  SpringWebExceptionHandler,
  isSpringWebExceptionHandler,
} from './springWebExtends';
export * from './springWebConfiguration';
export * from './springWebAnnotation';
export * from './springReflectType';
export * from './springWebExtends';
export {
  ParamEnhanceInterceptor,
  isParamEnhanceInterceptor,
} from './paramEnhanceInterceptor';
export {
  RouterEnhanceInterceptor,
  isRouterEnhanceInterceptor,
} from './routerEnhanceInterceptor';
export * from './paramEnhanceInterceptor';

import { SpringResultOperatePostProcessor } from './springWebBeanProcessor';

/**
 * SpringWebStarter web启动器
 * ExpressAppEnhanceBeanProcessor ExpressConfiguration的后置处理器
 * ControllerBeanProcessor controller的后置处理器
 */
export const springWebModule = [
  SpringWebStarter,
  ExpressAppEnhanceBeanProcessor,
  ControllerBeanProcessor,
  SpringParamterBeanPostProcessor,
  SpringResultOperatePostProcessor,
];
