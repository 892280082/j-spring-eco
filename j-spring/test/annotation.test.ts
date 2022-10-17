import { spring, SpringContainer } from '../src';
spring.closeLog();

//diy annotation
const Controller = (path: string) =>
  spring.classAnnotationGenerator('Controller', { path }, Controller);

const ResfulApi = () =>
  spring.classAnnotationGenerator('ResfulApi', {}, ResfulApi);

const Inject = (path: string) =>
  spring.fieldAnnotationGenerator('Inject', { path }, Inject);

const Get = (path: string) =>
  spring.methodAnnotationGenerator('Get', { path }, Get);

const Query = (fieldName: string) =>
  spring.paramterAnnotationGenerator('Query', fieldName, {}, Query);

describe('test custom annotation', () => {
  it('it should be work', () => {
    @Controller('/apiController')
    @ResfulApi()
    class ApiController extends SpringContainer {
      @Inject('small pigBank')
      pigBank: String;

      @Get('/say')
      async say(@Query('user') user: string, @Query('num') _num: number) {
        return user;
      }

      main() {
        let result: any[] = [];

        this.getBeanDefineMap().forEach((_v, k) => {
          const data = {
            class: k.clazz,
            'anno-length': k.annotationList.length,
            'anno-class': k.annotationList.map(a => a.clazz),
            'anno-param-list': k.annotationList.map(a => a.params),
            'field-list': k.fieldList.map(f => {
              return {
                name: f.name,
                'anno-list': f.annotationList.map(a => a.clazz),
                'anno-param-list': f.annotationList.map(a => a.params),
              };
            }),
            'method-list': k.methodList.map(m => {
              return {
                name: m.name,
                'anno-list': m.annotationList.map(m => m.clazz),
                'anno-params': m.annotationList.map(m => m.params),
                'field-list': m.paramterDefineList.map(pb => {
                  return {
                    name: pb.name,
                    index: pb.index,
                    'anno-list': pb.annotationList.map(a => a.clazz),
                  };
                }),
              };
            }),
          };
          result.push(data);
        });

        return result;
      }
    }

    expect(spring.launch(ApiController)).toEqual([
      {
        class: ApiController,
        'anno-length': 2,
        'anno-class': [ResfulApi, Controller],
        'anno-param-list': [{}, { path: '/apiController' }],
        'field-list': [
          {
            name: 'pigBank',
            'anno-list': [Inject],
            'anno-param-list': [{ path: 'small pigBank', reflectType: String }],
          },
        ],
        'method-list': [
          {
            name: 'say',
            'anno-list': [Get],
            'anno-params': [{ path: '/say', reflectType: Promise }],
            'field-list': [
              {
                name: 'num',
                index: 1,
                'anno-list': [Query],
              },
              {
                name: 'user',
                index: 0,
                'anno-list': [Query],
              },
            ],
          },
        ],
      },
    ]);
  });
});
