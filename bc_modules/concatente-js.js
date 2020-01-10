const fs = require('fs');
const path = require('path');

const messagePrefix = '[concatenate-js]';

const config = (fs.statSync('./concatenate-js.config.js').isFile()) ? require('../concatenate-js.config.js') : Error(messagePrefix + ' Provide concatenate-js.config.js at the project root.');


const filesToConcat = (config.files) ? config.files : Error(messagePrefix + ' Provide source files in concatenate-js.config.js at the project root.');
const targetFile = (config.target) ? config.target : Error(messagePrefix + ' Provide target file in concatenate-js.config.js at the project root.');

if (filesToConcat.length) {
	asyncConcatenate(filesToConcat);
} else {
	return console.log(messagePrefix + ' No findable files in concatenate-js.config.js');
}

function concatenate(targetFile, inputFile) {
	fs.readFile(inputFile, 'utf-8', (err, contents) => {
		if (err) return console.log(err.message);
		console.log(targetFile);
		console.log(contents);
		fs.open(targetFile, 'a+', (err, fd) => {
			if (err) return console.log(err);
			fs.appendFile(fd, contents, (err) => {
				if (err) return console.log(err);
			});	
		});
	});
}
async function asyncConcatenate(files) {
	const filesBuffer = [];
	for (file of files) {
		await concatenate(targetFile, file);
	}
	
}