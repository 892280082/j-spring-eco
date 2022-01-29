const {SpringFactory} = require("./spring");
/** generate lib */
const { EmailService } = require('./app/EmailService.js') 
const { MainController } = require('./app/MainController.js') 
const { TestService } = require('./app/TestService.js') 
const { UserDao } = require('./app/UserDao.js') 
const classReferences = {};
classReferences["EmailService"] = EmailService;
classReferences["MainController"] = MainController;
classReferences["TestService"] = TestService;
classReferences["UserDao"] = UserDao;
const args = JSON.parse(`{"rootPath":"D://gitProject//node-ioc","dirList":["D://gitProject//node-ioc//app"],"tempJsName":"runtemp.js","resourceDir":"D://gitProject//node-ioc//resource","inputArgs":[]}`); 
new SpringFactory(args,classReferences).boot();
