import { Autowired, Clazz, Component, spring } from 'j-spring'
import path from 'path'
import { DataSource } from 'typeorm'
import {SqliteStarter} from '../src'

describe('test sqlite starter is ok',()=>{


  const baseConfig = {
    'j-spring-jpa.sqlite.database':path.join(__dirname,'./data.db'),
    'j-spring-jpa.sqlite.logging':false
  }


  it('datasource is injected!',async ()=>{


    @Component()
    class Application {

      @Autowired({clazz:DataSource as Clazz})
      dataSource:DataSource;

      async main(){
        const connectState = this.dataSource ? 'yes':'no';
        await this.dataSource?.destroy();
        return connectState;
      }

    }

    await spring.bind(SqliteStarter).loadConfig(baseConfig).invokeStarter();

    const app = spring.getBean(Application);

    const result = await app.main();

    expect(result).toEqual('yes');


  })



})