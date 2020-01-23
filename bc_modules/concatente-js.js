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
	let newFile = true;
	if (debug) {
		console.log(``);	
		console.log(`* Process files *`);	
	}
	for (file of filesToConcat) {
		if (debug) {
			console.log(`New file is: ${newFile}`);	
			console.log(`Current source file: ${file}`);	
		}
		concatenate(targetFile, file, newFile);
		newFile = false;
	}
} else {
	return console.log(messagePrefix + ' No findable files in concatenate-js.config.js');
}

function concatenate(target, input, newFile) {
	try {
		if (debug) {
			console.log(``);
			console.log('Concatenate function:');	
		}
		if (newFile === true && fs.existsSync(target) && fs.lstatSync(target).isFile()) {
			if (debug) {
				console.log('New file is true, unlink existing file');	
			}
			fs.unlinkSync(targetFile);
		}
 		const targetFD = fs.openSync(targetFile, 'a+');
		const inputFileData = fs.readFileSync(input);	
		fs.appendFileSync(targetFD, inputFileData);
	} catch (err) {
		return console.log(err);
	}
}