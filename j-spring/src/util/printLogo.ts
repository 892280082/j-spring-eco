//递归查询logo文件
function findLogoFile(currentDir:string,fileName:string,deep?:number):string{
    const path = require('path');
    const fs = require('fs');
    deep = deep || 0;
    if(deep > 5)
        throw `logo文件不存在`
    const filePath = path.join(currentDir,fileName)
    return fs.existsSync(filePath) ? filePath : findLogoFile(path.join(currentDir,'../'),fileName,deep+1);
}

export function printLogo(cb:(data:any)=>void){
    if(typeof window !== void 0){
        const path = require('path');
        const fs = require('fs');
        const data = fs.readFileSync(findLogoFile(path.join(__dirname,'../'),'app.logo'))
        cb(data.toString())
    }
}

