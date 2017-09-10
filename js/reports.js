var showReport = function(timeSheetData) {
    sessionStorage.lastReport = JSON.stringify(timeSheetData);

    if(timeSheetData) {
        var tableHTML = 
        '<div class="generate-csv"><button class="btn btn-xs btn-danger" onclick="generateCSV()">Download CSV</button></div>'
                        + '<div class="table-responsive">'
                        + '<table class="table table-hover table-condensed">'
                        + '<thead>'
                        + '    <tr>'
                        + '        <th>Employee ID</th>'
                        + '        <th>Employee Name</th>'
                        + '        <th>Date</th>'
                        + '        <th>In Time</th>'
                        + '        <th>Out Time</th>'
                        + '        <th>Total Hours</th>'
                        + '    </tr>'
                        + '</thead>'
                        + '<tbody>';

            $.each(timeSheetData, function(index, value) {
                tableHTML += '<tr>' +
                                '<td>' + value.EmpID + '</td>' +
                                '<td>' + value.EmpName + '</td>' +
                                '<td>' + value.Date + '</td>' +
                                '<td>' + value.InTime + '</td>' +
                                '<td>' + value.OutTime + '</td>' +
                                '<td>' + value.Hours + '</td>' +
                            '</tr>'
            });

            tableHTML += '</tbody></table></div></div>';

        $("#reportTable").html(tableHTML);
        $("#reportTable").slideDown();
    }
}

$(document).ready(function () {
    $("#noLocalStorage").hide();
    $("#reportsSuccessMsg").hide();
    $("#reportsErrorMsg").hide();
    $("#reportTable").hide();

    checkLocalStorage();
    
    $("#showReportAll").click(function(evt) {
        evt.preventDefault();
        showReport(fetchTimesheet(null, true));
    });

    $("#searchEmpID").keyup(function() {
        if($("#searchEmpID").val().trim() !== '') {
            $("#showReport").prop('disabled', false);
        } else {
            $("#showReport").prop('disabled', true);            
        }
    });

    $("#showReport").click(function(evt) {
        evt.preventDefault();
        var data = fetchTimesheet($("#searchEmpID").val().trim());
        if(data && data.length > 0) {
            showReport(data);
        } else {
            showMessage('reports', 'Error', 'There were no records found for this employee', true);
        }
    })
});