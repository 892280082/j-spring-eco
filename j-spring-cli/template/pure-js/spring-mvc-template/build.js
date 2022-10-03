const {app} = require('./app')

/**
	编译+手动运行.runtemp.js

	如果需要编译线上环境
	app.build({
		configPaths:['./resource/app-product.yaml']
	})

*/
app.build();