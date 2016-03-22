window.Dropdown = (function() {

	'use strict';

	var incrementer = 0;
	var util = {
		addClass:function(node, cl) {
			if (node.classList) {
				node.classList.add(cl);
			} else {
				node.className += ' ' + cl;
			}
		},
		removeClass:function(node, cl) {
			if (node.classList) {
				node.classList.remove(cl);
			} else {
				node.className = node.className.replace(new RegExp('(^|\\b)' + cl.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		},
		preventDefault:function(e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},
		hasTouch:(function() {
			// reference https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
			if ('ontouchstart' in window) {
				return true;
			} else {
				var bool;
				var body = document.body;
				var fakeBody = false;
				var node = document.createElement('div');
				var style = document.createElement('style');
				var query = ['@media (', ['-webkit-','-moz-','-o-','-ms-'].join('touch-enabled),('), 'heartz', ')', '{#hasTouchNode{top:9px;position:absolute}}'].join('');

				if (!body) {
					body = document.createElement('body');
					fakeBody = true;
				}

				node.id = 'hasTouchNode';

				if (style.styleSheet) {
					style.styleSheet.cssText = query;
				} else {
					style.appendChild(document.createTextNode(query));
				}

				(!fakeBody ? node : body).appendChild(style);
				body.appendChild(node);

				if (fakeBody) {
					document.documentElement.appendChild(body);
				}

				// make sure offset is what it should be
				bool = node.offsetTop === 9;

				// remove temp elements
				node.parentNode.removeChild(node);
				style.parentNode.removeChild(style);
				if (fakeBody) body.parentNode.removeChild(body);

				return bool;
			}
		})()
	};

	var Dropdown = function(container, opts) {
		var _this = this;
		var evts = {};
		var hasGeneratedID = false;
		var isPointerTypeTouch = false;
		if (!container) {
			return;
		}

		this.container = (typeof container === 'string') ? document.querySelector(container) : container;
		this.opts = {
			delay: 250,
			openClass: 'dropdown--open',
			menu : '> ul',
			spa : false
		};

		for(var opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				this.opts[opt] = opts[opt];
			}
		}

		if (!this.container.id) {
			hasGeneratedID = true;
			incrementer++;
			this.container.id = 'dropdown-temp-id-' + incrementer;
		}

		this.mainLink = document.querySelector('#' + this.container.id + ' > a');
		this.menu = document.querySelector('#' + this.container.id + ' ' + this.opts.menu);

		if (hasGeneratedID) {
			this.container.removeAttribute('id');
		}

		if (!this.menu) {
			return;
		}

		this.menuLinks = this.menu.querySelectorAll('a');
		this.timeout = {enter: null, leave: null};
		this.active = false;

		evts.touch = function(e) {
			if (!_this.active) {
				util.preventDefault(e);
				e.stopPropagation();
				_this.open();
			} else {
				_this.close();
			}
		};

		evts.mouseenter = function() {
			if (typeof _this.timeout.leave === 'number') {
				window.clearTimeout(_this.timeout.leave);
			} else {
				_this.timeout.enter = window.setTimeout(function() {
					_this.open();
				}, _this.opts.delay);
			}
		};

		evts.mouseleave = function() {
			if (typeof _this.timeout.enter === 'number') {
				window.clearTimeout(_this.timeout.enter);
			} else {
				_this.timeout.leave = window.setTimeout(function() {
					_this.close();
				}, _this.opts.delay);
			}
		};

		evts.pointerenter = function(e) {
			switch(e.pointerType) {
				case 'touch':
					isPointerTypeTouch = true;
					_this.mainLink.addEventListener('click', evts.touch);
					document.addEventListener('click', evts.maybeClose);
				break;
				default:
					evts.mouseenter(e);
				break;
			}
		};

		evts.pointerleave = function(e) {
			switch(e.pointerType) {
				case 'touch':
					if (isPointerTypeTouch) {
						isPointerTypeTouch = false;
					} else {
						evts.touch(e);
					}
				break;
				default:
					evts.mouseleave(e);
				break;
			}
		};

		evts.handleTouchClose = function(e) {
			e.preventDefault();
			if (e.target.tagName === 'A') {
				_this.close();
			}
		};

		evts.maybeClose = function(e) {
			var target = e.target || e.srcElement;
			if (!_this.active) {
				return;
			}

			while(target) {
				if (target.tagName === 'A') {
					break;
				}
				if (target === this.node) {
					return;
				}
				target = target.parentNode;
			}
			_this.close();
			document.removeEventListener('click', evts.maybeClose);
		};

		evts.focus = function() {
			if (!_this.active) {
				_this.open();
			}
		};

		evts.blur = function() {
			if (_this.menuLinks.length < 1) {
				_this.close();
				return;
			}

			// make this async so we can detect the correct document.activeElement
			window.setTimeout(function() {
				for(var i = 0; i<_this.menuLinks.length; i++) {
					if (document.activeElement === _this.menuLinks[i]) {
						return;
					}
				}
				_this.close();
			}, 0);
		};

		// use event capturing to detect event focus and blur because do not bubble
		if (this.container.addEventListener) {
			this.container.addEventListener('focus', evts.focus, true);
			this.container.addEventListener('blur', evts.blur, true);
		}

		if (window.PointerEvent) {
			this.container.addEventListener('pointerenter', evts.pointerenter);
			this.container.addEventListener('pointerleave', evts.pointerleave);
			if (this.opts.spa) {
				this.menu.addEventListener('click', evts.handleTouchClose);
			}
		} else {
			if (util.hasTouch) {
				this.mainLink.addEventListener('click', function(e) {
					evts.touch(e);
				});
				if (this.opts.spa) {
					this.menu.addEventListener('click', evts.handleTouchClose);
				}
			}

			if (this.container.addEventListener) {
				this.container.addEventListener('mouseenter', evts.mouseenter);
				this.container.addEventListener('mouseleave', evts.mouseleave);
			} else if (this.container.attachEvent) {
				this.container.attachEvent('onmouseenter', evts.mouseenter);
				this.container.attachEvent('onmouseleave', evts.mouseleave);
			}
		}
	};

	Dropdown.prototype = {
		open:function() {
			if (typeof this.opts.beforeOpen === 'function') {
				if(this.opts.beforeOpen.call(this) === false) {
					return;
				}
			}

			this.active = true;
			if (typeof this.timeout.enter === 'number') {
				window.clearTimeout(this.timeout.enter);
				this.timeout.enter = null;
			}
			util.addClass(this.container, this.opts.openClass);

			if (typeof this.opts.afterOpen === 'function') {
				this.opts.afterOpen.call(this);
			}
		},
		close:function() {
			if (typeof this.opts.beforeClose === 'function') {
				if(this.opts.beforeClose.call(this) === false) {
					return;
				}
			}

			this.active = false;
			if (typeof this.timeout.leave === 'number') {
				window.clearTimeout(this.timeout.leave);
				this.timeout.leave = null;
			}
			util.removeClass(this.container, this.opts.openClass);

			if (typeof this.opts.afterClose === 'function') {
				this.opts.afterClose.call(this);
			}
		}
	};

	var Factory = function(node, opts) {
		return new Dropdown(node, opts);
	};

	if (typeof window.jQuery === 'function') {
		window.jQuery.fn.dropdown = function(opts) {
			window.jQuery(this).each(function() {
				window.jQuery(this).data('dropdown', new Factory(this, opts));
			});
		};
	}

	return Factory;
})();
