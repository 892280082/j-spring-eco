import {
  ControllerBeanProcessor,
  ExpressAppEnhanceBeanProcessor,
  SpringParamterBeanPostProcessor,
} from './springWebBeanProcessor';
import { SpringWebStarter } from './springWebContainer';

export {
  SpringWebExceptionHandler,
  SpringWebParamInteceptor,
  isSpringWebParamInteceptor,
  isSpringWebExceptionHandler,
} from './springWebExtends';
export * from './springWebConfiguration';
export * from './springWebAnnotation';
export * from './springReflectType';

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
];
