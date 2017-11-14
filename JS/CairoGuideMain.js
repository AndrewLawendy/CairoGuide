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
    var highlightsWrpPos = parseFloat($('.highlights-wrp').css('margin-left'), 10);
    if (direction == 'next') {
        var calculatedMargin = highlightsItemWidth * Math.round((highlightsWrpPos - highlightsItemWidth) / highlightsItemWidth);
    } else {
        var calculatedMargin = highlightsItemWidth * Math.round((highlightsWrpPos + highlightsItemWidth) / highlightsItemWidth);
    }
    $('.highlights-wrp').css('margin-left', calculatedMargin);
}

//Drag highlights with Mouse
var DragHighlights = function (highlightsItemWidth, clickX, pageX) {
    var highlightsWrpPos = parseFloat($('.highlights-wrp').css('margin-left'), 10);
    var calculatedMargin = highlightsItemWidth * Math.round((clickX - pageX) / highlightsItemWidth);
    $('.highlights-wrp').css('margin-left', calculatedMargin);
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
}

//Move items listing page advert during scroll
var MoveAd = function (scrollPos, breakPos) {
    var adContainer = $('.items-list-ads-wrp');
    if (scrollPos >= breakPos) {
        adContainer.addClass('fixed');
    } else {
        adContainer.removeClass('fixed');
    }
}

//document ready
$(document).ready(function () {
    //Header
    var header = $('header'),
        breakPos = header.height();
    var scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    MainBannerlParallax(scrollPos, breakPos);
    adBreakPos = $('.advanced-search-filters-wrp').offset().top - ($('.advanced-search-filters-wrp').css('margin-bottom') + $('.bottom-header').height() + $('.attached-menu').height());
    MoveAd(scrollPos, adBreakPos);

    SetInnersCategory();
    $('.nav-search-btn').on('click', function () {
        $('#popup-base').addClass('popup-active search-popup-active').find('.close-btn').addClass('init');
    });

    $('#popup-close-btn').on('click', function () {
        $('#popup-base').removeClass('popup-active search-popup-active').find('.close-btn').removeClass('init');
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

    //Highlights
    if ($('#highlights').length) {
        var highlightsCount = $('.highlights-carousel-wrp').find('.hightlights-item').length,
            shownFrameHighlightIndex = 5,
            lastShownHighlightIndex = 5,
            highlightsItemWidth = $('.highlights-carousel-wrp').find('.hightlights-item').width() + (parseFloat($('.highlights-carousel-wrp').find('.hightlights-item').css('margin-right'), 10) * 2),
            highlightsWrp = $('.highlights-wrp'),
            highlightsNextBtn = $('.highlights-controls').find('.next-btn'),
            highlightsPrevBtn = $('.highlights-controls').find('.prev-btn'),
            clicked = false,
            clickX;

        highlightsNextBtn.on('click', function () {
            if (shownFrameHighlightIndex < highlightsCount) {
                ScrollHighlights(highlightsItemWidth, 'next');
                shownFrameHighlightIndex++;
            }
        });

        highlightsPrevBtn.on('click', function () {
            if (shownFrameHighlightIndex > lastShownHighlightIndex) {
                ScrollHighlights(highlightsItemWidth, 'prev');
                shownFrameHighlightIndex--;
            }
        });

        $(document).on({
            'mousemove': function (e) {
                //console.log('clicked = ' + clicked + ', clickX = ' + clickX + ', e.pageX = ' + e.pageX);
                if (clicked) {
                    //DragHighlights(highlightsItemWidth, clickX, e.pageX);
                }
            },
            'mousedown': function (e) {
                clicked = true;
                clickX = e.pageX;
            },
            'mouseup': function () {
                clicked = false;
            }
        });
    }

    //Carousel
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
            $('#main-carousel .carousel-container').on('mousedown', function (e) {
                if (e.which == 1) {
                    carouselDrag = true;
                    fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    carouselItemTarget = $(e.target).closest('.carousel-item');
                    activeItemIndex = carouselItemTarget.index() + 1;
                    var test = $('#main-carousel .carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                    carouselBasePos = e.pageX;
                    carouselScrollLeft = $(this).scrollLeft();
                }
            });
            $('#main-carousel .carousel-container').on('mousemove', function (e) {
                if (carouselDrag) {
                    entered = false;
                    activeItemIndex = carouselItemTarget.index();
                    carouselPosDiff = carouselBasePos - e.pageX;
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
            $('#main-carousel').on('mouseenter', function () {
                clearInterval(carouselAuto);
            });
            $('#main-carousel').on('mouseleave', function () {
                carouselAuto = setInterval(moveNext, 4000);
            });
        }
    }
    // End of Carousel

    //Start of What to Do
    if ($('#wtd').length) {
        $('#wtd .wtd-container div[class^=wtd]').on('mouseenter', function () {
            $(this).addClass('selected');
            $(this).siblings().addClass('shadow');
            $(this).on('mouseleave', function () {
                $('.wtd-container div[class^=wtd]').removeClass('selected shadow');
            });
        });
    }
    //End of What to Do

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
                console.log('dropdown updated');
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
                    width: 0
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
            if(higherLowerValidation){
                var parentCollapsable = $(this).closest('.collapsable-filter-wrp');
                console.log('validate');
            }
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

    $(document).on('mouseup', function (e) {
        if (e.which == 1) {
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
        }
    });
    $(document).on('keyup', function (e) {
        if (e.keyCode == 27) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-close-btn').click();
            }
        } else if (e.keyCode == 13) {
            if ($('#popup-base .search-input input').hasClass('field-focus')) {
                console.log('Search Btn Clicked');
            }
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
    });
});

$(document).scroll(function () {
    var header = $('header'),
        breakPos = header.height();
    var scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    MainBannerlParallax(scrollPos, breakPos);
    adBreakPos = $('.items-list-ads-container').offset().top - (parseFloat($('.advanced-search-filters-wrp').css('margin-bottom')) + $('.bottom-header').height() + $('.attached-menu').height());
    console.log(scrollPos+','+adBreakPos);
    MoveAd(scrollPos, adBreakPos);
});