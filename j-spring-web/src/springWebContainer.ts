import express from "express";
import { Component, Value,SpringStarter,Clazz } from "j-spring";
import { ExpressApp, ExpressServer } from './springWebExtends'
import {loadConfiguration} from './springWebBeanProcessor'

@Component()
export class SpringWebStarter implements SpringStarter{

    @Value({path:'j-spring-web.port',type:Number,force:false})
    port = 3000;

    async doStart(clazzMap: Map<Clazz, any>): Promise<any> {
        const app = express();
        
        clazzMap.set(ExpressApp,app);

        loadConfiguration(app);
        
        const startWeb = ()=> new Promise( (ok,_err) => {
            const expressServer = app.listen(this.port, () => {
                // tslint:disable-next-line:no-console
                console.log( `server started at http://localhost:${ this.port }` );
                ok('ok')
            });
            clazzMap.set(ExpressServer,expressServer);
        });
        await startWeb();
    }
 
    isSpringStater(): boolean {
        return true;
    }

}

