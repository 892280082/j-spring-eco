import { Value,Component, Autowired,loadResourceConfig, launch,cleanBeanCache, spring } from '../src'

@Component()
class Student {
    @Value({path:'student.name'})
    name:String;
    @Value({path:'student.age'})
    age:20;
    @Value({path:'student.city'})
    city:String;
    @Value({path:'student.isStuding'})
    isStuding:Boolean;
    @Value({path:'student.isBoy'})
    isBoy:Boolean;
    
    getMsg(){
        return ''+this.name+this.age+this.city;
    }
}


@Component()
class Application {

    @Value({path:'app.msg'})
    appMsg:string;

    @Autowired({clazz:Student})
    student:Student;

    public main(){
        return `${this.appMsg}! my name is ${this.student.name} and ${this.student.age} years old! ${this.student.isStuding} ${this.student.isBoy}`;
    }

}

describe('resource config load test',()=>{

    it('A simple set value',()=>{

        spring.loadConfig({
            'app.msg':'hello',
            student:{
                name:'lina',
                age:20,
                city:'youda',
                isStuding:'true',
                isBoy:'false'
            }
        })

        expect(spring.launch(Application)).toEqual(`hello! my name is lina and 20 years old! true false`)

    })


    it('number is NaN',()=>{

        cleanBeanCache();

        loadResourceConfig({
            'app.msg':'hello',
            student:{
                name:'a',
                age:'nihao',
                city:'sh',
                isStuding:'true',
                isBody:'false'
            }
        })

        expect(()=>launch(Application)).toThrow(`[配置解析错误]: 路径:[student.age] 原因：[value:nihao is NaN]`)

    })

    
    it('value type not expect',()=>{

        @Component()
        class Application {
        
            @Value({path:'app.msg'})
            appMsg:string;

        
            public main(){
                return this.appMsg;
            }
        
        }

        loadResourceConfig({'app.msg':'hello'})

        const d = launch(Application)
        expect(d).toEqual('hello');

    })

    it('value set defualt value',()=>{

        @Component()
        class Application {

            @Value({path:'port',force:false})
            port=3000;

            main(){
                return this.port;
            }
        }

        expect(launch(Application)).toBe(3000);

    })

    it('value not set defualt value',()=>{

        @Component()
        class Application {

            @Value({path:'port',force:false})
            port:any;

            main(){
                return this.port;
            }
        }

        expect(()=>launch(Application)).toThrow(`类:[${Application.name}] 字段:port 若无配置则必须设置默认值!`)

    })

})