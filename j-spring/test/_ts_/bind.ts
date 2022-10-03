
import {Component,SpringContainer,BeanDefine,spring} from '../../src'

@Component()
class ApiController {
    hello = 'already instance';
}

@Component()
class Application extends SpringContainer{

    main(){

        let v = 'no find';

        this.getBeanDefineMap().forEach((bean:any,bd:BeanDefine)=>{

            if(bd.clazz === ApiController){
                v = bean['hello']
            }

        })
        return v;
    }

}

console.log(spring.bind(ApiController).launch(Application));