$(document).ready(function () {
    //Carousel
    var carouselItemCount = $('.carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
    if (carouselItemCount > 1) {
        carouselItemCount +=2;
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
                var test = $('.carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                carouselBasePos = e.pageX;
                carouselScrollLeft = $(this).scrollLeft();
            }
        });
        $('.carousel-container').on('mousemove', function (e) {
            if (carouselDrag) {
                entered = false;
                var activeItemIndex = carouselItemTarget.index();
                carouselPosDiff = carouselBasePos - e.pageX;
                carouselItemTarget.find('.carousel-data').css('left',30+(carouselPosDiff*-1.2)+'px');
                if(carouselPosDiff>0){
                    if(activeItemIndex == (carouselItemCount-1) && !entered){
                        $('.carousel-container').scrollLeft(fullScroll);
                        carouselScrollLeft = fullScroll;
                        carouselItemTarget = $('.carousel-item:nth-child(2)')
                        entered = true;
                    }
                    carouselItemTarget.next().find('.carousel-data').css('left',fullScroll-(carouselPosDiff*.5)+'px');
                }else{
                    if(activeItemIndex == 0 && !entered){
                        $('.carousel-container').scrollLeft((carouselItemCount-2)*fullScroll);
                        activeScrollItem = $('.carousel-item:nth-last-child(2)')
                        carouselScrollLeft = (carouselItemCount-2)*fullScroll;
                        entered = true;
                    }
                    carouselItemTarget.prev().find('.carousel-data').css('left',-650-(carouselPosDiff*.5)+'px');
                }
                $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
            }
        });
        var moveNext = function(){
            var carouselArray = $('.carousel-item');
            for(var i = 0; i<carouselArray.length;i++){
                if($(carouselArray[i]).position().left == 0){
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            }
            var activeItemIndex = (activeScrollItem).index();
            if(activeItemIndex == (carouselItemCount-1)){
                $('.carousel-container').scrollLeft(fullScroll);
                activeScrollItem = $('.carousel-item:nth-child(2)')
            }
            var actualScroll = $('.carousel-container').scrollLeft();
            fullScroll = $('.carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({left:'-650'},1200);
            activeScrollItem.next().find('.carousel-data').css('left',fullScroll+'px').delay(300).animate({left:30},1200);
            $('.carousel-container').stop().animate({scrollLeft:fullScroll * Math.round((actualScroll+fullScroll)/fullScroll)},1600,function(){
                $('.carousel-data').css('left','30px');
            });
        }

        var movePrevious = function(){
            var carouselArray = $('.carousel-item');
            for(var i = 0; i<carouselArray.length;i++){
                if($(carouselArray[i]).position().left == 0){
                    var activeScrollItem = $(carouselArray[i]);
                    break;
                }
            }
            var activeItemIndex = (activeScrollItem).index();
            if(activeItemIndex == 0){
                $('.carousel-container').scrollLeft((carouselItemCount-2)*fullScroll);
                activeScrollItem = $('.carousel-item:nth-last-child(2)')
            }
            var actualScroll = $('.carousel-container').scrollLeft();
            fullScroll = $('.carousel-item:first-child').width();
            activeScrollItem.find('.carousel-data').animate({left:fullScroll},1000);
            activeScrollItem.prev().find('.carousel-data').css('left','-650px').delay(500).animate({left:30},1200);
            $('.carousel-container').stop().animate({scrollLeft:fullScroll * Math.round((actualScroll-fullScroll)/fullScroll)},1600,function(){
                $('.carousel-data').css('left','30px');
            });
        }

        $('#next').on('click',moveNext);

        $('#previous').on('click',movePrevious);

        //Automatic Scroll
        var carouselAuto = setInterval(moveNext,4000);
        $('.carousel-container').on('mouseenter',function(){
            clearInterval(carouselAuto);
        });
        $('.carousel-container').on('mouseleave',function(){
            carouselAuto = setInterval(moveNext,4000);
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

                    } else {
                        $('.carousel-container').animate({
                            scrollLeft: fullScroll * Math.round((carouselScrollLeft - scrollRemaining) / fullScroll)
                        }, 800);
                        carouselItemTarget.find('.carousel-data').animate({left:fullScroll},800);
                    }

                } else {
                    $('.carousel-container').animate({
                        scrollLeft: fullScroll * Math.round((carouselScrollLeft - carouselPosDiff) / fullScroll)
                    });
                }
                carouselPosDiff = undefined;
                entered = false;
                $('.carousel-data').animate({left:30},800);
            }
            //End of Carousel Autocomplete
        }
    });
});