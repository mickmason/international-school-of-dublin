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
			@arg iframeParents, String selector for the iframe parent or and array of String selector parents
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
				}	
				iframeParents[parent].classList.remove('is-not-loaded');	
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
		function gsapShowHide($toggler, $el, activeClass, GSAPOptions, cb) {
			if ($el && $toggler) {
				const targetHeight = ($el.classList.contains(activeClass)) ? '0px' : $el.scrollHeight;
				const opts = Object.assign({
					height: targetHeight,
					duration: 0.482,
					ease: 'power1.out'	
				}, GSAPOptions);
				
				if (GSAPOptions.height !== undefined) {
					opts.height = ($el.classList.contains(activeClass)) ? '0px' : GSAPOptions.height;
				}
				if (GSAPOptions.paddingTop !== undefined) {
					opts.paddingTop = ($el.classList.contains(activeClass)) ? '0px' : GSAPOptions.paddingTop;
				}
				if (GSAPOptions.paddingBottom !== undefined) {
					opts.paddingBottom = ($el.classList.contains(activeClass)) ? '0px' : GSAPOptions.paddingBottom;
				}
				if (GSAPOptions.marginTop !== undefined) {
					opts.marginTop = ($el.classList.contains(activeClass)) ? '0px' : GSAPOptions.marginTop;
				}
				$gsap.to($el, opts).eventCallback('onComplete', cb, [$toggler, $el]);
				
				if ($el.classList.contains(activeClass)) {
					$el.classList.remove(activeClass);
				} else {
					$el.classList.add(activeClass);
				}
			} else {
				return new Error(`gsapFadeIn requries a target DOMNode`);
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
				showHide: gsapShowHide
			},
			utils: {
				getDomNode: _getDOMNode,
				getDomNodes: _getAllDOMNodes,
			}
		};
	})();	//bigCatScripts()()
	
	/*** Project scripts ***/
	window.onload = () => {
		
		$bc.responsiveiFrames('.bc-responsive-embed'); 
		const $pageFeatures = (document.querySelectorAll('.bc-hero, .bc-feature-component').length > 0) ? document.querySelectorAll('.bc-hero, .bc-feature-component') : null;
		
		/** Main navigation **/
		navTogglersFactory(document.querySelector('.bc-main-navigation-toggle .bc-navigation-toggle'), {baseColor: 'transparent', activeColor: '#fff', baseStrokeColor: '#fff', activeStrokeColor: '#303030'});
		document.querySelector('.bc-main-navigation-toggle').addEventListener('click', (event) => {
			event.preventDefault();
			let siteHeader = null;
			siteHeader = event.currentTarget.closest('.bc-site-header');
			siteHeader.classList.toggle('has-active-navigation');
		}, true);
		
		if (document.querySelectorAll('.bc-expandible-block__expander__button').length > 0) {
			const $expandButtons = document.querySelectorAll('.bc-expandible-block__expander__button');
			for (let $btn of $expandButtons) {
				const $expandableBlock = $btn.parentElement.parentElement;
				const $expandableBody = $expandableBlock.querySelector('.bc-expandible-block__body'); 
				$btn.addEventListener('click', () => {
					$bc.showHide($expandableBody, 'is-active');		
					requestAnimationFrame(() => {
						$btn.classList.toggle('is-active');	
					});
				});
			}
		}
		/** end Main navigation **/
		/** Nav icons **/
		function navTogglersFactory($navigationToggler, toggleColors = {baseColor: '#000', activeColor: '#fff', baseStrokeColor: '#030303', activeStrokeColor: '#030303'}, duration =  0.482) {
			//Menu icon parts
			const menuIcon = $navigationToggler.querySelector('.bc-menu-icon');
			const menuIconTopLine = menuIcon.querySelector('.bc-menu-icon__icon__line--top');
			const menuIconMiddleLine = menuIcon.querySelector('.bc-menu-icon__icon__line--middle');
			const menuIconBottomLine = menuIcon.querySelector('.bc-menu-icon__icon__line--bottom');
			
			//Icon active/inactive transitions timeline
			const activeTransitionTl = $bc.gsap.timeline().pause();
			
			activeTransitionTl.to(menuIconMiddleLine, {duration: duration, opacity: 0 });
			activeTransitionTl.to(menuIconTopLine, {duration: duration/2, y: '50%', x: '50%', rotation: '45deg', transformOrigin: '50% 50%', stroke: toggleColors.activeStrokeColor}, '-='+duration*1.75);
			activeTransitionTl.to(menuIconBottomLine, {duration: duration/2, y: '-50%', x: '50%', rotation: '-45deg', transformOrigin: '50% 50%', stroke: toggleColors.activeStrokeColor}, '-='+duration*1.75); 
			activeTransitionTl.to($navigationToggler, {duration: duration/2, backgroundColor: toggleColors.activeColor}, '-='+duration*2); 
			
			const inactiveTransitionTl = $bc.gsap.timeline().pause();
			
			inactiveTransitionTl.to(menuIconMiddleLine, {duration: duration, opacity: 1 }); 
			inactiveTransitionTl.to(menuIconTopLine, {stroke: toggleColors.baseStrokeColor, y: '0%', x: '0%', rotation: '0deg', transformOrigin: '50% 50%', duration: duration/2}, '-='+duration);
			inactiveTransitionTl.to(menuIconBottomLine, {stroke: toggleColors.baseStrokeColor, y: '0%', x: '0%', rotation: '0deg', transformOrigin: '50% 50%', duration: duration/2}, '-='+duration); 
			inactiveTransitionTl.to($navigationToggler, {backgroundColor: toggleColors.baseColor, duration: duration/2}, '-='+duration); 
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

		/** Landing page navigation **/ 
		const $landingPageToggle = (document.querySelector('.feature-page-navigation__toggle')) ? document.querySelector('.feature-page-navigation__toggle') : null;
		const $landingPageNav = (document.querySelector('.feature-page-navigation__list')) ? document.querySelector('.feature-page-navigation__list') : null;
		
		if ($landingPageNav && $landingPageToggle) {
			const targetHeight = $landingPageNav.scrollHeight;
			$landingPageNav.style.height = 0;
			$landingPageNav.style.paddingTop = 0;
			$landingPageNav.style.paddingBottom = 0;
			$landingPageNav.style.marginTop = 0;
			
			navTogglersFactory($landingPageToggle, {baseColor: '#017CC0', activeColor: '#fff', baseStrokeColor: '#fff', activeStrokeColor: '#017CC0'});
			
			$landingPageToggle.addEventListener('click', (evt) => {
				evt.preventDefault();
				evt.stopPropagation();
				console.log('landing page toggle click');
				const $this = evt.currentTarget;
				const $thisWrapper = $this.closest('.feature-page-navigation');
				$bc.gsapFns.showHide($this, $landingPageNav, 'is-active', {height: targetHeight, paddingBottom: '1rem', paddingTop: '0', marginTop: '2.91483rem'}, () => {
					$thisWrapper.classList.toggle('is-active');
				});
			});
			
			//set up links
			
			const $landingPageNavLinks = ($landingPageNav.querySelectorAll('.feature-page-navigation__item a').length > 0) ? $landingPageNav.querySelectorAll('.feature-page-navigation__item a') : null;
			
			if ($landingPageNavLinks) {
				for (let $landingPageNavLink of $landingPageNavLinks) {
					
					$landingPageNavLink.addEventListener('click', (evt) => {
						evt.preventDefault();
						let linkTarget = document.querySelector($landingPageNavLink.getAttribute('href'));
						
						$bc.gsapFns.scrollTo({scrollTo: {y: linkTarget.offsetTop}, duration: 0.360});
					});
				}
			}
			
		}//if landing page nav
		
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
		const featuresObserverOptions = {
			threshold: [0.1, 0.2, 0.25, 0.3, 0.5, 0.9]
		};
		const bcFeaturesFadeInOptions = {
			rootMargin: '0% 0% -18% 0%',
			threshold: [0.15, 0.20, 0.382, 0.5, 0.75, 0.95]
		};
		const bcHeroesFadeInOptions = {
			rootMargin: '0% 0% 0% 0%',
			threshold: [0.15, 0.20, 0.382, 0.5, 0.75, 0.95]
		};
		/* Observer for Features */
		const bcFeaturesFadeInObserver = new IntersectionObserver((entries) => {
			for (let entry of entries) {
				if (entry.isIntersecting) {
					const $target = entry.target;
					//Handle cards a little bit differently
					if ($target.classList.contains('bc-card') && entry.intersectionRatio >= 0.1) {
						$bc.gsapFns.fadeIn($target, {y: 0, duration: 0.721, ease: 'power4.out'});
					}
					//Fade in for everything else - show when it's fully visible
					if (entry.intersectionRatio === 1) {
						$bc.gsapFns.fadeIn($target, {y: 0, duration: 1.125, ease: 'power4.out'});
						if ($target.classList.contains('bc-feature-component__next')) {
							$bc.gsap.to($target.querySelector('.bc-svg-icon'), {rotation: '90deg', duration: 1, ease: 'power4.out', delay: 0.4});
						}
					}
				}
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
		const bcHeroesFadeInObserver = new IntersectionObserver((entries) => {
			for (let entry of entries) {
				if (entry.isIntersecting) {
					const $target = entry.target;
					if (entry.intersectionRatio === 1) {
						$bc.gsapFns.fadeIn($target, {y: 0, duration: 1.125, ease: 'power4.out'});
						if ($target.classList.contains('bc-feature-component__next')) {
							$bc.gsap.to($target.querySelector('.bc-svg-icon'), {rotation: '90deg', duration: 1, ease: 'power4.out', delay: 0.4});
						}
					}
				}
			}
		}, bcHeroesFadeInOptions);
		const bcHeroesFadeInFeatures = document.querySelectorAll('.bc-hero .bc-fade-in-up--is-not-visible');
		if (bcFadeInFeatures.length > 0) {
			for (let fadeInFeature of bcHeroesFadeInFeatures) {
				bcHeroesFadeInObserver.observe(fadeInFeature);	
			}
		}
		const bcFeaturesObserver = new IntersectionObserver((entries) => {
			for (let entry of entries) {
				if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
					const $thisFeature = entry.target;
					const thisFeatureChildren = $thisFeature.querySelectorAll('.bc-fade-in-up--is-not-visible');
					if (thisFeatureChildren.length > 0) {
						for (let thisFeatureChild of thisFeatureChildren) {
							if (thisFeatureChild.classList.contains('bc-fade-in-up--is-not-visible')) {
								thisFeatureChild.classList.remove('bc-fade-in-up--is-not-visible');	
							}
						}
					}	
				}
			}
		}, featuresObserverOptions);
		bcFeaturesObserver.observe(document.querySelector('.bc-feature-component'));
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
						//$bc.gsapFns.fadeIn($nextLinkText);
						//$bc.gsap.to($nextLinkIcon, {rotation: '90deg', duration: 0.88, ease: 'power2.out', delay: 0.2});
					}
				} else {
					return;
				}
			});
			
		}
	};/*** // window.onload Project scripts ***/
	
})();// bcScriptsWrap()