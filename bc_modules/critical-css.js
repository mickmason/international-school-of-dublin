(function () {
	
	/** Debug or not debug **/
	const debug = true;
	
	const fs = require('fs');
	const path = require('path');
	const critical = require('critical');
	const yargs = require('yargs');
	
	
	let sourcePath = null;
	let isDir = false;
	const messagePrefix = '[critical-css.js]';
	/*
	 *** Options for critical 
	*/
	let criticalOptions = {} ;
	
	/*
	 *** 	Set up Command line arguments to the script:
  		--help            Show help                       [boolean]
  		--version         Show version number             [boolean]
  		--base, -b        Critical base directory         [string]
  		--inline, -i      Write critical styles inline    [boolean]
  		--css, -c         CSS source file                 [array]
  		--width, -w       Target viewport width           [number]
  		--height, -t      Target viewport height          [number]
  		--dimensions, -n  Target viewport dimensions      [array]
  		--dest, -d        Provide a file for output       [string]
  		--minify, -m      Minify output                   [boolean]
  		--ignore, -g      Minify output                   [array]
	**/
	const argv = yargs.option('base', {
		alias: 'b',
		description: 'Critical base directory',
		type: 'string'
	}).option('inline', {
		alias: 'i',
		description: 'Write critical styles inline',
		type: 'boolean'
	}).option('css', {
		alias: 'c',
		description: 'CSS source file',
		type: 'string'
	}).array('css').option('width', {
		alias: 'w',
		description: 'Target viewport width',
		type: 'number'
	}).option('height', {
		alias: 't',
		description: 'Target viewport height',
		type: 'number'
	}).option('dimensions', {
		alias: 'n',
		description: 'Target viewport dimensions',
		type: 'string'
	}).array('dimensions').option('dest', {
		alias: 'd',
		description: 'Provide a file for output',
		type: 'string'
	}).option('minify', {
		alias: 'm',
		description: 'Minify output',
		type: 'boolean'
	}).option('ignore', {
		alias: 'g',
		description: 'Minify output',
		type: 'string'
	}).array('ignore')
	.usage(messagePrefix + ' Provide a source file or directory as the first CLI argument or as src value in ./critical-css.config.js')
	.argv;	

	/* 
	 *** Search for config file 
	*/
	const fsFiles = fs.readdirSync('./'); 
	if (fsFiles.includes('critical-css.config.js')) {
			Object.assign(criticalOptions, require('../'+fsFiles[fsFiles.indexOf('critical-css.config.js')]));
	}
	
	/* 
	 *** Handle command line arguments 
	*/	
	criticalOptions.base 				= (argv.base) ? (argv.base) : criticalOptions.base; 
	criticalOptions.inline 			= (argv.inline || argv.dest === undefined) ? true : criticalOptions.inline;
	criticalOptions.minify 			= (argv.minify) ? true : criticalOptions.minify;
	criticalOptions.src 				= (argv._[0]) ? (argv._[0]) : criticalOptions.src;	
	criticalOptions.dest 				= (argv.dest) ? (argv.dest) : (criticalOptions.dest !== undefined) ? criticalOptions.dest : criticalOptions.src; 
	criticalOptions.css 				= (argv.css) ? (argv.css) : criticalOptions.css; 
	criticalOptions.width 			= (argv.width) ? (argv.width) : criticalOptions.width; 
	criticalOptions.height 			= (argv.height) ? (argv.height) : criticalOptions.height; 
	criticalOptions.dimensions 	= (argv.dimensions) ? (argv.dimensions) : criticalOptions.dimensions;
	
	/* 
	 ***	 Check there is a src in critialOptions
	 			 Quit if not
	*/
	if (criticalOptions.src === undefined && fs.statSync(criticalOptions.src).isDirectory() === false && fs.statSync(criticalOptions.src).isFile() === false) {
		console.error(`${messagePrefix} Provide source file or directory as the first CLI argument or as the src value in critical-css.config.js`);
		console.log(`${messagePrefix} Use ${argv.$0} --help for more`);
		return;
	} else {
		sourcePath = (argv._[0] || criticalOptions.src);
	}
	/* 
	 *** Is the source path a directory
	*/
	isDir = fs.statSync(criticalOptions.src).isDirectory();
	
	/* 
	 *** Execute critical.generate 
	 */
	try {
		if (isDir) {
			try {
				criticalAsync(recursiveFileSearch(process.cwd() + '/' +sourcePath, '.html'), criticalOptions);	
			} catch (err) {
				console.log(err.message);
				(debug) ? console.error(e.stack) : false ;
			}
			
		} else {
			critical.generate(criticalOptions);	
		}
	} catch (e) {
		console.error(e.message);
		(debug) ? console.error(e.stack) : false ;
	} 
	
	/* 
		**	Recursively search for files by extension
		**	sourcePath is an absolute file path, extn is a file extension
		** 	Returns an array of absoulte file paths
		** 	@param sourcePath is the root of a file system brach
		**	@param extn is a file extension to get
	*/
	function recursiveFileSearch(sourcePath, extn) {
		let filesArray = [];
		recursiveReadDirs(sourcePath);
		
		/* Does the recursive search */
		function recursiveReadDirs(sourcePath) {
			let subdirs = [];
			let files = fs.readdirSync(sourcePath);
			let $i = 0;			
			for (file of files) {		
				file = path.normalize(sourcePath + '/' + file);
				if (fs.statSync(file).isDirectory()) {
					subdirs.push(file);
				} else if (fs.statSync(file).isFile() && path.extname(file) === extn) {
					filesArray.push(file);
				}
			}
			if (subdirs.length > 0) {
				for (subdir of subdirs) {
					recursiveReadDirs(path.normalize(subdir));
				}
			}
			return true;
		}
		return (filesArray.length) ? filesArray : false;
	}
	/*
		**	Asynchronous wrapper for critical.generate()
		**	Using await to proecss an array of files 
		** 	@param files is an array of HTML files
		**	@param options is a set of critical options
	*/
	async function criticalAsync(files, options) {
		if (!files.length || !options) {
			throw new Error(`${messagePrefix} Provide a source path and options`)
		}
		const startSrc = criticalOptions.src;
		for (let $i = 0; $i < files.length; $i++) {
			console.log(`Critical on file ${$i} of ${files.length}`);
			let htmlFile = files[$i];
			htmlFile = htmlFile.slice(htmlFile.indexOf(startSrc));
			options.src = htmlFile;
			options.dest = htmlFile;
			await critical.generate(options);				
		}
	}
	
	
})();