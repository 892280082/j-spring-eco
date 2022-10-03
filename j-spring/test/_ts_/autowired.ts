import { Component,Autowired,replaceClazz } from '../../src'

class A {
    value(){
      return 1;
    }
  }    

  @Component()
  class Application {

    @Autowired({clazz:A,force:false})
    a:A = new A();

    main(){
      return this.a.value();
    }

  }

  @Component()
  class A100 extends A {
    value(): number {
      return 101;        
    }
  }

  const replaceSize = replaceClazz(A,A100);
