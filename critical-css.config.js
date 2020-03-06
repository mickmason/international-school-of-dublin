module.exports = {
	base: './', 
	inline: true,
	html: undefined,
	src: 'dist/',	
	isDir: true,
	css: 'dist/css/style.css', 
	dest: 'dist/', 
	width: undefined, 
	height: undefined, 
	dimensions:  [{
			width: 360,
			height: 640
		 },
		 {
			width: 1366,
			height: 768
		 },
		{
			width: 1440,
			height: 900
		},
		{
			width: 1920,
			height: 1080
	}],
	extract: true,
	minify: false,
	pathPrefix: undefined,
	ignore: undefined,
	ignoreOptions: {},
};