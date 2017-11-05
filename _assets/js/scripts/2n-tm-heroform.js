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
