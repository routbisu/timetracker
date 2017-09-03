// Check if local storage is supported by browser
//var employeeData = [];

var checkLocalStorage = function () {
    if (typeof (Storage) === "undefined") {
        $("#noLocalStorage").show();
    } else {
        if (!localStorage.getItem('TimeTrackerData')) {
            // Create instance if not found
            localStorage.TimeTrackerData = JSON.stringify([]);
        }
    }
};

var addTimesheet = function (timesheet) {
    var timesheetData = JSON.parse(localStorage.TimeTrackerData);
    timesheetData.push(timesheet);
    localStorage.TimeTrackerData = JSON.stringify(timesheetData);
}

var fetchTimesheet = function (empID, isAll) {
    if (isAll) {
        return JSON.parse(localStorage.TimeTrackerData);
    } else {
        // Fetch timesheet data
        var timesheetData = JSON.parse(localStorage.TimeTrackerData);
        // Filter for employee ID
        var employeeData = timesheetData.filter(function (data) {
            return data.EmpID === empID;
        });

        return employeeData;
    }
}

var resetData = function () {
    localStorage.TimeTrackerData = JSON.stringify([]);
    location.reload();
}

var calculateDuration = function (inTime, outTime) {
    try {
        var ary1 = inTime.split(':'), ary2 = outTime.split(':');

        // Validation for hours and mins limit (0 - 12, 0 - 60)
        if(parseInt(ary1[0], 10) > 23 || parseInt(ary1[0], 10) < 0 ||
            parseInt(ary2[0], 10) > 23 || parseInt(ary2[0], 10) < 0) {
            return false;
        }  
        if(parseInt(ary1[1], 10) > 59 || parseInt(ary1[1], 10) < 0 ||
            parseInt(ary2[1], 10) > 59 || parseInt(ary2[1], 10) < 0) {
            return false;
        }

        var minsdiff = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10)
            - parseInt(ary1[0], 10) * 60 - parseInt(ary1[1], 10);

        if (minsdiff < 0) {
            return 'negative';
        };

        var hoursDiff = 100 + Math.floor(minsdiff / 60);
        var minsDiff = 100 + minsdiff % 60;
        if (isNaN(hoursDiff) || isNaN(minsDiff)) {
            return false;
        }
        return String(String(hoursDiff).substr(1) + ':' + String(minsDiff).substr(1));
    } catch (ex) {
        return false;
    }
}

var showMessage = function(pageName, type, msg, fadeOut = false, duration = 3000) {
    var elementID = '#' + pageName + type + 'Msg';
    $(elementID).text(msg);
    $(elementID).show();
    if(fadeOut) {
        setTimeout(function() {
            $(elementID).fadeOut(2000);
        }, duration);
    }
}
