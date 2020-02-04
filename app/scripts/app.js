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
			let startTime = Date.now();
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
						console.log(`End time: ${Date.now() - startTime}`);
						return ;
					}
					currentHeight -= (currentHeight - targetHeight) * 0.25;
					$el.style.height = currentHeight + 'px';
					requestAnimationFrame(() => {
						$el.style.height = currentHeight + 'px';
						_lerpShowHide($el, currentHeight, targetHeight);
					});
				} else {
					console.log(`End time: ${Date.now() - startTime}`);
					return ;
				}
			}//_lerpShowHide()
			let $el = null;
			try {
				$el = _getDOMNode(el);	
				console.log(`${$el}`);
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
		function gsapScrollTo(targetScrollOptions, $el) {
			$el = $el || window;
			$gsap.registerPlugin(ScrollToPlugin); 
			const scrollOptions =  Object.assign({
				scrollTo: {x: 0, y: 0}, 
				duration: 1, 
				ease: 'power1.in'
			}, targetScrollOptions);
			$gsap.to($el, scrollOptions);
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
				fadeIn: gsapFadeIn
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
		
		/** Main navigation **/
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
		
		//All heroes and feature components - used in the following scripts
		const $pageFeatures = (document.querySelectorAll('.bc-hero, .bc-feature-component').length > 0) ? document.querySelectorAll('.bc-hero, .bc-feature-component') : null;
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
				//console.log(`Event`);
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
		//* If IntersectionObserver in window */
		const featuresObserverOptions = {
			threshold: [0.1, 0.2, 0.25, 0.3, 0.5, 0.9]
		};
		const bcFeaturesFadeInoOptions = {
			rootMargin: '0% 0% -18% 0%',
			threshold: [0.15, 0.20, 0.382, 0.5, 0.75, 0.95]
		};
		const bcFeaturesFadeInObserver = new IntersectionObserver((entries) => {
			for (let entry of entries) {
				if (entry.isIntersecting) {
					const $target = entry.target;
					if ($target.classList.contains('bc-card') && entry.intersectionRatio >= 0.1) {
						$bc.gsapFns.fadeIn($target, {y: 0, duration: 0.721, ease: 'power4.out'});
					}
					if (entry.intersectionRatio === 1) {
						$bc.gsapFns.fadeIn($target, {y: 0, duration: 1.125, ease: 'power4.out'});
						
						if ($target.classList.contains('bc-feature-component__next')) {
							console.log(`Fade in Observer: intersectionRatio: ${entry.intersectionRatio}`);
							$bc.gsap.to($target.querySelector('.bc-svg-icon'), {rotation: '90deg', duration: 1, ease: 'power4.out', delay: 0.4});
						}
					}
					/*if (entry.intersectionRatio >= 0.95 && $target.classList.contains('bc-fade-in-up--is-not-visible')) {
						$target.classList.remove('bc-fade-in-up--is-not-visible');	
					}*/
				}
			}
		}, bcFeaturesFadeInoOptions);
		const bcFadeInFeatures = document.querySelectorAll('.bc-fade-in-up--is-not-visible');
		if (bcFadeInFeatures.length > 0) {
			console.log(bcFadeInFeatures.length);
			for (let fadeInFeature of bcFadeInFeatures) {
				bcFeaturesFadeInObserver.observe(fadeInFeature);	
			}
		}
		const bcFeaturesObserver = new IntersectionObserver((entries) => {
			for (let entry of entries) {
				/*console.log(`Features Observer: entry target: ${entry.target.classList}`);
				console.log(entry.intersectionRatio);*/
				if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
					const $thisFeature = entry.target;
					const thisFeatureChildren = $thisFeature.querySelectorAll('.bc-fade-in-up--is-not-visible');
					console.log(`Feature thisFeatureChildren length: ${thisFeatureChildren.length}`);
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
			console.log(`Got them  ${$pageFeatures.length}`);
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
							console.log(`click ${linkText}`);
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