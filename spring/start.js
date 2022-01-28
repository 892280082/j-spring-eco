const {SpringBeanScaner,SpringRuntime} = require("./index")


1.SpringBeanScaner扫描src目录下所有的文件 创建成beanDefine

List<BeanDefine> beanDefineList = SpringBeanScaner.scanner("./src")

2.创建临时文件
SpringRuntime.generateRuntimeJs(beanDefineList,"../runtime.log");

3.运行临时文件
shell('node runtime.tempjs')