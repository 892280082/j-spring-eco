import { Value,Component, Autowired,loadResourceConfig, launch,cleanBeanCache, spring } from '../src'

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
        return `${this.appMsg}! my name is ${this.student.name} and ${this.student.age} years old!`;
    }

}

describe('resource config load test',()=>{

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


    it('number is NaN',()=>{

        cleanBeanCache();

        loadResourceConfig({
            'app.msg':'hello',
            student:{
                name:'a',
                age:'nihao',
                city:'sh'
            }
        })

        expect(()=>launch(Application)).toThrow(`[SPRING_RESOURCE_ERROR: path[student.age] reason[value:nihao is NaN] `)

    })

    
    it('value type not expect',()=>{

        @Component()
        class Application {
        
            @Value({path:'app.msg',type:Object})
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

            @Value({path:'port',type:Number,force:false})
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

            @Value({path:'port',type:Number,force:false})
            port:any;

            main(){
                return this.port;
            }
        }

        expect(()=>launch(Application)).toThrow(`class:${Application} field:port must be set initial value!`)

    })

})