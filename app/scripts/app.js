
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
				return null;
			}
			$el = document.querySelector(selector);
			return $el ;
		} else if (selector instanceof Node) {
			$el = selector;
			return $el;
		} else {
			throw new Error(`Element selector must be a String value or a Document Node object`);
		}
	}
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
	}
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
	}
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
	}
	/* 
		Remove width and height from iframes
		@arg iframeParents, String selector for the iframe parent or and array of String selectors
	*/
	function makeResponsiveiFrames(iframeParents) {
		iframeParents = Array.from(document.querySelectorAll(iframeParents));
		if (Array.isArray(iframeParents)) {
			for (let parent in iframeParents) {
				let iframes = Array.from(iframeParents[parent].getElementsByTagName(`iframe`));
				for (let iframe in iframes) {
					iframes[iframe].removeAttribute('width');	
					iframes[iframe].removeAttribute('height');	
				}	
				iframeParents[parent].classList.remove('is-not-loaded');	
			}
			return;
		}
	}
	/* Interface */
	return {
		toggleClass: toggleClass,
		selectSiblings: selectSiblings,
		responsiveiFrames: makeResponsiveiFrames,
		utils: {
			getDomNode: _getDOMNode,
			getDomNodes: _getAllDOMNodes,
		}
	};
})();

window.onload = () => {
	$bc.responsiveiFrames('.bc-responsive-embed');
	document.querySelector('.bc-main-navigation-toggle').addEventListener('click', (event) => {
		event.preventDefault();
		let siteHeader = null;
		let thisParent = event.currentTarget.parentElement;
		while (!siteHeader) {
			siteHeader = (thisParent.classList.contains('.bc-site-header')) ? thisParent : thisParent = thisParent.parentElement; 
		}
		console.log(siteHeader);
		$bc.toggleClass(siteHeader, 'has-active-navigation');
	}, true);
};

