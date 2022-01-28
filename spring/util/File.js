const fs = require('fs')
const path = require('path')


class File {

	content="";
	encoding = 'utf-8'

	constructor(fsPath){
		this.fsPath = fsPath;
	}

	getExtName(){
		return path.extname(this.fsPath);
	}

	getFileName(noExt){
		const name =  path.basename(this.fsPath)
		return noExt ? name.split(".")[0] : name;
	}

	getParent(){
		return new File(path.dirname(this.fsPath));
	}

	touch(){
		const parent = this.getParent()
		if(!parent.exist()){
			parent.mkdir()
			this.write()
		}else{
			if(!this.exist())
				this.write();
		}
	
	}

	getRelativeFile(relativePath){
		return new File(path.join(this.getFileDir(),relativePath))
	}

	readFile(){
		this.content = fs.readFileSync(this.fsPath,this.encoding).toString()
		return this;
	}

	setContent(c){
		this.content = c;
		return this;
	}

	write(){
		const {encoding} = this;
		fs.writeFileSync(this.fsPath,this.content,{encoding})
	}

	append(data){
		fs.appendFileSync(this.fsPath, data, this.encoding);
	}

	appendFile(filePath){
		return this.setContent(this.content+new File(filePath).readFile().content+";");
	}

	preAppendFile(filePath){
		return this.setContent(new File(filePath).readFile().content+this.content+";");
	}

	delete(){
		if(fs.existsSync(this.fsPath))
			fs.rmSync(this.fsPath)
	}

	isContain(str){
		return this.content.indexOf(str) > -1;
	}

	mapRows(fn){
		this.content = this.content.split('\n').map(fn).join('\n');
		return this;
	}

	exist(){
		return fs.existsSync(this.fsPath);
	}

	setObject(object){
		this.setContent(JSON.stringify(object));
		return this;
	}

	getObject(){
		this.readFile();
		return JSON.parse(this.content);
	}

	mkdir(){
		fs.mkdirSync(this.fsPath,{recursive:true})
	}

	removeEmptyLines(){
		return this.setContent(this.content.replace(/^\s*\n/gm, ""));
	}

	getLines(){
		return this.content.split(/[\r\n]+/)
	}

	map(fn){
		return this.setContent(fn(this.content))
	}

	getFileListRecurse(dir, filesList = []){
		dir = dir || this.fsPath;
	    const files = fs.readdirSync(dir);
	    files.forEach((item, index) => {
	        var fullPath = path.join(dir, item);
	        const stat = fs.statSync(fullPath);
	        if (stat.isDirectory()) {      
	            readFileList(path.join(dir, item), filesList);  //递归读取文件
	        } else {                
	            filesList.push(fullPath);                     
	        }        
	    });
	    return filesList;
	}

	getFileList(){
		return fs.readdirSync(this.fsPath)
		.filter(f =>  fs.statSync(path.join(this.fsPath,f)).isFile())
		.map(f => path.join(this.fsPath,f))
	}

}





module.exports = {File}