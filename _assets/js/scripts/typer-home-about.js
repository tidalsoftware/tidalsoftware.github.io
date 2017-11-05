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
