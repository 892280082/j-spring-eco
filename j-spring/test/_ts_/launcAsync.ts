import { Component,SpringStarter,launchAsync, spring } from "../../src";

@Component()
class Application implements SpringStarter{
  
    isSpringStater(): boolean {
        return true;
    }

    value = 1;

    async doStart(): Promise<any> {
        this.value = 100;
    }
    
    main(){
        return this.value;
    }

}

launchAsync(Application).then(v => console.log(v))


spring.clear();

let count = 0;

@Component()
class Db implements SpringStarter{

  isSpringStater(): boolean {
    return true;
  }
  async doStart(): Promise<any> {
    count = 100;
  }
}

spring.bind(Db).invokeStarter().then(_v => console.log('ii',count))