# J-SPRING
> Spring for TS

# install
```js
npm install j-spring
```

# Usage

## example
```js
  import { spring,Component,Autowired } from "j-spring";

  it('autowired by special interface',()=>{

    interface A {
      v():number;
    }
    
    @Component()
    class A1 implements A{
      v(): number {
        return 1;
      }
    }
    
    @Component()
    class A2 implements A{
      v(): number {
        return 2;
      }
    }

    @Component()
    class Application {
      
      @Autowired<A>({clazz:A1})
      a1:A;

      @Autowired<A>({clazz:A2})
      a2:A;

      main(c:number){
        return this.a1.v()+this.a2.v()+c;
      }
    }

    expect(spring.getBean(Application).main(3)).toBe(6);

  })
```

## inject profile infomation
```js
import { spring,Component,Autowired } from "j-spring";

describe('resource config load test',()=>{

  @Component()
  class Student {
      @Value({path:'student.name',type:String})
      name:String;
      @Value({path:'student.age',type:Number})
      age:20;
      @Value({path:'student.city',type:String})
      city:String
      
      getMsg(){
          return ''+this.name+this.age+this.city;
      }
  }


  @Component()
  class Application {

      @Value({path:'app.msg',type:String})
      appMsg:string;

      @Autowired({clazz:Student})
      student:Student;

      public main(){
          return this.appMsg+this.student.getMsg();
      }

  }

  it('A simple set value',()=>{

      spring.loadConfig({
        'app.msg':'hello',
        student:{
            name:'lina',
            age:20,
            city:'youda'
        }
      })

      expect(spring.launch(Application)).toEqual(`hello! my name is lina and 20 years old!`)

  })

})
```

## aop 
```js
it('test sample Aop',()=>{

    import { spring,BeanPostProcessor,Component } from "j-spring";

    //create Annotation
    const SupperCaseParamter = spring.methodAnnotationGenerator('SupperCaseParamter',{})

    @Component()
    class SupperCaseParamterBeanProcessor implements BeanPostProcessor {
        getSort(): number {
            return 100;
        }
        postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
            return bean;
        }
        postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object {
            beanDefine.methodList.filter(m => m.hasAnnotation(SupperCaseParamter)).forEach(m => {
                
                const method = bean[m.name];

                bean[m.name] = function(...args:any[]){
                    return  method.apply(bean,args.map(a => {
                        return typeof a === 'string' ? (a as string).toUpperCase() : a;
                    }));
                }

            })
            return bean;
        }
        
    }

    @Component()
    class Application {

        @SupperCaseParamter
        main(name:string){
            return name;
        }

    }

    expect(spring.bind(SupperCaseParamterBeanProcessor).getBean(Application).main('hello')).toEqual('HELLO');

})
```

## costom annotation
```js
import { spring, SpringContainer  } from '../src';

//diy annotation
const Controller = (path:string) => spring.classAnnotationGenerator('Controller',{path},Controller)

const ResfulApi = spring.classAnnotationGenerator('ResfulApi',{})

const Inject = (path:string) => spring.fieldAnnotationGenerator('Inject',{path},Inject);

const Get = (path:string) => spring.methodAnnotationGenerator('Get',{path},Get);

const Query = (fieldName:string) => spring.paramterAnnotationGenerator('Query',fieldName,{},Query)


describe('test custom annotation',()=>{

    it('it should be work',()=>{

        @Controller('/apiController')
        @ResfulApi
        class ApiController extends SpringContainer{

            @Inject('small pigBank')
            pigBank:String;
        
            @Get('/say')
            async say(@Query('user') user:string){
                return user;
            }

            main(){

                let result:any[] =[];

                this.getBeanDefineMap().forEach((_v,k) => {
                    const data = {
                        'class':k.clazz,
                        'anno-length':k.annotationList.length,
                        'anno-class':k.annotationList.map(a => a.clazz),
                        'anno-param-list':k.annotationList.map(a => a.params),
                        'field-list':k.fieldList.map(f => {
                            return {
                                'name':f.name,
                                'anno-list':f.annotationList.map(a => a.clazz),
                                'anno-param-list':f.annotationList.map(a => a.params)
                            }
                        }),
                        'method-list':k.methodList.map(m => {
                            return {
                                'name':m.name,
                                'anno-list':m.annotationList.map(m => m.clazz),
                                'anno-params':m.annotationList.map(m => m.params),
                                'field-list':m.paramterDefineList.map(pb => {
                                    return {
                                        'name':pb.name,
                                        'index':pb.index,
                                        'anno-list':pb.annotationList.map(a => a.clazz)
                                    }
                                })
                            }
                        })
                    }
                    result.push(data)
                })

                return result;
            }
        
        }

        expect(spring.launch(ApiController)).toEqual([
            {
                'class':ApiController,
                'anno-length':2,
                'anno-class':[ResfulApi,Controller],
                'anno-param-list':[{},{path:'/apiController'}],
                'field-list':[{
                    'name':'pigBank',
                    'anno-list':[Inject],
                    'anno-param-list':[{path:'small pigBank'}]
                }],
                'method-list':[
                    {
                        'name':'say',
                        'anno-list':[Get],
                        'anno-params':[{path:'/say'}],
                        'field-list':[
                            {
                                name:'user',
                                index:0,
                                'anno-list':[Query]
                            }
                        ]
                    },
                    
                ]
            }
        ])

    })

});

```

## replace dependence
```js
  it('replace autowired class',()=>{
    
    @Component()
    class A {
      value(){
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

      @Autowired({clazz:A})
      a:A;

      main(){
        return this.a.value();
      }

    }

    expect(spring.replaceClass(A,A100).launch(Application)).toBe(100)

  })
```