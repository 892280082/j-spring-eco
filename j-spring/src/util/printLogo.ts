import path from 'path';
import fs from 'fs'

export function printLogo(){

    const data = fs.readFileSync(path.join(__dirname,'./app.logo'))

    console.log(data.toString())

}

