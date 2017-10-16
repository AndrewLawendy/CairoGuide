$(document).ready(function () {
    //Carousel
    var carouselItemCount = $('.carousel-item').length;
    var carouselDrag = false;
    var carouselBasePos = 0;
    var carouselPosDiff = 0;
    var carouselScrollLeft = 0;
    $('.carousel-body').css('width', carouselItemCount + 'vw');
    $('.carousel-container').on('mousedown', function (e) {
        carouselDrag = true;
        var _this = $(this);
        carouselBasePos = e.pageX;
        carouselScrollLeft = $(this).scrollLeft();
    });
    $('.carousel-container').on('mousemove', function (e) {
        if(carouselDrag){
            carouselPosDiff = carouselBasePos - e.pageX;
            $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
        }
    });

    $(document).on('mouseup', function () {
        carouselDrag = false;
    });
});