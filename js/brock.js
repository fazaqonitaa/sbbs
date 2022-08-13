/* 
 * The Brock News general JS declarations.
 * Menu, general accessibility and desktop > mobile transitions.
 * Sebastien Marchal / BrockU
 *
 */

(function ($) {
    $(document).ready(function () {

        // Before Window loads

        /** Mobile/small
            screen check
        **************/
        // Some functions only apply to the mobile view, so let's check for it.
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            ismobile = true;
        } else {
            ismobile = false;
        }

        // Also check for the layout width.
        // Get the windowwidth on resize
        var windowwidth;
        if (window.addEventListener) {

            // For most browsers
            window.addEventListener('resize', function () {
                windowwidth = document.documentElement.clientWidth;
            }, false); // last arg. required for gecko browsers

        } else {

            // for IE8 and below
            window.attachEvent('resize', function () {
                windowwidth = document.documentElement.clientWidth;
            });

        }

        /** Main menu
        **************/

        // Accessible mega menu
        $('.main-menu').accessibleMegaMenu({ // Menu container class
            /* prefix for generated unique id attributes, which are required 
               to indicate aria-owns, aria-controls and aria-labelledby */
            uuidPrefix: "accessible-menu",

            /* css class used to define the megamenu styling -- NOTE: Not currently used in the CSS */
            menuClass: "main-menu-js",

            /* css class for a top-level navigation item in the megamenu */
            topNavItemClass: "menu-item",

            /* css class for a megamenu panel -- NOTE: this is not attached to a Wordpress class. */
            panelClass: "sub-nav",

            /* css class for a group of items within a megamenu panel */
            panelGroupClass: "sub-menu",

            /* css class for the hover state */
            hoverClass: "hover",

            /* css class for the focus state */
            focusClass: "focus",

            /* css class for the open state */
            openClass: "open"
        });

        // Clear the text of the '.home' menu item so we can add our home icon
        $('.main-menu > ul.menu > li.home > a').empty().attr('title', 'Home Page');


        /** Accessibility skipnav
        **************************/

        // Skip to search:
        $('ul#skip li.skip-to-search a, a.search-404').click(function () {
            $('#sidebar input#s').focus(); // focus on search form
            //$('#sidebar input#s').val('');
        });

        // Skip to Navigation:
        $('.menu > li:first-child a').attr('id', 'main-menu-first-item'); // Assign ID to first menu item
        $('ul#skip li.skip-to-navigation a').click(function () {
            $('#main-menu-first-item').focus();
        });

        // Skip to Content:
        $('ul#skip li.skip-to-content a').click(function () {
            $('#content').focus();
        });


        /** Quick links / Admissions
        ****************************
        ****************************/

        /* Accessibility: clone the menus for jaws */
        $('#quicklinks').clone().addClass(".hfsr").prependTo($('#wrapper')).attr('id', 'quicklinks-jaws');
        $('#quicklinks-jaws').find("*").removeAttr("id");
        $('#quicklinks-jaws').attr({ "aria-hidden": "false", "aria-expanded": "true" });


        /** Quick links
        ****************************/
        // Toggle
        $('#quicklinks-toggle').on('click keydown', function (e) {

            var quicklinks = $('#quicklinks');

            // If drawer is closed
            if ($(this).attr('aria-expanded') == 'false') {

                if (e.type == 'click' || e.keyCode == 13) { // on click or enter

                    e.preventDefault();
                    quicklinks.slideToggle('fast');

                    // aria
                    $('#quicklinks-toggle').attr('aria-expanded', 'true');
                    quicklinks.attr('aria-hidden', 'false');
                    quicklinks.attr('aria-expanded', 'true');

                    quicklinks_drawer_actions();

                }
                return;
            }

            // If drawer is open
            if ($(this).attr('aria-expanded') == 'true') {

                if (e.type == 'click' || e.keyCode == 13) { // on enter

                    e.preventDefault();
                    quicklinks.slideToggle('fast');

                    // aria
                    $('#quicklinks-toggle').attr('aria-expanded', 'false');
                    quicklinks.attr('aria-hidden', 'true');
                    quicklinks.attr('aria-expanded', 'false');

                    quicklinks_drawer_actions();

                }

                if (e.keyCode == 9) { // on tab
                    if (!e.shiftKey) { // if shift key isn't pressed
                        e.preventDefault();
                        $('#quicklinks-first-item').focus(); // focus on first item
                    }
                }
                return;
            }

        });

        // Quick links first item
        $('#quicklinks-first-item').on('keydown', function (e) {
            if (e.keyCode == 9) { // on tab
                if (e.shiftKey) { // if shift key is pressed
                    e.preventDefault();
                    $('#quicklinks-toggle').focus(); // return focus to quicklinks toggle
                }
            }
        });

        // Quick links close button
        $('a#quicklinks-close').on('click keydown', function (e) {
            // On mouse click or keyboard
            if (e.type == 'click' || e.keyCode == 13) {
                $('#quicklinks').slideToggle('fast');

                // aria
                $('#quicklinks-toggle').attr('aria-expanded', 'false');
                $('#quicklinks').attr('aria-hidden', 'true');
                $('#quicklinks').attr('aria-expanded', 'false');
            }

            $('#quicklinks-toggle .fa').removeClass('fa-angle-up').addClass('fa-bars');

        });

        function quicklinks_drawer_actions() {

            // reset icons			
            $('#quicklinks-toggle .fa').toggleClass('fa-angle-up').toggleClass('fa-bars');

        }


        /** Mobile
        ***********/

        // Menu/Quicklinks toggle for mobile view.
        $('#mobile-quicklinks-toggle').click(function () {

            if ($('#mobilesearch').is(':visible')) {
                $('#mobilesearch').slideToggle('fast');
                $('#mobilesearch').attr('aria-hidden', 'true');
            }

            $('#quicklinks').slideToggle('fast');
            $('#quicklinks').attr('aria-hidden', 'false');
            $('#mobile-quicklinks-toggle span.fa').toggleClass('fa-search');
            $('#mobile-quicklinks-toggle span.fa').toggleClass('fa-angle-up');

            $('#header').removeClass('expanded'); // restore header height

            // restore the other two buttons to default state
            $('#mobile-search-toggle .fa').removeClass('fa-angle-up').addClass('fa-search');

        });


        // Search toggle for mobile view.
        $('#mobile-search-toggle').click(function () {

            if ($('#quicklinks').is(':visible')) {
                $('#quicklinks').slideToggle('fast');
                $('#quicklinks').attr('aria-hidden', 'true');
            }

            $('#mobilesearch').slideToggle('fast');
            $('#mobilesearch').attr('aria-hidden', 'false');
            $('#mobile-search-toggle span.fa').toggleClass('fa-search');
            $('#mobile-search-toggle span.fa').toggleClass('fa-angle-up');

            // restore the other two buttons to default state
            $('#mobile-quicklinks-toggle .fa').removeClass('fa-angle-up').addClass('fa-bars');

        });


        /** Setup the menus for
            touch interactions
        ***********************/

        $('#mobile-menu-toggle').click(function () {
            $('.main-menu-parent').slideToggle('fast');
            $('#mobile-menu-toggle span').toggleClass('fa-angle-down');
            $('#mobile-menu-toggle span').toggleClass('fa-angle-up');

            if ($('.main-menu-parent').attr('aria-hidden') == 'true') {
                $('.main-menu-parent').attr('aria-hidden', 'false');
            } else {
                $('.main-menu-parent').attr('aria-hidden', 'true');
            }

        });


        /** Setup the menus
        ***********************/
        if (ismobile) {

            $('.main-menu').on('touchstart', function (event) { });

            // Move 'this issue' info the drawer menu. Using clone to avoid layout breakage.
            $('#header .thisissue').clone().prependTo($('.main-menu-parent')); // This issue

            // Remove searchform from sidebar
            $('#sidebar .widget_search').remove();

        }


        /** Back to Top
        ****************/
        $(window).scroll(function () {

            if (ismobile == false) { // Only show the arrow on non-touch screens.
                if ($(window).scrollTop() > 300) {
                    $('#backtotop').fadeIn('fast');
                } else {
                    $('#backtotop').fadeOut('fast');
                }
            }

        });

        // If button is clicked or keyboard is used
        $('#backtotop').on('click keydown', function (e) {

            // On mouse click, scroll to the top.
            if (e.type == 'click') {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $("#wrapper").offset().top
                }, 500);

                // On key press, jump to top and select main logo.
            } else if (e.keyCode == 13 || e.keyCode == 32) { // 13 is enter, 32 is space
                $('#brand').focus();
            }
        });


        /** Single image zoom & caption
        ********************************/
        if ($.fn.featherlight) {
            $('.wp-caption a').featherlight({
                previousIcon: '',
                nextIcon: '',
                loading: '<span class=\"loading fa fa-circle-o-notch fa-spin\"></span>',
                afterContent: function () {
                    this.$caption = this.$caption || jQuery('<div class="caption" />').insertAfter(this.$content);
                    //console.log(this.$currentTarget.context.nextSibling.innerText);
                    this.$caption.text(this.$currentTarget.context.nextSibling.innerText); // Get the text of the next sibling detected, which should be p.caption-text
                }
            });
        }


        /** Seen & Heard Form tweaks
        ********************************/
        $('label.ginput_post_image_file').text('');
        $('.ginput_post_image_description label').text('Enter a description for your image above.');



    });

    $(window).load(function () {

        // After Window has loaded

        /** Weather info
        ****************/

        //getWeather();

        function getWeather() {

            /*  Weather data provided by Open Weather Map.
                http://openweathermap.org/API#weather
                http://openweathermap.org/current
                http://openweathermap.org/city/6155721
                https://weather.gc.ca/city/pages/on-107_metric_e.html
            	
                to do:
                https://developer.forecast.io/docs/v2
                    	
                Fetch the data from the public API through JSONP:
            */

            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather',
                jsonp: 'callback',
                dataType: 'jsonp',
                cache: false,
                data: {
                    //q: 'St. Catharines',
                    //id: 6155721, // St. Catharines Station ID
                    id: 6165719, // Thorold Station ID
                    units: 'metric',
                    APPID: '94930c730b69a2ce4bec2f381c77fa47',
                },
                // work with the response
                success: function (response) {
                    $('#debug').text(JSON.stringify(response));
                    var temp = response.main.temp;
                    temp = Math.round(temp * 10) / 10;
                    $('.weather-temp').text(temp + " \260C");
                    //$('.weather-wind').text(response.wind.speed);

                    if (document.domain == 'brocknews.brockubeta.ca') {
                        var path = '/wp-content/themes/the-brock-news/images/owm/';
                    } else {
                        var path = '/brock-news-test/wp-content/themes/the-brock-news/images/owm/';
                    }

                    var weather_source = path + response.weather[0].icon + '.png';
                    var weather_alt = response.weather[0].main + ' icon';
                    var weather_title = 'Current conditions in St. Catharines, Ontario: ' + response.weather[0].description + ", " + temp + " \260C with " + response.main.humidity + "% humidity.";

                    $('<img class="weather-icon" src="' + weather_source + '" width="20" height="20" title="' + weather_title + '" alt="' + weather_alt + '">').appendTo('#weather-icon-placeholder');

                },
            });
        }

        // Remove twitter timeline widgets from tab order, so users don't get stuck scrolling through a timeline.
        $('[class^=twitter-timeline]').attr('tabindex', '-1');

    });

})(jQuery);

/*  Fix for skip-to-content focus.
    From: http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
    */

if (window.addEventListener) {
    window.addEventListener("hashchange", function (event) {
        var element = document.getElementById(location.hash.substring(1));
        if (element) {
            if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
                element.tabIndex = -1;
            }
            element.focus();
        }
    }, false);
}
