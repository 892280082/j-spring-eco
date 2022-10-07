import {  Controller,Shuttle,Post } from '../../src'

@Shuttle()
@Controller('shuttleApi')
export class ShuttleApi {


    @Post()
    say(n:number,str:string){
        let out = "";
        for(let i =0;i<n;i++)
            out+=str;
        return out;
    }




}