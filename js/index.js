var resetValidation = function() {
    $(".main-form input").removeClass('red-border');
    $("#indexErrorMsg").hide();
}

var validateInput = function() {
    resetValidation();

    if($("#empId").val().trim() === '') {
        $("#empId").addClass('red-border');
        showMessage('index', 'Error', 'Please provide Employee ID');
        return false;
    }

    if($("#empName").val().trim() === '') {
        $("#empName").addClass('red-border');
        showMessage('index', 'Error', 'Please provide Employee Name');
        return false;
    }

    if($("#date").val().trim() === '') {
        $("#date").addClass('red-border');
        showMessage('index', 'Error', 'Please provide date');
        return false;
    }

    if($("#inTime").val().trim() === '') {
        $("#inTime").addClass('red-border');
        showMessage('index', 'Error', 'Please provide In-Time');
        return false;
    }

    if($("#outTime").val().trim() === '') {
        $("#outTime").addClass('red-border');
        showMessage('index', 'Error', 'Please provide Out-Time');
        return false;
    }

    return true;
}

var clearInputFields = function() {
    $("#date").val('');
    $("#inTime").val('');
    $("#outTime").val('');
    $("#hours").val('');
}

var showDuration = function() {
    $('#hours').removeClass("min-hours");
    var duration = calculateDuration($("#inTime").val(), $("#outTime").val(), function() {
        $('#hours').addClass("min-hours");
    }, function() {
        $('#hours').removeClass("min-hours");
    });

    if(duration && duration !== 'negative') {
        $('#hours').val(duration);
    }
}

// Check login
// if(!isLoggedIn()) {
//     redirectTo('login.html');
// }

$(document).ready(function () {
    $("#noLocalStorage").hide();
    $("#indexSuccessMsg").hide();
    $("#indexErrorMsg").hide();

    checkLocalStorage();

    // Show logged in user info in timesheet form
    var loggedInUser = getLoggedInUser();
    $("#empId").val(loggedInUser.EmpID);
    $("#empName").val(loggedInUser.EmpName);

    $("#btnSaveTimesheet").click(function () {
        // Validate input date
        if(validateInput()) {
            var duration = calculateDuration($("#inTime").val(), $("#outTime").val());
            if(duration == false) {
                showMessage('index', 'Error', 'Invalid in-time or out-time');
                return;
            } else {
                if(duration == 'negative') {
                    // If log-out time is next day, then change logout time to 23:59
                    if(confirm('Is the log-out time on next day?')) {
                      showMessage('index', 'Error', 'Max log-out time for a day can be 23:59.');
                       $("#outTime").val('23:59');
                    } else {
                      showMessage('index', 'Error', 'In-time can not be more than out-time');
                    }
                    return;
                }
            }
            // Add timesheet data
            addTimesheet({
                EmpID: $("#empId").val(),
                EmpName: $("#empName").val(),
                Date: $("#date").val(),
                InTime: $("#inTime").val(),
                OutTime: $("#outTime").val(),
                Hours: duration
            });
            clearInputFields();
            showMessage('index', 'Success', 'Timesheet data saved successfully', true);
            setLastLoginTime();
        }
    })

    // Calculate total hours on key up event for intime and out time
    $("#inTime").keyup(function () {
        $('#hours').val('');
		showDuration();
    });

    $("#outTime").keyup(function () {
        $('#hours').val('');
		showDuration();
    });

    $("#date").datepicker({ dateFormat: 'dd-mm-yy' });
	$("#inTime").timepicker({
	  timeFormat: 'HH:mm',
	  interval: 15,
      dropdown: true,
      scrollbar: true,
      change: showDuration
    });

	$("#outTime").timepicker({
	  timeFormat: 'HH:mm',
	  interval: 15,
      dropdown: true,
      scrollbar: true,
      change: showDuration
    });

    $("#date").change(function() {
        $("#inTime").val('');
        $("#outTime").val('');
        $("#hours").val('');
        showDuration();

        var date = $("#date").val();
        var empData = fetchTimeSheetForEmp(getLoggedInUser().EmpID, date);
        if(empData) {
            $("#inTime").val(empData.InTime);
            $("#outTime").val(empData.OutTime);
            showDuration();
        }
    });
});
