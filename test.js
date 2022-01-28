const {scanerDir,scanerDirList} = require("./spring/scaner/scaner")
const {SpringResource} = require("./spring/resource/SpringResource")
const path = require('path');


scanerDirList([path.join(__dirname,"src")]);


// const resource = new SpringResource(path.join(__dirname,"resource"))
// console.log(JSON.stringify(resource,null,2))
// console.log(resource.getValue("config.email.user"))
