module.exports = {
	src: {
		icons: './app/media/svg/icons',
		images: './app/media/svg/images'
	},
	output: {
		icons: './dist/media/svg/icons/bc-svgs.svg',
		images: './dist/media/svg/images/bc-svg-images.svg'
	},
	cleanDefs: true,
	cleanSymbols: true,
	svgAttrs: false,
	symbolAttrs: {
		viewBox: '0 0 100 100'
	},
	copyAttrs: false,
	renameDefs: false
}