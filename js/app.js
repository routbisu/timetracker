// Check if local storage is supported by browser
//var employeeData = [];
var CHECK_LOGINTIME_TIMER = 2000;

var checkLocalStorage = function () {
    if (typeof (Storage) === "undefined") {
        $("#noLocalStorage").show();
    } else {
        if (!localStorage.getItem('TimeTrackerData')) {
            // Create instance if not found
            localStorage.TimeTrackerData = JSON.stringify([]);
        }
        if (!localStorage.getItem('LastLoginTime')) {
            // Create instance if not found
            var nowTimestamp = new Date();
            localStorage.LastLoginTime = nowTimestamp.toLocaleString();
        }
        if (!localStorage.getItem('UserData')) {
            // Add default user
            var userData = [
                { EmpID: '10001', EmpName: 'Kanakdeepa', Password: 'password' }
            ];
            localStorage.UserData = JSON.stringify(userData);
        }
    }
};

var redirectTo = function(url) {
    window.location = url;
}

// Check if logged in
var isLoggedIn = function() {
    if(sessionStorage.getItem('LoggedInID') != null && sessionStorage.getItem('LoggedInName') != null) {
        return true;
    }
    return false;
}

// Get an object for logged in user
var getLoggedInUser = function() {
    return {
        EmpID: sessionStorage.LoggedInID,
        EmpName: sessionStorage.LoggedInName
    };
}

// Logout current user
var logOut = function() {
    sessionStorage.removeItem('LoggedInID');
    sessionStorage.removeItem('LoggedInName');
    redirectTo('login.html');
}

// Calculate time difference from Locale Time Strings
var calculateTimeDifference = function(time1, time2) {
  try {
    var t1 = new Date(time1);
    var t2 = new Date(time2);
    var timeDiffStr = '';

    var diffSeconds = Math.abs(t2 - t1) / 1000;

    if(diffSeconds < 60) {
      timeDiffStr = 'Just now';
    } else if(diffSeconds < 3600) {
      timeDiffStr = Math.round(diffSeconds / 60) + ' min(s) ago';
    } else if(diffSeconds < 86400) {
      timeDiffStr = Math.round(diffSeconds / 3600) + ' hour(s) ago';
    } else if(diffSeconds >= 86400) {
      timeDiffStr = Math.round(diffSeconds / 86400) + ' day(s) ago';
    }

    return timeDiffStr;
  } catch(ex) {
    return false;
  }
}

// Get last login duration (n mins/hours ago)
var getLastLoginDuration = function() {
  var nowTimeString = (new Date()).toLocaleString();
  return calculateTimeDifference(localStorage.LastLoginTime, nowTimeString);
}

var setLastLoginTime = function() {
  localStorage.LastLoginTime = (new Date()).toLocaleString();
}

/* Functions for timesheet operations */
// Add timesheet - Overwrites any existing record for same day
var addTimesheet = function (timesheet) {
    var timesheetData = JSON.parse(localStorage.TimeTrackerData);
    var isExist = false;

    for(var i = 0; i < timesheetData.length; i++) {
        if(timesheetData[i].Date === timesheet.Date && timesheetData[i].EmpID === timesheet.EmpID) {
            timesheetData[i].InTime = timesheet.InTime;
            timesheetData[i].OutTime = timesheet.OutTime;
            timesheetData[i].Hours = timesheet.Hours;
            isExist = true;
        }
    }

    if(!isExist) {
        timesheetData.push(timesheet);
    }

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

var fetchTimeSheetForEmp = function(empID, date) {
    // Fetch timesheet data
    var timesheetData = JSON.parse(localStorage.TimeTrackerData);
    // Filter for employee ID
    var employeeData = timesheetData.filter(function (data) {
        return (data.EmpID === empID && data.Date === date);
    });
    if(employeeData.length > 0) {
        return employeeData[0];
    } else {
        return false;
    }
}

var resetData = function () {
    localStorage.TimeTrackerData = JSON.stringify([]);
    location.reload();
}

// The callback will be called when working hours is less than 4 hours
var calculateDuration = function (inTime, outTime, lessHours = null, moreHours = null) {
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

        // If time is less than 4 hours (240 minutes) then execute the callback
        if(lessHours !== null || moreHours !== null) {
            if(((hoursDiff - 100) * 60 + (minsDiff - 100)) < (240)) {
                lessHours();
            } else {
                moreHours();
            }
        }

        return String(String(hoursDiff).substr(1) + ':' + String(minsDiff).substr(1));
    } catch (ex) {
        console.log(ex);
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

/* Functions for user login/sign up operations */
// Returns user object if valid credentials are provided
var checkLogin = function(empID, password) {
    var usersData = JSON.parse(localStorage.UserData);

    var validUser = usersData.filter(function(data) {
        if(data.EmpID == empID && data.Password == password)
            return data;
    });

    if(validUser.length > 0) {
        return validUser[0];
    } else {
        return false;
    }
}

// Check if employee ID already exists
var isAlreadyExistUser = function(empID) {
    var usersData = JSON.parse(localStorage.UserData);
    var user = usersData.filter(function(data) {
        if(data.EmpID == empID)
            return data;
    });
    if(user.length > 0)
        return true;

    return false;
}

// Add new user
var addUser = function(empID, empName, password) {
    if(isAlreadyExistUser(empID))
        return 'This employee ID already exists!';

    var usersData = JSON.parse(localStorage.UserData);
    usersData.push({
        EmpID: empID,
        EmpName: empName,
        Password: password
    });
    localStorage.UserData = JSON.stringify(usersData);
    return 'success';
}

// Prompt user to Download CSV
var downloadCSV = function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Generate CSV text and download
var generateCSV = function() {
    var csvData = Papa.unparse(JSON.parse(sessionStorage.lastReport));
    console.log(csvData);
    if(csvData && csvData.length > 0)
        downloadCSV('TimesheetReport.csv', csvData);
    else
        alert('There was an unexpected error');
}


// Handle delete all data
$(document).ready(function() {
    $("#resetData").click(function (evt) {
        if(confirm('Are you sure you want to delete all the data?')) {
            resetData();
            evt.preventDefault();
            alert('All timesheet has been erased!');
        }
    });

    var loggedInUser = getLoggedInUser();
    $("#logInUserWelcome").text('Welcome, ' + loggedInUser.EmpName);

    $(".hamburger-menu").click(function(evt) {
        $(".main-menu").addClass('menu-visible');
        evt.stopPropagation();
    });

    $(window).click(function() {
        $(".main-menu").removeClass('menu-visible');
    });

    $(".main-menu").click(function(evt) {
        evt.stopPropagation();
    });

    // Call get last login duration every 1 min
    setInterval(function() {
      var lastLoginDuration = getLastLoginDuration();
      $("#last-login-duration").text(lastLoginDuration);
    }, CHECK_LOGINTIME_TIMER);
});
