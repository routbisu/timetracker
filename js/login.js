$(function() {
    checkLocalStorage();
    $("#signupArea, #loginLink, #loginErrorMessage").hide();

    $("#signupLink").click(function() {
        $("#loginArea, #signupLink").slideUp('fast');
        $("#signupArea, #loginLink").slideDown('fast');
    });

    $("#loginLink").click(function() {
        $("#loginArea, #signupLink").slideDown('fast');
        $("#signupArea, #loginLink").slideUp('fast');
    });

    // Handle Login
    $("#loginArea").submit(function(event) {
        var user = checkLogin($("#txtLoginEmpID").val(), $("#txtLoginPassword").val());
        if(user) {
            // Set log in user ID and name in session storage
            // and redirect to index page
            sessionStorage.LoggedInID = user.EmpID;
            sessionStorage.LoggedInName = user.EmpName;
            redirectTo('index.html');

            console.log(user);
        } else {
            $("#loginErrorMessage").text('Incorrect Employee ID / Password.');
            $("#loginErrorMessage").show();
        }
        event.preventDefault();
    });

    // Check if employee ID already exists
    $("#txtSignupEmpID").keyup(function() {
        if(isAlreadyExistUser($("#txtSignupEmpID").val())) {
            $("#loginErrorMessage").text('This employee ID already exists');
            $("#loginErrorMessage").show(); 
        }
    });

    $("#txtSignupEmpID").change(function() {
        if(!isAlreadyExistUser($("#txtSignupEmpID").val())) {
            $("#loginErrorMessage").text('');
            $("#loginErrorMessage").hide(); 
        }
    });

    // Handle Signup
    $("#signupArea").submit(function(event) {
        $("#loginErrorMessage").hide();
        // Validation
        var empID = $("#txtSignupEmpID").val();
        var empName = $("#txtSignupEmpName").val();
        var empPassword = $("#txtSignupPassword").val();
        var empPassword1 = $("#txtSignupPassword1").val();

        if(!empID || empID.length !== 5) {
            $("#loginErrorMessage").text('Enter 5 digit emp ID.');
            $("#loginErrorMessage").show();
            event.preventDefault();
            return;
        }

        if(!empName || empName.trim() === '') {
            $("#loginErrorMessage").text('Please enter employee name.');
            $("#loginErrorMessage").show();
            event.preventDefault();
            return;
        }

        if(!empPassword || empPassword.trim() === '' || !empPassword1 || empPassword1.trim() === '') {
            $("#loginErrorMessage").text('Please enter password and confirm password.');
            $("#loginErrorMessage").show();
            event.preventDefault();
            return;
        }

        // Passwords must match
        if(empPassword !== empPassword1) {
            $("#loginErrorMessage").text('Passwords didn\'t match.');
            $("#loginErrorMessage").show();
            event.preventDefault();
            return;
        }

        // Add new user
        var succesMsg = addUser(empID, empName, empPassword);
        
        if(succesMsg === 'success') {
            $("#loginErrorMessage").text('The user has been added. Please login to continue.');
            $("#loginErrorMessage").show(); 
            $("#loginArea, #signupLink").slideDown('fast');
            $("#signupArea, #loginLink").slideUp('fast');
        } else {
            $("#loginErrorMessage").text(succesMsg);
            $("#loginErrorMessage").show(); 
        }

        event.preventDefault();
    });
});