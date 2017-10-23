var TrendingSliderIntervals = [];

var ResetTrendingSlides = function (trendItem) {
    trendItem.find('.trend-slide').each(function () {
        var trendSlide = $(this);
        trendSlide.css('left', (trendSlide.index() * trendItem.innerWidth()));
    });
    trendItem.find('.trend-slide').eq(0).addClass('active');
}

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

$(document).ready(function () {
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

    //Carousel
    var carouselItemCount = $('#main-carousel .carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
    var activeItemIndex = 2;
    if (carouselItemCount > 1) {
        carouselItemCount += 2;
        $('#main-carousel .carousel-body').css('width', carouselItemCount + '00vw');
        $('#main-carousel .carousel-item:last').clone().prependTo('#main-carousel .carousel-body');
        $('#main-carousel .carousel-item:nth-child(2)').clone().appendTo('#main-carousel .carousel-body');
        fullScroll = $('#main-carousel .carousel-item:first-child').width();
        $('#main-carousel .carousel-container').scrollLeft(fullScroll);
        for (var i = 0; i < carouselItemCount - 2; i++) {
            $('#main-carousel .carousel-indexes').append('<div></div>');
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
            activeScrollItem = $('#main-carousel .carousel-item:nth-child(' + activeItemIndex + ')');
            if (activeItemIndex == carouselItemCount) {
                $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                activeScrollItem = $('#main-carousel .carousel-item:nth-child(2)');
                activeItemIndex = 2;
            }
            var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
            fullScroll = $('#main-carousel .carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({
                left: '-650'
            }, 800);
            activeScrollItem.next().find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').animate({
                left: 30
            }, 1000);
            $('.carousel-container').stop().animate({
                scrollLeft: fullScroll * Math.round((actualScroll + fullScroll) / fullScroll)
            }, 1000, function () {
                $('.carousel-data').css('left', '30px');
            });
            selectedIndexControl = activeItemIndex;
            if (selectedIndexControl == carouselItemCount - 1) {
                selectedIndexControl = 1;
            }
            $('#main-carousel .carousel-indexes div').removeClass('selected');
            $('#main-carousel .carousel-indexes div:nth-child(' + selectedIndexControl + ')').addClass('selected');
            activeItemIndex++;
        }

        var movePrevious = function () {
            activeScrollItem = $('#main-carousel .carousel-item:nth-child(' + activeItemIndex + ')');
            if (activeItemIndex <= 1) {
                $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                activeScrollItem = $('#main-carousel .carousel-item:nth-last-child(2)');
                activeItemIndex = carouselItemCount - 1;
            }
            var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
            fullScroll = $('#main-carousel .carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({
                left: fullScroll
            }, 1000);
            activeScrollItem.prev().find('.carousel-data').css('left', '-650px').delay(300).animate({
                left: 30
            }, 800);
            $('#main-carousel .carousel-container').stop().animate({
                scrollLeft: fullScroll * Math.round((actualScroll - fullScroll) / fullScroll)
            }, 1000, function () {
                $('#main-carousel .carousel-data').css('left', '30px');
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

        $('#next').on('click', moveNext);

        $('#previous').on('click', movePrevious);

        $('#main-carousel .carousel-indexes div').on('click', function () {
            var indexValue = $(this).index() + 2;
            var fullScroll = $('#main-carousel .carousel-item:first-child').width();
            var targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
            var actualScroll = $('#main-carousel .carousel-container').scrollLeft();
            $('#main-carousel .carousel-indexes div').removeClass('selected');
            $(this).addClass('selected');
            if (indexValue == carouselItemCount - 1 && activeItemIndex == 1) {
                $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                return;
            } else if (indexValue == 2 && activeItemIndex == carouselItemCount) {
                $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                return;
            } else {
                if (activeItemIndex == 1) {
                    $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                    actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                    targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
                } else if (activeItemIndex == carouselItemCount) {
                    $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                    actualScroll = $('#main-carousel .carousel-container').scrollLeft();
                    targetItemPos = $('#main-carousel .carousel-item:nth-child(' + indexValue + ')').position().left;
                }
            }
            $('#main-carousel .carousel-container').stop().animate({
                scrollLeft: fullScroll * Math.round((actualScroll + targetItemPos) / fullScroll)
            }, 1000, function () {
                $('.carousel-data').css('left', '30px');
            });
            activeItemIndex = indexValue;
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
    // End of Carousel



    //Start of What to Do
    $('#wtd div[class^=wtd]').on('mouseenter', function (e) {
        $(this).addClass('selected');
        $(this).siblings().addClass('shadow');
        $(this).on('mouseleave', function () {
            $('.wtd-container div[class^=wtd]').removeClass('selected shadow');
        });
    });
    //End of What to Do

    //Start of Best Spots
    $('#best-spots .best-spots-image-container .image-container').on('click', function () {
        var bestContentFrame = $('.section-frame-content').index();
        //var bestImagesFrame = $('.section-frame-images').index();
        var bestIndex = $(this).index();
        $('.best-spots-image-container .image-container').removeClass('active shadow');
        $('.best-spots-details .text-area').removeClass('active')
        $('.title-bg .section-frame-title h2').removeClass('active');
        if (bestIndex == 1)
            $(this).siblings().addClass('shadow');
        $(this).addClass('active');
        $('.best-spots-details .section-frame-content').eq(bestContentFrame).find('.text-area').eq(bestIndex).addClass('active');
        $('.title-bg .section-frame-title').eq(bestContentFrame).find('h2').eq(bestIndex).addClass('active');
    });

    //Start of Attractions
    var anchorPos = $('#attractions a:first').position().left;
    var titlePos = $('#attractions a:first').find('p').position();
    var titleWidth = $('#attractions a:first').find('p').width();
    var activeTitleIndex = 0;
    var attractionOut = true;
    $('.attractions-body').find('img').eq(activeTitleIndex).addClass('active');
    $('.attractions-index').css({
        'top': titlePos.top + 10,
        'left': titlePos.left + anchorPos - 10
    });
    $('#attractions a').on('mouseenter', function () {
        var titleIndex = $(this).index();
        if (activeTitleIndex != titleIndex) {
            var titlePos = $(this).find('p').position();
            var anchorPos = $(this).position().left;
            var titleWidth = $(this).find('p').width();
            $('.attractions-index').stop().animate({
                top: titlePos.top + 10,
                left: titlePos.left + anchorPos - 10
            });
            $('.attractions-body').find('img').removeClass('active');
            $('.attractions-body').find('img').eq(titleIndex).addClass('active');
            activeTitleIndex = titleIndex;
        }
    });
    //End of Attractions

    $(document).on('mouseup', function (e) {
        if (e.which == 1) {
            //Carousel Autocomplete
            if (carouselItemCount > 1 && carouselPosDiff != undefined && carouselDrag) {
                carouselDrag = false;
                carouselScrollLeft = $('#main-carousel .carousel-container').scrollLeft();
                var fullScroll = $('#main-carousel .carousel-item:first-child').width();
                var scrollRemaining = fullScroll - (Math.abs(carouselPosDiff) % fullScroll);
                if (Math.abs(carouselPosDiff) > 50) {
                    if (carouselPosDiff > 0) {
                        $('#main-carousel .carousel-container').animate({
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
                        $('#main-carousel .carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                        }, 600);
                        carouselItemTarget.find('.carousel-data').animate({
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
                    $('#main-carousel .carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                    });
                }
                carouselPosDiff = undefined;
                entered = false;
                $('#main-carousel .carousel-data').animate({
                    left: 30
                }, 800);
            }
            //End of Carousel Autocomplete
        }
    });
    $(window).resize(function () {
        //Carousel Scroll Adjustment
        var fullScroll = $('.carousel-item:first-child').width();
        var actualScroll = $('.carousel-container').scrollLeft();
        var adjustedScrollValue = fullScroll * Math.round(actualScroll / fullScroll);
        $('.carousel-container').stop().animate({
            scrollLeft: adjustedScrollValue
        });
    });
});