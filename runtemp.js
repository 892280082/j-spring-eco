const {SpringFactory} = require("./spring");
/** generate lib */
const { EmailService } = require('./src/EmailService.js') 
const { MainController } = require('./src/MainController.js') 
const { TestService } = require('./src/TestService.js') 
const { UserDao } = require('./src/UserDao.js') 
const classReferences = {};
classReferences["EmailService"] = EmailService;
classReferences["MainController"] = MainController;
classReferences["TestService"] = TestService;
classReferences["UserDao"] = UserDao;
const args = JSON.parse(`{"rootPath":"D://gitProject//node-ioc","dirList":["D://gitProject//node-ioc//src"],"tempJsName":"runtemp.js","resourceDir":"D://gitProject//node-ioc//resource","inputArgs":[]}`); 
new SpringFactory(args,classReferences).boot();
