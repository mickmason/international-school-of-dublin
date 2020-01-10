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
	copyAttrs: false,
	renameDefs: false
}