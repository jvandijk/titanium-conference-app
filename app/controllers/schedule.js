var args = arguments[0] || {};
var moment = require('alloy/moment');
var decoder = require('entitydecoder');

var hideActivity = function () {
	$.scheduleWindow.remove($.activityIndicator);
};

function sortObj(arr){
	// Setup Arrays
	var sortedKeys = new Array();
	var sortedObj = {};

	// Separate keys and sort them
	for (var i in arr){
		sortedKeys.push(i);
	}
	sortedKeys.sort();

	// Reconstruct sorted obj based on keys
	for (var i in sortedKeys){
		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
	}
	return sortedObj;
}

function loadSchedule(collection, response, options) {      
    var schedule = collection.toJSON();
    Ti.API.info(JSON.stringify(schedule));
    if (schedule.length == 0) {
        $.table.headerTitle = "No schedule data";
        return true;
    }
    
    var sectionSchedule = [];
    var sections = [];
    for (var i = 0, iLen = schedule.length; i < iLen; i++) {
    	// divide data into sections
    	session = schedule[i];
    	
    	var timestampKey = session.startDate;
    	if (!sectionSchedule[timestampKey]) {
    		sectionSchedule[timestampKey] = [];
    	}
    	
    	sectionSchedule[timestampKey].push(Alloy.createController('schedulerow', {
            title: decoder.decode(session.title),
            content: session.content,
            speaker: session.speaker,
            bio: session.bio,
            picture: session.picture,
            startDate: session.startDate,
            endDate: session.endDate,
            room: session.room
        }).getView());
    }
    
    sectionSchedule = sortObj(sectionSchedule);
    
    for (var jIndex in sectionSchedule) {
    	var currentSection = sectionSchedule[jIndex];
    	var sectionHeader = Ti.UI.createTableViewSection({ headerTitle: moment(jIndex.toString(), 'X').format('DD MMM HH:mm')});
    	
    	for (var k = 0, kLen = currentSection.length; k < kLen; k++) {
    		sectionHeader.add(currentSection[k]);
    	}
    	sections.push(sectionHeader);
    }
    
    $.table.setData(sections);
    hideActivity();
};

var style;
if (Ti.Platform.name === 'iPhone OS'){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
} else {
  style = Ti.UI.ActivityIndicatorStyle.DARK;
}

$.activityIndicator.setStyle(style);
$.activityIndicator.show();

Ti.App.fireEvent('setMainTitle', {
	title: 'Schedule'
});

Alloy.Collections.schedule.fetch({ success: loadSchedule, error: hideActivity });
