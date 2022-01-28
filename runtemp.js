const {SpringFactory} = require("./spring");
/** generate lib */
const { MainController } = require('./src/MainController.js') 
const { TestService } = require('./src/TestService.js') 
const { UserDao } = require('./src/UserDao.js') 
const classReferences = {};
classReferences["MainController"] = MainController;
classReferences["TestService"] = TestService;
classReferences["UserDao"] = UserDao;
const args = JSON.parse(`{"rootPath":"D://gitProject//nodeSpring","dirList":["D://gitProject//nodeSpring//src"],"tempJsName":"runtemp.js","resourceDir":"D://gitProject//nodeSpring//resource","inputArgs":[]}`); 
new SpringFactory(args,classReferences).boot();
