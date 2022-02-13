/*
infiniteslide.js v2
version: 2.1.0-fork
Author: T.Morimoto

Copyright 2017, T.Morimoto
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php

https://github.com/woodroots/infiniteslidev2

Fork by jake-cryptic
https://github.com/jake-cryptic/infiniteslidev2
*/

(function($){
	$(window).on('load', function() {
	    window.loaded = true;
	});
	$(function(){
		$.fn.infiniteslide = function(options){
			// Options
			var settings = $.extend({
				'speed': 100,
				'direction': 'left',
				'pauseonhover': true,
				'responsive': false,
				'clone': 1
			}, options);
			
			var setCss = function(obj,direction){
				$(obj).wrap('<div class="infiniteslide_wrap"></div>').parent().css({
					overflow: 'hidden'
				});

				let d = 'row';
				if(direction == 'up' || direction == 'down'){
					d = 'column';
				}
								
				$(obj).css({
					display: 'flex',
					flexWrap: 'nowrap',
					alignItems: 'center',
					'-ms-flex-align': 'center',
					flexDirection: d
				}).children().css({
					flex: 'none',
					display: 'block'
				});
			}
			
			var setClone = function(obj,clone){
				let $clone = $(obj).children().clone(true).addClass('infiniteslide_clone');
				let i = 1;
				while(i <= clone){
					$clone.clone(true).appendTo($(obj));
					i++;
				}
			}
			
			var getWidth = function(obj){
				let w = 0;
				$(obj).children(':not(.infiniteslide_clone)').each(function(key,value){
					w = w + $(this).outerWidth(true);
				});
				return w;
			}
			var getHeight = function(obj){
				let h = 0;
				$(obj).children(':not(.infiniteslide_clone)').each(function(key,value){
					h = h + $(this).outerHeight(true);
				});
				return h;
			}

			
			var getSpeed = function(l,s){
				return l / s;
			}
			var getNum = function(obj,direction){
				let num = 0;
				if(direction == 'up' || direction == 'down'){
					num = getHeight(obj);
				} else {
					num = getWidth(obj);
				}
				return num;
			}
			
			var getTranslate = function(num,direction){
				let i = '-' + num + 'px,0,0';
				if(direction === 'up' || direction === 'down'){
					i = '0,-' + num + 'px,0';
				}
				return i;
			}
			
			var setAnim = function(obj,id,direction,speed){
				let num = getNum(obj,direction);
				if(direction == 'up' || direction == 'down'){
					$(obj).parent('.infiniteslide_wrap').css({
						height: num + 'px'
					});
				}
				let i = getTranslate(num,direction);
				
				$(obj).attr('data-style','infiniteslide' + id);

				let css = '@keyframes infiniteslide' + id + '{' + 
								'from {transform:translate3d(0,0,0);}' + 
								'to {transform:translate3d(' + i + ');}' + 
							'}';
				$('<style />').attr('id','infiniteslide' + id + '_style').html(css).appendTo('head');
				
				let reverse = '';
				if(direction === 'right' || direction === 'down'){
					reverse = ' reverse';
				}
				
				$(obj).css({
					animation: 'infiniteslide' + id + ' ' + getSpeed(num,speed) + 's linear 0s infinite' + reverse
				});
			}
			var setStop = function(obj){
				$(obj).on('mouseenter',function(){
					$(this).css({
						animationPlayState: 'paused'
					});
				}).on('mouseleave',function(){
					$(this).css({
						animationPlayState: 'running'
					});
				});
			}
			
			var setResponsive = function(obj,direction){
				let num = getNum(obj,direction);
				return getTranslate(num,direction);
			};
		
			return this.each(function(key,value){
				var $this = $(this);
				let num = Date.now() + Math.floor(10000*Math.random()).toString(16);

				if(settings.pauseonhover == true){
					setStop($this);
				}
				
				var _onload = function(){
					setCss($this,settings.direction);
					setClone($this,settings.clone);
					setAnim($this,num,settings.direction,settings.speed);
					
					if(settings.responsive){
						$(window).on('resize',function(){
							let i = setResponsive($this,settings.direction);
							let styleid = $this.attr('data-style');
							let stylehtml = $('#' + styleid + '_style').html();
							
							let stylehtml_new = stylehtml.replace(/to {transform:translate3d\((.*?)\)/,'to {transform:translate3d(' + i + ')');
							$('#' + styleid + '_style').html(stylehtml_new);
						});
					}
				};

				if (window.loaded) {
					_onload();
				} else {
					$(window).on('load', _onload);
				}
			});

		}
	});
})(jQuery);