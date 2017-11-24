var TrendingSliderIntervals = []; //array to hold intervals for each trending carousel

//Initiate trending sliders
var ResetTrendingSlides = function (trendItem) {
    trendItem.find('.trend-slide').each(function () {
        var trendSlide = $(this);
        trendSlide.css('left', (trendSlide.index() * trendItem.innerWidth()));
    });
    trendItem.find('.trend-slide').eq(0).addClass('active');
}

//Setting trending sliders intervals
var SetTrendingInterval = function (trendItem, randomIntervalTime) {
    var interval = setInterval(function () {
        trendItem.find('.trend-slide').each(function () {
            var trendSlide = $(this);
            if (trendSlide.index() == 1) {
                trendSlide.addClass('active');
            } else {
                trendSlide.removeClass('active');
            }
            trendSlide.stop().animate({
                left: ((trendSlide.index() - 1) * trendItem.innerWidth())
            }, 1000);
        });
        setTimeout(function () {
            trendItem.find('.trend-slide').eq(0).insertBefore($(trendItem).children('a')).css('left', ((trendItem.find('.trend-slide').length - 1) * trendItem.innerWidth()));
        }, 1100)
    }, randomIntervalTime);
    return interval;
}

//scroll highlights
var ScrollHighlights = function (highlightsItemWidth, direction) {
    var highlightsCarouselWrpPos = $('.highlights-carousel-wrp').scrollLeft();
    if (direction == 'next') {
        var calculatedScroll = highlightsItemWidth * Math.round((highlightsCarouselWrpPos + highlightsItemWidth) / highlightsItemWidth);
    } else {
        var calculatedScroll = highlightsItemWidth * Math.round((highlightsCarouselWrpPos - highlightsItemWidth) / highlightsItemWidth);
    }
    $('.highlights-carousel-wrp').animate({
        scrollLeft: calculatedScroll
    }, checkHighlightLimit);
}

//Drag highlights with Mouse
var DragHighlights = function (actualScroll, baseClick, newMousePos) {
    HighlightDiff = newMousePos - baseClick;
    $('.highlights-carousel-wrp').scrollLeft(actualScroll - HighlightDiff);
}

var checkHighlightLimit = function () {
    highlightsCarouselWrpPos = $('.highlights-carousel-wrp').scrollLeft(),
        maxScroll = $('.highlights-carousel-wrp')[0].scrollWidth - $('.highlights-carousel-wrp').width();
    if (highlightsCarouselWrpPos == 0) {
        $('.highlights-controls a').removeClass('disabled');
        $('.highlights-controls .prev-btn').addClass('disabled');
    } else if (highlightsCarouselWrpPos >= (maxScroll - 20)) {
        $('.highlights-controls a').removeClass('disabled');
        $('.highlights-controls .next-btn').addClass('disabled');
    } else {
        $('.highlights-controls a').removeClass('disabled');
    }
}

//Transform header during document scroll
var TransformHeader = function (scrollPos, breakPos) {
    var topHeader = $('.top-header'),
        stickyHeader = $('.sticky-header'),
        bottomHeader = $('.bottom-header'),
        mainContent = $('main');
    if (scrollPos >= breakPos) {
        stickyHeader.addClass('fixed');
    } else {
        stickyHeader.removeClass('fixed');
        topHeader.removeAttr('style');
    }
    mainContent.css('margin-top', breakPos + 'px');
}

//Scroll back to top function
var BackToTop = function () {
    $("html, body").animate({
        scrollTop: 0
    }, 700);
}

//Main Carousel Parallax
var carouselDataTop = parseFloat($('.carousel-data').css('top'), 10);
var MainBannerlParallax = function (scrollPos, breakPos) {
    if ($('#main-carousel').length) {
        var carouselBodyHeight = $('#main-carousel .carousel-body').height(),
            newTopValue = scrollPos / 2,
            newPaddingValue = scrollPos / 3;
        if (scrollPos >= breakPos) {
            if (newPaddingValue <= carouselBodyHeight) {
                $('#main-carousel .carousel-body').css('padding-top', newPaddingValue);
                $('.carousel-data').css('top', carouselDataTop - newTopValue);
            }
        } else {
            $('#main-carousel .carousel-body').css('padding-top', 0);
            $('.carousel-data').css('top', carouselDataTop);
        }
    } else if ($('.category-banner').length) {
        var breakPos = $('.top-header').height(),
            categoryBannerHeight = $('.category-banner').height();
        newBgPosition = scrollPos / 15;
        if (scrollPos >= breakPos) {
            if (newBgPosition <= categoryBannerHeight) {
                $('.category-banner').css('background-position-y', (50 - newBgPosition) + '%')
            }
        } else {
            $('.category-banner').css('background-position-y', (50 - newBgPosition) + '%')
        }
    }
}

//ifArabic
var ifArabic = function (input, strInput) {
    var arregex = /[\u0600-\u06FF]/;
    if (arregex.test(strInput)) {
        input.addClass('arabic-input');
        return true;
    } else {
        input.removeClass('arabic-input');
        return false;
    }
}

//ifParagraphExceeds
var ifParagraphExceeds = function (input, limit) {
    var inputHeight = input.height();
    var lineHeight = parseInt(input.css('line-height'), 10);
    var actualInputLines = inputHeight / lineHeight;
    if (actualInputLines > limit) {
        return true;
    } else {
        return false;
    }
}

//Continue Reading
var ifContinueReading = function (input, limit) {
    var exceeds = ifParagraphExceeds(input, limit);
    if (exceeds) {
        input.parent().siblings('.continue-reading').addClass('exceeds');
    } else {
        input.parent().siblings('.continue-reading').removeClass('exceeds');
    }
}

//Random Number Generator
var randomLimit = function (min, max) {
    var random = Math.random();
    var result = Math.round(random * (max - min) + min);
    return result;
}

//Set Cursor Limit
var setCursorLimit = function (input, charNumb, e) {
    var limit = input.val().length - charNumb;
    var cursorPos = input[0].selectionStart;
    var cursorEnd = input[0].selectionEnd;
    if (e) {
        if ((e.keyCode == 46) && (cursorPos >= limit || cursorEnd > limit)) {
            e.preventDefault();
        } else if (e.keyCode == 8 && (cursorPos > limit || cursorEnd > limit)) {
            e.preventDefault();
        }
    }
    if (cursorPos > limit) {
        input[0].setSelectionRange(limit, limit);
    }
}

//For Demo
var GetParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Set Active Category
var SetActiveCategory = function () {
    var cat = GetParameterByName('category');
    $('.sticky-header .category-nav li a:contains(' + cat + ')').addClass('active');
}

//Category names to inner pages
var SetInnersCategory = function () {
    var Category = GetParameterByName('category');
    var SubCategory = GetParameterByName('subcategory');
    $('body').addClass(Category + '-theme');
    if ($('.category-banner').length) {
        $('.category-banner h1').html(Category);
        if (SubCategory != null) {
            $('.category-banner h1').html(SubCategory);
        }
    }
    if ($('.category-best-wrp').length) {
        $('.category-best-wrp h2 .category-name').html(Category);
        if (SubCategory != null) {
            $('.category-best-wrp h2 .category-name').html(SubCategory);
        }
    }
    if ($('.main-category-name').length) {
        $('.main-category-name').html(Category);
        if ($('.main-category-name').is('a')) {
            $('.main-category-name').attr('title', Category).attr('href', 'category.html?category=' + Category);
        }
    }
    if ($('.sub-category-name').length) {
        $('.sub-category-name').html(SubCategory);
        if ($('.sub-category-name').is('a')) {
            $('.sub-category-name').attr('title', SubCategory).attr('href', 'items-listing.html?category=' + Category + '&subcategory=' + SubCategory);
        }
    }
}

//Move advert during scroll
var MoveAd = function (scrollPos, breakPos, stopPos, stopBreakPos, customTop) {
    var adContainer = $('.ads-wrp');
    if (scrollPos >= stopBreakPos) {
        adContainer.removeClass('fixed').parent().css('top', stopPos);
    } else if (scrollPos >= breakPos) {
        adContainer.addClass('fixed').css('top', customTop).parent().removeAttr('style');
    } else {
        adContainer.removeClass('fixed').removeAttr('style');
    }
}

if ($('gallery-section-container').length) {
    var mainSlideIndex = 0;
}

//Initialize gallery slider
var detailsGallerySlidesSize = $('.slide-image').length;
var InitDetailsGallerySlider = function () {
    var counter = 0;
    $('.slide-image').each(function () {
        $(this).attr('data-index', counter);
        counter++;
    });
}

//Display clicked gallery slide
var DisplayClickedDetailsGalleryItem = function (clickedSlide) {
    var mainImg = $('.main-slide-wrp').find('img');
    var clickedImg = clickedSlide.find('img');
    var temp = {
        src: mainImg.attr('src'),
        index: mainImg.attr('data-index')
    };
    mainImg.attr('src', clickedImg.attr('src')).attr('data-index', clickedImg.attr('data-index'));
    clickedImg.attr('src', temp.src).attr('data-index', temp.index);
}

//Display next gallery slide
var NextDetailsGalleryItem = function () {
    var mainImgIndex = parseInt($('.main-slide-wrp').find('img').attr('data-index'));
    var nextIndex = mainImgIndex + 1;
    DisplayClickedDetailsGalleryItem($('.slide-image[data-index="' + nextIndex + '"]').parent());
}

//Display prev gallery slide
var PrevDetailsGalleryItem = function () {

}

//Populate Popup
var PopulatePopup = function (type, title, hasBg = false) {
    var bgClass = '';
    hasBg ? bgClass = ' popup-with-bg' : '';
    $('#popup-base .popup-title span').html(title);
    $('#popup-base').find('.' + type + '-container').fadeIn(0);
    $('#popup-base').addClass('popup-active ' + type + '-popup-active' + bgClass).find('.close-btn').addClass('init');
}

//document ready
$(document).ready(function () {
    //Ripple Effect
    if ($('.ripple').length) {
        var circle = '<span class="circle"></span>'
        $('.ripple').on('click', function (e) {
            var height = $(this).height(),
                width = $(this).width(),
                posTop = $(this).position().top,
                posLeft = $(this).position().left,
                max = Math.max(height, width);
            $(this).prepend(circle);
            var newCircle = $(this).find('.circle:first');
            if ($(this).hasClass('pos')) {
                newCircle.css({
                    'top': e.clientY - posTop - (max / 2),
                    'left': e.clientX - posLeft - (max / 2)
                })
            }
            newCircle.width(max).height(max);
            console.log('posTop ', posTop, ' posLeft ', posLeft, ' clickY ', newCircle.css('top'), ' clickX ', newCircle.css('left'));
            setTimeout(function () {
                newCircle.remove();
            }, 500);
        });
    }

    //Header
    var header = $('header'),
        breakPos = header.height();
    var scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    MainBannerlParallax(scrollPos, breakPos);
    if ($('.side-ads.thirty-width').length) {
        var adMargin = 30;
        adBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top - ($('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin);
        var customTop = $('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin,
            stopPos = $('.side-ads.thirty-width').siblings('.seventy-width').outerHeight() - $('.side-ads.thirty-width .ads-wrp').outerHeight(),
            stopBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top + stopPos - customTop;
        $('.side-ads.thirty-width img').width($('.side-ads.thirty-width img').width());
        MoveAd(scrollPos, adBreakPos, stopPos, stopBreakPos, customTop);
    }
    SetActiveCategory();
    SetInnersCategory();
    $('.nav-search-btn').on('click', function () {
        PopulatePopup('search', 'Search');
    });

    $('.login-btn').on('click', function () {
        PopulatePopup('login', 'Login', true);
    });

    $('.register-btn').on('click', function () {
        PopulatePopup('register', 'Register', true);
    });

    $('#popup-close-btn').on('click', function () {
        $('#popup-base').removeClass('popup-active search-popup-active login-popup-active register-popup-active').find('.close-btn').removeClass('init');
        $('#popup-base').find('.popup-body-container').fadeOut(0);
        setTimeout(function () {
            $('#popup-base').removeClass('popup-with-bg');
        }, 1000);
    });

    $('input[type="text"],input[type="password"],input[type="email"],input[type="number"],textarea').on('focus', function () {
        var field = $(this);
        field.addClass("field-focus");
    }).on('blur', function () {
        var field = $(this);
        if (field.val() == null || field.val() == '' || field.val() == undefined) {
            field.removeClass("field-focus");
        }
    });

    if ($('.trend-item').length) {
        $('.trend-item').each(function () {
            var trendItem = $(this);
            if (trendItem.find('.trend-slide').length > 1) {
                var randomIntervalTime = Math.floor((Math.random() * 6000) + 4500);
                ResetTrendingSlides(trendItem);
                var interval = SetTrendingInterval(trendItem, randomIntervalTime);
                trendItem.data('trend-interval', interval);

                trendItem.on('mouseenter', function () {
                    var hoveredIndex = trendItem.index();
                    clearInterval(trendItem.data('trend-interval'));
                });

                trendItem.on('mouseleave', function () {
                    var interval = SetTrendingInterval(trendItem, randomIntervalTime);
                    trendItem.data('trend-interval', interval);
                });
            };
        });
    }

    // Start of Highlight
    if ($('#highlights').length) {
        var highlightsCount = $('.highlights-carousel-wrp').find('.hightlights-item').length,
            highlightsItemWidth = $('.highlights-carousel-wrp').find('.hightlights-item').width() + (parseFloat($('.highlights-carousel-wrp .hightlights-item').css('padding-right'), 10) * 2),
            highlightsNextBtn = $('.highlights-controls').find('.next-btn'),
            highlightsPrevBtn = $('.highlights-controls').find('.prev-btn'),
            highlightClicked = false,
            baseClick;
        $('.highlights-wrp').width(highlightsCount * highlightsItemWidth);
        highlightsNextBtn.on('click', function () {
            if (!$(this).hasClass('disabled'))
                ScrollHighlights(highlightsItemWidth, 'next');
        });

        highlightsPrevBtn.on('click', function () {
            if (!$(this).hasClass('disabled'))
                ScrollHighlights(highlightsItemWidth, 'prev');
        });

        $('.highlights-carousel-wrp').on('mousedown touchstart', function (e) {
            baseClick = e.clientX || e.originalEvent.touches[0].pageX;
            var actualScroll = $(this).scrollLeft();
            highlightClicked = true;
            $(this).on('mousemove touchmove', function (e) {
                if (highlightClicked) {
                    if (Math.abs((e.clientX || e.originalEvent.touches[0].pageX) - baseClick) > 30) {
                        $(this).find('a').addClass('scrolling');
                    }
                    DragHighlights(actualScroll, baseClick, (e.clientX || e.originalEvent.touches[0].pageX))
                    checkHighlightLimit();
                }
            });
        });
    }
    // End of Highlight

    //Start of Carousel
    if ($('#main-carousel').length) {
        var carouselItemCount = $('#main-carousel .carousel-item').length;
        var carouselDrag = false;
        var carouselBasePos = 0;
        var carouselPosDiff = 0;
        var carouselScrollLeft = 0;
        var activeItemIndex = 2;
        var carouselAnimation = false;
        if (carouselItemCount > 1) {
            carouselItemCount += 2;
            $('#main-carousel .carousel-body').css('width', carouselItemCount + '00vw');
            $('#main-carousel .carousel-item:last').clone().prependTo('#main-carousel .carousel-body');
            $('#main-carousel .carousel-item:nth-child(2)').clone().appendTo('#main-carousel .carousel-body');
            fullScroll = $('#main-carousel .carousel-item:first-child').width();
            $('#main-carousel .carousel-container').scrollLeft(fullScroll);
            for (var i = 0; i < carouselItemCount - 2; i++) {
                $('#main-carousel .carousel-indexes').append('<div>' + (i + 1) + '</div>');
            }
            $('#main-carousel .carousel-indexes div:first').addClass('selected');
            $('#main-carousel .carousel-container').on('mousedown touchstart', function (e) {
                if (e.which == 1 || e.which == 0) {
                    carouselDrag = true;
                    fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    carouselItemTarget = $(e.target).closest('.carousel-item');
                    activeItemIndex = carouselItemTarget.index() + 1;
                    var test = $('#main-carousel .carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                    carouselBasePos = e.pageX || e.originalEvent.touches[0].pageX;
                    carouselScrollLeft = $(this).scrollLeft();
                }
            });
            $('#main-carousel .carousel-container').on('mousemove touchmove', function (e) {
                if (carouselDrag) {
                    entered = false;
                    activeItemIndex = carouselItemTarget.index();
                    carouselPosDiff = carouselBasePos - (e.pageX || e.originalEvent.touches[0].pageX);
                    carouselItemTarget.find('.carousel-data').css('left', 30 + (carouselPosDiff * -1.2) + 'px');
                    if (carouselPosDiff > 0) {
                        if (activeItemIndex == (carouselItemCount - 1) && !entered) {
                            $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                            carouselScrollLeft = fullScroll;
                            carouselItemTarget = $('#main-carousel .carousel-item:nth-child(2)')
                            entered = true;
                        }
                        carouselItemTarget.next().find('.carousel-data').stop().css('left', fullScroll - (carouselPosDiff * .5) + 'px');
                    } else {
                        if (activeItemIndex == 0 && !entered) {
                            $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                            carouselItemTarget = $('#main-carousel .carousel-item:nth-last-child(2)')
                            carouselScrollLeft = (carouselItemCount - 2) * fullScroll;
                            entered = true;
                        }
                        carouselItemTarget.prev().find('.carousel-data').stop().css('left', -650 - (carouselPosDiff * .5) + 'px');
                    }
                    $(this).stop().scrollLeft(carouselScrollLeft + carouselPosDiff);
                }
            });
            var moveNext = function () {
                if (!carouselAnimation) {
                    carouselAnimation = true;
                    activeScrollItem = $('#main-carousel .carousel-item:nth-child(' + activeItemIndex + ')');
                    if (activeItemIndex == carouselItemCount) {
                        $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                        activeScrollItem = $('#main-carousel .carousel-item:nth-child(2)');
                        activeItemIndex = 2;
                    }
                    var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                    fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    activeScrollItem.find('.carousel-data').stop().animate({
                        left: '-650'
                    }, 800);
                    activeScrollItem.next().find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').stop().animate({
                        left: 30
                    }, 1000);
                    $('.carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll + fullScroll) / fullScroll)
                    }, 1000, function () {
                        $('.carousel-data').css('left', '30px');
                        carouselAnimation = false;
                    });
                    selectedIndexControl = activeItemIndex;
                    if (selectedIndexControl == carouselItemCount - 1) {
                        selectedIndexControl = 1;
                    }
                    $('#main-carousel .carousel-indexes div').removeClass('selected');
                    $('#main-carousel .carousel-indexes div:nth-child(' + selectedIndexControl + ')').addClass('selected');
                    activeItemIndex++;
                }
            }

            var movePrevious = function () {
                if (!carouselAnimation) {
                    carouselAnimation = true;
                    activeScrollItem = $('#main-carousel .carousel-item:nth-child(' + activeItemIndex + ')');
                    if (activeItemIndex <= 1) {
                        $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                        activeScrollItem = $('#main-carousel .carousel-item:nth-last-child(2)');
                        activeItemIndex = carouselItemCount - 1;
                    }
                    var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                    fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    activeScrollItem.find('.carousel-data').stop().animate({
                        left: fullScroll
                    }, 1000);
                    activeScrollItem.prev().find('.carousel-data').css('left', '-650px').delay(300).queue(function () {
                        $(this).stop().animate({
                            left: 30
                        }, 800);
                    })
                    $('#main-carousel .carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll - fullScroll) / fullScroll)
                    }, 1000, function () {
                        $('#main-carousel .carousel-data').css('left', '30px');
                        carouselAnimation = false;
                    });
                    selectedIndexControl = activeItemIndex - 2;
                    if (selectedIndexControl == 0) {
                        var indexControlMax = $('#main-carousel .carousel-indexes div').length;
                        selectedIndexControl = indexControlMax;
                    }
                    $('#main-carousel .carousel-indexes div').removeClass('selected');
                    $('#main-carousel .carousel-indexes div:nth-child(' + selectedIndexControl + ')').addClass('selected');
                    activeItemIndex--;
                }
            }

            $('#main-carousel .carousel-controls .next').on('click', moveNext);

            $('#main-carousel .carousel-controls .previous').on('click', movePrevious);

            $('#main-carousel .carousel-indexes div').on('click', function () {
                if (!carouselAnimation) {
                    carouselAnimation = true;
                    var indexValue = $(this).index() + 2;
                    if (indexValue == activeItemIndex)
                        return;
                    var fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    var targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
                    var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                    var newActiveScrollItem = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')');
                    activeScrollItem = $('#main-carousel .carousel-item:nth-child(' + activeItemIndex + ')');
                    $('#main-carousel .carousel-indexes div').removeClass('selected');
                    $(this).addClass('selected');
                    if (activeItemIndex == 1) {
                        $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                        actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                        targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
                    } else if (activeItemIndex == carouselItemCount) {
                        $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                        actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                        targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
                    }
                    if (indexValue > activeItemIndex) {
                        activeScrollItem.find('.carousel-data').stop().animate({
                            left: '-650'
                        }, 800);
                        newActiveScrollItem.find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').stop().animate({
                            left: 30
                        }, 1000);
                    } else {
                        activeScrollItem.find('.carousel-data').stop().animate({
                            left: fullScroll
                        }, 1000);
                        newActiveScrollItem.find('.carousel-data').css('left', '-650px').delay(300).queue(function () {
                            $(this).stop().animate({
                                left: 30
                            }, 800);
                        })
                    }
                    $('#main-carousel .carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll + targetItemPos) / fullScroll)
                    }, 1000, function () {
                        $('.carousel-data').css('left', '30px');
                        carouselAnimation = false;
                    });
                    activeItemIndex = indexValue;
                }
            });

            //Automatic Scroll
            var carouselAuto = setInterval(moveNext, 4000);
            $('#main-carousel').on('mouseenter touchstart', function () {
                clearInterval(carouselAuto);
            });
            $('#main-carousel').on('mouseleave touchend', function () {
                carouselAuto = setInterval(moveNext, 4000);
            });
        }
    }
    // End of Carousel

    //Start of Things to Do
    if ($('#wtd').length) {
        $('#wtd .wtd-container div[class^=wtd]').on('mouseenter', function () {
            $(this).addClass('selected');
            $(this).siblings().addClass('shadow');
            $(this).on('mouseleave', function () {
                $('.wtd-container div[class^=wtd]').removeClass('selected shadow');
            });
        });
    }
    //End of Things to Do

    //Start of Best Spots
    if ($('#best-spots').length) {
        var actualFrameIndex = 1;
        var bestFrameCount = $('#best-spots .best-frame-container').length;
        var bestAnimaion = false;
        $('#best-spots .best-frame-container:first').addClass('active');
        $('#best-spots .best-frame-container:first .best-image-frame:first').addClass('active');
        $('#best-spots .best-frame-container:first h2:first').addClass('active');
        $('#best-spots .best-frame-container:first h6:first').addClass('active');
        $('#best-spots .best-frame-container:first .best-description-frame:first').addClass('active');
        $('#best-spots .best-frame-container .best-image-frame').on('click', function () {
            var bestFrameIndex = $(this).closest('.best-frame-container').index();
            var bestIndex = $(this).index();
            $('#best-spots .best-frame-container .best-image-frame').removeClass('active shadow');
            $('#best-spots .best-frame-container .best-description-frame').removeClass('active')
            $('#best-spots .best-frame-container h2').removeClass('active');
            $('#best-spots .best-frame-container h6').removeClass('active');
            if (bestIndex == 1)
                $(this).siblings().not('.best-description-frame, h2').addClass('shadow');
            $(this).addClass('active');
            $('#best-spots .best-frame-container').eq(bestFrameIndex).find('.best-description-frame').eq(bestIndex).addClass('active');
            $('#best-spots .best-frame-container').eq(bestFrameIndex).find('h2').eq(bestIndex).addClass('active');
            $('#best-spots .best-frame-container').eq(bestFrameIndex).find('h6').eq(bestIndex).addClass('active');
        });
        $('.best-controls .best-previous').on('click', function () {
            if (!bestAnimaion) {
                var _this = $(this);
                _this.addClass('clicked');
                bestAnimaion = true;
                if (actualFrameIndex == 0)
                    actualFrameIndex = bestFrameCount;
                $('#best-spots .best-frame-container:nth-of-type(' + actualFrameIndex + ')').addClass('leaving').delay(700).queue(function () {
                    $('#best-spots .best-frame-container .best-image-frame').removeClass('active shadow');
                    $('#best-spots .best-frame-container .best-description-frame').removeClass('active')
                    $('#best-spots .best-frame-container h2').removeClass('active');
                    $('#best-spots .best-frame-container h6').removeClass('active');
                    $(this).removeClass('active leaving').dequeue();
                });
                if (actualFrameIndex == 1)
                    actualFrameIndex = bestFrameCount + 1;
                setTimeout(function () {
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ')').addClass('active enter').delay(700).queue(function () {
                        bestAnimaion = false;
                        _this.removeClass('clicked');
                        $(this).removeClass('enter').dequeue();
                    });
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ') .best-image-frame:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ') h2:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ') h6:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ') .best-description-frame:first').addClass('active');
                    actualFrameIndex--;
                }, 700);
            }
        });
        $('.best-controls .best-next').on('click', function () {
            if (!bestAnimaion) {
                var _this = $(this);
                _this.addClass('clicked');
                bestAnimaion = true;
                if (actualFrameIndex == (bestFrameCount + 1))
                    actualFrameIndex = 1;
                $('#best-spots .best-frame-container:nth-of-type(' + actualFrameIndex + ')').addClass('leaving').delay(700).queue(function () {
                    $('#best-spots .best-frame-container .best-description-frame').removeClass('active');
                    $('#best-spots .best-frame-container .best-image-frame').removeClass('active shadow');
                    $('#best-spots .best-frame-container h2').removeClass('active');
                    $('#best-spots .best-frame-container h6').removeClass('active');
                    $(this).removeClass('active leaving').dequeue();
                });
                if (actualFrameIndex == bestFrameCount)
                    actualFrameIndex = 0;
                setTimeout(function () {
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ')').addClass('active enter').delay(700).queue(function () {
                        bestAnimaion = false;
                        _this.removeClass('clicked');
                        $(this).removeClass('enter').dequeue();
                    });
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ') .best-image-frame:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ') h2:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ') h6:first').addClass('active');
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ') .best-description-frame:first').addClass('active');
                    actualFrameIndex++;
                }, 700);
            }
        });
    }
    // End of Best Spots

    //Start of Attractions
    if ($('#attractions').length) {
        var anchorPos = $('#attractions a:first').position().left;
        var titlePos = $('#attractions a:first').find('h3').position();
        var titleWidth = $('#attractions a:first').find('h3').width();
        var activeTitleIndex = 0;
        var attractionOut = true;
        $('.attractions-body').find('img').eq(activeTitleIndex).addClass('active');
        $('.attractions-index').css({
            'top': titlePos.top + 20,
            'left': titlePos.left + anchorPos - 10,
            'width': titleWidth + 10
        });
        $('.attractions-index div').css('border-right-width', titleWidth);
        $('#attractions a').on('mouseenter', function () {
            var titleIndex = $(this).index();
            if (activeTitleIndex != titleIndex) {
                var titlePos = $(this).find('h3').position();
                var anchorPos = $(this).position().left;
                var titleWidth = $(this).find('h3').width();
                $('.attractions-index').stop().animate({
                    top: titlePos.top + 20,
                    left: titlePos.left + anchorPos - 10,
                    width: titleWidth + 10
                });
                $('.attractions-index div').stop().animate({
                    borderRightWidth: titleWidth
                });
                $('.attractions-body').find('img').removeClass('active');
                $('.attractions-body').find('img').eq(titleIndex).addClass('active');
                activeTitleIndex = titleIndex;
            }
        });
    }
    //End of Attractions

    //Start of Advanced Search
    higherLowerValidation = false;
    if ($('.advanced-search-filters-wrp').length) {
        $('.dropdown-input').on('click', function () {
            var _this = $(this);
            _this.toggleClass('active');
            $(document).on('click', function (e) {
                if (!_this.is(e.target) && _this.has(e.target).length == 0) {
                    _this.removeClass('active');
                }
            });
        });
        $('.dropdown-options li').on('click', function () {
            var parentDropDown = $(this).closest('.dropdown-input');
            if (!parentDropDown.hasClass('multiple-choice')) {
                var dropDownChoice = $(this).text();
                parentDropDown.find('.selected-value').text(dropDownChoice);
            }
        });
        $('.dropdown-options li input').on('change', function () {
            var checkboxStatus = $(this).is(':checked');
            var filterLabel = $(this).next('label').find('.filter-label').text();
            var filterValue = $(this).closest('.multiple-choice').find('.selected-value');
            var baseText = 'Please choose';
            var spanModel = '<span class="entering">' + filterLabel + '</span>';
            if (checkboxStatus) {
                if (filterValue.text() == baseText) {
                    filterValue.text('');
                }
                filterValue.append(spanModel);
                setTimeout(function () {
                    filterValue.find('.entering').removeClass('entering');
                });
            } else {
                var falseCheckbox = filterValue.find('span:contains(' + filterLabel + ')');
                falseCheckbox.animate({
                    width: 0,
                    margin: 0
                }, 50);
                setTimeout(function () {
                    falseCheckbox.remove();
                    if (filterValue.children().length == 0) {
                        filterValue.text(baseText);
                    }
                }, 400);
            }
        });
        $('.filter-set-item .simulate-number').on('keypress', function (e) {
            if (e.which < 48 || e.which > 57) {
                e.preventDefault();
            }
        });
        $('.filter-set-item .simulate-number').on('keydown', function (e) {
            var val = $(this).val();
            var valUnit = $(this).data('unit').toUpperCase();
            var keys = [9, 13, 16, 17, 18, 19, 20, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 45, 91, 93, 106, 107, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 187, 189, 192, 144, 145, 220];
            if (val.indexOf(valUnit) == -1 && $.inArray(e.keyCode, keys) == -1) {
                $(this).val(val + ' ' + valUnit);
            }
            if (e.keyCode == 46 || e.keyCode == 8) {
                valLength = val.length;
                var selectionStart = $(this)[0].selectionStart;
                var selectionEnd = $(this)[0].selectionEnd;
                if (valLength < 6 || (selectionStart == 0 && selectionEnd == valLength - 4)) {
                    $(this).val('');
                }
            }
            setCursorLimit($(this), (valUnit.length + 1), e);
            if (higherLowerValidation) {
                var parentCollapsable = $(this).closest('.collapsable-filter-wrp');
            }
        });

        $('.filter-set-item .simulate-number').on('cut', function (e) {
            e.preventDefault();
        });

        $('.filter-set-item .simulate-number').on('blur', function () {
            var valUnit = $(this).data('unit').toUpperCase();
            var regNumUbit = new RegExp("[^0-9\\" + valUnit + "]", 'g');
            var val = $(this).val();
            val = val.replace(regNumUbit, '');
            var valUnitIndex = val.indexOf(valUnit);
            val = val.slice(0, valUnitIndex) + ' ' + valUnit;
            $(this).val(val);
        });

        $('.search-go-event').on('click', function () {
            var parentCollapsable = $(this).closest('.collapsable-filter-wrp');
            var parentSearchFilter = $(this).closest('.advanced-search-filters-wrp');
            var ratingChoices = parentCollapsable.find('p:contains("Rating")').siblings('.multiple-choice').find('.selected-value');
            var facilitiesChoices = parentCollapsable.find('p:contains("Facilities")').siblings('.multiple-choice').find('.selected-value');
            var lowestPrice = parentCollapsable.find('p:contains("Lowest price")').siblings('input').val().replace(/\D/g, '');
            if (lowestPrice == '')
                lowestPrice = 'The lowest possible';
            var highestPrice = parentCollapsable.find('p:contains("Highest price")').siblings('input').val().replace(/\D/g, '');
            if (highestPrice == '')
                highestPrice = 'The highest possible';
            if (!isNaN(lowestPrice) && !isNaN(highestPrice) && Number(lowestPrice) >= Number(highestPrice)) {
                parentCollapsable.find('p:contains("Lowest price")').siblings('.validation-msg').fadeIn().addClass('entering');
                parentCollapsable.find('p:contains("Highest price")').siblings('.validation-msg').fadeIn().addClass('entering');
                higherLowerValidation = true;
                return;
            }

            if (ratingChoices.children().length == 0) {
                parentSearchFilter.find('.rating-value').text('Any');
            } else {
                var ratingCount = ratingChoices.children().length;
                parentSearchFilter.find('.rating-value').empty();
                for (var i = 0; i < ratingCount; i++) {
                    var ratingResult = ratingChoices.find('span').eq(i).text();
                    parentSearchFilter.find('.rating-value').append('<span>' + ratingResult + '</span>');
                }
            }
            if (facilitiesChoices.children().length == 0) {
                parentSearchFilter.find('.facilities-value').text('Any');
            } else {
                var facilitiesCount = facilitiesChoices.children().length;
                parentSearchFilter.find('.facilities-value').empty();
                for (var i = 0; i < facilitiesCount; i++) {
                    var ratingResult = facilitiesChoices.find('span').eq(i).text();
                    parentSearchFilter.find('.facilities-value').append('<span>' + ratingResult + '</span>');
                }
            }
            var offers = parentCollapsable.find('p:contains("Offers")').siblings('.filter-radio-container').find('.inline-radio input:checked + label').text();
            parentSearchFilter.find('.lowest-price-value').text(lowestPrice);
            parentSearchFilter.find('.highest-price-value').text(highestPrice);
            higherLowerValidation = false;
        });

        $('.dynamic-settings-wrp').on('click', function () {
            var parentFilterWrapper = $(this).closest('.advanced-search-filters-wrp');
            var siblingCollapsable = $(this).siblings('.collapsable-filter-wrp');
            siblingCollapsable.toggleClass('open').slideToggle('fast');
            $(document).on('click', function (e) {
                if (!parentFilterWrapper.is(e.target) && parentFilterWrapper.has(e.target).length == 0) {
                    siblingCollapsable.removeClass('open').slideUp('fast');
                }
            });
        });
        $('.advanced-search-filters-wrp').on('click', function () {
            var childDynamicSettings = $(this).find('.dynamic-settings-wrp');
            var childColumnHeight = childDynamicSettings.find('.settings-column').height();
            var randomPercentage = randomLimit(12, 65) + '%';
            childDynamicSettings.find('.settings-column').eq(0).find('.column-index').css('top', randomPercentage);
            var randomPercentage = randomLimit(12, 65) + '%';
            childDynamicSettings.find('.settings-column').eq(1).find('.column-index').css('top', randomPercentage);
            var randomPercentage = randomLimit(12, 65) + '%';
            childDynamicSettings.find('.settings-column').eq(2).find('.column-index').css('top', randomPercentage);
        });
    }
    //End of Advanced Search

    //Item Details Gallery Functions
    InitDetailsGallerySlider();
    $('.side-slide-item:not(:last-child) a').on('click', function () {
        DisplayClickedDetailsGalleryItem($(this));
    })
    $('.gallery-next').on('click', function () {
        NextDetailsGalleryItem();
    });

    //Start of Comment Section
    if ($('.comment-section-container').length) {
        var heartsCount = 0;
        var owlRatings = [{
                src: 'bad-owl.svg',
                title: 'Bad'
            },
            {
                src: 'ihateit-owl.svg',
                title: 'I hate it'
            },
            {
                src: 'ok-owl.svg',
                title: 'OK'
            },
            {
                src: 'iloveit-owl.svg',
                title: 'I love it'
            },
            {
                src: 'wow-owl.svg',
                title: 'Wow'
            }
        ]
        $('.review-satisfaction-wrp i').on('mouseenter', function () {
            $(this).addClass('selected');
            $(this).prevAll().addClass('selected');
            $(this).nextAll().removeClass('selected');
        });
        $('.review-satisfaction-wrp i').on('click', function () {
            $(this).addClass('selected');
            $(this).prevAll().addClass('selected');
            $(this).nextAll().removeClass('selected');
            $(this).parent().data('rated', $(this).index());
        });
        $('.review-satisfaction-wrp').on('mouseleave', function () {
            $(this).find('i').removeClass('selected');
            heartsCount = $(this).data('rated') + 1;
            if (heartsCount != undefined) {
                for (var i = 0; i < heartsCount; i++) {
                    $(this).find('i').eq(i).addClass('selected');
                }
            }
        });

        $('.item-rating-details-container .rating-owl-wrp div[class^="rating"]').each(function () {
            var ratingValue = parseInt($(this).data('rating') / 20);
            ratingValue > (owlRatings.length - 1) ? ratingValue-- : '';
            $(this).find('img').attr({
                'src': '../Images/ratings-owls/' + owlRatings[ratingValue].src,
                'title': owlRatings[ratingValue].title
            })
            $(this).find('span').text(owlRatings[ratingValue].title);
        })

        $('.multilanguage').on('keyup paste', function () {
            var val = $(this).val();
            ifArabic($(this), val);
        })
        $('.comment-container .comment-text').each(function () {
            ifContinueReading($(this), 4);
            var arabic = ifArabic($(this), $(this).text());
            if (arabic)
                $(this).closest('.comment-container').addClass('arabic');
        });
        $('.comment-container .continue-reading.exceeds').on('click', function () {
            var parentContainer = $(this).parent(),
                paragraphContainer = parentContainer.find('.paragraph-container'),
                paragraphHeight = parentContainer.find('p').height();
            paragraphContainer.css('height', paragraphHeight);
            $(this).fadeOut('fast');
        })

        $('.comment-container .translate-comment').on('click', function () {
            $(this).siblings('.continue-reading').click();
            $(this).siblings('.translation-container').slideDown('fast');
            $(this).fadeOut('fast');
        });
    }
    //End of Comment Section

    $(document).on('mouseup touchend', function (e) {
        if (e.which == 1 || e.which == 0) {
            //Carousel Autocomplete
            if ($('#main-carousel').length) {
                if (carouselItemCount > 1 && carouselPosDiff != undefined && carouselDrag) {
                    carouselDrag = false;
                    carouselScrollLeft = $('#main-carousel .carousel-container').scrollLeft();
                    var fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    var scrollRemaining = fullScroll - (Math.abs(carouselPosDiff) % fullScroll);
                    if (Math.abs(carouselPosDiff) > 30) {
                        if (carouselPosDiff > 0) {
                            $('#main-carousel .carousel-container').stop().animate({
                                scrollLeft: fullScroll * Math.round((carouselScrollLeft + scrollRemaining) / fullScroll)
                            }, 600);
                            var controlsIndex = activeItemIndex;
                            if (controlsIndex == carouselItemCount - 2) {
                                controlsIndex = 0;
                            }
                            $('#main-carousel .carousel-indexes div').removeClass('selected');
                            $('#main-carousel .carousel-indexes div:nth-child(' + (controlsIndex + 1) + ')').addClass('selected');
                            activeItemIndex += 2;
                        } else {
                            $('#main-carousel .carousel-container').stop().animate({
                                scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                            }, 600);
                            carouselItemTarget.find('.carousel-data').stop().animate({
                                left: (fullScroll * 3) / 4
                            }, 600);
                            activeItemIndex = carouselItemTarget.index() + 1;
                            var controlsIndex = activeItemIndex - 1;
                            if (controlsIndex == 1) {
                                controlsIndex = carouselItemCount - 1;
                            }
                            $('#main-carousel .carousel-indexes div').removeClass('selected');
                            $('#main-carousel .carousel-indexes div:nth-child(' + (controlsIndex - 1) + ')').addClass('selected');
                            activeItemIndex--;
                        }

                    } else {
                        $('#main-carousel .carousel-container').stop().animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                        });
                    }
                    carouselPosDiff = undefined;
                    entered = false;
                    $('#main-carousel .carousel-data').stop().animate({
                        left: 30
                    }, 800);
                }
            }
            //End of Carousel Autocomplete

            //Start Highlight AutoComplete
            if ($('#highlights').length) {
                if (highlightClicked) {
                    highlightClicked = false;
                    var actualScroll = $('.highlights-carousel-wrp').scrollLeft();
                    var scrollRemaining = highlightsItemWidth - (Math.abs(HighlightDiff) % highlightsItemWidth);
                    if (Math.abs(HighlightDiff) > 30) {
                        if (HighlightDiff > 0) {
                            $('.highlights-carousel-wrp').stop().animate({
                                scrollLeft: highlightsItemWidth * Math.round((actualScroll - scrollRemaining) / highlightsItemWidth)
                            }, checkHighlightLimit);
                        } else {
                            $('.highlights-carousel-wrp').stop().animate({
                                scrollLeft: highlightsItemWidth * Math.round((actualScroll + scrollRemaining) / highlightsItemWidth)
                            }, checkHighlightLimit);
                        }
                    } else {
                        $('.highlights-carousel-wrp').stop().animate({
                            scrollLeft: highlightsItemWidth * Math.round((actualScroll - HighlightDiff) / highlightsItemWidth)
                        }, checkHighlightLimit);
                    }
                    $('.highlights-carousel-wrp a').removeClass('scrolling');
                }
            }
            //End of Highlight Autocomplete
        }
    });
    $(document).on('keyup', function (e) {
        if (e.keyCode == 27) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-close-btn').click();
            }
        } else if (e.keyCode == 13) {
            if ($('#popup-base .search-input input').hasClass('field-focus')) {}
        } else if (e.keyCode == 9) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-base .search-input input').focus();
            }
        }
    });

    $(window).resize(function () {
        //Carousel Scroll Adjustment
        if ($('#main-carousel').length) {
            var fullScroll = $('#main-carousel .carousel-item:first-child').width();
            var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
            var adjustedScrollValue = fullScroll * Math.round(actualScroll / fullScroll);
            $('#main-carousel .carousel-container').stop().animate({
                scrollLeft: adjustedScrollValue
            });
        }

        //Comment Container
        $('.comment-container .comment-text').each(function () {
            ifContinueReading($(this), 4);
        });
    });
});

$(document).scroll(function () {
    var header = $('header'),
        breakPos = header.height();
    var scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    MainBannerlParallax(scrollPos, breakPos);
    if ($('.side-ads.thirty-width').length) {
        var adMargin = 30;
        adBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top - ($('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin);
        var customTop = $('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin,
            stopPos = $('.side-ads.thirty-width').siblings('.seventy-width').outerHeight() - $('.side-ads.thirty-width .ads-wrp').outerHeight(),
            stopBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top + stopPos - customTop;
        $('.side-ads.thirty-width img').width($('.side-ads.thirty-width img').width());
        MoveAd(scrollPos, adBreakPos, stopPos, stopBreakPos, customTop);
    }
});