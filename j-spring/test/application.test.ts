import {
  Autowired,
  Component,
  launch,
  launchAsync,
  spring,
  SpringStarter,
  Value,
} from '../src';
spring.closeLog();

describe('application test!', () => {
  it('launch right application', () => {
    @Component()
    class Application {
      main(n: number) {
        return 1 + n;
      }
    }

    expect(launch(Application, [2])).toBe(3);
  });

  it('simple test', () => {
    @Component()
    class Calculate {
      @Value({ path: 'n' })
      n: number;

      doCalculate(inputN: number) {
        return this.n * inputN;
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: Calculate })
      calculate: Calculate;

      main(n: number) {
        return this.calculate.doCalculate(n);
      }
    }

    expect(
      spring
        .loadConfig({ n: 2 })
        .getBean(Application)
        .main(2)
    ).toBe(4);
  });

  it('repeat get bean is same', () => {
    @Component()
    class Application {
      main(n: number) {
        return 1 + n;
      }
    }

    const b1 = spring.getBean(Application);
    const b2 = spring.getBean(Application);

    expect(b1 === b2).toBe(true);
  });

  it('repeat get bean is not same if run clear method', () => {
    @Component()
    class Application {
      main(n: number) {
        return 1 + n;
      }
    }

    const b1 = spring.getBean(Application);

    spring.clear();

    const b2 = spring.getBean(Application);

    expect(b1 !== b2).toBe(true);
  });

  it('launch application with no @Component(),it should throw exception!', () => {
    class Application {
      main(n: number) {
        return 1 + n;
      }
    }

    expect(() => launch(Application, [2])).toThrow(
      `找不到类:[${Application.name}]的BeanDefine信息,是否忘记在该类上添加 @Component() 装饰器?`
    );
  });

  it('launch application with no main function', () => {
    @Component()
    class Application {}
    expect(() => launch(Application, [2])).toThrow(
      `类:${Application.name} 没有找到main方法`
    );
  });

  it('run starter applicaiton', () => {
    spring.clear();

    @Component()
    class Application implements SpringStarter {
      isSpringStater(): boolean {
        return true;
      }

      value = 1;

      async doStart(): Promise<any> {
        this.value = 100;
      }

      main() {
        return this.value;
      }
    }

    launchAsync(Application).then(v => expect(v).toBe(100));
  });

  it('run starter applicaiton by spring', () => {
    spring.clear();

    @Component()
    class Application implements SpringStarter {
      isSpringStater(): boolean {
        return true;
      }

      value = 1;

      async doStart(): Promise<any> {
        this.value = 100;
      }

      main() {
        return this.value;
      }
    }

    spring
      .starter(Application)
      .launchAsync(Application)
      .then(v => expect(v).toBe(100));
  });

  it('run starter applicaiton by spring with paramter', () => {
    spring.clear();

    @Component()
    class Application implements SpringStarter {
      isSpringStater(): boolean {
        return true;
      }

      async doStart(): Promise<any> {
        this.value = 100;
      }

      value = 1;

      main(n: number) {
        return this.value + n;
      }
    }

    launchAsync(Application, [3]).then(v => expect(v).toBe(103));
  });

  it('run starter applicaiton by spring and inject more starter ', () => {
    spring.clear();

    @Component()
    class Db implements SpringStarter {
      isConnect: string = 'db no';

      isSpringStater(): boolean {
        return true;
      }
      async doStart(): Promise<any> {
        this.isConnect = 'db ok';
      }
    }

    @Component()
    class Server implements SpringStarter {
      isStart: string = 'server no';

      isSpringStater(): boolean {
        return true;
      }
      async doStart(): Promise<any> {
        this.isStart = 'server ok';
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: Db })
      db: Db;

      @Autowired({ clazz: Server })
      server: Server;

      value = 1;

      main() {
        return `${this.db.isConnect} ${this.server.isStart}`;
      }
    }

    launchAsync(Application).then(v => expect(v).toBe(`db ok server ok`));
  });

  it('run starter applicaiton by spring and inject more starter ', () => {
    spring.clear();

    @Component()
    class Db implements SpringStarter {
      isConnect: string = 'db no';

      isSpringStater(): boolean {
        return true;
      }
      async doStart(): Promise<any> {
        this.isConnect = 'db ok';
      }
    }

    @Component()
    class Server implements SpringStarter {
      isStart: string = 'server no';

      isSpringStater(): boolean {
        return true;
      }
      async doStart(): Promise<any> {
        this.isStart = 'server ok';
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: Db })
      db: Db;

      @Autowired({ clazz: Server })
      server: Server;

      value = 1;

      main() {
        return `${this.db.isConnect} ${this.server.isStart}`;
      }
    }

    spring
      .starter(Db, Server)
      .launchAsync(Application)
      .then(v => expect(v).toBe(`db ok server ok`));
  });

  it('only run starter', () => {
    spring.clear();

    let count = 0;

    @Component()
    class Db implements SpringStarter {
      isSpringStater(): boolean {
        return true;
      }
      async doStart(): Promise<any> {
        count = 100;
      }
    }

    spring
      .bind(Db)
      .invokeStarter()
      .then(_v => expect(count).toBe(100));
  });
});
