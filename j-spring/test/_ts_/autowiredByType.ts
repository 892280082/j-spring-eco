import { Component,Autowired,replaceClazz,isFunction,spring } from '../../src'

interface Dirver {
    doTest():string
    isDriver():boolean;
  }

  function isDriver(bean:any):boolean{
    const t = bean as Dirver;
    return isFunction(t.doTest) && isFunction(t.isDriver) && t.isDriver();
  }

  @Component()
  class Application {

    @Autowired({type:isDriver})
    dirver:Dirver;

    main(){
      return this.dirver.doTest();
    }

  }

  @Component()
  class MysqlDriver implements Dirver{
    doTest(): string {
      return 'mysql-driver'
    }
    isDriver(): boolean {
      return true;
    }
  }

console.log( spring.bind(MysqlDriver).getBean(Application).main());