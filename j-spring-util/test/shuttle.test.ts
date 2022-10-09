import { spring } from 'j-spring'
import {  springWebModule,BodyParseConfiguration,Controller,Shuttle,ExpressServer,Post, ApiMiddleWare,CorresDomainMiidleWare } from 'j-spring-web'
import axios from 'axios'
import {shuttle} from '../src'


@Shuttle()
@Controller('testAPi')
@ApiMiddleWare([CorresDomainMiidleWare])
class TestApi {

  @Post()
  async doCalculate(n:number,b:string){
    return Array(n).fill(b).join('');
  }


}


describe('测试shuttle', () => {

  beforeAll(done=>{

    shuttle.setConfig({
      host:'http://localhost:3000',
      request:axios,
    })

    //启动服务器
    spring.bindModule([springWebModule,[BodyParseConfiguration,TestApi]])
      .invokeStarter()
      .then(done);
  })

  afterAll(done=>{
    //关闭服务器
    spring.getBeanFromContainer(ExpressServer)?.close(done);
  })


  it('test shuttle', async () => {

    const testApi:TestApi = shuttle.createShuttle('testApi',{
      format:v => {
        return "!"+v.data
      }
    })
  
    const result = await testApi.doCalculate(2,"hello")

    expect(result).toEqual('!hellohello')

  });
});
