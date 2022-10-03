import express from "express";
import { Component, Value,SpringStarter,Clazz } from "j-spring";
import {loadConfiguration} from './springWebBeanProcessor'

@Component()
export class SpringWebStarter implements SpringStarter{

    @Value({path:'j-spring.port',type:Number,force:false})
    port = 3000;

    async doStart(clazzMap: Map<Clazz, any>): Promise<any> {
        const app = express();
        
        clazzMap.set(express as any,app);

        loadConfiguration(app);
        
        const startWeb = ()=> new Promise( (ok,_err) => {
            app.listen(this.port, () => {
                // tslint:disable-next-line:no-console
                console.log( `server started at http://localhost:${ this.port }` );
                ok('ok')
            });
        });
        await startWeb();
    }
 
    isSpringStater(): boolean {
        return true;
    }

}

