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
    $(".main-form input[type='text']").val('');
}

var showDuration = function() {
    var duration = calculateDuration($("#inTime").val(), $("#outTime").val());
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

    $("#btnSaveTimesheet").click(function () {
        // Validate input date
        if(validateInput()) {
            var duration = calculateDuration($("#inTime").val(), $("#outTime").val());
            if(duration == false) {
                showMessage('index', 'Error', 'Invalid in-time or out-time');
                return;
            } else {
                if(duration == 'negative') {
                    showMessage('index', 'Error', 'In-time can not be more than out-time');
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
});