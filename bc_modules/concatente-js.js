const debug = false;
const fs = require('fs');
const path = require('path');

const messagePrefix = '[concatenate-js]';

if (debug) {
	console.log(`** concatenate-js.js debug **`);	
}

const config = (fs.statSync('./concatenate-js.config.js').isFile()) ? require('../concatenate-js.config.js') : Error(messagePrefix + ' Provide concatenate-js.config.js at the project root.');


const filesToConcat = (config.files) ? config.files : Error(messagePrefix + ' Provide source files in concatenate-js.config.js at the project root.');
const targetFile = (config.target) ? config.target : Error(messagePrefix + ' Provide target file in concatenate-js.config.js at the project root.');

if (debug) {
	console.log(`Target file: ${targetFile}`);	
}
if (filesToConcat.length) {
	if (debug) {
		console.log(``);	
		console.log(`* Process files *`);	
	}
	if (fs.existsSync(targetFile) && fs.lstatSync(targetFile).isFile()) {
		if (debug) {
			console.log(`Delete existing file ${targetFile}`);	
		}
		fs.unlinkSync(targetFile);
	}
	if (debug === true) 
		console.log(`Open target file: ${targetFile}`);	
	const targetFD = fs.openSync(targetFile, 'a+');
	if (debug) {	
		console.log(`Target file FD: ${targetFD}`);	
	}
	let inputFileData = '';
	
	for (file of filesToConcat) {
		if (debug === true) 
			console.log(`Read file: ${file}`);	
		inputFileData += fs.readFileSync(file, 'utf-8') + '\n';
	}
	if (debug === true) 
			console.log(`Read file: ${targetFD}`);	
	fs.appendFileSync(targetFD, inputFileData);
	fs.closeSync(targetFD);
} else {
	return console.log(messagePrefix + ' No findable files in concatenate-js.config.js');
}
