$(document).ready(function() {

	$( ".hero-search input" ).focus(function() {
	  	$(".search-results").delay(0).fadeIn();
	});
	$( ".hero-search input" ).focusout(function() {
	  	$(".search-results").delay(0).fadeOut();
	});

	$('.hero-slider-slides').slick({
	  	slidesToShow: 1,
	  	slidesToScroll: 1,
		speed:1000,
		infinite: true,
	  	dots: false,
	  	arrows: true,
	  	autoplay: true,
	  	autoplaySpeed: 5000,
	  	fade: true,
	  	draggable: false
	});

	$('a[data-slide]').click(function(e) {
	   	e.preventDefault();
	   	var slideno = $(this).data('slide');
	   	$('a[data-slide=0]').removeClass('active');
	   	$('a[data-slide=1]').removeClass('active');
	   	$('a[data-slide=2]').removeClass('active');
	   	$('a[data-slide=3]').removeClass('active');
	   	$('a[data-slide=4]').removeClass('active');
	   	$('a[data-slide=5]').removeClass('active');
	   	$('a[data-slide=' + slideno + ']').addClass('active');
	   	$('.hero-slider-slides').slick('slickGoTo', slideno);
	});

	$(".hero-slider-slides").on("afterChange", function (event, slick, currentSlide, nextSlide) {
	    $('a[data-slide=0]').removeClass('active');
	   	$('a[data-slide=1]').removeClass('active');
	   	$('a[data-slide=2]').removeClass('active');
	   	$('a[data-slide=3]').removeClass('active');
	   	$('a[data-slide=4]').removeClass('active');
	   	$('a[data-slide=5]').removeClass('active');
	   	$('a[data-slide=' + currentSlide + ']').addClass('active');
	})

	const words = [
		"I hear a high pitched clicking sound.", 
		"My Engine does not start", 
		"Brakes are old and grinding"
	];
	let i = 0;
	let timer;

	function typingEffect() {
		let word = words[i].split("");
		var loopTyping = function() {
			if (word.length > 0) {
				document.getElementById('typing-effect').value += word.shift();
			} else {
				deletingEffect();
				return false;
			};
			timer = setTimeout(loopTyping, 100);
		};
		loopTyping();
	};

	function deletingEffect() {
		let word = words[i].split("");
		var loopDeleting = function() {
			if (word.length > 0) {
				word.pop();
				document.getElementById('typing-effect').value = word.join("");
			} else {
				if (words.length > (i + 1)) {
					i++;
				} else {
					i = 0;
				};
				typingEffect();
				return false;
			};
			timer = setTimeout(loopDeleting, 30);
		};
		loopDeleting();
	};

	typingEffect();

	$('.testimonial-slider').slick({
	  	slidesToShow: 1,
	  	slidesToScroll: 1,
		speed: 500,
		infinite: true,
	  	dots: false,
	  	arrows: true,
	  	autoplay: true,
	  	autoplaySpeed: 5000,
	  	fade: true,
	});

	$('.market-place-slider').slick({
	  	slidesToShow: 6,
	  	slidesToScroll: 1,
		speed: 500,
		infinite: true,
	  	dots: false,
	  	arrows: true,
	  	autoplay: true,
	  	autoplaySpeed: 3000,
	  	responsive: [
			{
	      		breakpoint: 1200,
	      		settings: {
			        slidesToShow: 5
	      		}
	    	},
	    	{
	      		breakpoint: 992,
	      		settings: {
			        slidesToShow: 4
	      		}
	    	},
	    	{
	      		breakpoint: 768,
	      		settings: {
			        slidesToShow: 3
	      		}
	    	},
	    	{
	      		breakpoint: 576,
	      		settings: {
			        slidesToShow: 2
	      		}
	    	}
	  	]
	});

});

var textAreas = document.getElementsByTagName('input');

Array.prototype.forEach.call(textAreas, function(elem) {
    elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
});