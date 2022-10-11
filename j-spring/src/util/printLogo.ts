import path from 'path';
import fs from 'fs'

//递归查询logo文件
function findLogoFile(currentDir:string,fileName:string,deep?:number):string{

    deep = deep || 0;

    if(deep > 5)
        throw `logo文件不存在`

    const filePath = path.join(currentDir,fileName)

    return fs.existsSync(filePath) ? filePath : findLogoFile(path.join(currentDir,'../'),fileName,deep+1);
}

export function printLogo(){

    const data = fs.readFileSync(findLogoFile(path.join(__dirname,'../'),'app.logo'))

    console.log(data.toString())

}

