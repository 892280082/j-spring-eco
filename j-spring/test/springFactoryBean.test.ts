import {Autowired, Component, isFunction, spring, SpringFactoryBean } from '../src'

describe('test factory bean',()=>{


    it('first sample',()=>{

        let realDbSource = {port:20};

        @Component()
        class DataSource implements SpringFactoryBean<any> {

            port:number;

            isSpringFactoryBean(): boolean {
                return true;
            }
            getBean() {
                return realDbSource;
            }
        }

        @Component()
        class Application {

            @Autowired({clazz:DataSource})
            db:DataSource;

            public main(){
                return this.db.port;
            }

        }

        const result =spring.getBean(Application).main();

        expect(result).toBe(20);
    })

    it('change the ref',()=>{

        let realDbSource = {port:20};

        @Component()
        class DataSource implements SpringFactoryBean<any> {

            port:number;

            isSpringFactoryBean(): boolean {
                return true;
            }
            getBean() {
                return realDbSource;
            }
        }

        @Component()
        class Application {

            @Autowired({clazz:DataSource})
            db:DataSource;

            public main(){
                return this.db.port;
            }

        }

        const result =spring.getBean(Application).main();

        realDbSource = {port:30};

        const result2 =spring.getBean(Application).main();

        expect(result+result2).toBe(50);
    })


    it('autowired by type',()=>{

        interface SqlQuery {
            query():string[];
            isSqlQuery():boolean;
        }

        function isSquery(bean:SqlQuery):boolean {
            return isFunction(bean.query) && isFunction(bean.isSqlQuery) && bean.isSqlQuery();
        }


        @Component()
        class Application {

            @Autowired({type:isSquery})
            db:SqlQuery;

            public main(){
                return this.db.query();
            }

        }


        expect(()=>{
            spring.getBean(Application).main()
        }).toThrowError();
    })


    it('autowired by type',()=>{

        interface SqlQuery {
            query():string[];
            isSqlQuery():boolean;
        }

        function isSquery(bean:SqlQuery):boolean {
            return isFunction(bean.query) && isFunction(bean.isSqlQuery) && bean.isSqlQuery();
        }

        class SqliteDb implements SqlQuery {
            query(){
                return ['query ok']
            }
            isSqlQuery(): boolean {
              return true;
            }
        }

        //模拟这是从外部Module获取的实例
        const instanceDb = new SqliteDb();

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
        class Application {

            @Autowired({type:isSquery})
            db:SqlQuery;

            public main(){
                return this.db.query();
            }

        }

        const result =spring.bind(SqliteQueryBeanFactory).getBean(Application).main();

        expect(result).toEqual(['query ok'])
    })
    
    
})