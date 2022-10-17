import { Autowired, Component, launch, spring } from '../src';

spring.closeLog();

const AName = 'test bean a';

@Component()
class A {
  name: string = AName;
}

@Component()
class A2 {
  name: string = AName + '2';
}

@Component()
class Deep1 {
  @Autowired()
  A: A;
}

@Component()
class Deep2 {
  @Autowired()
  A2: A2;

  @Autowired()
  Deep1: Deep1;
}

@Component()
class Deep3 {
  @Autowired()
  Deep2: Deep2;
}

describe('test autowired', () => {
  it('single autwired', () => {
    @Component()
    class Application {
      @Autowired()
      A: A;

      main() {
        return this.A.name;
      }
    }

    expect(launch(Application, [])).toEqual(AName);
  });

  it('more autowired', () => {
    @Component()
    class Application {
      @Autowired()
      a: A;

      @Autowired()
      a1: A;

      @Autowired()
      a2: A2;

      main() {
        return this.a === this.a1 && this.a !== this.a2;
      }
    }

    expect(launch(Application)).toBe(true);
  });

  it('recursion autowired', () => {
    @Component()
    class Application {
      @Autowired()
      Deep2: Deep2;

      @Autowired()
      Deep3: Deep3;

      main() {
        return this.Deep3.Deep2.Deep1.A.name + '|' + this.Deep3.Deep2.A2.name;
      }
    }

    expect(launch(Application)).toEqual(AName + '|' + AName + '2');
  });

  it('autowired by special interface', () => {
    interface A {
      v(): number;
    }

    @Component()
    class A1 implements A {
      v(): number {
        return 1;
      }
    }

    @Component()
    class A2 implements A {
      v(): number {
        return 2;
      }
    }

    @Component()
    class Application {
      @Autowired<A>({ clazz: A1 })
      a1: A;

      @Autowired<A>({ clazz: A2 })
      a2: A;

      main(c: number) {
        return this.a1.v() + this.a2.v() + c;
      }
    }

    expect(spring.getBean(Application).main(3)).toBe(6);
  });

  it('autowired by special interface though module', () => {
    interface A {
      v(): number;
    }

    @Component()
    class A1 implements A {
      v(): number {
        return 1;
      }
    }

    @Component()
    class A2 implements A {
      v(): number {
        return 2;
      }
    }

    @Component()
    class Application {
      @Autowired<A>({ clazz: A1 })
      a1: A;

      @Autowired<A>({ clazz: A2 })
      a2: A;

      main(c: number) {
        return this.a1.v() + this.a2.v() + c;
      }
    }

    expect(spring.bindModule([[A1, A2]]).launch(Application, [3])).toBe(6);
  });

  it('autowired force=false field not set inital object value', () => {
    class A {
      value() {
        return 1;
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: A, force: false })
      a: A;

      main() {
        return this.a.value();
      }
    }

    expect(() => launch(Application)).toThrowError();
  });

  it('autowired force=false  inital object value', () => {
    spring.clear();

    class A {
      value() {
        return 1;
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: A, force: false })
      a: A = new A();

      main() {
        return this.a.value();
      }
    }

    expect(launch(Application)).toBe(1);
  });

  it('force=false override inital object value', () => {
    class A {
      value() {
        return 1;
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: A, force: false })
      a: A = new A();

      main() {
        return this.a.value();
      }
    }

    @Component()
    class A100 extends A {
      value(): number {
        return 100;
      }
    }

    expect(spring.replaceClass(A, A100).launch(Application)).toBe(100);
  });

  it('replace autowired class', () => {
    @Component()
    class A {
      value() {
        return 1;
      }
    }

    @Component()
    class A100 extends A {
      value(): number {
        return 100;
      }
    }

    @Component()
    class Application {
      @Autowired({ clazz: A })
      a: A;

      main() {
        return this.a.value();
      }
    }

    expect(spring.replaceClass(A, A100).launch(Application)).toBe(100);
  });
});
