jQuery(document).ready(function(){
	if (jQuery('.hero-container').length != 0) {

		// Great fix for a bad browser
		if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			jQuery('.graphicselect img').click(function(e) {
				oCheckbox = jQuery(this).parent().prev();
				// alert("You hit: " + oCheckbox.attr('id'));
				jQuery(".graphiccheckbox.selected").removeClass("selected");
				if (!oCheckbox.is(":checked")) {
					oCheckbox.addClass("selected").prop('checked', true);
				}
			});
		}

    $("#cta-download").click(function() {
                                     ga('send', {hitType: 'event',
                                     eventCategory: 'Leadform CTA',
                                     eventAction: 'download',
                                     eventValue: 5,});});

		function heroformGetCurrentStep() {
			return jQuery('.hero-container .orbit .orbit-slide.is-active').data('stepnumber');
		}

		jQuery('.hero-container .slider').on('moved.zf.slider', function(){
		    var iValue = jQuery(this).children('.slider-handle').attr('aria-valuenow')

		    if (iValue>=1000) {
		    	jQuery('#migrationsCount').val(iValue + "+");
		    }
		    jQuery('#migrationsMaxServers').html(iValue*5);
		});

		jQuery("#txt_contactemail").keypress(function (e) {
			if (e.which == 13) {
				jQuery(this).closest('.orbit-slide').find('.button').trigger('click');
				return false;
			}
		});

		jQuery('.hero-container .orbit').on('slidechange.zf.orbit', function(){
			var currentStep = heroformGetCurrentStep();
			jQuery('.hero-container .progress-meter').css('width',currentStep*25 + '%');
		});

		jQuery('.hero-container .action-advance').on("click",function(){
			if (!jQuery(this).is('[disabled]')) {
				var iCurrentStep = heroformGetCurrentStep();
				if (heroformValidateStep(iCurrentStep)) {
					heroformClearMessage();
				}
			}
		});

		function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
		}

		function heroformValidateStep(iStepToValidate) {
			switch (iStepToValidate) {
				case 1: 	if (validateSeleccionCollection(jQuery('.hero-container .graphiccheckbox'))) {
								var data = JSON.stringify({
							      "category": heroformGetDataItem('category')
							    });
							    heroformAPICall("post",data);
							} else {
								heroformSetMessage('Please select your company type');
							}
							break;

				case 2: 	var data = JSON.stringify({
						      "id": heroformGetID(),
						      "application_count": parseInt(heroformGetDataItem('number_of_applications'))
						    });
							heroformAPICall("put",data);
							break;

				case 3: 	if (validateEmail(jQuery('#txt_contactemail').val())) {
								var data = JSON.stringify({
							      "id": heroformGetID(),
							      "email": heroformGetDataItem('email')
							    });
								heroformAPICall("put",data);
	              activeCampaignEvent(heroformGetDataItem('email'));
							} else {
								heroformSetMessage('Please enter a valid email');
							}
							break;

				default: 	return true;
			}
		}

		function heroformSetMessage(sMessage) {
			var sDialog = 	'<div class="warning callout" data-closable>' +
								sMessage +
							  '<button class="close-button" aria-label="Dismiss alert" type="button" data-close>' +
							    '<span aria-hidden="true">&times;</span>' +
							  '</button>' +
							'</div>';
			jQuery('.message-holder').html(sDialog);
		}

		function heroformClearMessage() {
			jQuery('.message-holder').html('&nbsp;');
		}

		function validateSeleccionCollection(oCollection) {
			var atLeastOneIsChecked = false;
			oCollection.each(function () {
			    if ($(this).is(':checked')) {
				    atLeastOneIsChecked = true;
				    return false;
			    }
			});
			return atLeastOneIsChecked;
		}

		function heroformGetDataItem(sVar) {
			switch (sVar) {
				case "category": 				return jQuery('.hero-container .graphiccheckbox:checked ~ .graphic-legend').html();
												break;
				case "number_of_applications": 	return jQuery('#migrationsCount').val();
												break;
				case "email": 					return jQuery('#txt_contactemail').val();
												break;
				default: 						return '';
			}
		}
		function heroformSetID(sID) { jQuery('.hero-container').data('leadid',sID); }
		function heroformGetID() { return jQuery('.hero-container').data('leadid'); }

		function heroformAdvanceStep() {
			if (jQuery('.hero-container .orbit-slide.is-active').data('stepnumber') < jQuery('.orbit-container .orbit-slide').length) {
				oNextSlide = jQuery('.hero-container .orbit-slide.is-active ').next();
				jQuery('.hero-container .orbit').foundation('changeSlide', true, oNextSlide);
			}
		}

		function heroformAPICall(sMethod,jsonData) {
      var api_base = "https://4chtqhjfi1.execute-api.ca-central-1.amazonaws.com";
      var api_prefix = "/production";
      var resource = "/leads";
			var url = api_base + api_prefix + resource
			var xhr = new XMLHttpRequest();

		    xhr.addEventListener("readystatechange", function () {
		    	if (this.readyState === 4) {
	                if (this.responseText == "") {
	                	heroformSetMessage("There was an error saving form data, try again soon.");
	                } else {
			    		var jsonAnswer = JSON.parse(this.response);
	                	jQuery('.hero-container .orbit-slide .button[disabled]').removeAttr('disabled');
		                if (heroformGetID() == undefined) {
		                	heroformSetID(jsonAnswer.id);
		                }
	                }
		    	}
		    });

		    xhr.open(sMethod.toUpperCase(), url);
		    heroformAdvanceStep();
		    xhr.setRequestHeader("content-type", "application/json");
		    xhr.send(jsonData);
		}

	}

});


jQuery(document).ready(function() {

  jQuery('.contact-popup-trigger').click(function(e){
    e.preventDefault;
    jQuery('#modalContact').foundation('open');
    return false;
  });

	var stickyNavTop = jQuery('#top-bar-menu').offset().top;
	 
	var stickyNav = function(){
		var scrollTop = jQuery(window).scrollTop();
		      
		if (scrollTop > 500) { 
		    jQuery('#top-bar-menu').addClass('is-stuck');
		} else {
		    jQuery('#top-bar-menu').removeClass('is-stuck'); 
		}
	};
	 
	stickyNav();
	 
	jQuery(window).scroll(function() {
	  stickyNav();
	});

	jQuery('.mobile-menu-toggler').click(function(e) {
		e.preventDefault;
		oTarget = jQuery('#' + jQuery(this).data('toggle'));
		if (oTarget.length > 0) {
			oTarget.toggleClass('active');
		}
		return false;
	});
});


function activeCampaignEvent(email) {
  var url = "https://trackcmp.net/event";
  var email = encodeURIComponent(email);
  var event = "leadform-cta";
  var id = "999887588";
  var key = "1def5fe3b34bf0b805c18246a4acb388cef62d3f";
  var data = "actid=" + id + "&key=" + key + "&event=" + event + "&visit=%7B%22email%22%3A%22" + email + "%22%7D";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.send(data);
}

$('.pricing-table__header').hover( function() {
  $('.pricing-table__header.active-tb').removeClass('selected');
});

$('.pricing-table__header').mouseleave(function(){
  $('.pricing-table__header.active-tb').addClass('selected');
});



jQuery(document).foundation();

!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.7 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent);
                if (svg) {
                    var src = use.getAttribute("xlink:href") || use.getAttribute("href");
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});

// The MIT License (MIT)

// Typed.js | Copyright (c) 2016 Matt Boldt | www.mattboldt.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.




! function($) {

	"use strict";

	var Typed = function(el, options) {

		// chosen element to manipulate text
		this.el = $(el);

		// options
		this.options = $.extend({}, $.fn.typed.defaults, options);

		// attribute to type into
		this.isInput = this.el.is('input');
		this.attr = this.options.attr;

		// show cursor
		this.showCursor = this.isInput ? false : this.options.showCursor;

		// text content of element
		this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text();

		// html or plain text
		this.contentType = this.options.contentType;

		// typing speed
		this.typeSpeed = this.options.typeSpeed;

		// add a delay before typing starts
		this.startDelay = this.options.startDelay;

		// backspacing speed
		this.backSpeed = this.options.backSpeed;

		// amount of time to wait before backspacing
		this.backDelay = this.options.backDelay;

		// div containing strings
		this.stringsElement = this.options.stringsElement;

		// input strings of text
		this.strings = this.options.strings;

		// character number position of current string
		this.strPos = 0;

		// current array position
		this.arrayPos = 0;

		// number to stop backspacing on.
		// default 0, can change depending on how many chars
		// you want to remove at the time
		this.stopNum = 0;

		// Looping logic
		this.loop = this.options.loop;
		this.loopCount = this.options.loopCount;
		this.curLoop = 0;

		// for stopping
		this.stop = false;

		// custom cursor
		this.cursorChar = this.options.cursorChar;

		// shuffle the strings
		this.shuffle = this.options.shuffle;
		// the order of strings
		this.sequence = [];

		// All systems go!
		this.build();
	};

	Typed.prototype = {

		constructor: Typed,

		init: function() {
			// begin the loop w/ first current string (global self.strings)
			// current string will be passed as an argument each time after this
			var self = this;
			self.timeout = setTimeout(function() {
				for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;

				// shuffle the array if true
				if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

				// Start typing
				self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
			}, self.startDelay);
		},

		build: function() {
			var self = this;
			// Insert cursor
			if (this.showCursor === true) {
				this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
				this.el.after(this.cursor);
			}
			if (this.stringsElement) {
				this.strings = [];
				this.stringsElement.hide();
				console.log(this.stringsElement.children());
				var strings = this.stringsElement.children();
				$.each(strings, function(key, value){
					self.strings.push($(value).html());
				});
			}
			this.init();
		},

		// pass current string state to each function, types 1 char per call
		typewrite: function(curString, curStrPos) {
			// exit when stopped
			if (this.stop === true) {
				return;
			}

			// varying values for setTimeout during typing
			// can't be global since number changes each time loop is executed
			var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
			var self = this;

			// ------------- optional ------------- //
			// backpaces a certain string faster
			// ------------------------------------ //
			// if (self.arrayPos == 1){
			//  self.backDelay = 50;
			// }
			// else{ self.backDelay = 500; }

			// contain typing function in a timeout humanize'd delay
			self.timeout = setTimeout(function() {
				// check for an escape character before a pause value
				// format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
				// single ^ are removed from string
				var charPause = 0;
				var substr = curString.substr(curStrPos);
				if (substr.charAt(0) === '^') {
					var skip = 1; // skip atleast 1
					if (/^\^\d+/.test(substr)) {
						substr = /\d+/.exec(substr)[0];
						skip += substr.length;
						charPause = parseInt(substr);
					}

					// strip out the escape character and pause value so they're not printed
					curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
				}

				if (self.contentType === 'html') {
					// skip over html tags while typing
					var curChar = curString.substr(curStrPos).charAt(0)
					if (curChar === '<' || curChar === '&') {
						var tag = '';
						var endTag = '';
						if (curChar === '<') {
							endTag = '>'
						}
						else {
							endTag = ';'
						}
						while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
							tag += curString.substr(curStrPos).charAt(0);
							curStrPos++;
							if (curStrPos + 1 > curString.length) { break; }
						}
						curStrPos++;
						tag += endTag;
					}
				}

				// timeout for any pause after a character
				self.timeout = setTimeout(function() {
					if (curStrPos === curString.length) {
						// fires callback function
						self.options.onStringTyped(self.arrayPos);

						// is this the final string
						if (self.arrayPos === self.strings.length - 1) {
							// animation that occurs on the last typed string
							self.options.callback();

							self.curLoop++;

							// quit if we wont loop back
							if (self.loop === false || self.curLoop === self.loopCount)
								return;
						}

						self.timeout = setTimeout(function() {
							self.backspace(curString, curStrPos);
						}, self.backDelay);

					} else {

						/* call before functions if applicable */
						if (curStrPos === 0) {
							self.options.preStringTyped(self.arrayPos);
						}

						// start typing each new char into existing string
						// curString: arg, self.el.html: original text inside element
						var nextString = curString.substr(0, curStrPos + 1);
						if (self.attr) {
							self.el.attr(self.attr, nextString);
						} else {
							if (self.isInput) {
								self.el.val(nextString);
							} else if (self.contentType === 'html') {
								self.el.html(nextString);
							} else {
								self.el.text(nextString);
							}
						}

						// add characters one by one
						curStrPos++;
						// loop the function
						self.typewrite(curString, curStrPos);
					}
					// end of character pause
				}, charPause);

				// humanized value for typing
			}, humanize);

		},

		backspace: function(curString, curStrPos) {
			// exit when stopped
			if (this.stop === true) {
				return;
			}

			// varying values for setTimeout during typing
			// can't be global since number changes each time loop is executed
			var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
			var self = this;

			self.timeout = setTimeout(function() {

				// ----- this part is optional ----- //
				// check string array position
				// on the first string, only delete one word
				// the stopNum actually represents the amount of chars to
				// keep in the current string. In my case it's 14.
				// if (self.arrayPos == 1){
				//  self.stopNum = 14;
				// }
				//every other time, delete the whole typed string
				// else{
				//  self.stopNum = 0;
				// }

				if (self.contentType === 'text') {
					// skip over html tags while backspacing
					if (curString.substr(curStrPos).charAt(0) === '>') {
						var tag = '';
						while (curString.substr(curStrPos - 1).charAt(0) !== '<') {
							tag -= curString.substr(curStrPos).charAt(0);
							curStrPos--;
							if (curStrPos < 0) { break; }
						}
						curStrPos--;
						tag += '<';
					}
				}

				// ----- continue important stuff ----- //
				// replace text with base text + typed characters
				var nextString = curString.substr(0, curStrPos);
				if (self.attr) {
					self.el.attr(self.attr, nextString);
				} else {
					if (self.isInput) {
						self.el.val(nextString);
					} else if (self.contentType === 'html') {
						self.el.html(nextString);
					} else {
						self.el.text(nextString);
					}
				}

				// if the number (id of character in current string) is
				// less than the stop number, keep going
				if (curStrPos > self.stopNum) {
					// subtract characters one by one
					curStrPos--;
					// loop the function
					self.backspace(curString, curStrPos);
				}
				// if the stop number has been reached, increase
				// array position to next string
				else if (curStrPos <= self.stopNum) {
					self.arrayPos++;

					if (self.arrayPos === self.strings.length) {
						self.arrayPos = 0;

						// Shuffle sequence again
						if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

						self.init();
					} else
						self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
				}

				// humanized value for typing
			}, humanize);

		},
		/**
		 * Shuffles the numbers in the given array.
		 * @param {Array} array
		 * @returns {Array}
		 */
		shuffleArray: function(array) {
			var tmp, current, top = array.length;
			if(top) while(--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}
			return array;
		},

		// Start & Stop currently not working

		// , stop: function() {
		//     var self = this;

		//     self.stop = true;
		//     clearInterval(self.timeout);
		// }

		// , start: function() {
		//     var self = this;
		//     if(self.stop === false)
		//        return;

		//     this.stop = false;
		//     this.init();
		// }

		// Reset and rebuild the element
		reset: function() {
			var self = this;
			clearInterval(self.timeout);
			var id = this.el.attr('id');
			this.el.empty();
			if (typeof this.cursor !== 'undefined') {
        this.cursor.remove();
      }
			this.strPos = 0;
			this.arrayPos = 0;
			this.curLoop = 0;
			// Send the callback
			this.options.resetCallback();
		}

	};

	$.fn.typed = function(option) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('typed'),
				options = typeof option == 'object' && option;
			if (data) { data.reset(); }
			$this.data('typed', (data = new Typed(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.typed.defaults = {
		strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
		stringsElement: null,
		// typing speed
		typeSpeed: 0,
		// time before typing starts
		startDelay: 0,
		// backspacing speed
		backSpeed: 0,
		// shuffle the strings
		shuffle: false,
		// time before backspacing
		backDelay: 500,
		// loop
		loop: false,
		// false = infinite
		loopCount: false,
		// show cursor
		showCursor: true,
		// character for cursor
		cursorChar: "|",
		// attribute to type (null == text)
		attr: null,
		// either html or text
		contentType: 'html',
		// call when done callback function
		callback: function() {},
		// starting callback function before each string
		preStringTyped: function() {},
		//callback for every typed string
		onStringTyped: function() {},
		// callback for reset
		resetCallback: function() {}
	};


}(window.jQuery);

0

jQuery(function() {
  //jQuery.typer.options.highlightspeed = 300;
  //var typer = jQuery('[data-typer-targets]').typer();


  jQuery('[data-typer-targets]').each(function() {

    var typeWriterText = this.getAttribute('data-typer-targets').split(',');
    jQuery(this).typed({
        strings: typeWriterText,
        typeSpeed: 75,
        loop: true,
    });

  });
});
