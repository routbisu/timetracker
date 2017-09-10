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
    sessionStorage.LoggedInID = null;
    sessionStorage.LoggedInName = null;    
}

/* Functions for timesheet operations */

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
});
