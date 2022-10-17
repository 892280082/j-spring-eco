import {
  Autowired,
  Component,
  isFunction,
  spring,
  SpringFactoryBean,
  SpringStarter,
} from '../src';
import { ClazzExtendsMap } from '../src/SpringFactry';
spring.closeLog();
describe('test async assmble by type', () => {
  it('async load', () => {
    interface SqlQuery {
      query(): string[];
      isSqlQuery(): boolean;
    }

    function isSquery(bean: SqlQuery): boolean {
      return (
        bean &&
        isFunction(bean.query) &&
        isFunction(bean.isSqlQuery) &&
        bean.isSqlQuery()
      );
    }

    class SqliteDb implements SqlQuery {
      query() {
        return ['query ok'];
      }
      isSqlQuery(): boolean {
        return true;
      }
    }

    //模拟这是从外部Module获取的实例
    let instanceDb: SqlQuery;

    //导出外部的实例
    @Component()
    class SqliteQueryBeanFactory implements SpringFactoryBean<SqlQuery> {
      isSpringFactoryBean(): boolean {
        return true;
      }
      getBean(): SqlQuery {
        return instanceDb;
      }
    }

    @Component()
    class DbStarter implements SpringStarter {
      async doStart(_clazzMap: ClazzExtendsMap): Promise<any> {
        instanceDb = new SqliteDb();
      }

      isSpringStater(): boolean {
        return true;
      }
    }

    @Component()
    class Application {
      @Autowired({ type: isSquery })
      db: SqlQuery;

      public main() {
        return this.db.query();
      }
    }

    spring
      .bindList([SqliteQueryBeanFactory, DbStarter])
      .launchAsync(Application)
      .then(v => expect(v).toEqual(['query ok']));
  });
});
