// JavaScript Document
if (null == eventWidgetWidth || eventWidgetWidth == "" || eventWidgetWidth == "undefined") var eventWidgetWidth = 600;
if (null == pathToLoadingImage || pathToLoadingImage == "" || pathToLoadingImage == "undefined") var pathToLoadingImage = '';
var dateLowerlimit = "";
var nextPageToken;
var rowEventCounter = 0;
var maxEventsInRow = Math.floor(eventWidgetWidth / 120);
var $eventaxRow;
var maxGcalEvents = 5;
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var lastDateProcessed = new Date();
lastDateProcessed.setYear((lastDateProcessed.getYear() - 1));

function getDateLowerLimit() {
    var todayDate;
    if (dateLowerlimit == "") {
        todayDate = new Date();
        dateLowerlimit = todayDate.getFullYear() + "-" + (todayDate.getMonth() < 10 ? '0' : '') + (todayDate.getMonth() + 1) + "-" + (todayDate.getDate() < 10 ? '0' : '') + todayDate.getDate() + "T00:00:00+00:00"
    } else {
        todayDate = new Date(dateLowerlimit)
    }
}

function getFormattedDate(dateTime, needFullDate) {
    var dd = new Date(dateTime);
    var timeSuffix = "am";
    var hours = dd.getHours();
    if (hours > 12) {
        hours = hours - 12;
        timeSuffix = "pm"
    }
    timeZone = (dateTime.indexOf("+") != -1) ? "[GMT" + dateTime.substring(dateTime.indexOf("+")) + "]" : "";
    if (needFullDate) return "<span class='gcal-datetime'>" + dd.getDate() + " " + monthNames[dd.getMonth()] + " " + dd.getFullYear() + ", " + hours + ":" + (dd.getMinutes() < 10 ? '0' : '') + dd.getMinutes() + " " + timeSuffix + "</span><span class='gcal-tzone'>&nbsp;" + timeZone + "</span>";
    else return "<span class='gcal-datetime'>" + hours + ":" + (dd.getMinutes() < 10 ? '0' : '') + dd.getMinutes() + " " + timeSuffix + "</span>"
}
$(document).ready(function() {
    style = '<style>#gcal-table{margin:0px; display: block; position: relative;} .gcal-tzone{color:rgb(202,211,236);font-size:12px;} .gcal-datetime {font-weight:bold;font-size: 1em;} .event-desc {word-wrap: break-word;font-size: 1em;text-decoration:none;} #gcalender #gcal {display:block; position: relative; overflow:hidden; width: 100%; height: 100%; position: relative;} a:link,a:visited,a:hover,a:active {text-decoration:none;} .gcal-rpointer {position: absolute; right: -15px; top: 90px; font-size: 1em; font-weight: bold; color: rgb(213,63,53); width: 35px; height: 35px; padding-bottom: 7px; padding-left: 5px; cursor:pointer; cursor:mouse;border-radius: 35px;}.gcal-lpointer {position: absolute; left: -15px; top: 90px; font-size: 1vw; font-weight: bold; color: rgb(213,63,53); width: 35px; height: 35px; padding-bottom: 7px;padding-left: 5px; cursor:pointer; cursor:mouse; border-radius: 35px;}</style>';
    $('html > head').append(style);
    var moreStyle = '<style>.event-header {text-align: center; width: 30%; height: 20%; max-height: 19.1%; background-color: rgb(46,46,46); background-image: url(images/gcalBG.jpg); background-repeat: no-repeat; color: white; border: none; position: absolute; display: inline-block;} .event-header-holder { } .event-day {font-size: 1.2em; display: inline-block;} .event-date {font-size: 1.5em; font-family: Georgia;}.event-year {font-size: 1.2em; padding-top: 0px; display: inline-block;}.event-body {cursor:pointer; cursor:mouse; width: 70%; height: 100%; border: none; padding: 3px; background-color: rgb(46,46,46); background-image: url(images/gcalBG.jpg); background-repeat: no-repeat; color: white; overflow: hidden; text-decoration: none; position: relative; display:inline-block; margin-left: 30%; z-index: 990;}.event-title {color: rgb(177, 216, 255);font-weight: bold; font-size: 1.5em;}.event-location {color:white; font-size: 0.9vw;} #load-more {background-color: rgb(46,46,46);visibility:none;border: none;display: none;padding: 3px;text-align: center;color: white;font: 13px arial,sans-serif;font-weight: bold;float: left; width: 70%; height: 100%; margin-left: 2%; cursor: pointer; cursor: mouse; line-height: 100%;} .load-more:hover{background-color:red;} .gcal-datetime-extended {font-weight: bold;font-size: 13px;color: rgb(181,230,29);}.event-img {cursor:pointer;cursor:mouse;width: 110px;height: 110px;border: none;padding: 3px;color: black;overflow: hidden;background-repeat: no-repeat;background-size: cover;}</style>';
    $('html > head').append(moreStyle);
    var lightBoxStyle = '<style>#pimax-lightbox {position:fixed;background-color:rgba(0,0,0,0.9);z-index:100;width:100%;height:100%;left:0;top:0;}#picasa-img-lightbox {opacity:1; max-width:1000px; max-height:700px; z-index:200;cursor:pointer;cursor:mouse;}#picasa-lightbox-wrapper {text-align:center;height: 100%;width: 100%;white-space: nowrap;}#picasa-lightbox-image {text-align:center;display: inline-block;vertical-align: middle;white-space: normal;z-index:120;}#picasa-lightbox-helper {display: inline-block;vertical-align: middle;height: 100%;}#pimax-header a {text-decoration: none;color: inherit;}</style>';
    $('html > head').append(lightBoxStyle);
    var lightBoxImageStyle = '<style>.lightbox-event {width:500px;height:auto;border: 1px solid #cccccc;padding: 3px;color: white; overflow: hidden;text-decoration: none;background-color: #25004e;}.event-label {font-weight:normal;color:grey;font-size: 12px;}.event-hidden-link {display:none;}.lightbox-link {font-size: 12px;color: burlywood;}.lightbox-event-desc {word-wrap: break-word;font-size: 13px;text-decoration: none;}</style>';
    $('html > head').append(lightBoxImageStyle);
    $('#gcal').empty().append('<table id="gcal-table"></table>');
    $('#gcal-table').append('<div></div>');
    $eventaxRow = $('#gcal-table div:last');
    $('#gcal').append('<div id="pimax-lightbox"><div id="picasa-lightbox-wrapper"><div id="picasa-lightbox-image"></div><div id="picasa-lightbox-helper"></div></div></div>');
    $('#pimax-lightbox').click(function() {
        $('#picasa-img-lightbox').attr('src', '');
        $('#pimax-lightbox').hide()
    });
    $('#pimax-lightbox').hide();
    loadEvents()
});

function showLoadingInLightbox() {
    $('#picasa-img-lightbox').attr('src', '');
    $('#picasa-img-lightbox').attr('src', pathToLoadingImage)
}

function showLightboxImage(picSrc) {
    $('#pimax-lightbox').show();
    showLoadingInLightbox();
    setTimeout(function() {
        $('#picasa-lightbox-image').empty().append('<img id="picasa-img-lightbox" src="' + picSrc + '">')
    }, 10)
}

function showLightboxEvent(eventBodyElement) {
    $('#pimax-lightbox').show();
    showLoadingInLightbox();
    $eventBodyElement = $(eventBodyElement).clone(false);
    var isFullDayEvent = ($eventBodyElement.children('.gcal-datetime-holder').attr('data-fullDayEvent'));
    var eventFullDateFrom = ($eventBodyElement.children('.gcal-datetime-holder').attr('data-fullDateFrom'));
    var eventFullDateTo = ($eventBodyElement.children('.gcal-datetime-holder').attr('data-fullDateTo'));
    var eventType = "";
    if (null != isFullDayEvent && isFullDayEvent != "undefined") {
        if (isFullDayEvent == 1) {
            eventType = "Full Day Event"
        } else if (isFullDayEvent == 2) {
            eventType = "Multiple days event"
        } else if (isFullDayEvent == 0) {
            eventType = "Single day event"
        }
    }
    $eventBodyElement.children('.gcal-datetime-holder').empty().append("<span class='event-label'>" + eventType + "</span><br><br><span class='event-label'>From:</span> " + eventFullDateFrom + "<br><span class='event-label'>To:</span> " + eventFullDateTo + "<br>");
    $eventBodyElement.removeClass('event-body').addClass('lightbox-event');
    $eventBodyElement.append('<br/>');
    $eventBodyElement.prepend('<br/><br/>');
    $eventBodyElement.children('.event-hidden-link').removeClass('event-hidden-link').addClass('lightbox-link');
    $eventBodyElement.children('.event-desc').removeClass('event-desc').addClass('lightbox-event-desc');
    $('#picasa-lightbox-image').empty().append($eventBodyElement)
}

function loadEvents() {
    var apiPostURL = "https://www.googleapis.com/calendar/v3/calendars/" + googleCalendarId + "/events";
    getDateLowerLimit();
    var dataBox = {
        orderBy: "startTime",
        singleEvents: "true",
        timeMin: dateLowerlimit,
        fields: "items,nextPageToken",
        key: googleCalendarApiKey,
        maxResults: maxGcalEvents
    };
    callAPI(apiPostURL, dataBox)
}

function loadMore() {
    if (!fqlPending) {
        if (null == nextPageToken || nextPageToken == "undefined") {
            $('#load-more').text(' No More Events ');
            return
        }
        var apiPostURL = "https://www.googleapis.com/calendar/v3/calendars/" + googleCalendarId + "/events";
        var dataBox = {
            orderBy: "startTime",
            singleEvents: "true",
            timeMin: dateLowerlimit,
            fields: "items,nextPageToken",
            key: googleCalendarApiKey,
            maxResults: maxGcalEvents
        };
        dataBox['pageToken'] = nextPageToken;
        callAPI(apiPostURL, dataBox)
    }
}

function callAPI(apiPostURL, dataBox) {
    fqlPending = 1;
    $.ajax({
        url: apiPostURL,
        type: "GET",
        data: dataBox,
        async: true,
        cache: true,
        dataType: "jsonp",
        success: function(data) {
            showEvents(data)
        },
        error: function(html) {
            alert(html)
        },
        beforeSend: setHeader
    })
}

function showEvents(data) {
    var eventStartDate;
    var eventEndDate;
    var eventArray = data.items;
    nextPageToken = data.nextPageToken;
    var eventHTML = "";
    var c = 0;
    var dateHTML;
    var formattedStartDate = "??";
    var formattedEndDate = "?";
    var continuousEvent = false;
    $('#load-more-cell').remove();
    for (var i = 0; i < eventArray.length; i++) {
        startDate = eventArray[i].start.date || eventArray[i].start.dateTime;
        endDate = eventArray[i].end.date || eventArray[i].end.dateTime;
        summary = eventArray[i].summary;
        description = eventArray[i].description;
        htmlLink = eventArray[i].htmlLink;
        event_location = eventArray[i].location;
        eventHTML = '<div><div class="event-body">';
        if (null != summary && summary != "undefined" && summary != "") {
            eventHTML += "<span class='event-title'>" + summary + "</span><br>"
        }
        if (null != startDate && startDate != "undefined" && startDate != "" && null != endDate && endDate != "undefined" && endDate != "") {
            eventStartDate = new Date(startDate);
            eventEndDate = new Date(endDate);
            if (lastDateProcessed.getYear() != eventStartDate.getYear() || lastDateProcessed.getDate() != eventStartDate.getDate() || lastDateProcessed.getMonth() != eventStartDate.getMonth()) {
                dateHTML = showDateBox(eventStartDate);
                $eventaxRow.append(dateHTML);
                //rowEventCounter++; // Made change 12:01 25-04 
                if (rowEventCounter >= maxEventsInRow) {
                    $('#gcal-table').append('<div></div>');
                    $eventaxRow = $('#gcal-table div:last');
                    rowEventCounter = 0
                }
                lastDateProcessed = eventStartDate
            }
            formattedStartDate = getFormattedDate(startDate, false);
            formattedEndDate = getFormattedDate(endDate, false);
            fullDateFrom = getFormattedDate(startDate, true);
            fullDateTo = getFormattedDate(endDate, true);
            if ((eventStartDate.getDate() + 1) == eventEndDate.getDate() && formattedStartDate == formattedEndDate) {
                eventHTML += "<span class='gcal-datetime gcal-datetime-holder' data-fullDayEvent=\"1\" data-fullDateFrom=\"" + fullDateFrom + "\" data-fullDateTo=\"" + fullDateTo + "\" >Full Day Event</span>"
            } else {
                if (eventEndDate.getDate() > eventStartDate.getDate()) {
                    continuousEvent = true;
                    eventHTML += "<span class='gcal-datetime gcal-datetime-holder' data-fullDayEvent=\"2\" data-fullDateFrom=\"" + fullDateFrom + "\" data-fullDateTo=\"" + fullDateTo + "\" >" + eventStartDate.getDate() + " " + monthNames[eventStartDate.getMonth()] + ", " + formattedStartDate + " - " + eventEndDate.getDate() + " " + monthNames[eventEndDate.getMonth()] + ", " + formattedEndDate + "</span>"
                } else {
                    eventHTML += "<span class='gcal-datetime-holder' data-fullDayEvent=\"0\" data-fullDateFrom=\"" + fullDateFrom + "\" data-fullDateTo=\"" + fullDateTo + "\">" + formattedStartDate + " - " + formattedEndDate + "</span>"
                }
            }
            formattedStartDate = "??";
            formattedEndDate = "?"
        }
		/*
        if (null != event_location && event_location != "undefined" && event_location != "") {
            eventHTML += '&nbsp;' + "@ <span class='event-location'>" + event_location + "</span>"
        }
		*/
        if (null != description && description != "undefined" && description != "") {
            if (description.indexOf("{") != -1 && description.indexOf("}") != -1) {
                imgLink = description.substring(description.indexOf("{") + 1, description.indexOf("}"));
                description = description.replace('{' + imgLink + '}', '');
                imgHTML = '<div><div class="event-img" data-picSrc="' + imgLink + '" style="background-image:url(\'' + imgLink + '\')"></div></div>';
                $eventaxRow.append(imgHTML);
                rowEventCounter++;
                if (rowEventCounter >= maxEventsInRow) {
                    $('#gcal-table').append('<div></div>');
                    $eventaxRow = $('#gcal-table div:last');
                    rowEventCounter = 0
                }
            }
            eventHTML += "<span class='event-desc'>[" + description + "] </span><br>"
        } else {
            eventHTML += "<br>"
        }
        eventHTML += "<br><a target='_blank' class='event-hidden-link' href='" + htmlLink + "'>View this event on our Google Calendar</a><br><br></div>";
        eventHTML += '</div>';
        $eventaxRow.append(eventHTML);
        if (continuousEvent) {
            $('.event-body:last').css({
                'background-color': 'rgb(176, 255, 246)'
            });
            continuousEvent = false
        }
        rowEventCounter++;
        if (rowEventCounter >= maxEventsInRow) {
            $('#gcal-table').append('<div></div>');
            $eventaxRow = $('#gcal-table div:last');
            rowEventCounter = 0
        }
    }
    $eventaxRow.append('<td id="load-more-cell"><span id="load-more" class="load-more"> Load More.. </div></div>');
    $('#load-more').click(function() {
        $('#load-more').text('loading..');
        loadMore()
    });
    $('.event-body').click(function() {
        showLightboxEvent(this)
    });
    $('.event-img').click(function() {
        showLightboxImage(this.getAttribute('data-picSrc'))
    });
    fqlPending = 0
}

function showDateBox(eventStartDate) {
    var eventYear = eventStartDate.getFullYear().toString().substr(2);
    var dateHTML = '<div><div class="event-header"><div class="event-header-holder"><br><br><span class="event-day">' + dayNames[eventStartDate.getDay()] + '&nbsp;' +' </span><span class="event-date">' + eventStartDate.getDate() + '&nbsp;' + '</span><span class="event-year">' + monthNames[eventStartDate.getMonth()] + '&nbsp;' + eventYear + '</span></div></div></div>';
    return dateHTML
}

function setHeader(xhr) {
    if (xhr && xhr.overrideMimeType) {
        xhr.overrideMimeType("application/j-son;charset=UTF-8")
    }
}