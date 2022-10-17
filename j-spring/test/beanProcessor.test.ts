import {
  Value,
  Component,
  launch,
  Autowired,
  BeanPostProcessor,
  BeanDefine,
  SpringContainer,
  spring,
} from '../src';
spring.closeLog();
describe('test beanProcessor', () => {
  @Component()
  class Student {
    @Value({ path: 'student.name' })
    name: String;
    getName() {
      return this.name;
    }
  }

  @Component()
  class StudentAopProcessor implements BeanPostProcessor {
    getSort(): number {
      return 1;
    }
    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine) {
      return bean;
    }
    postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine) {
      if (_beanDefine.clazz == Student) {
        const oldMethod = bean['getName'];
        bean['getName'] = function() {
          const result: String = oldMethod.apply(bean, []);
          return result.toUpperCase();
        };
      }
      return bean;
    }
  }

  spring
    .loadConfig({
      student: {
        name: 'liulanshan',
      },
    })
    .bind(StudentAopProcessor);

  it('test aop', () => {
    @Component()
    class Application {
      @Autowired({ clazz: Student })
      student: Student;

      main() {
        return this.student.getName();
      }
    }

    expect(launch(Application)).toEqual('LIULANSHAN');
  });

  it('test spring container', () => {
    @Component()
    class Application extends SpringContainer {
      main() {
        return this.getBeanPostProcessor().length;
      }
    }

    expect(launch(Application)).toBe(1);
  });

  it('test bind class', () => {
    @Component()
    class ApiController {
      hello = 'already instance';
    }

    @Component()
    class Application extends SpringContainer {
      main() {
        let v = 'no find';

        this.getBeanDefineMap().forEach((bean: any, bd: BeanDefine) => {
          if (bd.clazz === ApiController) {
            v = bean['hello'];
          }
        });
        return v;
      }
    }

    expect(spring.bind(ApiController).launch(Application)).toEqual(
      'already instance'
    );
  });

  it('test sample Aop', () => {
    const SupperCaseParamter = spring.methodAnnotationGenerator(
      'SupperCaseParamter',
      {}
    );

    @Component()
    class SupperCaseParamterBeanProcessor implements BeanPostProcessor {
      getSort(): number {
        return 100;
      }
      postProcessBeforeInitialization(
        bean: any,
        _beanDefine: BeanDefine
      ): Object {
        return bean;
      }
      postProcessAfterInitialization(
        bean: any,
        beanDefine: BeanDefine
      ): Object {
        beanDefine.methodList
          .filter(m => m.hasAnnotation(SupperCaseParamter))
          .forEach(m => {
            const method = bean[m.name];

            bean[m.name] = function(...args: any[]) {
              return method.apply(
                bean,
                args.map(a => {
                  return typeof a === 'string'
                    ? (a as string).toUpperCase()
                    : a;
                })
              );
            };
          });
        return bean;
      }
    }

    @Component()
    class Application {
      @SupperCaseParamter
      main(name: string) {
        return name;
      }
    }

    expect(
      spring
        .bind(SupperCaseParamterBeanProcessor)
        .getBean(Application)
        .main('hello')
    ).toEqual('HELLO');
  });
});
