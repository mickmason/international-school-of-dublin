(function bcScriptsWrap() {
	/* The scripts object */
	const $bc = (function bigCatScripts() {
		/* Utility functions */
		/* 
			Tests is a selector is a String or DOM Node, retunrs the selected Node if it can
			Returns false otherwise
			*/
		function _getDOMNode(selector) {
			let $el = null;
			if (typeof selector === 'string') {
				if (document.querySelector(selector) === null) {
					return false;
				}
				$el = document.querySelector(selector);
				return $el ;
			} else if (selector instanceof Node) {
				$el = selector;
				return $el;
			} else {
				return false;
			}
		}//_getOMNode() 
		/* 
			Tests will a string selector will return a DOM Node, retunrs an array of Nodes if it can
			Returns false otherwise
			*/
		function _getAllDOMNodes(selector) {
			let $els = null;
			if (typeof selector === 'string') {
				if (document.querySelectorAll(selector) === null) {
					return false;
				}
				$els = document.querySelectorAll(selector);
				return $els ;
			} else {
				return false;
			}
		}//_getAllDOMNodes()
		/* API functions */
		/**
			Add and remove classes
			el:  					DOM element: class toggle target 
			className: 		String: active class to toggle
			callback: 		Callback function, get the el and the className on success
			*/
		function toggleClass(el, classname, callback) {
			if ((el !== undefined && el instanceof Node) && (classname !== undefined && typeof classname === 'string')) {
				el.classList.toggle(classname);
				if (typeof callback == 'function') {
					callback(el, classname);
				}
			} else {
				throw new Error('Function classToggle requires: a HTML Node and a class name of type String');
			}
		}//toggleClass()
		/**
			Select siblings - select the direct next siblings of an element filtered by a classname
			Returns an array of HTMLElements if there is no callback
			el:  					DOM element: find this element's siblings filtered by an optional class 
			className: 		String: Class to filter the list of siblings
			callback: 		Gets the array of matching siblings
			*/
		function selectSiblings(el, classname, callback) {
			if ((el !== undefined && el instanceof Node) && (classname !== undefined && typeof classname === 'string')) {
				let allSiblings = Array.from(el.parentNode.childNodes);
				let matchingSiblings = allSiblings.filter((sibling) => {
					if (classname){
						return (sibling.tagName !== undefined && sibling.classList.contains(classname)) ? sibling : false;		
					} else {
						return (sibling.tagName !== undefined) ? sibling : false;	
					}
				});
				if (callback !== undefined && typeof callback == 'function') {
					callback(matchingSiblings);
				} else {
					return matchingSiblings;
				}
			} else {
				throw new Error('Function selectSiblings requires: a HTML Node and a class name of type String');
			}
		}//selectSiblings()
		/* Check if an element is within the viewport on scroll */
		function isScrollVisible($el, threshold = '50%'){
			console.log(threshold);
		}//isScrollVisible
		/* 
			Remove width and height from iframes
			@arg iframeParents, String selector for the iframe parent or an array of String selector parents
		*/
		function makeResponsiveiFrames(iframeParents) {
			iframeParents = Array.from(document.querySelectorAll(iframeParents));
			if (iframeParents.length > 0) {
				for (let parent in iframeParents) {
					let iframes = Array.from(iframeParents[parent].getElementsByTagName(`iframe`));
					for (let iframe in iframes) {
						iframes[iframe].removeAttribute('width');	
						iframes[iframe].removeAttribute('height'); 	
					}
					iframeParents[parent].classList.remove('is-not-loaded');
				}	
					
			}
			return;
		}//makeResponsiveiFrames
	
		/* Slides an element up or down by transitioning the height */
		/* 
				On click some element, call this
				Show/hide the target element based on the presence or not of the active class
				Add or remove the active class
		*/
		function showHide(el, activeClass) {
			//let startTime = Date.now();
			function _lerpShowHide($el, currentHeight, targetHeight) {
				if (Math.round(targetHeight) > Math.round(currentHeight)) {
					//Show
					currentHeight += (targetHeight - currentHeight) * 0.25;
					requestAnimationFrame(() => {
						$el.style.height = currentHeight + 'px';
						_lerpShowHide($el, currentHeight, targetHeight);
					});
				} else if (Math.round(currentHeight) > Math.round(targetHeight)) {
					//Hide
					if (currentHeight < 2) {
						requestAnimationFrame(() => {
							$el.style.height = 0 + 'px';
						});	
						
						return ;
					}
					currentHeight -= (currentHeight - targetHeight) * 0.25;
					$el.style.height = currentHeight + 'px';
					requestAnimationFrame(() => {
						$el.style.height = currentHeight + 'px';
						_lerpShowHide($el, currentHeight, targetHeight);
					});
				} else {
					
					return ;
				}
			}//_lerpShowHide()
			let $el = null;
			try {
				$el = _getDOMNode(el);	
				
			} catch (err) {
				return console.log(err);
			}
			if ($el.classList.contains(activeClass)) {
				const elHeight = $el.scrollHeight;
				const elTransitions = $el.style.transition;
				$el.style.transition = '';
				requestAnimationFrame(() => {
					$el.style.height = elHeight + 'px';
					$el.style.transition = elTransitions;
					_lerpShowHide($el, elHeight, 0); 
					$el.classList.remove(activeClass);
				});
			} else {
				//show
				const elHeight = $el.scrollHeight;
				requestAnimationFrame(() => {
					_lerpShowHide($el, $el.clientHeight, elHeight) ;
					$el.style.height = null;
					$el.classList.add(activeClass);
					$el.addEventListener('transitionend', () => {
						$el.removeEventListener('transitionend', arguments.callee);
					});
				});
			}
		}//showHide()
		/* 
			Wrapper functions for gsap https://greensock.com/
		*/
		const $gsap = gsap;
		function gsapScrollTo(targetScrollOptions, $el, cb) {
			$el = $el || window;
			$gsap.registerPlugin(ScrollToPlugin); 
			const scrollOptions =  Object.assign({
				scrollTo: {x: 0, y: 0}, 
				duration: 1, 
				ease: 'power1.in'
			}, targetScrollOptions);
			const scrollToTween = $gsap.to($el, scrollOptions).pause();
			if (typeof cb === 'function') {
				scrollToTween.eventCallback('onComplete', cb);
				scrollToTween.play();
			} else {
				scrollToTween.play();	
			}
			
		}
		function gsapFadeIn($el, targetFadeInOpts, cb) {
			if ($el) {
				const fadeInOptions = Object.assign({
					duration: 0.82,
					opacity: 1,
					y: 0
				}, targetFadeInOpts);
				$gsap.to($el, fadeInOptions);
			} else {
				return new Error(`gsapFadeIn requries a target DOMNode`);
			}
			if (typeof cb === 'function') {
				cb($el);
			}
		}
		function gsapShowHide($el, GSAPOptions, cb) {
			if ($el) {
				const opts = Object.assign({
					duration: 0.482,
					ease: 'power1.out'	
				}, GSAPOptions);
				opts.height = ($el.scrollHeight < opts.height) ? opts.height : '0px';
				$gsap.to($el, opts).eventCallback('onComplete', cb, [$el]);
				
			} else {
				return new Error(`gsapFadeIn requries a target DOMNode`);
			}
		}
		function gsapShow($el, height, GSAPOptions, cb) {
			if ($el) {
				const opts = Object.assign({
					duration: 0.482,
					ease: 'power1.out'	
				}, GSAPOptions);
				
				opts.height = height;
				$gsap.to($el, opts).eventCallback('onComplete', cb, [$el]);
				
			} else {
				return new Error(`gsapShow requries a target DOMNode`);
			}
		}
		function gsapHide($el, GSAPOptions, cb) {
			if ($el) {
				const opts = Object.assign({
					duration: 0.482,
					ease: 'power1.out'	
				}, GSAPOptions);
				opts.height = 0;
				$gsap.to($el, opts).eventCallback('onComplete', cb, [$el]);
			} else {
				return new Error(`gsapHide requries a target DOMNode`);
			}
		}
		/* 
			Interface 
		*/
		return {
			toggleClass: toggleClass,
			selectSiblings: selectSiblings,
			responsiveiFrames: makeResponsiveiFrames,
			showHide: showHide,
			isScrollVisible: isScrollVisible,
			gsap: $gsap,
			gsapFns: {
				scrollTo: gsapScrollTo,
				fadeIn: gsapFadeIn,
				showHide: gsapShowHide,
				show: gsapShow,
				hide: gsapHide
			},
			utils: {
				getDomNode: _getDOMNode,
				getDomNodes: _getAllDOMNodes,
			}
		};
	})();	//bigCatScripts()()
	
	/*** Project scripts ***/
	window.onload = () => {
		
		/* Making iFrames responsive */
		$bc.responsiveiFrames('.bc-responsive-embed'); 
		
		/* All feature content components - used through */
		const $pageFeatures = (document.querySelectorAll('.bc-hero, .bc-feature-component').length > 0) ? document.querySelectorAll('.bc-hero, .bc-feature-component') : null;
		/*
			** Navigation components **
		*/
		/** Make nav icons **/
		function navTogglersFactory($navigationToggler, toggleColors = {baseColor: '#000', activeColor: '#fff', baseStrokeColor: '#030303', activeStrokeColor: '#030303'}, duration =  0.482) {
			//Menu icon parts
			const menuIcon = $navigationToggler.querySelector('.bc-menu-icon');
			const menuIconTopLine = menuIcon.querySelector('.bc-menu-icon__icon__line--top');
			const menuIconMiddleLine = menuIcon.querySelector('.bc-menu-icon__icon__line--middle');
			const menuIconBottomLine = menuIcon.querySelector('.bc-menu-icon__icon__line--bottom');
			
			//Icon active/inactive transitions timeline
			const activeTransitionTl = $bc.gsap.timeline().pause();
			
			activeTransitionTl.to(menuIconMiddleLine, {duration: duration, x: '200%' });
			activeTransitionTl.to(menuIconTopLine, {duration: duration/2, y: '47%', rotation: '45deg', transformOrigin: 'center', stroke: toggleColors.activeStrokeColor},'-='+duration);
			activeTransitionTl.to(menuIconBottomLine, {duration: duration/2, y: '-47%', rotation: '-45deg', transformOrigin: 'center', stroke: toggleColors.activeStrokeColor}, '-='+duration); 
			activeTransitionTl.to($navigationToggler, {duration: duration/2, backgroundColor: toggleColors.activeColor}, '-='+duration); 
			
			const inactiveTransitionTl = $bc.gsap.timeline().pause();
			
			inactiveTransitionTl.to(menuIconMiddleLine, {duration: 0.24, x: 0 }); 
			inactiveTransitionTl.to(menuIconTopLine, {stroke: toggleColors.baseStrokeColor, y: '0%', rotation: '0deg', transformOrigin: 'center', duration: duration/2}, '-='+duration);
			inactiveTransitionTl.to(menuIconBottomLine, {stroke: toggleColors.baseStrokeColor, y: '0%', rotation: '0deg', transformOrigin: 'center', duration: duration/2}, '-='+duration); 
			inactiveTransitionTl.to($navigationToggler, {backgroundColor: toggleColors.baseColor, duration: duration/2}, '-='+duration); 
			
			const animateInTl = $bc.gsap.timeline().pause();
			$navigationToggler.addEventListener('bc-is-visible', () => {
				animateInTl.to([menuIconTopLine, menuIconMiddleLine, menuIconBottomLine], {x: 0});	
			});
			$navigationToggler.addEventListener('click', (evt) => {
				evt.preventDefault();
				const $this = evt.currentTarget;
				if ($this.classList.contains('is-active')) {
					inactiveTransitionTl.play(0);
					$this.classList.toggle('is-active');	
				} else {
					activeTransitionTl.play(0);
					$this.classList.toggle('is-active');	
				}
			});
			
			return $navigationToggler;
		}//navTogglersFactory
		
		/** Main navigation **/
		navTogglersFactory(document.querySelector('.bc-main-navigation-toggle .bc-navigation-toggle'), {baseColor: 'transparent', activeColor: '#fff', baseStrokeColor: '#fff', activeStrokeColor: '#303030'});
		document.querySelector('.bc-main-navigation-toggle').addEventListener('click', (event) => {
			event.preventDefault();
			let $siteHeader = null;
			$siteHeader = event.currentTarget.closest('.bc-site-header');
			requestAnimationFrame(() => {
				$siteHeader.classList.toggle('has-active-navigation');	
			});
		}, true);
		
		/** end Main navigation **/
		

		/** Landing page navigation **/ 
		let $landingPageToggle = (document.querySelector('.feature-page-navigation__toggle')) ? document.querySelector('.feature-page-navigation__toggle') : null;
		const $landingPageNavList = (document.querySelector('.feature-page-navigation__list')) ? document.querySelector('.feature-page-navigation__list') : null;
		
		if ($landingPageNavList && $landingPageToggle) {
			let $landingPageNav = $landingPageNavList.closest('.feature-page-navigation');
			//const targetHeight = $landingPageNavList.scrollHeight + 3;
			
			$landingPageToggle = navTogglersFactory($landingPageToggle, {baseColor: '#017CC0', activeColor: '#F2EF11', baseStrokeColor: '#fff', activeStrokeColor: '#017CC0'});
			
			$landingPageToggle.addEventListener('click', (evt) => {
				evt.preventDefault();
				evt.stopPropagation();
				const duration = 0.4;
				const ease = 'ease.out';
				const $thisWrapper =  $landingPageNav.querySelector('.feature-page-navigation__wrapper');
				//$thisWrapper.style.height = 0;
				if ($thisWrapper.classList.contains('is-active')) { 	
					$bc.gsap.to($thisWrapper, {height: 0, duration: duration, ease: ease}).eventCallback('onComplete', () => {
						$thisWrapper.classList.toggle('is-active'); 
					});
				} else {
					$bc.gsap.to($thisWrapper, {height: $thisWrapper.scrollHeight, duration: duration, ease: ease}).eventCallback('onComplete', () => {
						$thisWrapper.classList.toggle('is-active');
					});
				}
			});
			//set up links
			const $landingPageNavLinks = (document.querySelectorAll('.feature-page-navigation__item > a').length > 0) ? document.querySelectorAll('.feature-page-navigation__item a') : null;
			if ($landingPageNavLinks) {
				for (let $landingPageNavLink of $landingPageNavLinks) {
					$landingPageNavLink.addEventListener('click', (evt) => {
						/* If it is not a site quicklink */
						if ($landingPageNavLink.classList.contains('.is-site-quicklink') === false) {
							evt.preventDefault();
							let linkTarget = document.querySelector($landingPageNavLink.getAttribute('href'));
							$bc.gsapFns.scrollTo({scrollTo: {y: linkTarget.offsetTop}, duration: 0.360});
						}
					});
				}
			}
			
		}//if landing page nav
		/** Landing page floating navigation **/ 
		function toggleFloatingNav() {
			const dur = 0.4; 
			const easing = 'back(0.5)';
			if ($floatingNav.classList.contains('is-visible')) {	
				$bc.gsap.to($floatingNav, {bottom: '-100%', duration: dur, ease: easing}).eventCallback('onComplete', () => {
					$floatingNav.classList.remove('is-visible');
				});
			} else {
				$bc.gsap.to($floatingNav, {bottom: '3%', duration: dur, ease: easing}).eventCallback('onComplete', () => {
					$floatingNav.classList.add('is-visible');
				});
			}
		}
		const $floatingNav = (document.querySelector('.feature-page-navigation--floating')) ? document.querySelector('.feature-page-navigation--floating') : null;
		if ($floatingNav) {
			const scrollThreshold = $floatingNav.scrollHeight;
			const $floatingNav_toggleNav = navTogglersFactory($floatingNav.querySelector('.feature-page-navigation__toggle-nav__link'), {baseColor: '#017CC0', activeColor: '#fff', baseStrokeColor: '#fff', activeStrokeColor: '#303030'});
			const $floatingNav_toTop = $floatingNav.querySelector('.feature-page-navigation__to-top');
			const $floatingNav_nav = $floatingNav.querySelector('.feature-page-navigation__wrapper');
			$bc.gsap.set($floatingNav_nav, {opacity: 0, display: 'none'});  
			
			if (window.scrollY >= scrollThreshold && $floatingNav.classList.contains('is-visible') === false) {
				toggleFloatingNav();
			}
			window.onscroll = () => {
				if (window.scrollY >= scrollThreshold && $floatingNav.classList.contains('is-visible') === false) {
					toggleFloatingNav();
				} else if (window.scrollY < scrollThreshold && $floatingNav.classList.contains('is-visible')) {
					toggleFloatingNav();
				}
			};
			$floatingNav_toggleNav.addEventListener('click', (evt) => {
				evt.stopPropagation();
				const $this = evt.currentTarget;
				if ($this.classList.contains('is-active')) {
					$bc.gsap.to($floatingNav_nav, {opacity: 1, duration: 0.328, display: 'block', delay: 0.12}).eventCallback('onComplete', () => {
						$floatingNav_nav.classList.toggle('is-active');
					});	
					
				} else {
					$bc.gsap.to($floatingNav_nav, {opacity: 0,  duration: 0.328, display: 'none', delay: 0.12}).eventCallback('onComplete', () => {
						$floatingNav_nav.classList.toggle('is-active');
					});	
				}
			});
			$floatingNav_toTop.addEventListener('click', (evt) => {
				evt.stopPropagation();
				$bc.gsapFns.scrollTo({scrollTo: {y: 0}, duration: 0.360});
			});
		}
		/* Section subnavigation component */
		const $sectionSubNav = (document.querySelector('.bc-inner-page-header__sub-nav')) ? document.querySelector('.bc-inner-page-header__sub-nav') : null;
		if ($sectionSubNav) {
			const $navToggle = $sectionSubNav.querySelector('.bc-inner-page-header__sub-nav__toggle__icon');
			const $navToggleIcon = $navToggle.querySelector('.bc-inner-page-header__sub-nav__toggle__icon .bc-svg-icon');
			const $navBody = $sectionSubNav.querySelector('.bc-inner-page-header__sub-nav__links');
			$navToggle.addEventListener('click', (evt) => {
				evt.preventDefault();
				if ($navToggle.classList.contains('is-active')) {
					$bc.gsap.to($navBody, {opacity: 0, duration: 0.328, display: 'none'}).eventCallback('onComplete', () => {
						$navBody.classList.toggle('is-active');
						$navToggle.classList.toggle('is-active');
					});
					$bc.gsap.to($navToggleIcon, {rotate: '90deg', duration: 0.180});	
				} else {
					$bc.gsap.to($navBody, {opacity: 1, duration: 0.328, display: 'block'}).eventCallback('onComplete', () => {
						$navBody.classList.toggle('is-active');
						$navToggle.classList.toggle('is-active');
					});	
					$bc.gsap.to($navToggleIcon, {rotate: '-90deg', duration: 0.180});
				}
			});
			
		}// Section subnavigation component
		
		/** 
			*	Animate elements as they become visible
			*	.bc-fade-in-up--is-not-visible has not been seen
			*	.bc-fade-in-up--is-visible has been seen
		**/
		/* 
			* 					-- If !(IntersectionObserver in window) -- 
		*/
		// Custom event - fired when an element becomes visible in the viewport
		const bcIsVisibleEvt = document.createEvent('Event');
		bcIsVisibleEvt.initEvent('bc-is-visible', true, true);
		const animatableElements = document.querySelectorAll('.bc-feature-component .bc-fade-in-up--is-not-visible, .bc-hero .bc-fade-in-up--is-not-visible');
		for (const $el of animatableElements) {
			//bc-is-visible handler
			$el.addEventListener('bc-is-visible', () => {
				//Fade in up
				/*$bc.gsapFns.fadeIn($el, {duration: 1, y: 20}, ($el) => {
					$el.classList.remove('bc-fade-in-up--is-not-visible');
					$el.classList.add('bc-fade-in-up--is-visible');
				});*/
			});
		}
		document.addEventListener('scroll', () => {
			for (const $el of animatableElements) {
				//Test visibility using $bc.isScrollVisible()
				if ($el.classList.contains('bc-fade-in-up--is-not-visible') ) {
					$el.dispatchEvent(bcIsVisibleEvt);	
				}
			}
		});
		//* If (IntersectionObserver in window) */
		/*const featuresObserverOptions = {
			threshold: [0.1, 0.2, 0.25, 0.3, 0.5, 0.9]
		};*/
		const bcFeaturesFadeInOptions = {
			rootMargin: '0% 0% 0% 0%',
			threshold: [0, 0.20, 0.382, 0.5, 0.75, 0.95]
		};
		const bcHeroesFadeInOptions = {
			rootMargin: '0% 0% 0% 0%',
			threshold: [0.15, 0.20, 0.382, 0.5, 0.75, 0.95]
		};
		
		/* Observer for Features */
		const bcFeaturesFadeInObserver = new IntersectionObserver((entries, observer) => {
			const targets = entries.filter(entry => {
				if (entry.isIntersecting) {
					observer.unobserve(entry.target);
					return entry;
				} 
			}).map(entry => {
				return entry.target;
			}); 
			
			if (targets.length > 0 ) {
				$bc.gsap.to(targets, {y: 0, opacity: 1, duration: 1.125, ease: 'power4.out', stagger: 0.2});	
			}
		}, bcFeaturesFadeInOptions);
		//Observe all fadable elements in feature components
		const bcFadeInFeatures = document.querySelectorAll('.bc-feature-component .bc-fade-in-up--is-not-visible');
		if (bcFadeInFeatures.length > 0) {
			for (let fadeInFeature of bcFadeInFeatures) {
				bcFeaturesFadeInObserver.observe(fadeInFeature);	
			}
		}
		/* Observer for Heroes */
		const bcHeroesFadeInObserver = new IntersectionObserver((entries, observer) => {
			for (let entry of entries) {
				if (entry.intersectionRatio > 0) {
					const $target = entry.target;
					let yTarget = -30;
					if (window.innerWidth >= 768 && window.innerHeight >= 600) {
						yTarget = -60;
					}
					if (window.innerWidth >= 1600) {
						yTarget = -110; 
					}
					$bc.gsapFns.fadeIn($target, {y: yTarget, opacity: 1, duration: 1.125, ease: 'power4.out'});
					if ($target.classList.contains('bc-feature-component__next')) {
						$bc.gsap.to($target.querySelector('.bc-svg-icon'), {rotation: '90deg', duration: 1, ease: 'power4.out', delay: 0.4});
					}
					observer.unobserve($target);
				}
			}
		}, bcHeroesFadeInOptions);
		const bcHeroesFadeInFeatures = document.querySelectorAll('.bc-hero .bc-fade-in-up--is-not-visible:not(.bc-feature-component__next)'); 
		
		if (bcHeroesFadeInFeatures.length > 0) {			
			for (let fadeInFeature of bcHeroesFadeInFeatures) {
				bcHeroesFadeInObserver.observe(fadeInFeature);	
			}
		}
		
		/** Feature components, Heroes scroll to next content onclick **/
		if ($pageFeatures) {
			//For each node in the list 
			$pageFeatures.forEach(($this) =>{
				
				//Project specific - if this is a hero component and it has the site quick nav embedded or if it is not full VH in it then skip it
				if ($this.classList.contains('has-quick-nav') || $this.classList.contains('is-full-vh') === false) {
					return;
				} 
				if ($this.nextElementSibling) {
					const $nextSibling = $this.nextElementSibling;
					//Skip this if the next element is the CTA feature
					if ($nextSibling.classList.contains('.bc-cta-feature')) {
						return;
					}
					const linkText = ($nextSibling.getAttribute('aria-label')) ? 'Next: '+$nextSibling.getAttribute('aria-label') : 'Next content' ;	
					const $thisCTA = $this.querySelector('.bc-hero__cta, .bc-feature-component__cta');
					if ($thisCTA  && $thisCTA.querySelector('.bc-feature-component__next')) {
						const $nextLinkText = $thisCTA.querySelector('.bc-feature-component__next__text');
						//const $nextLinkIcon = $thisCTA.querySelector('.bc-feature-component__next__icon svg');
						$nextLinkText.innerHTML = '';
						$nextLinkText.append(document.createTextNode(linkText));
						$nextLinkText.addEventListener('click', (evt) => {
							evt.preventDefault(); 
							$bc.gsapFns.scrollTo({scrollTo: {y: $nextSibling.offsetTop}, duration: 0.360});
						});
					}
				} else {
					return;
				}
			});
		}
		/* 
			** Flickty sliders 
		*/
		if (document.querySelector('.bc-flickty-slider')) {
			const $sliderElement = document.querySelector('.bc-flickty-slider');
			const $sliderNext = document.querySelector('.bc-flickty-slider__next');
			const $sliderPrev = document.querySelector('.bc-flickty-slider__prev');
			const $slider = new Flickity($sliderElement, {
				cellSelector: '.bc-flickty-slider__slide',
				prevNextButtons: false,
				pageDots: false
			});
			if ($slider.selectedIndex === 0) {
				$sliderPrev.classList.add('is-inactive');	
				$sliderNext.classList.remove('is-inactive');	
			} else if ($slider.selectedIndex === $slider.cells.length -1) {
				$sliderPrev.classList.remove('is-inactive');
				$sliderNext.classList.add('is-inactive');	
			} else {
				$sliderPrev.classList.remove('is-inactive');	
				$sliderNext.classList.remove('is-inactive');	
			}
			if ($sliderElement.querySelectorAll('.bc-flickty-slider__slide--video').length > 0) {
				const $videoSlide = $sliderElement.querySelectorAll('.bc-flickty-slider__slide--video')[0];
				const $videoSlideWrap = $sliderElement.querySelectorAll('.bc-flickty-slider__video-wrap')[0];
				$bc.responsiveiFrames('.bc-flickty-slider .bc-flickty-slider__slide--video');
				
				//	const $videoSlideContent = $videoSlide.querySelector('.bc-flickty-slider__slide__content'); 
				//const $videoSlidePlay = $videoSlide.querySelector('.bc-flickty-slider__slide--video__play'); 
				const $videoSlideHeading = $videoSlide.querySelector('.bc-flickty-slider__slide__heading');
				const $videoSlideSubHeading = $videoSlide.querySelector('.bc-flickty-slider__slide__sub-heading');
				const $videoSlideLeader = $videoSlide.querySelector('.bc-flickty-slider__slide__leader');
				const $videoSlideLink = $videoSlide.querySelector('.bc-flickty-slider__slide__link'); 
				const videoSliderElements = [$videoSlideHeading, $videoSlideSubHeading, $videoSlideLink, $videoSlideLeader];
				
				$videoSlideHeading.style.top = $videoSlideHeading.offsetTop + 'px'; 
				
				const videoTl = $bc.gsap.timeline().pause();
				videoTl.to(videoSliderElements, {y: 50, opacity: 0, transformOrigin: 'left bottom'});
				videoTl.set($videoSlideWrap, {display: 'block', opacity: 0, y: -50});
				//videoTl.set([$videoSlidePlay, $videoSlideHeading, $videoSlideSubHeading], {display: 'none'});
				videoTl.set([$videoSlideLink, $videoSlideLeader], {y: -20});
				videoTl.to($videoSlideWrap, {opacity: 1, y: 0});
				videoTl.to([$videoSlideLink, $videoSlideLeader], {opacity: 1, y: 0});
				//videoTl.to($, {height: 0});
				
				/*$videoSlidePlay.addEventListener('click', (evt) => {
					evt.preventDefault();
					const $this = evt.currentTarget;
					videoTl.play();
					
					$this.removeEventListener('click', arguments.callee);
				});*/
			}
			$sliderNext.addEventListener('click', (evt) => { 
				evt.preventDefault();
				$slider.next();
				if ($slider.selectedIndex === 0) {
					$sliderPrev.classList.add('is-inactive');
					$sliderNext.classList.remove('is-inactive');
				} else if ($slider.selectedIndex === $slider.cells.length -1) {
					$sliderPrev.classList.remove('is-inactive');
					$sliderNext.classList.add('is-inactive');	
				} else {
					$sliderPrev.classList.remove('is-inactive');	
					$sliderNext.classList.remove('is-inactive');	
				}
			});
			$sliderPrev.addEventListener('click', (evt) => {
				evt.preventDefault();
				$slider.previous(); 
				if ($slider.selectedIndex === 0) {
					$sliderPrev.classList.add('is-inactive');
					$sliderNext.classList.remove('is-inactive');
				} else if ($slider.selectedIndex === $slider.cells.length -1) {
					$sliderPrev.classList.remove('is-inactive');
					$sliderNext.classList.add('is-inactive');	
				} else {
					$sliderPrev.classList.remove('is-inactive');	
					$sliderNext.classList.remove('is-inactive');	
				}
			});
		}// end if .bc-flickty-slider
		/* Expandible blocks */
		if (document.querySelectorAll('.bc-expandible-block__expander__button').length > 0) {
			const $expandButtons = document.querySelectorAll('.bc-expandible-block__expander__button');
			for (let $btn of $expandButtons) {
				const $expandableBlock = $btn.closest('.bc-expandible-block');
				const $expandableBody = $expandableBlock.querySelector('.bc-expandible-block__body'); 
				$btn.addEventListener('click', () => {
					/*const duration = 0.618;
					const ease = 'power1.in';*/
					if ($btn.classList.contains('is-active')) {
						hideAccordionBody($expandableBody, () => {
							$btn.classList.toggle('is-active');	
							
						});
						/*$bc.gsap.to($expandableBody, {height: 0, duration: duration, ease: ease}).eventCallback('onComplete', () => {
							$btn.classList.toggle('is-active');	
						});	*/
					} else {
						showAccordionBody($expandableBody, () => {
							$btn.classList.toggle('is-active');	
							
						});
						$bc.gsapFns.scrollTo({scrollTo: {y: $expandableBlock.offsetTop}, duration: 0.2});
						/*$bc.gsap.to($expandableBody, {height: $expandableBody.scrollHeight, duration: duration, ease: ease}).eventCallback('onComplete', () => {
							$btn.classList.toggle('is-active');	 
						});*/
					}
				});
			}
		}/* End Expandible blocks */
		/** Accordion components **/ 
		function showAccordionBody(accordionBody, cb) {
			if (accordionBody.classList.contains('is-active') === false) {
				$bc.gsap.to(accordionBody, {height: accordionBody.scrollHeight + 'px'}).eventCallback('onComplete', () => {
					accordionBody.classList.toggle('is-active');
					if (typeof cb === 'function') {
						cb();
					}
				});
			} else {
				return;
			}
		}
		function hideAccordionBody(accordionBody, cb) {
			if (accordionBody.classList.contains('is-active')) {
				$bc.gsap.to(accordionBody, {height: 0 + 'px'}).eventCallback('onComplete', () => {
					accordionBody.classList.toggle('is-active');
					if (typeof cb === 'function') {
						cb();
					}
				});	
			} else {
				return;
			}
		}
		if (document.querySelectorAll('.bc-accordion').length > 0) {
			const accordions = document.querySelectorAll('.bc-accordion');
			for (let $accordion of accordions) {
				const accordionTriggers = $accordion.querySelectorAll('.bc-accordion__block-trigger');
				for (let $accordionTrigger of accordionTriggers) {
					$accordionTrigger.addEventListener('click', (evt) => {
						evt.preventDefault();
						const $accordionTriggerIcon = $accordionTrigger.querySelector('.bc-accordion__block-trigger__icon > .bc-svg-icon');
						const $accordionBody = $accordionTrigger.closest('.bc-accordion__block-heading').nextElementSibling;
						const $accordionHeading = $accordionBody.previousElementSibling;
						if ($accordionTrigger.classList.contains('is-active') === false) {
							showAccordionBody($accordionBody);
							$bc.gsap.to($accordionTriggerIcon, {rotate: '90deg', duration: 0.1}).eventCallback('onComplete', () => {
								$accordionTrigger.classList.toggle('is-active');
							});
							$bc.gsapFns.scrollTo({scrollTo: {y: $accordionHeading.offsetTop}, duration: 0.2});
						} else {
							hideAccordionBody($accordionBody);
							$bc.gsap.to($accordionTriggerIcon, {rotate: '45deg', duration: 0.1}).eventCallback('onComplete', () => {
								$accordionTrigger.classList.toggle('is-active');
							});
							$bc.gsapFns.scrollTo({scrollTo: {y: $accordionHeading.offsetTop}, duration: 0.2}); 
						}						
					});	
				}
				const accordionCloseLinks = $accordion.querySelectorAll('.bc-accordion__block-body .bc-accordion__close > a');
				for (let $accordionCloseLink of accordionCloseLinks) {
					$accordionCloseLink.addEventListener('click', (evt) => {
						evt.preventDefault();
						const $thisBody = $accordionCloseLink.closest('.bc-accordion__block-body');
						const $thisHeading = $thisBody.previousElementSibling;
						
						const $accordionTrigger = $thisHeading.querySelector('.bc-accordion__block-trigger');
						const $accordionTriggerIcon = $accordionTrigger.querySelector('.bc-accordion__block-trigger__icon > .bc-svg-icon');
						hideAccordionBody($thisBody);
						$bc.gsap.to($accordionTriggerIcon, {rotate: '45deg', duration: 0.1}).eventCallback('onComplete', () => {
							$accordionTriggerIcon.classList.toggle('is-active');
						});
						$bc.gsapFns.scrollTo({scrollTo: {y: $thisHeading.offsetTop}, duration: 0.2, delay: 0.2}); 
						
					});
				}
			}
		}// Accordion components
	};/*** // window.onload Project scripts ***/
	
})();// bcScriptsWrap()