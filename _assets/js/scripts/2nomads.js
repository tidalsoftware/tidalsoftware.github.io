
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
