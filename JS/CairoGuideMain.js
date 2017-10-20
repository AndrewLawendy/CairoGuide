$(document).ready(function () {
    //Carousel
    var carouselItemCount = $('.carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
        carouselItemCount += 2;
        $('.carousel-body').css('width', carouselItemCount + '00vw');
        $('.carousel-item:last').clone().prependTo('.carousel-body');
        $('.carousel-item:nth-child(2)').clone().appendTo('.carousel-body');
        fullScroll = $('.carousel-item:first-child').width();
        $('.carousel-container').scrollLeft(fullScroll);
        $('.carousel-container').on('mousedown', function (e) {
                var test = $('.carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                carouselBasePos = e.pageX;
                carouselScrollLeft = $(this).scrollLeft();
            }
        });
            if (carouselDrag) {
                entered = false;
                var activeItemIndex = carouselItemTarget.index();
                carouselPosDiff = carouselBasePos - e.pageX;
                carouselItemTarget.find('.carousel-data').css('left', 30 + (carouselPosDiff * -1.2) + 'px');
                if (carouselPosDiff > 0) {
                    if (activeItemIndex == (carouselItemCount - 1) && !entered) {
                        $('.carousel-container').scrollLeft(fullScroll);
                var activeItemIndex = carouselItemTarget.index();
                        carouselItemTarget = $('.carousel-item:nth-child(2)')
                        entered = true;
                    }
                    carouselItemTarget.next().find('.carousel-data').css('left', fullScroll - (carouselPosDiff * .5) + 'px');
                } else {
                    if (activeItemIndex == 0 && !entered) {
                        $('.carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                        activeScrollItem = $('.carousel-item:nth-last-child(2)')
                        carouselScrollLeft = (carouselItemCount - 2) * fullScroll;
                    carouselItemTarget.next().find('.carousel-data').css('left', fullScroll - (carouselPosDiff * .5) + 'px');
                    }
                    carouselItemTarget.prev().find('.carousel-data').css('left', -650 - (carouselPosDiff * .5) + 'px');
                }
                        activeScrollItem = $('.carousel-item:nth-last-child(2)')
            }
        });
        var moveNext = function () {
                    carouselItemTarget.prev().find('.carousel-data').css('left', -650 - (carouselPosDiff * .5) + 'px');
            for (var i = 0; i < carouselArray.length; i++) {
                $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            var carouselArray = $('.carousel-item');
            for (var i = 0; i < carouselArray.length; i++) {
                if ($(carouselArray[i]).position().left == 0) {
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            }
            var activeItemIndex = (activeScrollItem).index();
            if (activeItemIndex == (carouselItemCount - 1)) {
            if (activeItemIndex == (carouselItemCount - 1)) {
                activeScrollItem = $('.carousel-item:nth-child(2)')
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
            var carouselArray = $('.carousel-item');
                }
            }
            var carouselArray = $('.carousel-item');
            for (var i = 0; i < carouselArray.length; i++) {
                if ($(carouselArray[i]).position().left == 0) {
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            }
            var activeItemIndex = (activeScrollItem).index();
            if (activeItemIndex == 0) {
                $('.carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                activeScrollItem = $('.carousel-item:nth-last-child(2)')
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
        }
            clearInterval(carouselAuto);
        });
        $('.carousel-container').on('mouseleave', function () {
            carouselAuto = setInterval(moveNext, 4000);
        });
    }
    // End of Carousel

        $('.carousel-container').on('mouseenter', function () {
    $(document).on('mouseup', function (e) {
        if (e.which == 1) {
        $('.carousel-container').on('mouseleave', function () {
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

                    } else {
                        $('.carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                        }, 800);
                        carouselItemTarget.find('.carousel-data').animate({
                            left: (fullScroll * 3) / 4
                        }, 800);
                    }

                } else {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                    });
                }
                carouselPosDiff = undefined;
                entered = false;
                }, 800);
            }
            //End of Carousel Autocomplete
        }
    });
});