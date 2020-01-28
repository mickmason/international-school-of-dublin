/* Lib 1 file */
const howdy = (hi) => {
	console.log(hi);
};
howdy('Hello');

const $bc = (function bigCatScripts() {
	
	/* Utility functions */
	/* 
		Tests is a selector is a String or DOM Node, retunrs the selected Node if it can
		Throws an Error otherwise
		*/
	function _getDOMNode(selector) {
		let $el = null;
		if (typeof selector === 'string') {
			if (document.querySelector(selector) === null) {
				throw new Error(`Element selector must be a String value or a Document Node object ${selector}`);
			}
			$el = document.querySelector(selector);
			return $el ;
		} else if (selector instanceof Node) {
			$el = selector;
			return $el;
		} else {
			throw new Error(`Element selector must be a String value or a Document Node object`);
		}
	}//_getOMNode()
	/* 
		Tests will a string selector will return a DOM Node, retunrs an array of Nodes if it can
		Throws an Error otherwise
		*/
	function _getAllDOMNodes(selector) {
		let $els = null;
		if (typeof selector === 'string') {
			if (document.querySelectorAll(selector) === null) {
				return null;
			}
			$els = document.querySelectorAll(selector);
			return $els ;
		} else {
			throw new Error(`Element selector must be a String value`);
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
		Select siblings - select the direct next siblings of an element optionally filtered by classname
		Returns an array of HTMLElements if there is no callback
		el:  					DOM element: find this element's siblings filtered by an optional class 
		className: 		String: Class to filter the list of siblings
		callback: 		Callback function, gets the array of matching siblings
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
			if (typeof callback == 'function') {
				callback(matchingSiblings);
			} else {
				return matchingSiblings;
			}
		} else {
			throw new Error('Function selectSiblings requires: a HTML Node and a class name of type String');
		}
	}//selectSiblings()
	/* 
		Remove width and height from iframes
		@arg iframeParents, String selector for the iframe parent or and array of String selectors
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
				if (currentHeight < 2) {
					requestAnimationFrame(() => {
						$el.style.height = 0 + 'px';
					});	
					console.log(`End time: ${Date.now() - startTime}`);
					return ;
				}
				//Hide
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
		}
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
	}
	/* Interface */
	return {
		toggleClass: toggleClass,
		selectSiblings: selectSiblings,
		responsiveiFrames: makeResponsiveiFrames,
		showHide: showHide,
		utils: {
			getDomNode: _getDOMNode,
			getDomNodes: _getAllDOMNodes,
		}
	};
	//makeResponsiveiFrames
})();

window.onload = () => {
	$bc.responsiveiFrames('.bc-responsive-embed');
	document.querySelector('.bc-main-navigation-toggle').addEventListener('click', (event) => {
		event.preventDefault();
		let siteHeader = null;
		siteHeader = event.currentTarget.closest('.bc-site-header');
		siteHeader.classList.toggle('has-active-navigation');
	}, true);
	if (document.querySelectorAll('.bc-expandible-block__expander__button').length > 0) {
		const $expandButotns = document.querySelectorAll('.bc-expandible-block__expander__button');
		for (let $btn of $expandButotns) {
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
	
};


