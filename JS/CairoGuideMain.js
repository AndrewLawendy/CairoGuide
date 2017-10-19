$(document).ready(function () {
    //Carousel
    var carouselItemCount = $('.carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
    var activeItemIndex = 2;
    if (carouselItemCount > 1) {
        carouselItemCount += 2;
        $('.carousel-body').css('width', carouselItemCount + '00vw');
        $('.carousel-item:last').clone().prependTo('.carousel-body');
        $('.carousel-item:nth-child(2)').clone().appendTo('.carousel-body');
        fullScroll = $('.carousel-item:first-child').width();
        $('.carousel-container').scrollLeft(fullScroll);
        $('.carousel-container').on('mousedown', function (e) {
            if (e.which == 1) {
                carouselDrag = true;
                fullScroll = $('.carousel-item:first-child').width();
                carouselItemTarget = $(e.target).closest('.carousel-item');
                activeItemIndex = carouselItemTarget.index() + 1;
                var test = $('.carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                carouselBasePos = e.pageX;
                carouselScrollLeft = $(this).scrollLeft();
            }
        });
        $('.carousel-container').on('mousemove', function (e) {
            if (carouselDrag) {
                entered = false;
                activeItemIndex = carouselItemTarget.index();
                carouselPosDiff = carouselBasePos - e.pageX;
                carouselItemTarget.find('.carousel-data').css('left', 30 + (carouselPosDiff * -1.2) + 'px');
                if (carouselPosDiff > 0) {
                    if (activeItemIndex == (carouselItemCount - 1) && !entered) {
                        $('.carousel-container').scrollLeft(fullScroll);
                        carouselScrollLeft = fullScroll;
                        carouselItemTarget = $('.carousel-item:nth-child(2)')
                        entered = true;
                    }
                    carouselItemTarget.next().find('.carousel-data').stop().css('left', fullScroll - (carouselPosDiff * .5) + 'px');
                } else {
                    if (activeItemIndex == 0 && !entered) {
                        $('.carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                        carouselItemTarget = $('.carousel-item:nth-last-child(2)')
                        carouselScrollLeft = (carouselItemCount - 2) * fullScroll;
                        entered = true;
                    }
                    carouselItemTarget.prev().find('.carousel-data').stop().css('left', -650 - (carouselPosDiff * .5) + 'px');
                }
                $(this).stop().scrollLeft(carouselScrollLeft + carouselPosDiff);
            }
        });
        var moveNext = function () {
            activeScrollItem = $('.carousel-item:nth-child(' + activeItemIndex + ')');
            if (activeItemIndex == carouselItemCount) {
                $('.carousel-container').scrollLeft(fullScroll);
                activeScrollItem = $('.carousel-item:nth-child(2)');
                activeItemIndex = 2;
            }
            var actualScroll = $('.carousel-container').scrollLeft();
            fullScroll = $('.carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({
                left: '-650'
            }, 1200);
            activeScrollItem.next().find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').animate({
                left: 30
            }, 1600);
            $('.carousel-container').stop().animate({
                scrollLeft: fullScroll * Math.round((actualScroll + fullScroll) / fullScroll)
            }, 1600, function () {
                $('.carousel-data').css('left', '30px');
            });
            activeItemIndex++;
        }

        var movePrevious = function () {
            activeScrollItem = $('.carousel-item:nth-child(' + activeItemIndex + ')');
            if (activeItemIndex <= 1) {
                $('.carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                activeScrollItem = $('.carousel-item:nth-last-child(2)');
                activeItemIndex = carouselItemCount - 1;
            }
            var actualScroll = $('.carousel-container').scrollLeft();
            fullScroll = $('.carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({
                left: fullScroll
            }, 1000);
            activeScrollItem.prev().find('.carousel-data').css('left', '-650px').delay(500).animate({
                left: 30
            }, 1200);
            $('.carousel-container').stop().animate({
                scrollLeft: fullScroll * Math.round((actualScroll - fullScroll) / fullScroll)
            }, 1600, function () {
                $('.carousel-data').css('left', '30px');
            });
            activeItemIndex--;
        }

        $('#next').on('click', moveNext);

        $('#previous').on('click', movePrevious);

        //Automatic Scroll
        var carouselAuto = setInterval(moveNext, 4000);
        $('.carousel-container').on('mouseenter', function () {
            clearInterval(carouselAuto);
        });
        $('.carousel-container').on('mouseleave', function () {
            carouselAuto = setInterval(moveNext, 4000);
        });
    }
    // End of Carousel


    $(document).on('mouseup', function (e) {
        if (e.which == 1) {
            //Carousel Autocomplete
            if (carouselItemCount > 1 && carouselPosDiff != undefined && carouselDrag) {
                carouselDrag = false;
                carouselScrollLeft = $('.carousel-container').scrollLeft();
                var fullScroll = $('.carousel-item:first-child').width();
                var scrollRemaining = fullScroll - (Math.abs(carouselPosDiff) % fullScroll);
                if (Math.abs(carouselPosDiff) > 50) {
                    if (carouselPosDiff > 0) {
                        $('.carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft + scrollRemaining) / fullScroll)
                        }, 800);
                        activeItemIndex += 2;
                    } else {
                        $('.carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                        }, 800);
                        carouselItemTarget.find('.carousel-data').animate({
                            left: (fullScroll * 3) / 4
                        }, 800);
                        activeItemIndex = carouselItemTarget.index() + 1;
                        activeItemIndex--;
                    }

                } else {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                    });
                }
                carouselPosDiff = undefined;
                entered = false;
                $('.carousel-data').animate({
                    left: 30
                }, 800);
            }
            //End of Carousel Autocomplete
        }
    });
    $(window).resize(function () {
        //Scroll Adjustment
        var fullScroll = $('.carousel-item:first-child').width();
        var actualScroll = $('.carousel-container').scrollLeft();
        var adjustedScrollValue = fullScroll * Math.round(actualScroll / fullScroll);
        $('.carousel-container').stop().animate({scrollLeft:adjustedScrollValue});
    });
});