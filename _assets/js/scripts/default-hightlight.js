$('.pricing-table__header').hover( function() {
  $('.pricing-table__header.active-tb').removeClass('selected');
});

$('.pricing-table__header').mouseleave(function(){
  $('.pricing-table__header.active-tb').addClass('selected');
});


