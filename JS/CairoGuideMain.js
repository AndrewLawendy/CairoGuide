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
            if (e.which == 1) {
                carouselDrag = true;
                carouselItemTarget = $(e.target).closest('.carousel-item');
                var test = $('.carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                carouselBasePos = e.pageX;
                carouselScrollLeft = $(this).scrollLeft();
            }
        });
        $('.carousel-container').on('mousemove', function (e) {
            if (carouselDrag) {
                carouselPosDiff = carouselBasePos - e.pageX;
                $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
                carouselItemTarget.find('.carousel-data').css({transform:'translateX('+(carouselPosDiff*-1.2)+'px)'})
                if(carouselPosDiff>0){
                    carouselItemTarget.next().find('.carousel-data').addClass('titleEnter-left');
                    $('.titleEnter-left').css({transform:'translateX('+(1000-(carouselPosDiff*.5))+'px)'})
                }
            }
        });
        var moveNext = function(){
            var actualScroll = $('.carousel-container').scrollLeft();
            var fullScroll = $('.carousel-item:first-child').width();
            var carouselArray = $('.carousel-item');
            for(var i = 0; i<carouselArray.length;i++){
                if($(carouselArray[i]).position().left == 0){
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            }
            activeScrollItem.find('.carousel-data').animate({transform:'translateX(-650px)'},1200)
            activeScrollItem.next().find('.carousel-data').css('transform','translateX(1000px)').delay(300).queue(function(){
                $(this).animate({transform:'translateX(0)'}).dequeue();
            });;
            $('.carousel-container').stop().animate({scrollLeft:fullScroll * Math.round((actualScroll+fullScroll)/fullScroll)},1600);
            //$('.section-title').css({transform:'translateX(0px)'});
        }

        $('#next').on('click',moveNext);

        $('#previous').on('click',function(){
            var actualScroll = $('.carousel-container').scrollLeft();
            var fullScroll = $('.carousel-item:first-child').width();
            $('.carousel-container').stop().animate({scrollLeft:fullScroll * Math.round((actualScroll-fullScroll)/fullScroll)},1600);
        });
    }

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
                    } else {
                        $('.carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                        }, 800);
                        $('.section-title').css({transform:'translateX(0px)'})
                    }

                } else {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                    });
                }
                carouselPosDiff = undefined
            }
        }
    });
});