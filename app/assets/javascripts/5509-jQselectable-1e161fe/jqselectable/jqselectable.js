/**
 * jQselectable
 *
 * @version      2.0.3
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         https://github.com/5509/jQselectable
 *
 * 2011-12-08 0:55
 */
;(function($, window, document, undefined) {

	// jQselectable
	var jQselectable = function(elem, options) {

		if ( !(this instanceof jQselectable) ) {
			return new jQselectable(elem, options);
		}

		this.elem = elem;
		this.$elem = $(elem);
		this.$body = $('body');
		this.$document = $(document);

		this.conf = $.extend({
			style: 'selectable',
			showDuration: 200,
			hideDuration: 200,
			show: 'fadeIn',
			hide: 'fadeOut',
			height: 'auto',
			top: 0,
			left: 0,
			opacity: 0.9
		}, options);

		this._init();
	};

	jQselectable.prototype = {
		_init: function() {
			var self = this,
				conf = self.conf;

			// data map
			self.map = {};
			self.selected = undefined;
			self.selected_id = undefined;

			self.has_no_maxheight = typeof document.body.style.maxHeight;

			// id
			self.id = self.elem.id || 'jqs_' + parseInt(Math.random()*1000);

			// id, class
			self.attr = {
				id: self.id,
				klass: self.elem.className
			};

			self.style = /simple/.test(conf.style) ? 'sBox' : 'sctble';

			self._build();
			self._eventify();
		},

		_map: function() {
			var self = this;
			self.$option = self.$elem.find('option');
			each(self.$option, function(i, opt) {
				var data = opt.value;
				self.map[data.length ? data : 'nodata'] = {
					elem: opt,
					text: opt['textContent'] || opt['innerText']
				};
			});
		},

		_build: function() {
			var self = this,
				conf = self.conf,
				value = self.$elem.val(),
				id = self.id,
				selected_id = undefined,
				$body = self.$body,
				$elem = self.$elem;

			value = value.length ? value : 'nodata';

			self._map();

			self.$view = self._view(self.map[value].text)
				.addClass(self.style)
				.addClass(self.attr.klass);

			self.$list = self._createList()
				.css({
					position: 'absolute'
				});

			// append
			$elem.hide().after(self.$view);
			$body.append(self.$list);

			self.list_height = self.$list[0].offsetHeight;

			// keep a anchor element classed 'selected'
			selected_id = self.selected_id;
			self.selected = document.getElementById(id + '_' + selected_id);

			self.$list.hide();
		},

		_view: function(defValue) {
			var self = this;
			return $([
				'<a id="' + self.id + '_dammy"',
					'href="javascript:void(0)"',
					'class="sctble_display"',
					'data-id="' + self.id + '"',
				'>',
					'<span data-id="' + self.id + '">',
						defValue,
					'</span>',
				'</a>'
			].join(''));
		},

		_setPosition: function() {
			var self = this,
				conf = self.conf,
				$view = self.$view,
				$list = self.$list,
				top_pos = undefined,
				pos = $view.offset(),
				scroll_top = get_scrolltop(),
				client_height = get_clientheight();

			if ( client_height / 2 < pos.top - scroll_top ) {
				top_pos = pos.top - self.list_height + conf.top - 5;
			} else {
				top_pos = pos.top + $view.height() * 1.3 + conf.top;
			}

			$list.css({
				top: top_pos,
				left: pos.left + conf.left
			});
		},

		_addSelected: function(elem) {
			var self = this;

			self.selected = elem;
			elem.className = 'selected';
		},

		_removeSelected: function() {
			var self = this,
				anchor = self.selected;

			if ( !anchor ) return;
			anchor.className = '';
		},

		_addItem: function(html, option) {
			var self = this;
			each(option, function(i, opt) {
				var value = opt.value || 'nodata',
					text = self.map[value].text,
					klass = opt.className,
					selected = opt.selected;

				// memorize selected option
				if ( selected ) {
					self.selected_id = value;
				}

				html = html + (opt.disabled ? '<span>' :
					[
						'<a href="#' + text + '"',
							'id="' + self.id + '_' + value + '"',
							'data-value="' + value + '"',
							(selected ? 'class="selected"' : ''),
						'>'
					].join('')
				);
				html = html + text;
				html = html + (opt.disabled ? '</span>' : '</a>');

				if ( klass && /br/.test(klass) ) {
					html = html + '<br>';
				}
			});
			if ( !self.selected_id ) {
				self.selected_id = option[0].value;
			}
			return html;
		},

		_createList: function() {
			var self = this,
				conf = self.conf,
				body_style = undefined,
				list_id = self.id + '_mat',
				list_class = 'sctble_mat ' + self.attr.klass,
				list = '<div id="' + list_id + '" class="' + list_class + '">',
				height = (conf.height === 'auto') ? 'auto' : conf.height + 'px',
				$elem = self.$elem;

			// for IE6
			if ( self.has_no_maxheight ) {
				body_style = 'height: ' + height + '; overflow-y: scroll;';
			// for other browsers
			} else {
				body_style = 'max-height: ' + height + ';';
			}

			list = list + '<div class="body" style="' + body_style + '">';

			// has optgroup ?
			self.has_group = $elem.find('optgroup').length;

			if ( self.has_group ) {
				// selectable and has_group
				// has optgroup
				self.list_klass = 'sctble optgroup';
				list = list + (function() {
					var html = '<dl>',
						optgroup = $elem.find('optgroup');

					each(optgroup, function(i, optg) {
						var option = optg.getElementsByTagName('option');
						html = html + ('<dt>' + optg.label + '</dt><dd>');
						// add anchor
						html = self._addItem(html, option);
						html = html + '</dd>';
					});
					html = html + '</dl>';
					return html;
				}());
			} else {
				// simple and has no optgroup
				if ( conf.style === 'selectable' ) {
					self.list_klass = 'sctble nooptgroup';
				} else {
					self.list_klass = 'sBox nooptgroup';
				}
				list = list + (function() {
					var html = '';
					// add anchor
					html = self._addItem(html, self.$option);
					return html;
				}());
			}

			// <!--// div.body --><!--// div.sctble_mat -->
			list = list + '</div></div>';

			return $(list).addClass(self.list_klass);
		},

		_eventify: function() {
			var self = this,
				$elem = self.$elem,
				$view = self.$view,
				$list = self.$list;

			// triggers
			$view.bind('click', function() {
				if ( self.disabled ) return;
				$elem.trigger('jQselectable.click');
			});

			$list.delegate('a', 'click', function(ev) {
				var a = this;
				ev.preventDefault();
				$elem.trigger('jQselectable.change', {
					value: a.getAttribute('data-value'),
					anchor: a
				});
			});

			// binds
			$elem.bind('jQselectable.click', function(ev) {
				self._show();
			});

			$elem.bind('jQselectable.change', function(ev, data) {
				self._change(data.value);
				self._removeSelected();
				self._addSelected(data.anchor);

				self.$view.focus();
			});

			self.$document.bind('click.' + self.id, function(ev) {
				if ( !ev.target ) return;

				var target = ev.target,
					id = target.getAttribute('data-id');

				ev.stopPropagation();
				if ( id && id === self.id ) return;

				self._hide();
			});
		},

		_show: function() {
			var self = this,
				conf = self.conf,
				$list = self.$list,
				$view = self.$view,
				scroll_top = undefined,
				client_height = undefined,
				pos = undefined,
				balance = undefined;

			self._setPosition();

			if ( conf.show === 'slideDown' ) {
				scroll_top = get_scrolltop();
				client_height = get_clientheight();
				pos = $view.offset();
				balance = client_height / 2 < (pos.top - scroll_top);

				if ( balance ) {
					$list
						.css({
							top: pos.top + conf.top - 5
						});

					$list
						.animate({
							height: 'toggle',
							top: parseInt($list.css('top')) - self.list_height
						}, {
							easing: 'swing',
							duration: conf.showDuration
						})
						.css({
							opacity: conf.opacity
						});
				} else {
					$list
						.slideDown(conf.showDuration)
						.css({
							opacity: conf.opacity
						});
				}
			} else
			if ( conf.show === 'fadeIn' ) {
				$list
					.css({
						display: 'block',
						opacity: 0
					})
					.fadeTo(conf.showDuration, conf.opacity);
			} else {
				$list
					.show()
					.css({
						opacity: conf.opacity
					});
			}

			setTimeout(function() {
				self.selected.focus();
			}, isNaN(conf.showDuration) ? (function() {
				var duration = conf.showDuration;
				return (/slow/.test(duration)) ? 610 :
					(/fast/.test(duration)) ? 210 :
					410;
			}()) : conf.showDuration + 10);
		},

		_hide: function() {
			var self = this,
				conf = self.conf,
				$list = self.$list;

			switch( conf.hide ) {
			case 'slideUp':
				$list.slideUp(conf.hideDuration);
				break;
			case 'fadeOut':
				$list.fadeOut(conf.hideDuration);
				break;
			default:
				$list.hide();
			}
		},

		_change: function(val) {
			var self = this;
			self.$view.find('span').text(self.map[val].text);
			self.$elem.val(val);
		},

		refresh: function() {
			var self = this;

			self.destroy();

			self._build();
			self._eventify();
			
			self.$elem.trigger('jQselectable.refresh');
		},

		disable: function() {
			var self = this;
			self.disabled = true;
			self.$view.addClass('disabled');

			self.$elem.trigger('jQselectable.disable');
		},

		enable: function() {
			var self = this;
			self.disabled = false;
			self.$view.removeClass('disabled');

			self.$elem.trigger('jQselectable.enable');
		},

		destroy: function() {
			var self = this;

			self.$view.remove();
			self.$list.remove();
			self.$elem.show();
			self.$document.unbind('click.' + self.id);

			self.$elem.trigger('jQselectable.destroy');
		}
	};

	function each(elems, func) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i = i + 1 ) {
			func(i, elems[i]);
		}
	}

	function get_scrolltop() {
		return document.documentElement.scrollTop || document.body.scrollTop;
	}

	function get_clientheight() {
		return document.documentElement.clientHeight || document.body.clientHeight;
	}

	// extend $.fn
	$.fn.jQselectable = function(options) {
		var instance = [];
	
		if ( this.length > 1 ) {
			$.each(this, function(i, elem) {
				instance.push(jQselectable(this, options));
			});
		} else {
			instance = jQselectable(this, options);
		}
		return instance;
	};

}(jQuery, this, this.document));
