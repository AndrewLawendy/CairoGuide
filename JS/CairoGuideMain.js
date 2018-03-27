var newScreenSize = 0; //Last screen size, changes when screen size changes, takes values 1,2 or 3
var TrendingSliderIntervals = []; //array to hold intervals for each trending carousel

//ifNotDesktop
var ifNotDesktop = function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    return false;
}

//ifInfiniteLoop
var maxIteration = 0;
var ifInfiniteLoop = function (max) {
    maxIteration++;
    if (maxIteration == max) {
        maxIteration = 0;
        return true;
    }
    return false;
}

//rippleEffect
var rippleEffect = function (e, _this) {
    var circle = $('<span class="circle"></span>'),
        height = _this.height(),
        width = _this.width(),
        posTop = _this.offset().top,
        posLeft = _this.offset().left,
        max = Math.max(height, width);
    _this.prepend(circle);
    if (_this.hasClass('pos')) {
        circle.css({
            'top': e.pageY - posTop - (max / 2),
            'left': e.pageX - posLeft - (max / 2)
        })
    }
    circle.width(max).height(max);
    setTimeout(function () {
        circle.remove();
    }, 800);
}

//initTypewriter
var initTypewriter = function () {
    $('[data-typewriter]').each(function () {
        var data = $(this).data('typewriter').split(';'),
            _this = $(this);
        updateChar = function (str, timeOut) {
            setTimeout(function () {
                _this.text(str);
            }, timeOut)
        }
        loopingData = function (data) {
            var timeOut = 100;
            for (var i = 0; i < data.length; i++) {
                for (var j = 1; j <= data[i].length; j++) {
                    var newStr = data[i].slice(0, j);
                    updateChar(newStr, timeOut);
                    timeOut += 100;
                }
                timeOut += 1000;
                for (var e = data[i].length; e >= 0; e--) {
                    var newStr = data[i].slice(0, e);
                    updateChar(newStr, timeOut);
                    timeOut += 75;
                }
                timeOut += 150;
            }
            timeOut += 150;
            setTimeout(function () {
                loopingData(data);
            }, timeOut);
        }
        loopingData(data);
    });
}

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

//Round to nearest value
var roundToNearestValue = function (reference, newVal) {
    return reference * Math.round((newVal) / reference);
}

//Ceil to nearest value
var ceilToNearestValue = function (reference, newVal) {
    return reference * Math.ceil((newVal) / reference);
}

//getQueryString
var getQueryString = function (field) {
    var href = window.location.href,
        reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i'),
        string = reg.exec(href);
    return string ? string[1] : null;
};

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
        if ($('.top-header .account-wrp').length) {
            $('.top-header .account-wrp').removeClass('active');
        }
        stickyHeader.addClass('fixed');
    } else {
        if ($('.attached-menu .account-wrp').length) {
            $('.attached-menu .account-wrp').removeClass('active');
        }
        stickyHeader.removeClass('fixed');
        topHeader.removeAttr('style');
    }
    if ($(window).width() <= 1024) {
        mainContent.removeAttr('style');
    } else {
        mainContent.css('margin-top', (breakPos - 1) + 'px');
    }
}

//Add see all at the end of submenu in main nav
var AddSeeAll = function (listItem) {
    if (listItem.children('ul').length) {
        var childList = listItem.children('ul');
        /*childList.children('li').each(function () {
            AddSeeAll($(this));
        });*/
        var seeAllLink = listItem.children('a').attr('href'),
            seeAllTitle = listItem.children('a').attr('title');
        var seeAllItem = '<li class="landing-page-menu-item"><a href="' + seeAllLink + '" title="' + seeAllTitle + '">' + seeAllTitle + ' home</a></li>';
        listItem.children('ul').prepend(seeAllItem);
        listItem.children('a').attr('href', 'javascript:void(0);');
    }
}
var RemoveSeeAll = function (listItem) {
    var seeAllLink = listItem.find('a').attr('href'),
        seeAllTitle = listItem.find('a').attr('title');
    listItem.closest('ul').siblings('a').attr('href', seeAllLink).attr('title', seeAllTitle);
    listItem.remove();
}

//Change menu header in smaller screen
var ManipulateMainNav = function () {
    if ($(window).width() <= 1024) {
        if (!$('.bottom-header').hasClass('changed')) {
            $('.bottom-header').addClass('changed');
            $('.bottom-header .category-nav').find('li').each(function () {
                AddSeeAll($(this));
            });
            $('.close-mobile-menu-btn').off().on('click', function () {
                ToggleMainNav();
            });
        }
    } else if ($(window).width() > 1024) {
        if ($('.bottom-header').hasClass('changed')) {
            $('.bottom-header').removeClass('changed');
            $('.bottom-header .category-nav').find('.landing-page-menu-item').each(function () {
                RemoveSeeAll($(this));
            });
            $('.bottom-header').removeClass('active').removeAttr('style');
            $('html,body').removeClass('popup-in-motion');
            $('.bottom-header .category-nav').find('ul').removeClass('expand').removeAttr('style');
            $('.close-mobile-menu-btn').off();
        }
    }
}

//Toggle main menu on smaller screens
var ToggleMainNav = function () {
    $('.bottom-header').toggleClass('active').fadeToggle();
    if ($('.bottom-header').hasClass('active')) {
        $('html,body').addClass('popup-in-motion');
        $('.bottom-header .category-nav').find('li').find('a').off().on('click', function () {
            if ($(this).siblings('ul').length) {
                $(this).closest('li').siblings('li').find('ul').slideUp().removeClass('expand');
                $(this).siblings('ul').slideToggle().toggleClass('expand');
                if (!$(this).siblings('ul').hasClass('expand')) {
                    $(this).siblings('ul').find('ul').slideUp().removeClass('expand');
                }
            }
        });
    } else {
        $('html,body').removeClass('popup-in-motion');
        $('.bottom-header .category-nav').find('li').find('a').off();
        $('.bottom-header .category-nav').find('ul').slideUp().removeClass('expand');
    }
}

//Scroll back to top function
var BackToTop = function () {
    $("html, body").animate({
        scrollTop: 0
    }, 700);
}

//Main Carousel Parallax
var MainBannerlParallax = function (scrollPos, breakPos) {
    if ($('#main-carousel').length) {
        var carouselBodyHeight = $('#main-carousel').height(),
            newTopValue = scrollPos - breakPos,
            newPaddingValue = (scrollPos - breakPos) / 3;
        if (scrollPos >= Math.floor(breakPos)) {
            if (newPaddingValue <= carouselBodyHeight) {
                $('#main-carousel .carousel-body').css('padding-top', newPaddingValue);
                $('.carousel-data').css('margin-top', (newTopValue * -.5));
            }
        } else {
            $('#main-carousel .carousel-body').css('padding-top', 0);
            $('.carousel-data').css('margin-top', 0);
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
    } else if ($('#calendar-carousel').length) {
        var carouselBodyHeight = $('.details-carousel').height(),
            carouselOffsetTop = $('.details-carousel').offset().top * .75,
            newTopValue = (scrollPos - carouselOffsetTop) / 3.5;
        if (scrollPos >= Math.floor(carouselOffsetTop)) {
            if (newTopValue <= carouselBodyHeight) {
                $('.details-carousel .details-carousel-item-wrp').css('top', newTopValue);
            }
        } else {
            $('.details-carousel .details-carousel-item-wrp').css('top', 0);
        }
    }
}
//Event Calendar
var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    creatingCalendar = false,
    creatingRange = false,
    todaySet = false,
    monthsCreated = [],
    yearsCreated = [];

var getDaysInMonth = function (year, month) {
    return new Date(year, month + 1, 0).getDate();
};

var getOrdinalIndicator = function (num) {
    var lastNumber = num.toString().slice(-1);
    if (lastNumber == 1 && num != 11) return 'st';
    if (lastNumber == 2 && num != 12) return 'nd';
    if (lastNumber == 3 && num != 13) return 'rd';
    return 'th';
}

var ifCurrentExceedsOther = function (date, currentDay) {
    var monthDays = getDaysInMonth(date.getFullYear(), date.getMonth());
    if (currentDay <= monthDays) return currentDay;
    return monthDays;
}

var getWeekNumber = function (date) {
    var yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
//Calendar Main Function
var initCalendarView = function (calendarView) {
    var switchControlView = function () {
        if (!$('.calendar-controls-wrp').hasClass('months-view')) {
            $('.calendar-controls-wrp').addClass('months-view');
            var thisMonth = $('#calendar-wrp').data('thisDate')[1],
                currentMonth = $('#calendar-wrp').data('currentDate')[1];
            $(this).find('.calendar-month-name').stop().animate({
                width: 'hide'
            }, {
                duration: 'fast'
            });
            $('.calendar-overview .calendar-head-body').addClass('leaving');
            setTimeout(function () {
                $('.calendar-overview .calendar-months-view-wrp').fadeIn(500).addClass('entering').find('.month:contains(' + thisMonth + ')').addClass('this-month');
                $('.calendar-overview .calendar-months-view-wrp .month').removeClass('active');
                $('.calendar-overview .calendar-months-view-wrp .month').eq(currentMonth).addClass('active');
            }, 300);
        } else if (!$('.calendar-controls-wrp').hasClass('years-view')) {
            var thisYear = $('#calendar-wrp').data('thisDate')[3],
                currentYear = $('#calendar-wrp').data('currentDate')[2],
                checkYearBefore = checkYearRangeBefore(currentYear);
            if (checkYearBefore != false)
                generateYearsView(checkYearBefore[0], checkYearBefore[1], checkYearBefore[2], checkYearBefore[3]);
            $('.calendar-controls-wrp').addClass('years-view');
            $(this).find('.calendar-month-year').fadeOut();
            // $(this).find('.calendar-month-year').stop().animate({
            //     width: 'hide'
            // }, {
            //     duration: 'fast'
            // });
            $(this).find('.calendar-year-range').fadeIn();
            $('.calendar-overview .calendar-months-view-wrp').fadeOut('fast').addClass('leaving')
            setTimeout(function () {
                $('.calendar-overview .calendar-years-view-wrp').fadeIn(500).css('display', 'flex').addClass('entering').find('.year:contains(' + thisYear + ')').addClass('this-year');
                $('.calendar-overview .calendar-years-view-wrp .year').removeClass('active');
                $('.calendar-overview .calendar-years-view-wrp .year:contains(' + currentYear + ')').addClass('active');
            }, 300);
        }
    }

    var checkMonthBefore = function (dateObj) {
        var monthsCreatedArr = monthsCreated.map(function (m) {
            return m.toDateString();
        })
        if (monthsCreatedArr.indexOf(dateObj.toDateString()) == -1) {
            var monthAfter = monthsCreated.filter(function (m) {
                return dateObj < m;
            });
            if (monthAfter.length) {
                var monthDiv = $('.calendar-month-wrp').filter(function () {
                        return $(this).data('year') == monthAfter[0].getFullYear() && $(this).data('month') == monthAfter[0].getMonth();
                    }),
                    activeMonthDateObj = new Date($('.calendar-month-wrp.active').data('year'), $('.calendar-month-wrp.active').data('month')),
                    isPrevWindow = dateObj < activeMonthDateObj;
                return [monthDiv, isPrevWindow]
            }
            return [undefined, false]
        }
        var monthIndex = monthsCreatedArr.indexOf(dateObj.toDateString()),
            choosenMonth = $('.calendar-month-wrp').eq(monthIndex);
        scrollToMonth(choosenMonth);
        updateDay(choosenMonth.data('monthName'), $('#calendar-wrp').data('currentDate')[0], choosenMonth.data('year'));
        choosenMonth.find('.day').removeClass('active');
        choosenMonth.find('.day:contains(' + $('#calendar-wrp').data('currentDate')[0] + ')').first().addClass('active');
        return false;
    }

    var checkYearRangeBefore = function (year) {
        var yearIndex = yearsCreated.indexOf(year),
            startFrom = year - (year % 12),
            endAt = startFrom + 11,
            choosenYear;
        if (yearIndex == -1) {
            var yearAfter = yearsCreated.filter(function (y) {
                return year < y;
            });
            if (yearAfter.length) {
                var yearAfterIndex = yearsCreated.indexOf(yearAfter[0]);
                if (yearAfterIndex % 2 == 0) {
                    choosenYear = $('.years-range-wrp').filter(function () {
                        return $(this).data('startFrom') == yearAfter[0];
                    });
                    var yearDivPosLeft = choosenYear.position().left,
                        isPrev = yearDivPosLeft < $('.calendar-years-view-wrp').width() ? true : false;
                    return [startFrom, endAt, isPrev, choosenYear];
                }
                choosenYear = $('.years-range-wrp').filter(function () {
                    return $(this).data('endAt') == yearAfter[0];
                });
            } else {
                return [startFrom, endAt, false]
            }
        }
        if (choosenYear == undefined) choosenYear = $('.years-range-wrp').filter(function () {
            return $(this).data('startFrom') == year || $(this).data('endAt') == year;
        });
        updateCalControls(choosenYear.data('startFrom') + ' - ' + choosenYear.data('endAt'));
        $('.years-range-wrp').removeClass('active')
        choosenYear.addClass('active');
        $('.years-range-wrp .year').removeClass('active');
        choosenYear.find('.year:contains(' + year + ')').addClass('active');
        scrollToYear();
        return false;
    }

    var setMonth = function (e, date) {
        var month = $(this).index(),
            year = $('.calendar-controls-wrp .calendar-today .calendar-month-year').text(),
            dateObj = new Date(year, month),
            currentDay = $('#calendar-wrp').data('currentDate')[0],
            newDayLimit = ifCurrentExceedsOther(dateObj, currentDay);
        if (date != undefined) dateObj = date;
        var checkMonth = checkMonthBefore(dateObj);
        if (checkMonth != false) initCalendar(dateObj, checkMonth[0], checkMonth[1]);
        $('.calendar-controls-wrp').removeClass('months-view').find('.calendar-month-name').animate({
            width: 'show'
        }, {
            duration: 'fast'
        }, {
            complete: function () {
                $('.calendar-controls-wrp .calendar-month-name').css('width', 'auto');
            }
        })
        $('.calendar-months-view-wrp').fadeOut('fast').removeClass('entering leaving');
        $('.calendar-month-wrp .day').removeClass('active');
        $('.calendar-month-wrp').each(function () {
            $(this).find('.day:contains(' + newDayLimit + ')').first().addClass('active');
        });
        setTimeout(function () {
            $('.calendar-head-body').removeClass('leaving');
        }, 300);
        $('#calendar-wrp').data('currentDate', [newDayLimit, dateObj.getMonth(), dateObj.getFullYear()]);
        $('.calendar-overview').attr('class') != 'calendar-overview' && initWeekView($('.calendar-month-wrp.active .day:contains(1)').first());
    }

    var setYear = function () {
        $('.calendar-years-view-wrp .year').removeClass('active');
        $(this).addClass('active');
        $('#calendar-wrp').data('currentDate')[2] = $(this).text();
        $('.calendar-controls-wrp .calendar-month-year').text($(this).text());
        $('.calendar-controls-wrp .calendar-year-range').fadeOut('fast', function () {
            $('.calendar-controls-wrp').removeClass('years-view').find('.calendar-month-year').stop().animate({
                width: 'show'
            }, {
                duration: 'fast',
                complete: function () {
                    $('.calendar-controls-wrp .calendar-month-year').css('width', 'auto');
                }
            });
        });
        $('.calendar-overview .calendar-years-view-wrp').fadeOut('fast').removeClass('entering').find('.year').removeClass('this-year active');
        setTimeout(function () {
            $('.calendar-overview .calendar-months-view-wrp').fadeIn().removeClass('leaving');
        }, 300)
    }

    var scrollToMonth = function (month) {
        var fullScroll = month.width(),
            allCalendars = month.prevAll().length,
            relativePosLeft = allCalendars * fullScroll;
        $('.calendar-month-wrp').removeClass('active');
        month.addClass('active');
        $('#calendar-wrp .calendar-months-body-wrp').stop().animate({
            scrollLeft: roundToNearestValue(fullScroll, relativePosLeft)
        }, function () {
            creatingCalendar = false;
        });
    }

    var scrollToYear = function () {
        var fullScroll = $('.calendar-years-view-wrp').width(),
            allRanges = $('.calendar-years-view-wrp .years-range-wrp.active').prevAll().length,
            relativePosLeft = allRanges * fullScroll;
        $('.calendar-years-view-wrp').stop().animate({
            scrollLeft: roundToNearestValue(fullScroll, relativePosLeft)
        }, function () {
            creatingRange = false;
        });
    }

    var posWeekIndicator = function (day) {
        var dayPos = day.position().top,
            current = $('#calendar-wrp').data('currentDate');
        $('.week-indicator').stop().animate({
            top: dayPos
        });
        updateWeekNumber(new Date(current[2], current[1], day.text().trim()));
    }

    var updateDay = function (currentMonth, dayDate, year) {
        $('#calendar-wrp .calendar-today>span').stop().animate({
            opacity: 0
        }, {
            duration: 150,
            complete: function () {
                $('#calendar-wrp .calendar-today .calendar-month-name').text(currentMonth);
                $('#calendar-wrp .calendar-today .calendar-month-day').text(dayDate);
                $('#calendar-wrp .calendar-today .ordinal-indicator').text(getOrdinalIndicator(dayDate));
                $('#calendar-wrp .calendar-today .calendar-month-year').text(year);
                $('#calendar-wrp .calendar-today>span').stop().animate({
                    opacity: 1
                }, {
                    duration: 150
                });
            }
        });
    }

    var updateCalControls = function (year) {
        $('.calendar-controls-wrp .calendar-today>span').stop().animate({
            opacity: 0
        }, {
            duration: 150,
            complete: function () {
                $('.calendar-controls-wrp .calendar-today .calendar-month-year').text(year);
                $('.calendar-controls-wrp .calendar-today .calendar-year-range').text(year);
                $('#calendar-wrp .calendar-today>span').stop().animate({
                    opacity: 1
                }, {
                    duration: 150
                });
            }
        });
    }

    var updateWeekNumber = function (date) {
        var weekNumber = getWeekNumber(date);
        if ($('.week-indicator span').text() == weekNumber) return;
        $('.week-indicator span').fadeOut(150, function () {
            $(this).text(weekNumber).fadeIn(150);
        })
    }

    var generateYearsView = function (startFrom, endAt, yearPrev, insertBefore) {
        var yearsRangeWrp = $('<div class="years-range-wrp"></div>');
        insertBefore != undefined ? yearsRangeWrp.insertBefore(insertBefore) : $('.calendar-overview .calendar-years-view-wrp').append(yearsRangeWrp);
        for (var i = startFrom; i <= endAt; i++) {
            yearsRangeWrp.append('<div class="calendar-unit year">\n<div>' + i + '</div>\n</div>');
        }
        yearsRangeWrp.data({
            'startFrom': startFrom,
            'endAt': endAt
        });
        updateCalControls(startFrom + ' - ' + endAt);
        $('.calendar-overview .calendar-years-view-wrp .years-range-wrp').removeClass('active');
        yearsRangeWrp.addClass('active');
        if (yearPrev) {
            var fullScroll = $('.calendar-overview .calendar-years-view-wrp').width(),
                actualScroll = $('.calendar-overview .calendar-years-view-wrp').scrollLeft();
            $('.calendar-overview .calendar-years-view-wrp').scrollLeft(roundToNearestValue(fullScroll, (actualScroll + fullScroll)));
        }
        scrollToYear();
        yearsCreated.push(startFrom, endAt);
        yearsCreated.sort(function (a, b) {
            return a - b
        });
    }

    var initCalendar = function () {
        var date = new Date(),
            monthPrev = false,
            prevCalendar = undefined;
        if (arguments.length) {
            date = arguments[0];
            prevCalendar = arguments[1],
                monthPrev = arguments[2];
            var current = $('#calendar-wrp').data('currentDate')[0];
            date.setDate(ifCurrentExceedsOther(date, current));
        }
        var year = date.getFullYear(),
            month = date.getMonth(),
            dayDate = date.getDate(),
            firstDayIndex = new Date(year + '-' + (month + 1) + '-01').getDay(),
            currentMonth = monthNames[month],
            days = getDaysInMonth(year, month),
            emptyDays = [];
        emptyDays[firstDayIndex] = 1;
        var monthView = $('<div class="calendar-month-wrp"></div>');
        prevCalendar != undefined ? monthView.insertBefore(prevCalendar) : $('#calendar-wrp .calendar-months-body-wrp').append(monthView);
        monthView.append('<div class="day calendar-unit">\n<div>' + emptyDays.join('</div>\n</div>\n<div class="day calendar-unit">\n<div>') + '</div\ndiv>\n');
        for (var i = 2; i <= days; i++) {
            monthView.append('<div class="day calendar-unit">\n<div>' + i + '</div>\n</div>\n');
        }
        monthsCreated.push(new Date(year, month));
        monthsCreated.sort(function (a, b) {
            return a - b
        });
        $('#calendar-wrp').data('currentDate', [dayDate, month, year]);
        $('#calendar-wrp .calendar-month-wrp,#calendar-wrp .calendar-month-wrp .day').removeClass('active');
        monthView.data({
            'year': year,
            'month': month,
            'monthName': currentMonth,
            'day': dayDate,
            'totalDays': days
        }).addClass('active').find('.day:contains(' + dayDate + ')').first().addClass('active');
        if (!todaySet) {
            todaySet = true;
            $('#calendar-wrp').data('thisDate', date.toDateString().split(' '));
            monthView.addClass('current-month').find('.day:contains(' + dayDate + ')').first().addClass('today').click();
        }
        updateDay(currentMonth, dayDate, year);
        if (monthPrev) {
            var fullScroll = monthView.width(),
                actualScroll = $('#calendar-wrp .calendar-months-body-wrp').scrollLeft();
            $('#calendar-wrp .calendar-months-body-wrp').scrollLeft(roundToNearestValue(fullScroll, (actualScroll + fullScroll)));
        }
        scrollToMonth(monthView);
    }

    var initWeekView = function (dayInWeek) {
        var weekPos = dayInWeek.position().top,
            dayActive = $('.calendar-month-wrp.active .day.active').index() % 7,
            thisWeek = $('.calendar-month-wrp.active .day').filter(function () {
                return $(this).position().top == weekPos;
            }),
            posWeekDayIndex = ceilToNearestValue(6,dayInWeek.index());
            posWeekDayIndex == 0 &&(posWeekDayIndex = 6);
        $('.calendar-month-wrp.active .day').removeClass('this-week active');
        if ($('.calendar-overview.weekend-view').length) {
            if (thisWeek.length < 5) {
                var index = dayInWeek.index(),
                    dayInLastWeek = $('.calendar-month-wrp.active .day').eq(index - 7);
                return initWeekView(dayInLastWeek);
            }
            if (dayActive < 4) dayActive = 4;
        }
        if (thisWeek.length > 4 && thisWeek.eq(dayActive).text().trim() == '') {
            while (thisWeek.eq(dayActive).text().trim() == '' && dayActive < 6) {
                dayActive++;
            }
        }
        thisWeek.addClass('this-week').eq(dayActive).addClass('active').click();
        //dayInWeek = $('.calendar-month-wrp.active .day').eq(posWeekDayIndex);
        posWeekIndicator(dayInWeek);
    }

    var setCalendarDate = function () {
        var _this = $(this);
        $('#calendar-wrp .calendar-month-wrp .day').removeClass('active');
        _this.addClass('active');
        $('#calendar-wrp').data('currentDate')[0] = Number(_this.text());
        if ($('.calendar-overview').hasClass('weekend-view')) {
            var tabIndex = (_this.index() % 7) - 4;
            $('#weekend-view .tabs-items li').eq(tabIndex).click();
        } else if ($('.calendar-overview').hasClass('week-view')) {
            $('#week-view .tabs-items li').eq(_this.index() % 7).click();
        }
        $('h3.calendar-today .calendar-month-day,h3.calendar-today .ordinal-indicator').stop().animate({
            opacity: 0
        }, {
            duration: 150,
            complete: function () {
                $('h3.calendar-today .calendar-month-day').text(_this.text().trim());
                $('h3.calendar-today .ordinal-indicator').text(getOrdinalIndicator(_this.text().trim()));
                $('h3.calendar-today .calendar-month-day,h3.calendar-today .ordinal-indicator').animate({
                    opacity: 1
                }, {
                    duration: 150
                });
            }
        });
    }

    var setWeek = function (e) {
        if (e.which == 1 || e.which == 0) {
            e.preventDefault();
            var startGrab = e.pageY || e.originalEvent.touches[0].pageY,
                indicatorBasePos = parseInt($('.week-indicator').css('top'), 10),
                stopIndicatorDrag = function (e) {
                    var dayHeight = $('.day').height(),
                        mouseUpPos = e.pageY || e.originalEvent.changedTouches[0].pageY,
                        hoveredWeek = $('.calendar-month-wrp.active .day').filter(function () {
                            return mouseUpPos > $(this).offset().top;
                        }).last();
                    if (!hoveredWeek.length) hoveredWeek = $('.day:contains(1)').first();
                    initWeekView(hoveredWeek);
                    $('#calendar-wrp').off('mousemove mouseup mouseleave touchmove touchend');
                };
            $('#calendar-wrp').on('mousemove touchmove', function (e) {
                var updatedPos = startGrab - (e.pageY || e.originalEvent.changedTouches[0].pageY);
                $('.week-indicator').css('top', indicatorBasePos - updatedPos);
                $('#calendar-wrp').on('mouseup mouseleave touchend', stopIndicatorDrag)
            });
        }
    }

    var switchViews = function (calendarView) {
        if (calendarView == 'today') {
            $('#month-view').siblings().slideUp(150, function () {
                $('#month-view').slideDown(150);
                $('.calendar-this .this-day').siblings().fadeOut(function () {
                    $('.calendar-this .this-day').fadeIn();
                });
            });
            $('.calendar-overview').attr('class', 'calendar-overview');
        } else if (calendarView == 'weekend') {
            $('#weekend-view').siblings().slideUp(150, function () {
                $('#weekend-view').slideDown(150, function () {
                    var weekIndex = ceilToNearestValue(6,$('.calendar-month-wrp .day.active').index());
                    if(weekIndex == 0) weekIndex = 6;
                    initWeekView($('.calendar-month-wrp .day').eq(weekIndex));
                    $('.calendar-this .this-weekend').siblings().fadeOut(function () {
                        $('.calendar-this .this-weekend').fadeIn();
                    });
                });
            });
            $('.calendar-overview').attr('class', 'calendar-overview weekend-view');
        } else {
            $('#week-view').siblings().slideUp(150, function () {
                $('#week-view').slideDown(150, function () {
                    var weekIndex = Math.floor(Math.ceil($('.calendar-month-wrp .day.active').index() / 6.9) * 6.9);
                    initWeekView($('.calendar-month-wrp .day').eq(weekIndex));
                    $('.calendar-this .this-week').siblings().fadeOut(function () {
                        $('.calendar-this .this-week').fadeIn();
                    })
                });
            });
            $('.calendar-overview').attr('class', 'calendar-overview week-view');
        }
    }

    //Views controls
    $('.calendar-views-wrp p').on('click', function () {
        var spanLeft = $(this).find('span').position().left,
            spanWidth = $(this).find('span').width(),
            spanHeight = $(this).find('span').height(),
            calendarView = $(this).text().toLowerCase().trim();
        $('.calendar-views-index').css({
            left: spanLeft,
            width: spanWidth,
            height: spanHeight
        });
        $(this).addClass('active').siblings().removeClass('active');
        switchViews(calendarView);
    });
    $('.calendar-this .control-btn').on('click', function () {
        var currentMonth = $('.current-month'),
            currentMonthData = currentMonth.data();
        scrollToMonth(currentMonth);
        updateDay(currentMonthData.monthName, currentMonthData.day, currentMonthData.year);
        posWeekIndicator($('.day.today'));
        $('.day.today').click();

    })
    $('#calendar-wrp .calendar-months-body-wrp').off().on('click', '.day:not(:empty)', setCalendarDate);
    //Month view
    $('.calendar-controls-wrp .calendar-prev').on('click', function (e) {
        if (creatingCalendar) return;
        creatingCalendar = true;
        var monthData = $('#calendar-wrp .calendar-month-wrp.active').data(),
            year = monthData.year,
            month = monthData.month,
            prevMonth = new Date(year, month - 1);
        setMonth(e, prevMonth);
    });
    $('.calendar-controls-wrp .calendar-next').on('click', function (e) {
        if (creatingCalendar) return;
        creatingCalendar = true;
        var monthData = $('#calendar-wrp .calendar-month-wrp.active').data(),
            year = monthData.year,
            month = monthData.month,
            nextMonth = new Date(year, month + 1);
        setMonth(e, nextMonth);
    });
    //Year View
    $('.calendar-controls-wrp .year-prev').on('click', function () {
        var prevYear = Number($('.calendar-controls-wrp .calendar-today .calendar-month-year').text()) - 1;
        $('#calendar-wrp').data('currentDate')[2] = prevYear;
        updateCalControls(prevYear);
    })
    $('.calendar-controls-wrp .year-next').on('click', function () {
        var nextYear = Number($('.calendar-controls-wrp .calendar-today .calendar-month-year').text()) + 1;
        $('#calendar-wrp').data('currentDate')[2] = nextYear;
        updateCalControls(nextYear);
    })
    //Year Range View
    $('.calendar-controls-wrp .year-range-prev').on('click', function () {
        var rangeStart = $('.calendar-years-view-wrp .years-range-wrp.active').data('startFrom') - 12,
            checkYearBefore = checkYearRangeBefore(rangeStart);
        if (checkYearBefore != false)
            generateYearsView(checkYearBefore[0], checkYearBefore[1], checkYearBefore[2], checkYearBefore[3]);
        $('.calendar-overview .calendar-years-view-wrp .year').removeClass('active');
        $('.calendar-overview .calendar-years-view-wrp .year:contains(' + rangeStart + ')').addClass('active');
    });
    $('.calendar-controls-wrp .year-range-next').on('click', function () {
        var rangeStart = $('.calendar-years-view-wrp .years-range-wrp.active').data('endAt') + 1,
            checkYearBefore = checkYearRangeBefore(rangeStart);
        if (checkYearBefore != false)
            generateYearsView(checkYearBefore[0], checkYearBefore[1], checkYearBefore[2], checkYearBefore[3]);
        $('.calendar-overview .calendar-years-view-wrp .year').removeClass('active');
        $('.calendar-overview .calendar-years-view-wrp .year:contains(' + rangeStart + ')').addClass('active');
    });
    $('.calendar-controls-wrp .calendar-today').on('click', switchControlView);
    //set Month
    $('.calendar-months-view-wrp .month').on('click', setMonth);
    //set Year
    $('.calendar-years-view-wrp').on('click', '.year', setYear);
    //setWeek
    $('.week-indicator').on('mousedown touchstart', setWeek);

    initCalendar();
    if (calendarView != 'today') {
        var weekIndex = Math.floor(Math.ceil($('.day.today').index() / 6.9) * 6.9);
        initWeekView($('.day').eq(weekIndex));
    }
    switchViews(calendarView);
    $('.calendar-views-wrp p').filter(function () {
        return $(this).text().trim().toLowerCase() == calendarView
    }).click();
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

//showOnScroll
var showOnScroll = function () {
    var checkPos = function () {
        $('.show-onscroll').each(function () {
            if ($(this).hasClass('active') || !$(this).is(':visible')) return;
            var docScroll = $(document).scrollTop(),
                posTop = $(this).offset().top - docScroll,
                startFadeIn = $(window).height() * .75;
            if (posTop < startFadeIn) {
                $(this).addClass('active');
            }
        });
    }
    checkPos();
    $(document).scroll(checkPos);
}

//initTextScroll
var initTextScroll = function () {
    var distributeOpacity = function () {
        $('.text-scroll .text-scroll-unit-content>*').each(function () {
            var docScroll = $(document).scrollTop(),
                posTop = $(this).offset().top - docScroll,
                startFadeIn = $(window).height() * .65,
                startFadeOut = $(window).height() * .3,
                newOpacity;
            if (posTop < startFadeIn) {
                if (posTop > startFadeOut) {
                    newOpacity = 1;
                } else {
                    newOpacity = 1 - Math.abs(((posTop - startFadeOut) / 150));
                }
            } else {
                newOpacity = 1 - Math.abs(((startFadeIn - posTop) / 150));
            }
            $(this).css('opacity', newOpacity)
        });
    }
    distributeOpacity();
    $(document).scroll(distributeOpacity);
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
    // var ifOpen = oppeningHours.filter(v => timeString > v[0] && timeString < v[1]);
    var ifOpen = oppeningHours.filter(function (v) {
        return timeString > v[0] && timeString < v[1];
    });
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
    if (location.pathname == "/") return;
    var cat = $('body').attr('class').split(' ')[0].replace('-theme', '');
    if (cat != null && cat != 'null')
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
    adContainer.width(adContainer.parent().width());
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
        if (!IsDetailsGalleryPaused && !$('#lightbox-popup').hasClass('active')) {
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
var sliderMainImage = $('#lightbox-popup').find('.slider-main-image').not('.cloned');
var imgSmallSliderContainer = $('#lightbox-popup').find('.img-small-slider-container');
var lastScreenSize = 0;
console.log(lastScreenSize);

//Draw popup gallery slider
var DrawPopupGallery = function (galleryList, activeImgIndex) {
    PopupGallerySlides = Array.from(galleryList);
    PopulateGalleryPopup();
    DisplayClickedPopupGalleryItem(activeImgIndex);
    ActivateGalleryPopup();
    $('html,body').addClass('popup-in-motion');
    $('#lightbox-popup').find('.default-close-btn').off().on('click', function () {
        $('#lightbox-popup').removeClass('active');
        setTimeout(function () {
            $('#lightbox-popup').removeAttr('class');
            DestroyPopupGallery();
        }, 300);
    });
}

//Initialize popup gallery slider
var InitPopupGallery = function () {
    if (lastScreenSize != newScreenSize) {
        if (newScreenSize == 1) {
            imgSmallSliderContainer.find('img').off().on('click', function () {
                DisplayClickedPopupGalleryItem($(this).attr('popup-slide-data-index'));
            });
            $('#lightbox-popup').find('.slider-nav-next').off().on('click', function () {
                NextPopupGalleryItem();
            });
            $('#lightbox-popup').find('.slider-nav-prev').off().on('click', function () {
                PrevPopupGalleryItem();
            });
            $('.slider-count span').html((parseInt(PopupImgToDisplayIndex) + 1) + ' / ' + PopupGallerySlides.length);
        } else {
            imgSmallSliderContainer.find('img').off();
            $('#lightbox-popup').find('.slider-nav-next,.slider-nav-prev').off();
            $('.slider-count span').html(PopupGallerySlides.length + ' Photos');
        }
        lastScreenSize = CalcLastScreenSize(lastScreenSize);
    }
}

//Destroy popup gallery slide
var DestroyPopupGallery = function () {
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
    sliderMainImage = $('#lightbox-popup').find('.slider-main-image').not('.cloned');
    PopupImgToDisplay = PopupGallerySlides[imageIndex];
    MoveGalleryPopupSlider(parseInt(PopupImgToDisplayIndex), parseInt(imageIndex));
    PopupImgToDisplayIndex = imageIndex;
    //sliderMainImage.attr('src', PopupImgToDisplay.src).attr('alt', PopupImgToDisplay.title).attr('popup-main-data-index', PopupImgToDisplayIndex);
    sliderMainImage.clone().addClass('cloned').prependTo("#lightbox-popup .slider-main-slide-wrp");
    sliderMainImage.hide().delay(100).queue(function () {
        sliderMainImage.attr('src', PopupImgToDisplay.src).fadeIn(100).attr('alt', PopupImgToDisplay.title).attr('popup-main-data-index', PopupImgToDisplayIndex).dequeue();
        $('#lightbox-popup').find('.slider-main-image.cloned').delay(100).queue(function () {
            $(this).remove().dequeue();
        });
    });
    if (newScreenSize == 1) {
        $('.slider-count span').html((parseInt(PopupImgToDisplayIndex) + 1) + ' / ' + PopupGallerySlides.length);
    } else {
        $('.slider-count span').html(PopupGallerySlides.length + ' Photos');
    }
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
    $('#lightbox-popup').addClass('active image-slider');
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

//Search Autocomplete
var SearchAutocomplete = function () {
    if ($('#popup-base .autocomplete-keywords li').length && !$('#popup-base .autocomplete-keywords').hasClass('opened')) {
        $('#popup-base .autocomplete-keywords').addClass('opened').stop().slideDown('fast');
    } else if (!$('#popup-base .autocomplete-keywords li').length && $('#popup-base .autocomplete-keywords').hasClass('opened')) {
        $('#popup-base .autocomplete-keywords').removeClass('opened').stop().slideUp('fast');
    }
    $('#popup-base .autocomplete-keywords li').on('click', function () {
        var keywordVal = $(this).text();
        $('#popup-base .search-input input').val(keywordVal);
        $('#popup-base .autocomplete-keywords').removeClass('opened').slideUp('fast');
        $('#popup-base .search-input a').click();
    })
    var searchKeyWord = $(this).val(),
        keywordRegExp = new RegExp("(" + searchKeyWord + ")", "gi"),
        allKeywordsHeights = 0;
    $('#popup-base .autocomplete-keywords li').each(function () {
        var autocompleteText = $(this).text();
        $(this).text(autocompleteText);
        allKeywordsHeights += $(this).outerHeight();
        var ifMatch = autocompleteText.match(keywordRegExp);
        if (ifMatch != null) {
            var matchRegExp = new RegExp("(" + ifMatch[0] + ")", "gi"),
                highlightedKeywords = $(this).text().replace(matchRegExp, function (x) {
                    return '<span class="bold">' + x + '</span>';
                });
            $(this).html(highlightedKeywords);
        }
    });
    $('#popup-base .autocomplete-keywords').stop().animate({
        height: allKeywordsHeights
    }, {
        duration: 'fast'
    })
}

//Change selected category
var ChangeSelectedCat = function (obj) {
    $('.search-input-filter-wrp .search-filter-menu').find('li').removeClass('active');
    var selectedCat = obj.closest('li').addClass('active').text().trim();
    $('.search-filter-display').text(selectedCat);
    $('.search-input-filter-wrp').removeClass('active');
}

//Category dropdown initiation
var InitCatDropdown = function () {
    if ($('.search-input-filter-wrp').length) {
        $('.search-input-filter-wrp').find('.search-filter-display').off().on('click', function () {
            $('.search-input-filter-wrp').toggleClass('active');
        });
        $('.search-input-filter-wrp .search-filter-menu').find('a').off().on('click', function () {
            ChangeSelectedCat($(this));
        });
    }
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

//---------------------------------------------------------------------------------------------------
//initDetailsCarousel
var detailsCarousel = function () {
    var detailsNext = $('<div class="details-carousel-controls details-carousel-next"><i class="icon-right-chevron"></i></div>'),
        detailsPrev = $('<div class="details-carousel-controls details-carousel-prev"><i class="icon-left-chevron"></i></div>'),
        detailsNav = $('<div class="details-carousel-nav"></div>'),
        detailsItemsLength = $('.details-carousel-item-wrp').length,
        moving = false,
        detailsCarouselAuto;
    $('.details-carousel-item-wrp').first().show().addClass('active');
    $('.details-carousel').append(detailsNext, detailsPrev, detailsNav);
    for (var i = 0; i < detailsItemsLength; i++) {
        detailsNav.append('<div class="details-carousel-dot"></div>');
    }
    $('.details-carousel-dot').first().addClass('active');

    var setActiveItem = function (index) {
        if (moving) return;
        moving = true;
        $('.details-carousel-item-wrp.active').removeClass('active').addClass('leaving-left').delay(1050).fadeOut(1, function () {
            $(this).removeClass('leaving-left');
            moving = false;
        });
        $('.details-carousel-item-wrp').eq(index).addClass('active').show();
        $('.details-carousel-dot').removeClass('active');
        $('.details-carousel-dot').eq(index).addClass('active');
    }

    $('.details-carousel-dot').on('click', function () {
        var index = $(this).index();
        if ($('.details-carousel-item-wrp.active').index() == index) return;
        setActiveItem(index);
    })

    detailsNext.on('click', function () {
        var index = $('.details-carousel-item-wrp.active').index() + 1;
        if (index == detailsItemsLength) index = 0;
        setActiveItem(index);
    });

    detailsPrev.on('click', function () {
        var index = $('.details-carousel-item-wrp.active').index() - 1;
        if (index == -1) index = detailsItemsLength - 1;
        setActiveItem(index);
    });

    detailsCarouselAuto = setInterval(function () {
        detailsNext.click();
    }, 5000);
    $('.details-carousel').on('mouseenter touchstart', function () {
        clearInterval(detailsCarouselAuto);
    });
    $('.details-carousel').on('mouseleave touchend', function () {
        detailsCarouselAuto = setInterval(function () {
            detailsNext.click();
        }, 5000);
    });
};

//-------------------------------------------------------------------------------------------------
//FAQs category expand
var ExpandFaqCat = function (obj) {
    var faqCatClicked = obj.closest('.faq-category');
    $('.faq-category').not(faqCatClicked).removeClass('active').find('.faq-wrp').slideUp();
    faqCatClicked.toggleClass('active').find('.faq-wrp').slideToggle(300);
}

//Search in FAQs
var SearchFaq = function (searchWord) {
    $('.faq-search-results').html('');
    var searchWordRegex = new RegExp("(" + searchWord + ")", "gi"),
        haveRes = false;
    $('.faq-category-wrp .faq-item').each(function () {
        var item = $(this).clone(),
            title = item.find('h3'),
            desc = item.find('p'),
            titleMatch = title.text().match(searchWordRegex),
            descMatch = desc.text().match(searchWordRegex);
        if (searchWord != '' && searchWord != null && searchWord != undefined) {
            $('.faq-category-wrp').hide();
            $('.faq-search-result-wrp').show();
            if (titleMatch != null || descMatch != null) {
                haveRes = true;
                titleHighlightedKeywords = title.text().replace(searchWordRegex, function (x) {
                    return '<span class="mark">' + x + '</span>';
                });
                descHighlightedKeywords = desc.text().replace(searchWordRegex, function (x) {
                    return '<span class="mark">' + x + '</span>';
                });
                title.html(titleHighlightedKeywords);
                desc.html(descHighlightedKeywords);
                item.appendTo('.faq-search-results');
            }
            if (haveRes) {
                $('.no-results-item').hide();
            } else {
                $('.no-results-item').show();
            }
        } else {
            $('.faq-search-result-wrp').hide();
            $('.faq-category-wrp').show();
        }
    });
}

var windowLoaded = false;
//document ready
$(document).ready(function () {
    if ($('.items-list-wrp').length && $('.items-list-wrp').find('.ads-wrp').length) {
        $('.items-list-wrp').css('min-height', $('.ads-wrp').height());
    }
    //Ripple Effect
    if ($('.ripple').length) {
        $('.ripple').on('click', function (e) {
            rippleEffect(e, $(this));
        });
    }

    //Details Carousel
    if ($('.details-carousel').length) detailsCarousel();

    //Header
    var header = $('header'),
        breakPos = header.height(),
        scrollPos = $(this).scrollTop();
    TransformHeader(scrollPos, breakPos);
    if ($('.account-wrp').length) {
        $('.account-wrp a').on('click', function () {
            $(this).closest('.account-wrp').toggleClass('active');
        });
    }
    ManipulateMainNav();
    if ($('.burger-menu-btn-wrapper').length) {
        $('.burger-menu-btn-wrapper').off().on('click', function () {
            ToggleMainNav();
        });
    }
    newScreenSize = CalcLastScreenSize(newScreenSize);
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
        if ($('.search-input-filter-wrp').length) {
            $('.search-input-filter-wrp').removeClass('active');
        }
        $('html,body').removeClass('popup-in-motion');
    });

    $('#popup-base .search-input input').on('keyup', SearchAutocomplete);

    $('#popup-base .search-input input').on('blur', function () {
        $('#popup-base .autocomplete-keywords').removeClass('opened').slideUp('fast');
    });
    InitCatDropdown();

    if ($('#lightbox-popup').length) {
        $('#lightbox-popup .default-close-btn').off().on('click', function () {
            $('#lightbox-popup').removeClass('active');
            setTimeout(function () {
                $('#lightbox-popup').removeAttr('class');
            }, 300);
        })
    }

    if ($('.open-location-box').length && $('#lightbox-popup').length) {
        $('.open-location-box').on('click', function (e) {
            e.preventDefault();
            $('#lightbox-popup').addClass('active location-map');
        });
    }

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

    if ($('.facilities-wrp').length) getSvg('.facility-unit');

    if ($('.opening-hours-container').length) isOpen();

    if ($('.general-rating-container').length) ratingCircleResult();

    // showOnScroll
    if ($('.show-onscroll').length) showOnScroll();

    //initTypewriter
    if ($('[data-typewriter]').length) initTypewriter();

    //Text Scroll
    if ($('.text-scroll').length) initTextScroll();

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
        var carouselItemCount = $('#main-carousel .carousel-item').length,
            carouselDrag = false,
            carouselBasePos = 0,
            carouselPosDiff = 0,
            carouselScrollLeft = 0,
            activeItemIndex = 2,
            carouselAnimation = false,
            scrollingOnCarousel = false,
            documentScrollOnTouch = 0;
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
                    $('#main-carousel .carousel-container,#main-carousel .carousel-data').stop();
                    carouselDrag = true;
                    fullScroll = $('#main-carousel .carousel-item:first-child').width();
                    carouselItemTarget = $(e.target).closest('.carousel-item');
                    activeItemIndex = carouselItemTarget.index() + 1;
                    var test = $('#main-carousel .carousel-data').not($(carouselItemTarget).find('.carousel-data'));
                    carouselBasePos = e.pageX || e.originalEvent.touches[0].pageX;
                    carouselScrollLeft = $(this).scrollLeft();
                    documentScrollOnTouch = $(document).scrollTop();
                }
            });
            $('#main-carousel .carousel-container').on('mousemove touchmove', function (e) {
                if (carouselDrag && !scrollingOnCarousel) {
                    if ($(document).scrollTop() != documentScrollOnTouch) {
                        scrollingOnCarousel = true;
                        return;
                    }
                    entered = false;
                    activeItemIndex = carouselItemTarget.index();
                    carouselPosDiff = carouselBasePos - (e.pageX || e.originalEvent.changedTouches[0].pageX);
                    carouselItemTarget.find('.carousel-data').css('left', carouselPosDiff * -1.2 + 'px');
                    if (Math.abs(carouselPosDiff) < 30) return;
                    e.preventDefault();
                    if (carouselPosDiff > 0) {
                        if (activeItemIndex == (carouselItemCount - 1) && !entered) {
                            $('#main-carousel .carousel-container').scrollLeft(fullScroll);
                            carouselScrollLeft = fullScroll;
                            carouselItemTarget = $('#main-carousel .carousel-item:nth-child(2)')
                            entered = true;
                        }
                        carouselItemTarget.next().find('.carousel-data').css('left', fullScroll - (carouselPosDiff * .5) + 'px');
                    } else {
                        if (activeItemIndex == 0 && !entered) {
                            $('#main-carousel .carousel-container').scrollLeft((carouselItemCount - 2) * fullScroll);
                            carouselItemTarget = $('#main-carousel .carousel-item:nth-last-child(2)')
                            carouselScrollLeft = (carouselItemCount - 2) * fullScroll;
                            entered = true;
                        }
                        carouselItemTarget.prev().find('.carousel-data').css('left', -650 - (carouselPosDiff * .5) + 'px');
                    }
                    $(this).scrollLeft(carouselScrollLeft + carouselPosDiff);
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
                    }, {
                        duration: 600,
                        easing: 'easeOutExpo'
                    });
                    activeScrollItem.next().find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').stop().animate({
                        left: 0
                    }, {
                        duration: 850,
                        easing: 'easeOutExpo'
                    });
                    $('.carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll + fullScroll) / fullScroll)
                    }, {
                        duration: 750,
                        easing: 'easeOutExpo',
                        complete: function () {
                            setTimeout(function () {
                                $('.carousel-data').css('left', '0px');
                            }, 150);
                            carouselAnimation = false;
                        }
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
                    }, {
                        duration: 600,
                        easing: 'easeOutExpo'
                    });
                    activeScrollItem.prev().find('.carousel-data').css('left', '-650px').delay(150).queue(function () {
                        $(this).stop().animate({
                            left: 0
                        }, {
                            duration: 500,
                            easing: 'easeOutExpo'
                        }).dequeue();
                    })
                    $('#main-carousel .carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll - fullScroll) / fullScroll)
                    }, {
                        duration: 600,
                        easing: 'easeOutExpo',
                        complete: function () {
                            $('#main-carousel .carousel-data').css('left', '0px');
                            carouselAnimation = false;
                        }
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
                        }, {
                            duration: 600,
                            easing: 'easeOutExpo'
                        });
                        newActiveScrollItem.find('.carousel-data').css('left', ((fullScroll * 3) / 4) + 'px').stop().animate({
                            left: 0
                        }, {
                            duration: 600,
                            easing: 'easeOutExpo'
                        });
                    } else {
                        activeScrollItem.find('.carousel-data').stop().animate({
                            left: fullScroll
                        }, {
                            duration: 400,
                            easing: 'easeOutExpo'
                        });
                        newActiveScrollItem.find('.carousel-data').css('left', '-650px').delay(50).queue(function () {
                            $(this).stop().animate({
                                left: 0
                            }, {
                                duration: 600,
                                easing: 'easeOutExpo'
                            }).dequeue();
                        })
                    }
                    $('#main-carousel .carousel-container').stop().animate({
                        scrollLeft: fullScroll * Math.round((actualScroll + targetItemPos) / fullScroll)
                    }, {
                        duration: 400,
                        easing: 'easeOutExpo',
                        complete: function () {
                            carouselAnimation = false;
                            setTimeout(function () {
                                $('.carousel-data').css('left', '0px');
                            }, 200);
                        }
                    });
                    activeItemIndex = indexValue;
                }
            });

            // Automatic Scroll
            var carouselAuto = setInterval(moveNext, 5000);
            $('#main-carousel').on('mouseenter touchstart', function () {
                clearInterval(carouselAuto);
            });
            $('#main-carousel').on('mouseleave touchend', function () {
                carouselAuto = setInterval(moveNext, 5000);
            });
        }
    }
    // End of Carousel

    //Start of Things to Do
    if ($('#wtd').length) {
        $('#wtd .wtd-container div[class^=wtd]').on('mouseenter', function () {
            if (ifNotDesktop()) return;
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
        $('#best-spots .best-frame-container:first,#best-spots .best-frame-container:first .best-item:first').addClass('active');
        $('#best-spots .best-frame-container .best-image-frame').on('click', function () {
            $('#best-spots .best-frame-container .best-item').removeClass('active shadow');
            var parentItem = $(this).closest('.best-item');
            parentItem.addClass('active');
            if (parentItem.index() == 1) parentItem.siblings().addClass('shadow');
        });
        $('#best-spots .best-controls .best-previous').on('click', function () {
            if (!bestAnimaion) {
                var _this = $(this);
                _this.addClass('clicked');
                bestAnimaion = true;
                if (actualFrameIndex == 0)
                    actualFrameIndex = bestFrameCount;
                $('#best-spots .best-frame-container').addClass('leaving').delay(700).queue(function () {
                    $('#best-spots .best-frame-container .best-item').removeClass('active shadow');
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
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex - 1) + ') .best-item:first').addClass('active');
                    actualFrameIndex--;
                }, 700);
            }
        });
        $('#best-spots .best-controls .best-next').on('click', function () {
            if (!bestAnimaion) {
                var _this = $(this);
                _this.addClass('clicked');
                bestAnimaion = true;
                if (actualFrameIndex == (bestFrameCount + 1))
                    actualFrameIndex = 1;
                $('#best-spots .best-frame-container').addClass('leaving').delay(1000).queue(function () {
                    $('#best-spots .best-frame-container .best-item').removeClass('active shadow');
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
                    $('#best-spots .best-frame-container:nth-of-type(' + (actualFrameIndex + 1) + ') .best-item:first').addClass('active');
                    actualFrameIndex++;
                }, 1000);
            }
        });

        //Mobile Best Controls
        var bestSwipe = false,
            bestTouchStart = 0;
        $('.best-spots-body').on('touchstart', function (e) {
            if ($(window).width() >= 640) return;
            bestSwipe = true;
            bestTouchStart = e.originalEvent.touches[0].pageX;
        });
        $('#best-spots .mobile-best-controls .mobile-best-prev').on('click', function () {
            var _this = $(this),
                bestFullScroll = $('.best-spots-body').width(),
                bestActualScroll = $('.best-spots-body').scrollLeft(),
                bestMaxScroll = $('.best-spots-body')[0].scrollWidth - $('.best-spots-body').width();
            $('.best-spots-body').stop().animate({
                scrollLeft: roundToNearestValue(bestFullScroll, (bestActualScroll - bestFullScroll))
            }, function () {
                $('#best-spots .mobile-best-controls div').removeClass('last');
                if ($('.best-spots-body').scrollLeft() == 0) _this.addClass('last');
            });
        });
        $('#best-spots .mobile-best-controls .mobile-best-next').on('click', function () {
            var _this = $(this),
                bestFullScroll = $('.best-spots-body').width(),
                bestActualScroll = $('.best-spots-body').scrollLeft(),
                bestMaxScroll = $('.best-spots-body')[0].scrollWidth - $('.best-spots-body').width();
            $('.best-spots-body').stop().animate({
                scrollLeft: roundToNearestValue(bestFullScroll, (bestActualScroll + bestFullScroll))
            }, function () {
                $('#best-spots .mobile-best-controls div').removeClass('last');
                if ($('.best-spots-body').scrollLeft() == bestMaxScroll) _this.addClass('last');
            });
        });
        //End of Mobile Best Controls
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
    if ($('#item-gallery-init').length) InitDetailsGallerySlider();

    //Tabs component
    if ($('.tabs-global-container').length) {
        $('.tabs-global-container ul.tabs-content-container li:not(".active")').hide();
        $('.tabs-global-container ul.tabs-items li').on('click', function () {
            if ($(this).hasClass('active')) return;
            var index = $(this).index(),
                closestContainer = $(this).closest('.tabs-global-container');
            closestContainer.find('ul.tabs-items li').removeClass('active');
            closestContainer.find('ul.tabs-content-container li').slideUp('slow').removeClass('active');
            $(this).addClass('active');
            closestContainer.find('ul.tabs-content-container li').eq(index).slideDown('slow', function () {
                $(this).addClass('active');
                if ($('.show-onscroll').length) showOnScroll();
            });
            //setTimeout(showOnScroll,1000);
        })
    }

    //Start of Comment Section
    if ($('.comment-section-container').length) {
        var heartsCount = 0;
        // var owlRatings = [{
        //         src: 'bad-owl.svg',
        //         title: 'Bad'
        //     },
        //     {
        //         src: 'ihateit-owl.svg',
        //         title: 'I hate it'
        //     },
        //     {
        //         src: 'ok-owl.svg',
        //         title: 'OK'
        //     },
        //     {
        //         src: 'iloveit-owl.svg',
        //         title: 'I love it'
        //     },
        //     {
        //         src: 'wow-owl.svg',
        //         title: 'Wow'
        //     }
        // ]
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

        // $('.item-rating-details-container .rating-owl-wrp div[class^="rating"]').each(function () {
        //     var ratingValue = parseInt($(this).data('rating') / 20);
        //     ratingValue > (owlRatings.length - 1) ? ratingValue-- : '';
        //     $(this).find('img').attr({
        //         'src': '../Images/ratings-owls/' + owlRatings[ratingValue].src,
        //         'title': owlRatings[ratingValue].title
        //     })
        //     $(this).find('span').text(owlRatings[ratingValue].title);
        // })

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
    if ($('.sitemap-list-wrp').length) ArrangeSitemap(4);

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
        var calendarView = getQueryString('calendar-view');
        initCalendarView(calendarView);
    }
    //End of Events Calendar

    //Start of FAQs
    if ($('.faq-category-wrp').length) {
        $('.faq-category-wrp').find('h2').on('click', function () {
            ExpandFaqCat($(this));
        });
        $('.faq-search').find('input').on('keyup', function () {
            SearchFaq($(this).val());
        });
    }
    //End of FAQs
    $(document).on('mousedown touchstart', function (e) {
        if (newScreenSize == 1) {
            if ($('#lightbox-popup.active.image-slider').length) {
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
                            }, {
                                duration: 750,
                                easing: 'easeOutExpo',
                                complete: function () {
                                    carouselAnimation = false;
                                }
                            });
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
                            }, {
                                duration: 750,
                                easing: 'easeOutExpo',
                                complete: function () {
                                    carouselAnimation = false;
                                }
                            });
                            carouselItemTarget.find('.carousel-data').stop().animate({
                                left: (fullScroll * 3) / 4
                            }, {
                                duration: 750,
                                easing: 'easeOutExpo'
                            });
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
                        }, {
                            easing: 'easeOutExpo'
                        }, function () {
                            carouselAnimation = false;
                        });
                    }
                    carouselPosDiff = undefined;
                    entered = false;
                    scrollingOnCarousel = false;
                    $('#main-carousel .carousel-data').stop().animate({
                        left: 0
                    }, {
                        duration: 1000,
                        easing: 'easeOutExpo'
                    }, function () {
                        carouselAnimation = false;
                    });
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
                if ($('#lightbox-popup.active.image-slider').length) {
                    var PopupMouseUpX = e.pageX || e.originalEvent.changedTouches[0].pageX;
                    if (PopupMouseDownX - PopupMouseUpX > 20) {
                        NextPopupGalleryItem();
                    } else if (PopupMouseDownX - PopupMouseUpX < -20) {
                        PrevPopupGalleryItem();
                    }
                }
            }


            var container = $(".search-input-filter-wrp.active"); // Give you class or ID

            if (!container.is(e.target) && // If the target of the click is not the desired div or section
                container.has(e.target).length === 0) // ... nor a descendant-child of the container
            {
                container.removeClass('active');
            }
        }
    });
    $(document).on('touchend', function (e) {
        if ($('#best-spots').length && bestSwipe) {
            bestSwipe = false;
            var bestTouchEnd = e.originalEvent.changedTouches[0].pageX,
                bestTouchDiff = bestTouchStart - bestTouchEnd;
            if (Math.abs(bestTouchDiff) > 30) {
                if (bestTouchDiff > 0) {
                    $('.mobile-best-next').click();
                } else {
                    $('.mobile-best-prev').click();
                }
            }
        }
    });
    $(document).on('keyup', function (e) {
        if (e.keyCode == 27) { //Esc button
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-close-btn').click();
            }
            if (newScreenSize == 1) {
                if ($('#lightbox-popup').length && $('#lightbox-popup').hasClass('active')) {
                    $('#lightbox-popup').removeClass('active');
                    setTimeout(function () {
                        $('#lightbox-popup').removeAttr('class');
                        DestroyPopupGallery();
                    }, 300);
                }
            }
            if (!$('#loader-wrp').hasClass('fade-away') && windowLoaded) {
                $('#loader-wrp').addClass('fade-away');
                $('html,body').removeClass('popup-in-motion');
            }
            if ($('.bottom-header').hasClass('active')) {
                ToggleMainNav();
            }
        } else if (e.keyCode == 13) { //Enter button
            if ($('#popup-base .search-input input').hasClass('field-focus')) {}
        } else if (e.keyCode == 9) {
            if ($('#popup-base').hasClass('popup-active')) {
                $('#popup-base .search-input input').focus();
            }
        } else if (e.keyCode == 37) { //Left arrow button
            if (newScreenSize == 1) {
                if ($('#lightbox-popup').length && $('#lightbox-popup').hasClass('active')) {
                    PrevPopupGalleryItem();
                }
            }
        } else if (e.keyCode == 39) { //Right arrow button
            if (newScreenSize == 1) {
                if ($('#lightbox-popup').length && $('#lightbox-popup').hasClass('active')) {
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
        if ($('#lightbox-popup').hasClass('active')) {
            imageSliderWrp = $('#lightbox-popup,.slider-main-slide-wrp');
            if (imageSliderWrp.is(e.target)) {
                $('#lightbox-popup').removeClass('active');
                setTimeout(function () {
                    $('#lightbox-popup').removeAttr('class');
                    DestroyPopupGallery();
                }, 300);
            }
        }
        if ($('.account-wrp').hasClass('active')) {
            var accountWrp = $('.account-wrp');
            if (!accountWrp.is(e.target) && accountWrp.has(e.target).length == 0) {
                $('.account-wrp').removeClass('active');
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
        ManipulateMainNav();
        if ($(window).width() <= 768 && $('.account-wrp').length) {
            $('.account-wrp').removeClass('active');
        }
        newScreenSize = CalcLastScreenSize(newScreenSize);

        /*if ($('.side-ads.thirty-width').length) {
            var adMargin = 30;
            adBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top - ($('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin);
            var customTop = $('.bottom-header').outerHeight() + $('.attached-menu').outerHeight() + adMargin,
                stopPos = $('.side-ads.thirty-width').siblings('.seventy-width').outerHeight() - $('.side-ads.thirty-width .ads-wrp').outerHeight(),
                stopBreakPos = $('.side-ads.thirty-width').siblings('.seventy-width').offset().top + stopPos - customTop;
            $('.side-ads.thirty-width img').width($('.side-ads.thirty-width img').width());
            MoveAd(scrollPos, adBreakPos, stopPos, stopBreakPos, customTop);
        }*/

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
        if ($('#lightbox-popup.active').length) {
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
    $(window).on('load', function () {
        windowLoaded = true;
        if ($('#loader-wrp').length && !$('#loader-wrp').hasClass('fade-away')) {
            $('#loader-wrp').find('.loader-skip-link').addClass('active');
        }
    });
});