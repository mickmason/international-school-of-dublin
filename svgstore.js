/* 
	Wrapper for npm svgstore 
	https://www.npmjs.com/package/svgstore
*/
let debug = false	 ;
const svgstore = require('svgstore');
const fs = require('fs');
const path = require('path');
const messagePrefix = '[bc-svgstore]';

if (!fs.statSync('./svgstore.config.js').isFile()) {
	throw new Error(`${messagePrefix} Provide svgstore.config.js at the project root`)
}
const options = require('../svgstore.config.js');

try {
	const srcSvgs = fs.readdirSync(options.src);
	let sprite = svgstore();
	if (srcSvgs.length) {
		for (svg in srcSvgs) {	
			let thisSvgPath = path.normalize(`${options.src}/${srcSvgs[svg]}`);
			let thisSvg = fs.readFileSync(thisSvgPath);
			if (path.extname(`${options.src}/${srcSvgs[svg]}`) === '.svg') {
				sprite.add(srcSvgs[svg].substring(0, srcSvgs[svg].indexOf('.svg')), thisSvg);
			} else {
				continue;
			}
		}
		fs.open(options.output, 'w+', (err, outputFD) => {
			if (err) {
				console.log(`${messagePrefix}: ${err.message}`);
				if (debug) {
					console.log(`${err.stack}`);	
				}			
			}
			fs.write(outputFD, sprite, (err, data) => {
				if (err) {
					console.log(`${messagePrefix}: ${err.message}`);
					if (debug) {
						console.log(`${err.stack}`);	
					}			
				}
				console.log(`${messagePrefix}: Success! Wrote ${options.output}`)
			});	
		});
		
	} else {
		throw new Error(`${messagePrefix}: Could not find svgs in ${options.src}`);
	}
} catch (err) {
	console.log(`${messagePrefix}: ${err.message}`);
	if (debug) {
		console.log(`${err.stack}`);	
	}
	return console.log(`${messagePrefix}: Exit...`);
}
 

