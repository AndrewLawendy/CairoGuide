var newScreenSize = 0; //Last screen size, changes when screen size changes, takes values 1,2 or 3
var TrendingSliderIntervals = []; //array to hold intervals for each trending carousel

//Calculate last screen size
var CalcLastScreenSize = function (screenSize) {
    if ($(document).width() > 768) {
        screenSize = 1;
    } else if ($(document).width() <= 768 && $(document).width() > 640) {
        screenSize = 2;
    } else {
        screenSize = 3;
    }
    return screenSize;
}

//Apply loader interval time
var SetLoaderTimeOut = function (catIndex, intervalTiming, categories, loaderTextContainer, decreasedTime, loaderLoopCount, loaderLoop, loopCount) {
    if (loaderLoopCount == true) {
        loaderLoop = setTimeout(function () {
            loopCount--;
            loaderTextContainer.find('.loader-text-white-bg[data-category="' + categories[catIndex] + '"]').addClass('active').css('animation-duration', intervalTiming + 'ms').delay(intervalTiming).queue(function () {
                $(this).removeClass('active').dequeue();
            });
            catIndex++;
            if (catIndex == categories.length) {
                catIndex = 0;
            }
            intervalTiming -= decreasedTime;
            if (intervalTiming <= 120) {
                intervalTiming = 120;
            }
            if (loopCount == 10) {
                loaderLoopCount = false;
            }
            if (decreasedTime <= 10) {
                decreasedTime = 10;
            }
            SetLoaderTimeOut(catIndex, intervalTiming, categories, loaderTextContainer, decreasedTime, loaderLoopCount, loaderLoop, loopCount);
        }, intervalTiming);
    } else {
        clearTimeout(loaderLoop);
        var finishInterval = setInterval(function () {
            loopCount--;
            $(loaderTextContainer).find('.loader-main-text').removeAttr('style').attr('class', 'loader-main-text switch-animation switch-' + categories[catIndex] + '-animation');
            catIndex++;
            if (catIndex == categories.length) {
                catIndex = 0;
            }
            if (loopCount == 0 && windowLoaded == true) {
                $('#loader-wrp').addClass('fade-away');
                $('html,body').removeClass('popup-in-motion');
                clearInterval(finishInterval);
            }
        }, 700);
        return;
    }
}

//Initialize loader
var InitLoader = function () {
    $('html,body').addClass('popup-in-motion');
    var intervalTiming = 1000,
        decreasedTime = 90,
        catIndex = 0,
        categories = [],
        loaderLoopCount = true,
        loaderLoop,
        loopCount = 42,
        loaderTextContainer = $('#loader-wrp').find('.loader-text-container');

    $('#loader-wrp .loader-text-white-bg').each(function () {
        categories.push($(this).attr('data-category'));
        var zindex = parseInt($(this).find('span').width(), 10) * -1;
        $(this).css('z-index', zindex);
    });
    $('#loader-wrp').find('.loader-skip-link').on('click', function () {
        $('#loader-wrp').addClass('fade-away');
        $('html,body').removeClass('popup-in-motion');
    });
    SetLoaderTimeOut(catIndex, intervalTiming, categories, loaderTextContainer, decreasedTime, loaderLoopCount, loaderLoop, loopCount);
}
if ($('#loader-wrp').length) {
    InitLoader();
}

//Fix header menus position
var FixHeaderMenusPosition = function () {
    var documentRightOffset = $('body').width();
    $('header .category-nav li ul li').on('mouseover', function () {
        $(this).siblings('li').find('.open-other-dir').removeClass('open-other-dir');
        if ($(this).children('ul').length) {
            var openedMenuRightOffset = $(this).children('ul').offset().left + $(this).children('ul').width();
            if (openedMenuRightOffset >= documentRightOffset) {
                $(this).children('ul').addClass('open-other-dir');
            }
        }
    });
}

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

//Check highlights limit
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
    mainContent.css('margin-top', (breakPos - 1) + 'px');
}

//Add see all at the end of submenu in main nav
var AddSeeAll = function(listItem){
    if(listItem.children('ul').length){
        var childList = listItem.children('ul');
        childList.children('li').each(function(){
            AddSeeAll($(this));
        });
        var seeAllLink = listItem.children('a').attr('href'),
            seeAllTitle = listItem.children('a').attr('title');
        var seeAllItem = '<li><a href="'+seeAllLink+'" title="'+seeAllTitle+'">See all</a></li>';
        listItem.children('ul').append(seeAllItem);
        listItem.children('a').attr('href','javascript:void(0);');
    }else{
        return;
    }
}

//Change menu header in smaller screen
var ManipulateMainNav = function(){
    if ($(document).width() <= 1024 && !$('.bottom-header').hasClass('changed')) {
        $('.bottom-header').addClass('changed');
        $('.bottom-header').find('li').each(function(){
            AddSeeAll($(this));
        });
    }
}

//Toggle main menu on smaller screens
var ToggleMainNav = function(isOpen){
    if(!isOpen){
    $('.bottom-header').addClass('active');
    $('html,body').addClass('popup-in-motion');
    $('.bottom-header .category-nav').find('li').find('a').off().on('click',function(){
        if($(this).siblings('ul').length){
            $(this).parent().siblings().find('ul').slideUp();
            $(this).siblings('ul').slideDown();
        }
    });   
}
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
            newPaddingValue = (scrollPos - breakPos) / 4;
        if (scrollPos >= Math.floor(breakPos)) {
            if (newPaddingValue <= carouselBodyHeight) {
                $('#main-carousel .carousel-body').css('padding-top', newPaddingValue);
                $('.carousel-data').css('top', carouselDataTop - newTopValue);
            }
        } else {
            $('#main-carousel .carousel-body').css('padding-top', 0);
            $('.carousel-data').css('top', carouselDataTop);
        }
    } else if ($('.category-banner').length) {
        var categoryBannerHeight = $('.category-banner').height();
        newBgPosition = scrollPos / 15;
        if (scrollPos >= breakPos) {
            if (newBgPosition <= categoryBannerHeight) {
                $('.category-banner').css('background-position-y', (50 - newBgPosition) + '%')
            }
        } else {
            $('.category-banner').css('background-position-y', (50 - newBgPosition) + '%')
        }
    } else if ($('.article-with-bg').length) {
        var newBgPosition = scrollPos / 15,
            newTop = scrollPos / 5;
        $('.article-with-bg .article-bg').css('object-position', '50% ' + (50 - newBgPosition) + '%');
        $('.article-with-bg  section').css('bottom', newTop);
    }
}
//Event Calendar
var getDaysInMonth = function (year, month) {
    return new Date(year, month + 1, 0).getDate();
};
var initCalendar = function () {
    var date = new Date();
    if (arguments.length)
        date = arguments[0];
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDay(),
        monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        currentMonth = monthNames[month],
        firstDay = daysNames[day],
        firstDayIndex = $('.calendar-body th:contains("' + firstDay + '")').index(),
        days = getDaysInMonth(year, month);
    $('#calendar-wrp .calendar-controls-wrp .month-details').text(year + ', ' + currentMonth);
    $('#calendar-wrp .calendar-controls-wrp').data({
        'year': year,
        'month': month
    });
    $('.calendar-body tbody tr').remove();
    var monthDone = false,
        week = 1,
        dayIteration = 1,
        remainigDays = 0;
    while (!monthDone) {
        $('.calendar-body tbody').append('<tr></tr>');
        if (week == 1) {
            var daysBefore = getDaysInMonth(year, month - 1);
            for (var b = 0; b < firstDayIndex; b++) {
                $('.calendar-body tbody tr:nth-child(' + week + ')').prepend('<td class="out-of-month">' + daysBefore + '</td>');
                daysBefore--;
            }
        }
        for (d = dayIteration; d <= days; d++) {
            $('.calendar-body tbody tr:nth-child(' + week + ')').append('<td>' + d + '</td>');
            if (d == days) {
                remainigDays = 7 - $('.calendar-body tbody tr:nth-child(' + week + ') td').length;
                monthDone = true;
            }
            if ($('.calendar-body tbody tr:nth-child(' + week + ') td').length == 7) {
                week++;
                dayIteration = d + 1;
                break
            }
        }
        for (var r = 1; r <= remainigDays; r++) {
            $('.calendar-body tbody tr:nth-child(' + week + ')').append('<td class="out-of-month">' + r + '</td>')
        }
    }

}

var calNextMonth = function (currentYear, currentMonth) {
    var nextMonth = new Date(currentYear, currentMonth + 1);
    initCalendar(nextMonth);
}

var calPrevMonth = function (currentYear, currentMonth) {
    var prevMonth = new Date(currentYear, currentMonth - 1);
    initCalendar(prevMonth);
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
        input.siblings('.continue-reading').addClass('exceeds');
    } else {
        input.siblings('.continue-reading').removeClass('exceeds');
    }
}

//ifImagesExceeds
var ifImagesExceeds = function (wrp) {
    var totlaImages = wrp.find('.image-wrp').length,
        firsImagePos = wrp.find('.image-wrp:first').position().top;
    wrp.find('.image-wrp .images-exceeds').remove();
    for (var i = 0; i < totlaImages; i++) {
        var imagePos = wrp.find('.image-wrp').eq(i).position().top;
        if (imagePos > firsImagePos) {
            var remaining = totlaImages - i + 1;
            wrp.find('.image-wrp').eq(i - 1).append('<div class="images-exceeds">+' + remaining + '</div>');
            break;
        }
    }
}

//isOpen
var isOpen = function () {
    var oppeningHours = [],
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        date = new Date(),
        day = date.getDay().toString(),
        hour = convertTo_00(date.getHours().toString()),
        minutes = convertTo_00(date.getMinutes().toString());
    if (day == 0 && $('.opening-details li:contains("Saturday") .hour .to').text().indexOf('AM') != -1)
        day = 7;
    var timeString = day + hour + minutes;
    $('.opening-details li').each(function () {
        var dayIndex = days.indexOf($(this).find('.day').text()),
            from = convertTo_24($(this).find('.hour .from').text()),
            to = convertTo_24($(this).find('.hour .to').text());
        oppeningHours.push(getTimeValue(dayIndex, from, to));
    });
    var ifOpen = oppeningHours.filter(v => timeString > v[0] && timeString < v[1]);
    if (ifOpen.length) {
        $('.opening-hours-container .icon-opening-hours').removeClass('closed').addClass('opened');
        $('.opening-hours-container .open-status').text('Open now');
    } else {
        $('.opening-hours-container .icon-opening-hours').removeClass('opened').addClass('closed');
        $('.opening-hours-container .open-status').text('Closed now');
    }
    setTimeout(isOpen, 900000);
};

var convertTo_00 = function (value) {
    value = '0' + value.toString();
    return value.slice(-2);
}

var convertTo_24 = function (time) {
    if (time.toUpperCase().indexOf('PM') != -1 && time.split(':')[0] < 12) {
        var arr = time.split(':');
        time = Number(arr[0]) + 12 + ':' + arr[1];
    }
    return time.replace(/[^0-9$:]/g, '');
}

var getTimeValue = function (dayIndex, from, to) {
    var fromValue = dayIndex + from.split(':').join('');
    var toTest = to.split(':').join('');
    if (fromValue > 1200 && toTest < 1200)
        dayIndex++;
    var toValue = dayIndex + to.split(':').join('');
    return [fromValue, toValue];
}

var ratingCircleResult = function () {
    $('.general-rating-container .circle-container').each(function () {
        var ratingValue = parseFloat($(this).find('span').text(), 10);
        if (ratingValue > 100)
            ratingValue = 100;
        var newDashOffsetValue = 290 - (ratingValue * 290 / 100);
        $(this).find('circle').css('stroke-dashoffset', newDashOffsetValue);
    });
}

//Get Svg
var getSvg = function (selector) {
    $(selector).each(function () {
        var _this = $(this);
        var path = _this.find('img').attr('src');
        $.get(path, function (data) {
            _this.html(data);
        }, 'text')
    });
};

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

//-------------------------------------------------------------------------------------------------

//Set Active Category
var SetActiveCategory = function () {
    var cat = $('body').attr('class').replace('-theme', '');
    if (cat != null)
        $('.sticky-header .category-nav li a:contains(' + cat + ')').addClass('active');
}

//Category names to inner pages
var SetInnersCategory = function () {
    var Category = GetParameterByName('category');
    var SubCategory = GetParameterByName('subcategory');
    $('body').addClass(Category + '-theme');
    if ($('.category-banner').length) {
        if (Category != null) {
            $('.category-banner h1').html(Category);
        }
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

//-------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------

if ($('gallery-section-container').length) {
    var mainSlideIndex = 0;
}

//Initialize gallery slider
var DetailsGallerySlides = [],
    ImgToDisplay = {},
    ImgToDisplayIndex = 0,
    IsDetailsGalleryPaused = false,
    IsDetailsGalleryPausedTimeout;
var InitDetailsGallerySlider = function () {
    $('#item-gallery-init').find('img').each(function () {
        var img = {};
        img.src = $(this).attr('src');
        img.title = $(this).attr('title');
        DetailsGallerySlides.push(img);
    });
    var counter = 0;
    $('.main-image').attr('src', DetailsGallerySlides[counter].src).attr('alt', DetailsGallerySlides[counter].alt).attr('data-index', counter);
    $('.slide-image').each(function () {
        $(this).attr('src', DetailsGallerySlides[counter].src).attr('alt', DetailsGallerySlides[counter].alt).attr('data-index', counter);
        counter++;
    });
    if (DetailsGallerySlides.length > 3) {
        $('.side-slides-count span').html('+' + (DetailsGallerySlides.length - 2));
        $('.side-slides-count').addClass('active');
    }
    $('.side-slide-item:not(:last-child) a').off().on('click', function () {
        DisplayClickedDetailsGalleryItem($(this).find('img').attr('data-index'));
    })
    $('.gallery-next').off().on('click', function () {
        NextDetailsGalleryItem();
    });
    $('.gallery-prev').off().on('click', function () {
        PrevDetailsGalleryItem();
    });
    $('.activate-slider-popup').off().on('click', function () {
        var clickedImgIndex;
        IsDetailsGalleryPaused = true;
        if ($(this).hasClass('more-slide')) {
            clickedImgIndex = 2;
        } else {
            clickedImgIndex = $('.main-slide-wrp img').attr('data-index');
        }
        DrawPopupGallery(DetailsGallerySlides, clickedImgIndex);
        InitPopupGallery();
    });
    AutoPlayDetailsGallery();
}

//Display clicked gallery slide
var DisplayClickedDetailsGalleryItem = function (imageIndex) {
    var mainImg = $('.main-slide-wrp').find('img').not('.cloned');
    ImgToDisplay = DetailsGallerySlides[imageIndex];
    ImgToDisplayIndex = imageIndex;
    mainImg.clone().addClass('cloned').prependTo(".main-slide-wrp .activate-slider-popup");
    mainImg.hide().delay(100).queue(function () {
        mainImg.attr('src', ImgToDisplay.src).fadeIn(100).attr('alt', ImgToDisplay.title).attr('data-index', imageIndex).dequeue();
        $('.main-slide-wrp').find('.cloned').delay(100).queue(function () {
            $(this).remove().dequeue();
        });
    });
}

//Display next gallery slide
var NextDetailsGalleryItem = function () {
    if (ImgToDisplayIndex < DetailsGallerySlides.length - 1) {
        ImgToDisplayIndex++;
        DisplayClickedDetailsGalleryItem(ImgToDisplayIndex);
    } else {
        DisplayClickedDetailsGalleryItem(0);
    }
}

//Display prev gallery slide
var PrevDetailsGalleryItem = function () {
    if (ImgToDisplayIndex > 0) {
        ImgToDisplayIndex--;
        DisplayClickedDetailsGalleryItem(ImgToDisplayIndex);
    } else {
        DisplayClickedDetailsGalleryItem(DetailsGallerySlides.length - 1);
    }
}

//Auto play details gallery
var AutoPlayDetailsGallery = function () {
    var detailsGalleryInterval = setInterval(function () {
        if (!IsDetailsGalleryPaused && !$('#image-slider-popup').hasClass('active')) {
            NextDetailsGalleryItem();
        }
    }, 2500)
    $('.main-slide-wrp').on('mouseover mouseenter', function () {
        IsDetailsGalleryPaused = true;
    });
    $('.main-slide-wrp').on('mouseout mouseleave', function () {
        IsDetailsGalleryPausedTimeout = setTimeout(function () {
            IsDetailsGalleryPaused = false;
            clearTimeout(IsDetailsGalleryPausedTimeout);
        }, 3000);
    });
}

//-------------------------------------------------------------------------------------------------

//popup gallery slider
var PopupGallerySlides = [];
var PopupImgToDisplay = {},
    PopupImgToDisplayIndex = 0,
    PopupMouseDownX = 0;
var sliderMainImage = $('#image-slider-popup').find('.slider-main-image').not('.cloned');
var imgSmallSliderContainer = $('#image-slider-popup').find('.img-small-slider-container');
var lastScreenSize = 0;
console.log(lastScreenSize);

//Draw popup gallery slider
var DrawPopupGallery = function (galleryList, activeImgIndex) {
    PopupGallerySlides = Array.from(galleryList);
    PopulateGalleryPopup();
    DisplayClickedPopupGalleryItem(activeImgIndex);
    ActivateGalleryPopup();
    $('html,body').addClass('popup-in-motion');
    $('#image-slider-popup').find('.default-close-btn').off().on('click', function () {
        DestroyPopupGallery();
    });
}

//Initialize popup gallery slider
var InitPopupGallery = function () {
    console.log('entered');
    console.log('lastScreenSize: in initial : ' + lastScreenSize);
    if (lastScreenSize != newScreenSize) {
        console.log('here');
        if (newScreenSize == 1) {
            console.log('bigger');
            imgSmallSliderContainer.find('img').off().on('click', function () {
                DisplayClickedPopupGalleryItem($(this).attr('popup-slide-data-index'));
            });
            $('#image-slider-popup').find('.slider-nav-next').off().on('click', function () {
                NextPopupGalleryItem();
            });
            $('#image-slider-popup').find('.slider-nav-prev').off().on('click', function () {
                PrevPopupGalleryItem();
            });
            $('.slider-count span').html((parseInt(PopupImgToDisplayIndex) + 1) + ' / ' + PopupGallerySlides.length);
        } else {
            console.log('smaller');
            imgSmallSliderContainer.find('img').off();
            $('#image-slider-popup').find('.slider-nav-next,.slider-nav-prev').off();
            $('.slider-count span').html(PopupGallerySlides.length + ' Photos');
        }
        lastScreenSize = CalcLastScreenSize(lastScreenSize);
        console.log('lastScreenSize inside change : ' + lastScreenSize);
    }
}

//Destroy popup gallery slide
var DestroyPopupGallery = function () {
    $('#image-slider-popup').removeClass('active');
    imgSmallSliderContainer.html('');
    $('.slider-count span').html('');
    sliderMainImage.attr('src', '').attr('alt', '').attr('popup-main-data-index', '');
    imgSmallSliderContainer.css('margin-left', 'initial');
    PopupGallerySlides = [], PopupImgToDisplay = {}, PopupImgToDisplayIndex = 0;
    setTimeout(function () {
        IsDetailsGalleryPausedTimeout = IsDetailsGalleryPaused = false;
        clearTimeout(IsDetailsGalleryPausedTimeout);
    }, 3000);
    $('html,body').removeClass('popup-in-motion');
}

//Populate gallery popup
var PopulateGalleryPopup = function () {
    var imgSmallSliderContainerHtml = '',
        imgSmallSliderContainerWidth = 0;
    /*sliderMainImage.attr('src', PopupImgToDisplay.src).attr('alt', PopupImgToDisplay.title).attr('popup-main-data-index', PopupImgToDisplayIndex);*/
    for (var i = 0; i < PopupGallerySlides.length; i++) {
        imgSmallSliderContainerHtml += '<div class="img-holder"><img src="' + PopupGallerySlides[i].src + '" alt="' + PopupGallerySlides[i].title + '" popup-slide-data-index="' + i + '" class="slider-slide-image" /></div>';
    }
    //imgSmallSliderContainerHtml += '<div class="active-slider-img-marker"></div>';
    imgSmallSliderContainer.html(imgSmallSliderContainerHtml);
    $('.img-small-slider-container .img-holder').each(function () {
        imgSmallSliderContainerWidth += $(this).innerWidth();
    });
    imgSmallSliderContainer.innerWidth(imgSmallSliderContainerWidth);
}

//Display clicked popup gallery slide
var DisplayClickedPopupGalleryItem = function (imageIndex) {
    sliderMainImage = $('#image-slider-popup').find('.slider-main-image').not('.cloned');
    PopupImgToDisplay = PopupGallerySlides[imageIndex];
    MoveGalleryPopupSlider(parseInt(PopupImgToDisplayIndex), parseInt(imageIndex));
    PopupImgToDisplayIndex = imageIndex;
    //sliderMainImage.attr('src', PopupImgToDisplay.src).attr('alt', PopupImgToDisplay.title).attr('popup-main-data-index', PopupImgToDisplayIndex);
    sliderMainImage.clone().addClass('cloned').prependTo("#image-slider-popup .slider-main-slide-wrp");
    sliderMainImage.hide().delay(100).queue(function () {
        sliderMainImage.attr('src', PopupImgToDisplay.src).fadeIn(100).attr('alt', PopupImgToDisplay.title).attr('popup-main-data-index', PopupImgToDisplayIndex).dequeue();
        $('#image-slider-popup').find('.slider-main-image.cloned').delay(100).queue(function () {
            $(this).remove().dequeue();
        });
    });
    $('.slider-count span').html((parseInt(PopupImgToDisplayIndex) + 1) + ' / ' + PopupGallerySlides.length);
    setTimeout(function () {
        MoveMarker();
    }, 200);
}

//Move small image slider
var MoveGalleryPopupSlider = function (prevImageIndex, clickedImageIndex) {
    if (PopupGallerySlides.length > 7) {
        var imageSmallSliderWrpWidth = $('.image-small-slider-wrp').innerWidth();
        var imgHolderWidth = $('.img-small-slider-container .img-holder').innerWidth();
        var differenceToEnd = PopupGallerySlides.length - 1 - clickedImageIndex;
        var differenceToStart = clickedImageIndex - 0;
        if (clickedImageIndex >= prevImageIndex) {
            if (differenceToEnd < 3) {
                imgSmallSliderContainer.css('margin-left', (PopupGallerySlides.length - 7) * imgHolderWidth * -1);
            } else if (differenceToStart >= 3 && differenceToEnd >= 3) {
                imgSmallSliderContainer.css('margin-left', (clickedImageIndex - 3) * imgHolderWidth * -1);
            }
        } else if (clickedImageIndex < prevImageIndex) {
            if (differenceToStart < 3) {
                imgSmallSliderContainer.css('margin-left', 0);
            } else if (differenceToStart >= 3 && differenceToEnd >= 3) {
                imgSmallSliderContainer.css('margin-left', (clickedImageIndex - 3) * imgHolderWidth * -1);
            }
        }
    }
}

//Move marker on active image
var MoveMarker = function () {
    var imageIndex = $('.slider-main-image').not('.cloned').attr('popup-main-data-index');
    var selectedImage = $('.slider-slide-image[popup-slide-data-index="' + imageIndex + '"]');
    $('.slider-slide-image').closest('.img-holder').removeClass('active');
    selectedImage.closest('.img-holder').addClass('active');
    /*var width = selectedImage.width() - ((2 * $(window).width()) / 1200),
        height = selectedImage.height() - ((2 * $(window).width()) / 1200),
        left = selectedImage.parent().position().left + ((3 * $(window).width()) / 1200);
    $('.active-slider-img-marker').css({
        'left': left,
        'width': width,
        'height': height
    });*/
}

//Display next popup gallery slide
var NextPopupGalleryItem = function () {
    if (PopupImgToDisplayIndex < PopupGallerySlides.length - 1) {
        var nextIndex = parseInt(PopupImgToDisplayIndex) + 1;
    } else {
        var nextIndex = 0;
    }
    DisplayClickedPopupGalleryItem(nextIndex);
}

//Display prev popup gallery slide
var PrevPopupGalleryItem = function () {
    if (PopupImgToDisplayIndex > 0) {
        var prevIndex = parseInt(PopupImgToDisplayIndex) - 1;
    } else {
        var prevIndex = parseInt(PopupGallerySlides.length) - 1;
    }
    DisplayClickedPopupGalleryItem(prevIndex);
}

//Open gallery popup
var ActivateGalleryPopup = function () {
    $('#image-slider-popup').addClass('active');
}

//-------------------------------------------------------------------------------------------------

//Populate Popup
var PopulatePopup = function (type, title) {
    /*var bgClass = '';
    hasBg ? bgClass = ' popup-with-bg' : '';*/
    $('#popup-base .popup-title span').html(title);
    $('#popup-base').find('.' + type + '-container').fadeIn(0);
    $('#popup-base').addClass('popup-active ' + type + '-popup-active').find('.close-btn').addClass('init');
}

//-------------------------------------------------------------------------------------------------

//Arrange Sitemap Components
var ArrangeSitemap = function (columnsCount) {
    var currentBottomOffset = 0;
    var upperSiblingBottomOffset = 0;
    var upperSiblingBottomIndex = 0;
    var columnWidth = $('.sitemap-list-wrp').parent().width() / columnsCount;
    var columnCounter = 0;
    var columnLeft = 0;
    var maxBottomOffset = 0;
    var additionalMargin =
        $('.sitemap-list-wrp').each(function () {
            upperSiblingBottomIndex = parseInt($(this).index() - columnsCount);
            columnLeft = columnCounter * columnWidth;
            if (upperSiblingBottomIndex >= 0) {
                upperSiblingBottomOffset = $('.sitemap-list-wrp').eq(upperSiblingBottomIndex).position().top + $('.sitemap-list-wrp').eq(upperSiblingBottomIndex).innerHeight() + 5;
            }
            $(this).css({
                'left': columnLeft,
                'top': upperSiblingBottomOffset
            });
            currentBottomOffset = $(this).position().top + $(this).innerHeight() + 5;
            if (currentBottomOffset > maxBottomOffset) {
                maxBottomOffset = currentBottomOffset
            }
            $('.sitemap-list-container').innerHeight(maxBottomOffset);
            columnCounter++;
            if (columnCounter == 4) {
                columnCounter = 0;
            }
        });
}

var windowLoaded = false;
//document ready
$(document).ready(function () {
    windowLoaded = true;
    if ($('#loader-wrp').length && !$('#loader-wrp').hasClass('fade-away')) {
        $('#loader-wrp').find('.loader-skip-link').addClass('active');
    }
    if ($('.items-list-wrp').length && $('.items-list-wrp').find('.ads-wrp').length) {
        $('.items-list-wrp').css('min-height', $('.ads-wrp').height());
    }
    //Ripple Effect
    if ($('.ripple').length) {
        var circle = '<span class="circle"></span>'
        $('.ripple').on('click', function (e) {
            var height = $(this).height(),
                width = $(this).width(),
                posTop = $(this).offset().top,
                posLeft = $(this).offset().left,
                max = Math.max(height, width);
            $(this).prepend(circle);
            var newCircle = $(this).find('.circle:first');
            if ($(this).hasClass('pos')) {
                newCircle.css({
                    'top': e.pageY - posTop - (max / 2),
                    'left': e.pageX - posLeft - (max / 2)
                })
            }
            newCircle.width(max).height(max);
            setTimeout(function () {
                newCircle.remove();
            }, 800);
        });
    }

    //Header
    var header = $('header'),
        breakPos = header.height();
    var scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    ManipulateMainNav();
    if($('.burger-menu-btn-wrapper').length){
        $('.burger-menu-btn-wrapper').off().on('click',function(){
            if(!$('.bottom-header').hasClass('active')){
                ToggleMainNav(false);
            }
            else{
                ToggleMainNav(true);
            }
        });
    }
    newScreenSize = CalcLastScreenSize(newScreenSize);
    console.log('newScreenSize in ready:' + newScreenSize);
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
    SetInnersCategory();
    SetActiveCategory();
    $('.category-nav>li>ul li').has('ul').each(function () {
        $(this).append('<i class="icon-triangular-arrow"></i>');
    });
    $('.nav-search-btn').on('click', function () {
        PopulatePopup('search', 'Search');
        $('html,body').addClass('popup-in-motion');
    });

    $('#popup-close-btn').on('click', function () {
        $('#popup-base').removeClass('popup-active search-popup-active').find('.close-btn').removeClass('init');
        $('#popup-base').find('.popup-body-container').fadeOut(0);
        /*setTimeout(function () {
            $('#popup-base').removeClass('popup-with-bg');
        }, 1000);*/
        $('html,body').removeClass('popup-in-motion');
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

    FixHeaderMenusPosition();

    if ($('.facilities-wrp').length) {
        getSvg('.facility-unit');
    }

    if ($('.opening-hours-container').length) {
        isOpen();
    }

    if ($('.general-rating-container').length) {
        ratingCircleResult();
    }

    //Start of Trending
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
        var highlightsCount = $('.highlights-carousel-wrp').find('.highlights-item').length,
            highlightsItemWidth = $('.highlights-carousel-wrp').find('.highlights-item').width() + (parseFloat($('.highlights-carousel-wrp .highlights-item').css('padding-right'), 10) * 2),
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
                    if (Math.abs((e.clientX || e.originalEvent.changedTouches[0].pageX) - baseClick) > 30) {
                        $(this).find('a').addClass('scrolling');
                    }
                    DragHighlights(actualScroll, baseClick, (e.clientX || e.originalEvent.changedTouches[0].pageX))
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
                    carouselPosDiff = carouselBasePos - (e.pageX || e.originalEvent.changedTouches[0].pageX);
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
                    }, 400);
                    activeScrollItem.next().find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').stop().animate({
                        left: 30
                    }, 600);
                    $('.carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll + fullScroll) / fullScroll)
                    }, 400, function () {
                        setTimeout(function(){
                            $('.carousel-data').css('left', '30px');
                        },200);
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
                    }, 400);
                    activeScrollItem.prev().find('.carousel-data').css('left', '-650px').delay(150).queue(function () {
                        $(this).stop().animate({
                            left: 30
                        }, 400);
                    })
                    $('#main-carousel .carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll - fullScroll) / fullScroll)
                    }, 400, function () {
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
        $('#best-spots .best-frame-container:first,#best-spots .best-frame-container:first .best-image-frame:first,#best-spots .best-frame-container:first h2:first,#best-spots .best-frame-container:first h6:first,#best-spots .best-frame-container:first .best-description-frame:first').addClass('active');
        $('#best-spots .best-frame-container .best-image-frame').on('click', function () {
            var bestFrameIndex = $(this).closest('.best-frame-container').index();
            var bestIndex = $(this).index();
            $('#best-spots .best-frame-container .best-image-frame,#best-spots .best-frame-container .best-description-frame,#best-spots .best-frame-container h2,#best-spots .best-frame-container h6').removeClass('active shadow');
            if (bestIndex == 1)
                $(this).siblings().not('.best-description-frame, h2').addClass('shadow');
            $(this).addClass('active');
            $('#best-spots .best-frame-container:eq(' + bestFrameIndex + ') .best-description-frame:eq(' + bestIndex + '),#best-spots .best-frame-container:eq(' + bestFrameIndex + ') h2:eq(' + bestIndex + '),#best-spots .best-frame-container:eq(' + bestFrameIndex + ') h6:eq(' + bestIndex + ')').addClass('active');
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
                $('#best-spots .best-frame-container:nth-of-type(' + actualFrameIndex + ')').addClass('leaving').delay(1000).queue(function () {
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
                }, 1000);
            }
        });
    }
    // End of Best Spots

    //Start of Attractions
    if ($('#attractions').length) {
        var anchorPos = $('#attractions .attractions-body .attraction:first').position().left;
        var titlePos = $('#attractions .attractions-body .attraction:first h3').position();
        var titleWidth = $('#attractions .attractions-body .attraction:first h3').width();
        var activeTitleIndex = 0;
        var attractionOut = true;
        $('#attractions .attractions-body .attraction:first').addClass('active');
        $('.attractions-index').css({
            'top': titlePos.top + 14,
            'left': titlePos.left + anchorPos - 15,
            'width': titleWidth + 30
        });
        $('.attractions-index div').css('border-right-width', titleWidth + 30);
        $('#attractions .attractions-body .attraction').on('mouseenter', function () {
            var titleIndex = $(this).index();
            if (activeTitleIndex != titleIndex) {
                var titlePos = $(this).find('h3').position();
                var anchorPos = $(this).position().left;
                var titleWidth = $(this).find('h3').width();
                $('.attractions-index').css({
                    'top': titlePos.top + 10,
                    'left': titlePos.left + anchorPos - 15,
                    'width': titleWidth + 30
                });
                $('.attractions-index div').css({
                    'border-right-width': titleWidth + 30
                });
                $('.attractions-body .attraction').removeClass('active');
                $('.attractions-body .attraction').eq(titleIndex).addClass('active');
                activeTitleIndex = titleIndex;
            }
        });
    }
    //End of Attractions

    //Start of Advanced Search
    if ($('.advanced-search-filters-wrp').length) {
        //higherLowerValidation = false;
        $('.dropdown-input').on('click', function () {
            var _this = $(this);
            $('.dropdown-input').not(_this).removeClass('active');
            _this.toggleClass('active');
        });
        $('.dropdown-options li').on('click', function (e) {
            e.stopPropagation();
            var parentDropDown = $(this).closest('.dropdown-input');
            if (!parentDropDown.hasClass('multiple-choice')) {
                var dropDownChoice = $(this).find('label').text();
                parentDropDown.removeClass('active').find('.selected-value').text(dropDownChoice);
            }
        });
        $('.dropdown-options li input').on('change', function (e) {
            e.stopPropagation();
            var checkboxStatus = $(this).is(':checked'),
                filterLabel = $(this).siblings('label').find('.filter-label').text(),
                filterValue = $(this).closest('.multiple-choice').find('.selected-value'),
                baseText = 'Please choose',
                spanModel = '<span class="entering">' + filterLabel + '</span>',
                ifValueExceeds = function () {
                    if (filterValue.height() > filterValue.parent('.filter-field-input').height()) {
                        filterValue.addClass('exceeds');
                    } else {
                        filterValue.removeClass('exceeds');
                    }
                };
            if (checkboxStatus) {
                if (filterValue.text() == baseText) {
                    filterValue.text('');
                }
                filterValue.append(spanModel);
                setTimeout(function () {
                    filterValue.find('.entering').removeClass('entering');
                });
                ifValueExceeds();
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
                    ifValueExceeds();
                }, 400);
            }
        });
        /*$('.filter-set-item .simulate-number').on('keypress', function (e) {
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
        });*/

        $('.search-go-event').on('click', function () {
            var parentCollapsable = $(this).closest('.collapsable-filter-wrp');
            var parentSearchFilter = $(this).closest('.advanced-search-filters-wrp');
            var ratingChoices = parentCollapsable.find('p:contains("Rating")').siblings('.multiple-choice').find('.selected-value');
            var facilitiesChoices = parentCollapsable.find('p:contains("Facilities")').siblings('.multiple-choice').find('.selected-value');
            // var lowestPrice = parentCollapsable.find('p:contains("Lowest price")').siblings('input').val().replace(/\D/g, '');
            // if (lowestPrice == '')
            //     lowestPrice = 'The lowest possible';
            // var highestPrice = parentCollapsable.find('p:contains("Highest price")').siblings('input').val().replace(/\D/g, '');
            // if (highestPrice == '')
            //     highestPrice = 'The highest possible';
            // if (!isNaN(lowestPrice) && !isNaN(highestPrice) && Number(lowestPrice) >= Number(highestPrice)) {
            //     parentCollapsable.find('p:contains("Lowest price")').siblings('.validation-msg').fadeIn().addClass('entering');
            //     parentCollapsable.find('p:contains("Highest price")').siblings('.validation-msg').fadeIn().addClass('entering');
            //     higherLowerValidation = true;
            //     return;
            // }

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
            //var offers = parentCollapsable.find('p:contains("Offers")').siblings('.radio-container').find('.inline-radio input:checked + label').text();
            // parentSearchFilter.find('.lowest-price-value').text(lowestPrice);
            // parentSearchFilter.find('.highest-price-value').text(highestPrice);
            // higherLowerValidation = false;
        });

        $('.advanced-search-filters').off().on('click', function () {
            var parentFilterWrapper = $(this).closest('.advanced-search-filters-wrp');
            var siblingCollapsable = parentFilterWrapper.find('.collapsable-filter-wrp');
            siblingCollapsable.toggleClass('open').slideToggle('fast');
        });
        $('.advanced-search-filters-wrp').off().on('click', function () {
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
    if ($('#item-gallery-init').length) {
        InitDetailsGallerySlider();
    }

    //Tabs component
    if ($('.tabs-global-container ul.tabs-items li').length > 1) {
        $('.tabs-global-container ul.tabs-content-container li:not(".active")').hide();
        $('.tabs-global-container ul.tabs-items li').on('click', function () {
            var index = $(this).index();
            $('.tabs-global-container ul.tabs-items li').removeClass('active');
            $('.tabs-global-container ul.tabs-content-container li').slideUp('slow').removeClass('active');
            $(this).addClass('active');
            $('.tabs-global-container ul.tabs-content-container li').eq(index).slideDown('slow', function () {
                $(this).addClass('active');
            });
        })
    }

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
        $('.comment-container .continue-reading').on('click', function () {
            // var parentContainer = $(this).parent(),
            var paragraphContainer = $(this).closest('.paragraph-container'),
                paragraphHeight = $(this).siblings('p').height();
            paragraphContainer.css('height', paragraphHeight).delay(150).queue(function () {
                paragraphContainer.css('height', 'auto').dequeue();
            });
            $(this).slideUp('fast');
        })

        $('.comment-container .translate-comment').on('click', function () {
            $(this).siblings('.paragraph-container').find('.continue-reading').click();
            $(this).siblings('.translation-container').slideDown('fast');
            $(this).slideUp('fast');
        });
        if ($('.images-container').length) {
            $('.images-container').each(function () {
                ifImagesExceeds($(this));
            });
            $('.images-container .image-wrp').on('click', function () {
                var allImages = $('.images-container .image-wrp').length,
                    imageIndex = $(this).index(),
                    commentImages = [];
                for (var i = 0; i < allImages; i++) {
                    var image = {};
                    image.src = $('.images-container .image-wrp').eq(i).find('img').attr('src');
                    image.title = $('.images-container .image-wrp').eq(i).find('img').attr('title') || 'Image';
                    commentImages.push(image);
                }
                DrawPopupGallery(commentImages, imageIndex);
                InitPopupGallery();
            });
        }
    }
    //End of Comment Section

    //Sitemap
    if ($('.sitemap-list-wrp').length) {
        ArrangeSitemap(4);
    }

    //Start of Register from
    if ($('.login-register-container').length) {
        $('.login-register-links .facebook-btn').on('click', function () {
            $('.login-register-welcome-wrp').slideUp(function () {
                $('.register-form').slideDown().addClass('opened');
            });
        });
        $('.register-form button.cancel').on('click', function () {
            $('.register-form').removeClass('opened').delay(300).slideUp(function () {
                $('.login-register-welcome-wrp').slideDown();
            });
        });
    }
    //End of Register from

    //Start of Events Calendar
    if ($('#calendar-wrp').length) {
        //initCalendar();
        $('.calendar-controls-wrp .calendar-prev').on('click', function () {
            var year = $('.calendar-controls-wrp').data('year'),
                month = $('.calendar-controls-wrp').data('month');
            calPrevMonth(year, month);
        });
        $('.calendar-controls-wrp .calendar-next').on('click', function () {
            var year = $('.calendar-controls-wrp').data('year'),
                month = $('.calendar-controls-wrp').data('month');
            calNextMonth(year, month);
        });
    }
    //End of Events Calendar

    $(document).on('mousedown touchstart', function (e) {
        if (newScreenSize == 1) {
            if ($('#image-slider-popup.active').length) {
                PopupMouseDownX = e.pageX || e.originalEvent.touches[0].pageX;
            }
        }
    });
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
                            }, 400);
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
                            }, 400);
                            carouselItemTarget.find('.carousel-data').stop().animate({
                                left: (fullScroll * 3) / 4
                            }, 400);
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
                    }, 600);
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

            if (newScreenSize == 1) {
                if ($('#image-slider-popup.active').length) {
                    var PopupMouseUpX = e.pageX || e.originalEvent.changedTouches[0].pageX;
                    if (PopupMouseDownX - PopupMouseUpX > 20) {
                        NextPopupGalleryItem();
                    } else if (PopupMouseDownX - PopupMouseUpX < -20) {
                        PrevPopupGalleryItem();
                    }
                }
            }
        }
    });
    $(document).on('keyup', function (e) {
        if (e.keyCode == 27) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-close-btn').click();
            }
            if (newScreenSize == 1) {
                if ($('#image-slider-popup').length && $('#image-slider-popup').hasClass('active')) {
                    //$('#image-slider-popup').removeClass('active');
                    DestroyPopupGallery();
                }
            }
            if (!$('#loader-wrp').hasClass('fade-away') && windowLoaded) {
                $('#loader-wrp').addClass('fade-away');
                $('html,body').removeClass('popup-in-motion');
            }
        } else if (e.keyCode == 13) {
            if ($('#popup-base .search-input input').hasClass('field-focus')) { }
        } else if (e.keyCode == 9) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-base .search-input input').focus();
            }
        } else if (e.keyCode == 37) {
            if (newScreenSize == 1) {
                if ($('#image-slider-popup').length && $('#image-slider-popup').hasClass('active')) {
                    PrevPopupGalleryItem();
                }
            }
        } else if (e.keyCode == 39) {
            if (newScreenSize == 1) {
                if ($('#image-slider-popup').length && $('#image-slider-popup').hasClass('active')) {
                    NextPopupGalleryItem();
                }
            }
        }
    });
    $(document).on('click', function (e) {
        if ($('.dropdown-input').hasClass('active')) {
            var _this = $('.dropdown-input.active');
            if (!_this.is(e.target) && _this.has(e.target).length == 0) {
                _this.removeClass('active');
            }
        }
        if ($('.collapsable-filter-wrp').hasClass('open')) {
            var parentFilterWrapper = $('.collapsable-filter-wrp.open').closest('.advanced-search-filters-wrp');
            if (!parentFilterWrapper.is(e.target) && parentFilterWrapper.has(e.target).length == 0) {
                $('.collapsable-filter-wrp.open').removeClass('open').slideUp('fast');
            }
        }
        if ($('#image-slider-popup').hasClass('active')) {
            imageSliderWrp = $('#image-slider-popup,.slider-main-slide-wrp');
            if (imageSliderWrp.is(e.target)) {
                //$('#image-slider-popup').removeClass('active');
                DestroyPopupGallery();
            }
        }
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
    $(window).resize(function () {
        var header = $('header'),
            breakPos = header.height();
        var scrollPos = $(this).scrollTop();
        TransformHeader(scrollPos, breakPos);
        newScreenSize = CalcLastScreenSize(newScreenSize);
        console.log('newScreenSize in resize :' + newScreenSize);

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
        if ($('.comment-section-container').length) {
            $('.comment-container .comment-text').each(function () {
                ifContinueReading($(this), 4);
            });
        }
        if ($('.images-container').length) {
            $('.images-container').each(function () {
                ifImagesExceeds($(this));
            });
        }
        if ($('#image-slider-popup.active').length) {
            var imgSmallSliderContainerWidth = 0;
            $('.img-small-slider-container .img-holder').each(function () {
                imgSmallSliderContainerWidth += $(this).innerWidth();
            });
            $('.img-small-slider-container').innerWidth(imgSmallSliderContainerWidth);
            MoveGalleryPopupSlider(PopupImgToDisplayIndex, PopupImgToDisplayIndex);
            MoveMarker();
            InitPopupGallery();
        }

        //Sitemap
        if ($('.sitemap-list-wrp').length) {
            ArrangeSitemap(4);
        }
    });
});