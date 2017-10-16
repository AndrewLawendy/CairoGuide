$(document).ready(function () {
    //Carousel
    var carouselItemCount = $('.carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
    if (carouselItemCount > 1) {
        $('.carousel-body').css('width', carouselItemCount + '00vw');
        $('.carousel-container').on('mousedown', function (e) {
            carouselDrag = true;
            var carouselItemTarget = $(e.target).closest('.carousel-item');
            var _this = $(this);
            carouselBasePos = e.pageX;
            carouselScrollLeft = $(this).scrollLeft();
        });
        $('.carousel-container').on('mousemove', function (e) {
            if (carouselDrag) {
                carouselPosDiff = carouselBasePos - e.pageX;
                $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
                //carouselItemTarget.find('.carousel-data').css({transform:'translateX('+(carouselPosDiff*-1.5)+'px)'})
            }
        });
    }

    $(document).on('mouseup', function () {
        //Carousel Autocomplete
        if (carouselItemCount > 1 && carouselPosDiff != undefined) {
            carouselDrag = false;
            carouselScrollLeft = $('.carousel-container').scrollLeft();
            var fullScroll = $('.carousel-item:first-child').width();
            var scrollRemaining = fullScroll - (carouselPosDiff % fullScroll);
            if (Math.abs(carouselPosDiff) > 50) {
                if (carouselPosDiff > 0) {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft + scrollRemaining) / fullScroll)
                    }, 800);
                } else {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                    }, 800);
                }

            } else {
                $('.carousel-container').animate({
                    scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                });
            }
            carouselPosDiff = undefined
        }
    });
});