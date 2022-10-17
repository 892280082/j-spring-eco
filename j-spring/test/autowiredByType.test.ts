import { Autowired, Component, isFunction, spring } from '../src';

spring.closeLog();
describe('autowired by type', () => {
  it('autowired by type', () => {
    interface Dirver {
      doTest(): string;
      isDriver(): boolean;
    }

    function isDriver(bean: any): boolean {
      const t = bean as Dirver;
      return isFunction(t.doTest) && isFunction(t.isDriver) && t.isDriver();
    }

    @Component()
    class Application {
      @Autowired({ type: isDriver })
      dirver: Dirver;

      main() {
        return this.dirver.doTest();
      }
    }

    @Component()
    class MysqlDriver {
      doTest(): string {
        return 'mysql-driver';
      }
      isDriver(): boolean {
        return true;
      }
    }

    expect(
      spring
        .bind(MysqlDriver)
        .getBean(Application)
        .main()
    ).toEqual('mysql-driver');
  });

  it('autowired by type', () => {
    interface Dirver {
      doTest(): string;
      isDriver(): boolean;
    }

    function isDriver(bean: any): boolean {
      const t = bean as Dirver;
      return isFunction(t.doTest) && isFunction(t.isDriver) && t.isDriver();
    }

    @Component()
    class Application {
      @Autowired({ type: isDriver })
      dirver: Dirver;

      main() {
        return this.dirver.doTest();
      }
    }

    @Component()
    class MysqlDriver {
      doTest(): string {
        return 'mysql-driver';
      }
      isDriver(): boolean {
        return true;
      }
    }

    expect(
      spring
        .bind(MysqlDriver)
        .getBean(Application)
        .main()
    ).toEqual('mysql-driver');
  });
});
