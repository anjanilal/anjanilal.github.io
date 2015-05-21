$(document).ready(function($) {
	
	$('.lightbox_trigger').click(function(e) {
	    e.preventDefault();
	    var image_href = $(this).attr("href");
	    var image_alt = $(this).attr("alt");
	    var image_title = $(this).attr("title");
      // Check if lightbox div is already opened  
        if ($('#lightbox').length > 0) 
            { // #lightbox exists
	//insert img tag with clicked link's href as src value
        	    $('#imagecontainer').html('<img src="' + image_href + '" />');
        	    $('#imagedesc #heading').html('<h1>' + image_title + '</h1>');
        	    $('#imagedesc #content').html('<h3>' + image_alt + '</h3>');
	//show lightbox window - you can use a transition here if you want, i.e. .show('fast')
            	$('#lightbox').show();
            }

        else 
            { //#lightbox does not exist 
	//create HTML markup for lightbox window
	            var lightbox = 
	                '<div id="lightbox">' +
	                '<p>Click to close</p>' +
	                '<div id="imagecontainer">' +
	                '<img src="' + image_href +'" />' +
	                '</div>' +
		            '<div id="imagedesc">' + //insert clicked link's href into img src
		            '<h1 id="heading">' + image_title + '</h1>' +
		            '<h3 id="content">' + image_alt + '</h3>' +
		            '</div>' +	
	                '</div>';
	//insert lightbox HTML into page
	                $('body').append(lightbox);
             }
    // to hide the lightbox    
    });
	
//Click anywhere on the page to get rid of lightbox window
	$('#lightbox').live('click', function() { //must use live, as the lightbox element is inserted into the DOM
		$('#lightbox').hide();
	});
    
});