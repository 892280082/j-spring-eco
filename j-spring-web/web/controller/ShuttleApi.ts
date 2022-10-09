import {  Controller,Shuttle,Post, ApiMiddleWare, CorresDomainMiidleWare } from '../../src'

@Shuttle()
@Controller('shuttleApi')
@ApiMiddleWare([CorresDomainMiidleWare])
export class ShuttleApi {


    @Post()
    say(n:number,str:string){
        return Array(n).fill(str).join('')
    }




}