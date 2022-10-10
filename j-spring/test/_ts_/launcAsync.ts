import { Component,SpringStarter,launchAsync, spring, BeanPostProcessor, BeanDefine, Autowired, Value } from "../../src";
import { ClazzExtendsMap } from "../../src/SpringFactry";

@Component()
class Application implements SpringStarter{
  
    isSpringStater(): boolean {
        return true;
    }

    value = 1;

    async doStart(): Promise<any> {
        this.value = 100;
    }
    
    main(){
        return this.value;
    }

}

//launchAsync(Application).then(v => console.log(v))


spring.clear();

let count = 0;

class LazyBean {
  a=1;
}

@Component()
class Db implements SpringStarter{
  async doStart(clazzMap: ClazzExtendsMap): Promise<any> {
    clazzMap.addBean(LazyBean,new LazyBean(),"延迟加载bean")
    count=100;
  }

  @Autowired()
  lazyBean:LazyBean;

  @Value({path:'j-spring.log.level'})
  level:string;

  isSpringStater(): boolean {
    return true;
  }
  // async doStart(): Promise<any> {
  //   count = 100;
  // }
}

@Component()
class BeanPostProcessorTemp implements BeanPostProcessor  {

  @Autowired()
  db:Db;

  @Value({path:'j-spring.log.level'})
  level:string;

  getSort(): number {
    return 200;
  }
  postProcessBeforeInitialization(bean: any, beanDefine: BeanDefine): Object {
    return bean;
  }
  postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object {
    return bean;
  }

}

spring.loadConfig({'j-spring.log.level':'debug'}).bindList([Db,BeanPostProcessorTemp]).invokeStarter().then(_v => console.log('ii',count))