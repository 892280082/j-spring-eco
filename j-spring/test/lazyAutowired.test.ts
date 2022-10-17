import {
  Autowired,
  Component,
  isFunctionList,
  launchAsync,
  spring,
  SpringStarter,
} from '../src';
import { ClazzExtendsMap } from '../src/SpringFactry';
spring.closeLog();

describe('test lazy autowired', () => {
  interface Express {
    star(): String;
    listen(): String;
  }

  function isExpress(bean: Express) {
    return isFunctionList(bean.star, bean.listen);
  }

  class DataSource {
    connect() {
      return 'db-ok';
    }
  }

  @Component()
  class ExpressWeb implements Express {
    star(): String {
      return 'web-start';
    }
    listen(): String {
      return 'web-listen';
    }
  }

  interface Redis {
    isRedis(): boolean;
    connect(): string;
  }

  function isRedis(b: any): boolean {
    return isFunctionList(b.isRedis, b.connect) && b.isRedis();
  }

  @Component()
  class Application implements SpringStarter {
    async doStart(clazzMap: ClazzExtendsMap): Promise<any> {
      class RedisImpl implements Redis {
        isRedis(): boolean {
          return true;
        }
        connect(): string {
          return 'redis-ok';
        }
      }

      clazzMap.addBean(RedisImpl, new RedisImpl());

      clazzMap.addBean(DataSource, new DataSource());
    }

    @Autowired({ type: isExpress })
    expess: Express;

    @Autowired({ clazz: DataSource })
    dataSource: DataSource;

    @Autowired({ type: isRedis })
    redis: Redis;

    isSpringStater(): boolean {
      return true;
    }

    main(): string {
      return (
        this.expess.star() +
        ' ' +
        this.dataSource.connect() +
        ' ' +
        this.redis.connect()
      );
    }
  }

  spring.bind(ExpressWeb);

  it('it shuold be ok', () => {
    launchAsync(Application).then(v =>
      expect(v).toEqual('web-start db-ok redis-ok')
    );
  });
});
