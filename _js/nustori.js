// global variables - short names for simplicity in math functions, chained css, etc.
// window width
var ww;
// window height
var wh;
// background image
var bi;
// background transition image
var bt;
// background color
var bc;
// background height
var bh;
// container width
var cw;
// sections count
var sc;
// window scrollTop
var p;
// pageHeader height
var hh;
// global DOM objects available onload - long names for clarity in targeting
var container;
var majorSections;
var majorSectionsHeaders;
var majorSectionsFirst;
var majorSectionsFirstHeaders;
var majorSectionsLast;
var majorSectionsLastHeaders;
var majorSectionsNotFirst;
var majorSectionsNotFirstHeaders;
var majorSectionsNotLast;
var majorSectionsNotLastHeaders;
var majorSectionsTitles;
var majorSectionsBackgrounds;
var horizScrollSections;
var pageHeader;
var topFixedNav;
// load
$(function() {
	// hide the content during load to avoid flash frames
	$('body').css('background', '#000000');
	$('.container').css('opacity', 0);
	// set up the page
	defineFixedGlobals();
	prepDom();
	positionSections();
	makeNav();
	windowScrollFunctions();
	// event binders
	$(window).scroll(function() {
		windowScrollFunctions()
	});
	$(window).mousemove(function(e) {
		mouseMoveFunctions(e)
	});
	$(window).resize(function() {
		resizeFunctions()
	});
	$('.container').animate({
		opacity : 1
	}, 1000, function() {
		$('body').css('background', '#FFFFFF');
	});
});
function defineFixedGlobals() {
	// starting values for global variables
	ww = $(window).width();
	wh = $(window).height();
	bi = $('.background').css('background-image');
	bt = $('.background .transition').css('background-image');
	bt = $('.background .transition').css('background-color');
	bh = $('.background').height();
	cw = $('.container').width();
	sc = $('.container > section').size();
	p = $(document).scrollTop();
	// starting values for global DOM objects
	container = $('body > .container');
	majorSections = $('> section', container);
	majorSectionsHeaders = $('> div:first', majorSections);
	majorSectionsFirst = majorSections.first();
	majorSectionsFirstHeaders = $('> div:first', majorSectionsHeaders);
	majorSectionsLast = majorSections.last();
	majorSectionsLastHeaders = $('> div:last', majorSectionsHeaders);
	majorSectionsNotFirst = majorSections.not(':first');
	majorSectionsNotFirstHeaders = majorSectionsHeaders.not(':first');
	majorSectionsNotLast = majorSections.not(':last');
	majorSectionsNotLastHeaders = majorSectionsHeaders.not(':last');
	horizScrollSections = $('> section.x-scroll', majorSections);
	horizScrollSectionsContent = $('> div.scroll > div', horizScrollSections);
	horizScrollSectionsContentNotLast = horizScrollSectionsContent.not(':last');
	pageHeader = $('body > header');
	// this one is out of order so it will work
	hh = pageHeader.height();
};
function prepDom(argument) {
	// let's mark the last section for easier looping
	majorSectionsLast.addClass('last');
	// top fixed nav
	// store the nav in an object
	topFixedNav = ('> nav', pageHeader);
	// major section h1s
	majorSectionsTitles = $('> h1', majorSectionsHeaders);
	// major sections and backgrounds
	majorSections.each(function(i) {
		// background image size directory chooser
		var bgdir = '/_img/480/';
		if (wh > 800) {
			bgdir = 1080;
		} else if (wh > '/_img/640/') {
			bgdir = 720;
		} else if (wh > 400) {
			bgdir = '/_img/480/';
		}
		;

		$(this).attr('data-index', i).attr('id', 'sec' + i);
		var bi = 'url(' + bgdir + $(this).attr('data-bg-img') + ')';
		var bt = 'url(' + bgdir + $(this).attr('data-bgt-img') + ')';
		var bc = $(this).attr('data-bg-color');
		$('.container').append('<div class="background" id="bg' + i + '" data-index="' + i + '"><div class="transition"></div></div>');
		$('.container > .background#bg' + i).css('background-image', bi).css('z-index', -(i + 1)).css('opacity', 0);
		$('.container > .background#bg' + i + ' > .transition').css('background-image', bt).css('opacity', 0);
	});
	majorSectionsBackgrounds = $('> .background', container);
	// major section internal nav
	majorSectionsHeaders.after('<div class="nav-curr">more</div>');
	majorSectionsNotFirstHeaders.before('<div class="nav-prev"></div>');
	majorSectionsNotLast.append('<div class="nav-next"></div>');
	$('.nav-prev', majorSections).each(function(i) {
		$(this).html('prev: <strong>' + majorSectionsTitles.eq(i).text() + '</strong>');
	});
	$('.nav-next', majorSections).each(function(i) {
		$(this).html('next: <strong>' + majorSectionsTitles.eq(i + 1).text() + '</strong>');
	});
	horizScrollSectionsContent.prepend('<div class="horiz-nav"></div>');
	// append these in html order
	horizScrollSections.each(function(i) {
		$('div.horiz-nav', this).not(':first').append('<span class="nav-left">prev</span>');
		$('div.horiz-nav', this).not(':last').append('<span class="nav-right">next</span>');
		$('div.horiz-nav', this).append('<div><ul></ul><br /><span class="nav-label"></span><div>');
	});

};
/*
 * layout 1: Put the sections where they need to be
 */
function positionSections() {
	// first, get the nested sections laid out so their parent elements have the right height
	var nw;
	// make the .x-scroll sections wide enough to hold their children

	$('> div.scroll', horizScrollSections).each(function(index) {
		nw = cw * $('> div', this).length;
		$(this).css('position', 'relative').width(nw);
	});

	// store the previous section bottom (if any) for offset calculation
	var pb;
	majorSections.each(function(i) {
		var th = $(this).outerHeight();
		var thh = majorSectionsHeaders.eq(i).outerHeight() + Number($('.nav-prev', this).outerHeight()) + Number($('.nav-curr', this).outerHeight());
		switch(i) {
			case 0:
				pb = wh - thh - 6;
				$(this).css('top', pb).attr('data-top', pb).attr('data-bottom', pb + th);
				pb = pb + th + wh;
				break;
			default:
				$(this).css('top', pb).attr('data-top', pb).attr('data-bottom', pb + th);
				pb = pb + th + wh;
				break;
		};
		var tar = majorSectionsHeaders.eq(i);
		var tac = $('.nav-curr', this).offset().top;
		var tap = $('.nav-curr', this).outerHeight();
		var tp = tac + tap - wh;
		$(this).attr('data-anchor', tp);
	});
};
/*
 * layout 2: build navigation elements
 * note that the changes to navigation display are in the trackNav() function, which responds to window postion().top
 */
function makeNav() {;
	// hmm. for some reason this doesn't work (in Chrome) when I reference the global topFixedNav object, so I have to find it again...
	//	var topNav = $('header > nav');
	// position the nav in relation to the .container: its left is the .container's left
	//	var nr = container.offset().left;
	//	topNav.css('right', nr);
	// now we're going to make the li and a elements
	majorSectionsTitles.each(function(i) {
		var curr = $(this).text();
		var sec = '#sec' + i;
		var nav = '#nav' + i;
		$('ul', topFixedNav).append('<li><a href="' + sec + '" title="' + curr + '">' + (i + 1) + '</a></li>');
	});
	// on mouseover swap out the active nav label to what you'll get if you click
	$('a', topFixedNav).hover(function() {
		$('span.nav-label', topFixedNav).text($(this).attr('title')).addClass('hov-nav-label');
	}, function() {
		$('span.nav-label', topFixedNav).text($('li.active > a', topFixedNav).attr('title')).removeClass('hov-nav-label');
	});
	// make the nav scroll to the right section when it's clicked
	// calling these the long way because for some reason the index count get wacked when I find within topFixedNav...
	$('body > header > nav > ul > li').each(function(i) {
		$('> a', this).click(function() {
			var lin = $('header > nav > ul > li.active').index();
			var dif = Math.abs(i - lin);
			var tar = majorSectionsHeaders.eq(i);
			var tp = majorSections.eq(i).attr('data-anchor');
			$('html, body').animate({
				scrollTop : tp
			}, 2000 * (dif + 1));
			trackNav();
			return false;
		});
	});
	// first, the major sections get linked to open the section when only the title header is visible, like on default load
	majorSections.each(function(i) {
		var tp = $(this).attr('data-top');
		$('.nav-curr', this).click(function() {
			$('html, body').animate({
				scrollTop : tp - hh - 8
			}, 1000);
		});
	});
	majorSectionsNotLast.each(function(i) {
		var no = $(this).next();
		var na = Number(no.attr('data-anchor'));
		$('.nav-next', this).click(function() {
			$('html, body').animate({
				scrollTop : na
			}, 2000);
		});
	});
	majorSectionsNotFirst.each(function(i) {
		var po = $(this).prev();
		var pa = Number(po.attr('data-top'));
		$('.nav-prev', this).click(function() {
			$('html, body').animate({
				scrollTop : pa - hh - 8
			}, 2000);
		});
	});
	// add left/right nav to the nested .x-scroll sections
	// currently displayed section
	var cds = 0;
	// last scroll position
	var lsp = 0;
	// reset on stop
	var ros = 0;
	horizScrollSections.each(function() {
		var pu = $(this);
		pu.scroll(function() {
			pu.removeClass('stopped');
			var sl = pu.scrollLeft();
			if (sl > (lsp + 15)) {
				ros = 1;
			} else if (sl < (lsp - 15)) {
				ros = -1;
			} else {
				ros = 0;
			}
			;
			function scrollStop() {
				if (pu.hasClass('clicked')) {
					pu.removeClass('clicked');
					cds = lsp / cw;
					return;
				};
				pu.addClass('stopped');
				if (sl * (cds + ros) !== lsp) {
					pu.animate({
						scrollLeft : cw * (cds + ros)
					}, 500, function() {
						lsp = pu.scrollLeft();
						cds = lsp / cw;
						ros = 0;
					});
				};
			};
			var self = this, $this = $(self);
			if ($this.data('scrollTimeout')) {
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(scrollStop, 100, self));

		});
		$('.nav-right', this).each(function(i) {
			var nt = $('> div > div', pu).eq(i + 1).find('h1,h2,h3,h4,h5').first().text();
			$(this).click(function() {
				pu.animate({
					scrollLeft : cw * (i + 1)
				}, 500, function() {
					lsp = pu.scrollLeft();
					pu.addClass('clicked');
				});
			}).html('next: <strong>' + nt + '</strong>');
		});
		$('.nav-left', this).each(function(i) {
			var pt = $('> div > div', pu).eq(i).find('h1,h2,h3,h4,h5').first().text();
			$(this).click(function() {
				pu.animate({
					scrollLeft : cw * i
				}, 500, function() {
					lsp = pu.scrollLeft();
					pu.addClass('clicked');
				});
			}).html('prev: <strong>' + pt + '</strong>');
		});

	});
	horizScrollSectionsContent.each(function() {
		var ts = $(this);
		var pu = $(this).parents('.x-scroll');
		var pc = $(this).prevAll().length;
		var nc = $(this).nextAll().length;
		for (var i = 0; i < pc; i++) {
			$('.horiz-nav > div > ul', this).append('<li><a>p</a></li>');
		};
		$('.horiz-nav > div > ul', this).append('<li class="active"><a>t</a></li>');
		for (var i = 0; i < nc; i++) {
			$('.horiz-nav > div > ul', this).append('<li><a>n</a></li>');
		};
		$('.horiz-nav > div > ul > li > a', this).each(function(i) {
			$(this).text((i + 1));
			// var txt = $('h1,h2,h3,h4,h5', ts).first().text();
			var ct = horizScrollSectionsContent.eq(i);
			var txt = $('h1,h2,h3,h4,h5', ct).first().text();
			var ltxt = $('h1,h2,h3,h4,h5', ts).first().text();
			$(this).attr('title', txt);
			$('.nav-label', ts).text(ltxt);
			$(this).hover(function() {
				$('.nav-label', ts).text($(this).attr('title')).addClass('hov-nav-label');
			}, function() {
				$('.nav-label', ts).text(ltxt).removeClass('hov-nav-label');
			});
			$(this).click(function() {
				pu.animate({
					scrollLeft : cw * i
				}, 500, function() {
					lsp = pu.scrollLeft();
					pu.addClass('clicked');
				});

			});
		});
	});
};
/*
 * behavior: let's make the nav react to window .position().top
 */
function trackNav(i) {
	// remove the active class from whatever had it and put in on the one passed to the function
	$('body > header > nav > ul li.active').removeClass('active');
	$('body > header > nav > ul li').eq(i).addClass('active');
	// retrieve the title attribute from the nav button and put it into the nav label
	var nt = $('body > header > nav > ul li a').eq(i).attr('title');
	$('body > header > span.nav-label').text(nt);
	// that's it!
};
/*
 * behavior: things to do when the window scrolls
 */
function windowScrollFunctions() {
	$('body').removeClass('stopped');
	// how's that scrolling going?
	p = $(document).scrollTop();
	viewportFunctions();
	// gather the sections and backgrounds we're working with
	var inv = $('.inview');
	var invind = majorSections.index(inv);
	var ninv = inv.next();
	var pinv = inv.prev();
	var invt = Number(inv.attr('data-top'));
	var invb = Number(inv.attr('data-bottom'));
	var bginv = $('.bg-inview');
	var bginvt = $('.transition', bginv);
	var nbginv = bginv.next('.background');
	var pbginv = bginv.prevAll('.background');
	var bginvh1 = $('.bg-inview > h1');
	var ito = (1 + ((p - invt) / wh) / .25).toFixed(2);
	// var io = (2 - ito).toFixed(2);
	var io = -(1 + ((p - invb) / wh) / .25);
	console.log(-(1 + ((p - invb) / wh) / .25));
	var np = -(p - invb);
	var no = (1 + ((p - invb) / wh) / .25).toFixed(2);
	if (ito > 1) {
		ito = 1;
	} else if (ito < 0) {
		ito = 0;
	}
	;
	if (io > 1) {
		io = 1;
	} else if (io < 0) {
		io = 0;
	}
	;
	if (no > 1) {
		no = 1;
	} else if (no < 0) {
		no = 0;
	}
	;
	bginvt.css('opacity', ito);
	bginvh1.css('opacity', 1 - (ito * 2))//.css('color','red');
	bginv.css('top', 0).css('opacity', io);
	var np = -(p - invb);
	var no = Number((1 + ((p - invb) / wh) / .25).toFixed(2)) + .25;
	nbginv.css('top', np).css('opacity', no);
	pbginv.css('opacity', 0);
	var nc = $('.inview');
	var nca = Number(nc.attr('data-anchor'));
	var nnc = $('.nav-curr', nc);
	var invat = -(p - Number(inv.attr('data-top')));
	if (invat <= hh) {
		pageHeader.slideUp();
	};
	// scroll stop
	function scrollStop() {
		$('body').addClass('stopped');
		if (invat <= hh) {
			pageHeader.slideUp();
		} else if (invind < 1 && p > 20) {
			pageHeader.slideUp();
		} else {
			pageHeader.slideDown();
		}
		;
		if (nca + 20 > p) {
			nnc.css('visibility', 'visible').css('cursor', 'pointer');
		};
		if (nca + 40 < p) {
			nnc.css('visibility', 'hidden').css('cursor', 'auto');
		};
	};

	var self = this, $this = $(self);
	if ($this.data('scrollTimeout')) {
		clearTimeout($this.data('scrollTimeout'));
	}
	$this.data('scrollTimeout', setTimeout(scrollStop, 250, self));

};
/*
 * behaviors 2: what's in the viewport and what's out of it
 */
function viewportFunctions() {
	// loop through each section and figure out its current state
	majorSections.each(function(i) {
		// objects we'll be working with
		var s = $(this);
		var sp = s.prevAll('section:first()');
		var sn = s.nextAll('section:first()');
		var sb = s.prevAll('.background:first');
		var spb = sp.prevAll('.background:first');
		var snb = sn.prevAll('.background:first');
		// give the background a special class
		sb.addClass('bg-inview');
		// how far down the page is the top?
		var tt = s.position().top;
		// how tall is it?
		var th = s.outerHeight();
		// where's the bottom? (hey, wait a minute! can't I just get all this from the data- attribute instead of figuring it out again?)
		var tb = tt + th;
		// this is simpler, yes, but it doesn't work, alas (is it because it's static offset, not dynamic position?)
		// var tb = $(this).attr('data-pos-key');
		// okay, if the window scroll is less than the top of the section and the top of the section is less than the window scroll plus window height, it's .inview
		// or if the dynamic bottom we just found is less than the window scroll plus the window height and the dynamic bottom is greater than the window scroll
		// either one. whatever works for you. it's all good.
		if (tt < (p + wh) && tb > p) {
			s.addClass('outview').removeClass('inview');
			majorSectionsBackgrounds.eq(i).addClass('bg-inview');
			s.addClass('inview').removeClass('outview');
			setTimeout(function() {
				trackNav(i);
			}, 500);
		} else {
			s.addClass('outview').removeClass('inview');
			majorSectionsBackgrounds.eq(i).removeClass('bg-inview');
		}
		;
	});
};
// when the mouse is moved, check where it is ana do things
function mouseMoveFunctions(e) {
	if (e.pageY - p < hh && $('body').hasClass('stopped')) {
		pageHeader.slideDown();
	};
};
// when the window is resized, get the background height and reposition all the sections, yo
function resizeFunctions() {
	// reset values for dimensional globals
	ww = $(window).width();
	wh = $(window).height();
	bh = $('.background').height();
	cw = $('.container').width();
	p = $(document).scrollTop();
	// rejigger the page
	positionSections();
	windowScrollFunctions();
	//	makeNav();
};
