var sjob_id = "";
var dataApproval, dataLogUser, dataLogAction, dataLogActionNRP;
var pNRP = $("#txt_nrp").val();
var gp_id = $("#txt_gp").val();

var txt_job_id = $("#txt_job_id").kendoDropDownList({
    optionLabel: "All",
    dataTextField: "job_id",
    dataValueField: "job_id",
    //filter: "contains",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/Home/DD_JOB_ID",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
        schema: {
            data: "Data",
            total: "Total"
        }
    },
    select: function (e) {
        var dataItem = this.dataItem(e.item.index());
        //var dataItem = e.dataItem;
        sjob_id = dataItem.job_id;
        loadgridMasterLog(sjob_id);
    }
});

var wnd_task = $("#wnd_task").kendoWindow({
    title: "Add Task",
    modal: true,
    visible: false,
    draggable: true,
    width: "500px",
    actions: [
        "Minimize",
        "Close"
    ]
}).data("kendoWindow");

function loadgridTaskMonitoring() {
    $("#gridTaskMonitoring").empty();
    var existingGrid = $('#gridTaskMonitoring').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }

    var gridTaskMonitoring = $("#gridTaskMonitoring").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Home/AjaxReadTaskMonitoring",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 10000,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "job_id",
                    fields: {
                        job_id: { type: "string", filterable: true, sortable: true, editable: false },
                        proces_insecond: { type: "number", filterable: true, sortable: true, editable: false },
                        last_longrun_insecond: { type: "number", filterable: true, sortable: true, editable: false },
                        job_status: { type: "string", filterable: true, sortable: true, editable: false },
                        job_remark: { type: "string", filterable: true, sortable: true, editable: false },
                        active_status: { type: "number", filterable: true, sortable: true, editable: false },
                        interval_type: { type: "string", filterable: true, sortable: true, editable: false },
                        duration: { type: "number", filterable: true, sortable: true, editable: false },
                        run_datetime: { type: "datetime", filterable: true, sortable: true, editable: false },
                        finish_datetime: { type: "datetime", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
        filterable: false,
        sortable: false,
        pageable: false,
        resizable: false,
        editable: "popup",
        toolbar: [
             { template: "<button class='k-button' onclick='openPopUp()'><i class='glyphicon glyphicon-plus-sign'></i>&nbsp;&nbsp;Add Task</button>" },
        ],
        columns: [
            {
                title: "No",
                width: "30px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                field: "job_id", title: "Job ID", width: "200px"
            }, {
                //#= street2 != null ? street2 : '' #
                field: "finish_datetime", title: "Finish Datetime", width: "150px", template: "#= finish_datetime != null ? kendo.toString(kendo.parseDate(finish_datetime, 'yyyy-MM-dd HH:mm:ss'), 'dd/MM/yyyy HH:mm:ss') : '-' #"
            }, {
                field: "proces_insecond", title: "Process <br/>in Second", width: "60px"
            }, {
                field: "job_status", title: "Job <br/>Status", width: "50px", template: $('#tmplt_job_status').html()
            }, {
                field: "job_remark", title: "Job <br/>Remarks", width: "100px"
            }, {
                field: "interval_type", title: "Interval <br/>Type", width: "100px"
            }, {
                field: "duration", title: "Duration", width: "100px"
            }, {
                field: "active_status", title: "Active <br/>Status", width: "50px"
            }, {
                title: "Action", width: "50px", template: $('#tmplt_btn_reset').html()
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function () {
            var i = 0;
            $("#gridTaskMonitoring tbody tr").each(function () {
                var dataItem = $("#gridTaskMonitoring").data().kendoGrid.dataSource.data()[i];
                if (dataItem.job_status == "ON") {
                    $("#job_status_color" + dataItem.job_id).append("<span class='label bg-success'>" + dataItem.job_status + "</span>");
                    $("#btn_reset" + dataItem.job_id).hide();
                }
                else if (dataItem.job_status == "OFF") {
                    $("#job_status_color" + dataItem.job_id).append("<span class='label bg-danger'>" + dataItem.job_status + "</span>");
                    if (dataItem.active_status == 0)
                        $("#btn_reset" + dataItem.job_id).hide();
                    else
                        $("#btn_reset" + dataItem.job_id).show();
                }
                i++;
            });
        }
    });
}

function clear_component() {
    $("#txt_jobid").val("");
    $("#txt_svname").val("");
    $("#txt_dbname").val("");
    $("#txt_type").val("");
    $("#chk_task").prop('checked', 0);
    $("#txt_duration").val("");
    $("#txt_script_location").val("");

    $("#txt_jobid").change();
    $("#txt_svname").change();
    $("#txt_dbname").change();
    $("#txt_type").change();
    $("#txt_duration").change();
    $("#txt_script_location").change();

}

function openPopUp() {
    wnd_task.center().open();
    clear_component();
}

function closePopUp() {
    wnd_task.close();
    clear_component();
}

function saveTask() {
    if ($("#txt_jobid").val() == "" || $("#txt_svname").val() == "" ||
        $("#txt_dbname").val() == "" || $("#txt_type").val() == "" ||
        $("#txt_duration").val() == "" || $("#txt_script_location").val() == "") {
        alert("Semua data harus diisi !");
    } else {
        var i_cls_task = {
            job_id: $("#txt_jobid").val(),
            db_server_name: $("#txt_svname").val(),
            database_name: $("#txt_dbname").val(),
            interval_type: $("#txt_type").val(),
            active_status: $("#chk_task").is(':checked'),
            duration: $("#txt_duration").val(),
            script_location: $("#txt_script_location").val()
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: $("#urlPath").val() + "/Home/AjaxSaveTask",
            data: JSON.stringify({
                sVW_task_monitoring_status: i_cls_task
            }),
            success: function (response) {
                console.log(response);
                if (response.status) {
                    closePopUp();
                    $("#gridTaskMonitoring").data("kendoGrid").dataSource.read();
                } else {
                    alert(response.remarks);
                }

            }
        });
    }



}


function loadgridMasterLog(sJobID) {
    $("#gridMasterLog").empty();
    var existingGrid = $('#gridMasterLog').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }

    var gridMasterLog = $("#gridMasterLog").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Home/AjaxReadMasterLog?sJobID=" + sJobID,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "log_id",
                    fields: {
                        log_id: { type: "string", filterable: true, sortable: true, editable: false },
                        job_id: { type: "string", filterable: true, sortable: true, editable: false },
                        job_status: { type: "string", filterable: true, sortable: true, editable: false },
                        job_remarks: { type: "string", filterable: true, sortable: true, editable: false },
                        log_date: { type: "datetime", filterable: true, sortable: true, editable: false },
                    }
                }
            }
        },
        height: 400,
        filterable: false,
        sortable: false,
        pageable: true,
        resizable: false,
        editable: "popup",
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        columns: [
            {
                title: "No",
                width: "30px",
                template: "#= ++rowNo #",
                filterable: false
            }
            , { field: "job_id", title: "Job ID", width: "150px" }
            , { field: "log_date", title: "Log Date", width: "150px", template: "#= kendo.toString(kendo.parseDate(log_date, 'yyyy-MM-dd HH:mm:ss'), 'dd/MM/yyyy HH:mm:ss') #" }
            , { field: "job_remarks", title: "Job Remarks", width: "450px" }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function Reset(jobID) {
    //console.log(jobStatus);
    $.ajax({
        url: $("#urlPath").val() + "/Home/AjaxReset",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ sJobID: jobID }),
        type: "POST",
        success: function (data) {
            if (data.status == 1) {
                //swal("Success!", data.remarks, "success");
                $("#gridTaskMonitoring").data("kendoGrid").dataSource.read();
            } else {
                swal("Error!", data.remarks, "error");
                $("#gridTaskMonitoring").data("kendoGrid").dataSource.read();
            }
        }
    });
}

function formatDate(date) {
    var monthNames = [
        "Januari", "Februari", "Maret",
        "April", "Mei", "Juni", "Juli",
        "Agustus", "September", "Oktober",
        "November", "Desember"
    ];

    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return day + ' ' + monthNames[monthIndex] + ', ' + hour + ':' + minutes;
}

function userView() {
    $(".heading-text").remove();
    $("#heading_date").append("<span class='heading-text'><i class='icon-calendar2 text-warning position-left'></i>" + formatDate(new Date()) + "</span>");

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Home/GetCountUser",
        success: function (response) {
            var dataItem = response.Data[0];
            $("#userOnline").val(dataItem.count_online);
            $("#userActive").val(dataItem.count_active);
            $("#loginToday").val(dataItem.count_last_login);

            getUserOnline();
            getUserActive();
            getLoginToday();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}

function getUserOnline() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Home/GetUserOnline",
        success: function (response) {
            var result = '<h5>' + "User Online" + '</h5>' +
              '<hr />';

            for (i = 0; i < response.Data.length; i++) {
                result += '<p style="font-size:12px">' + response.Data[i].nama + '</p>';

            }
            $("#tooltip_user_online").data("kendoTooltip").options.content = result;

            $("#tooltip_user_online").data("kendoTooltip").refresh();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}

function getUserActive() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Home/GetUserActive",
        success: function (response) {
            var result = '<h5>' + "User Active" + '</h5>' +
            '<hr />';

            for (i = 0; i < response.Data.length; i++) {
                result += '<p style="font-size:12px">' + response.Data[i].nama + '</p>';
            }

            $("#tooltip_user_active").data("kendoTooltip").options.content = result;

            $("#tooltip_user_active").data("kendoTooltip").refresh();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}

function getLoginToday() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Home/GetLoginToday",
        success: function (response) {
            var result = '<h5>' + "Login Today" + '</h5>' +
            '<hr />';

            for (i = 0; i < response.Data.length; i++) {
                result += '<p style="font-size:12px">' + response.Data[i].nama + '</p>';
            }

            $("#tooltip_login_today").data("kendoTooltip").options.content = result;

            $("#tooltip_login_today").data("kendoTooltip").refresh();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}

$('#tooltip_user_online').kendoTooltip({
    filter: 'a',
    position: 'right',
    content: new function (e) {
        var result = '<h5>' + "User Online" + '</h5>' +
              '<hr />';

        return result;
    },
    width: 220
});

$('#tooltip_user_active').kendoTooltip({
    filter: 'a',
    position: 'right',
    content: function (e) {
        var result = '<h5>' + "User Active" + '</h5>' +
            '<hr />';

        return result;
    },
    width: 220
});

$('#tooltip_login_today').kendoTooltip({
    filter: 'a',
    position: 'right',
    content: function (e) {
        var result = '<h5>' + "Login Today" + '</h5>' +
            '<hr />';

        return result;
    },
    width: 220
});

function ApprovalPercentage() {
    $.ajax({
        url: $("#urlPath").val() + "/Home/getApprovalPercentage",
        type: "POST",
        dataType: "json",
        success: function (e) {
            var arr_obj = [];
            for (var i = 0; i < e.length; i++) {
                var iterate = {
                    pid: e[i].pid,
                    approval_detail: e[i].approval_detail,
                    value: e[i].value,
                    color: e[i].color
                }

                arr_obj.push(iterate);
            }

            dataApproval = arr_obj;
            createChart();
        }
    });
}

function createChart() {
    $("#chart_apprvl").empty();
    var existingGrid = $('#chart_apprvl').data('kendoChart');
    if (existingGrid) {
        existingGrid.destroy();
    }
    $("#chart_apprvl").kendoChart({
        title: {

            font: "bold 10px PopIn, Arial",
            text: "Report Approval Percentage",
            position: "bottom",

        },
        legend: {
            visible: false
        },
        dataSource: {
            data: dataApproval
        },
        seriesDefaults: {
            labels: {
                font: " bold 8px Tahoma, Arial",
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= value#%",
            }
        },
        categoryAxis:
        {
            labels:
            {
                font: "bold 8px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }
        },
        valueAxis: {
            labels:
            {
                font: "bold 8px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }

        },
        series: [{
            type: "pie",
            field: "value",
            categoryField: "approval_detail",
            colorField: "color",
        }],
        tooltip: {
            visible: true,
            format: "{0}%"
        }
    });
}

var ApprovalDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/Home/getApprovalPercentageDetail2",
            type: "POST",
            dataType: "json"
        }
    },

    group: {
        field: "approval_detail"
    },

    schema: {
        model: {
            fields: {
                pid: { type: "string" },
                approval_detail: { type: "string" },
                app_id: { type: "string" },
                app_name: { type: "string" },
                value: { type: "double" },
            }
        }
    }
});

function createChartDetail() {
    $("#chart_apprvl_detail").empty();
    var existingGrid = $('#chart_apprvl_detail').data('kendoChart');
    if (existingGrid) {
        existingGrid.destroy();
    }
    $("#chart_apprvl_detail").kendoChart({
        title: {

            font: "bold 10px PopIn, Arial",
            text: "Report Approval Percentage Detail",
            position: "bottom",

        },
        legend: {
            visible: false
        },
        dataSource: ApprovalDataSource,
        series: [{
            type: "column",
            field: "value",
            categoryField: "app_name",
            name: "#= group.value #",
            colorField: "color",
            labels: {
                visible: true,
                background: "transparent",
                template: "#= dataItem.approval_detail # \n #= value#%",
            }
        }],
        //legend: {
        //position: "bottom",
        //color: "color",
        //},
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= dataItem.approval_detail # \n #= value#%",
        }
    });
}

function LogByUser() {
    $.ajax({
        url: $("#urlPath").val() + "/Home/getLogByUser",
        type: "POST",
        dataType: "json",
        success: function (e) {
            var arr_obj = [];
            for (var i = 0; i < e.length; i++) {
                var iterate = {
                    username: e[i].username,
                    name: e[i].name,
                    jumlah_access: e[i].jumlah_access
                }

                arr_obj.push(iterate);
            }

            dataLogUser = arr_obj;
            createChartLogUser();
        }
    });
}

function createChartLogUser() {
    $("#chart_log_user").empty();
    var existingGrid = $('#chart_log_user').data('kendoChart');
    if (existingGrid) {
        existingGrid.destroy();
    }
    $("#chart_log_user").kendoChart({
        title: {

            font: "bold 10px PopIn, Arial",
            text: "Report Summary Log by User",
            position: "bottom",

        },
        legend: {
            visible: false
        },
        dataSource: {
            data: dataLogUser
        },
        seriesDefaults: {
            labels: {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
                template: "#= value#",
            }
        },
        categoryAxis:
        {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }
        },
        valueAxis: {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }

        },
        series: [{
            type: "bar",
            field: "jumlah_access",
            categoryField: "name"
        }],
        tooltip: {
            visible: true,
            format: "{0}"
        }
    });
}

function LogByAction() {
    $.ajax({
        url: $("#urlPath").val() + "/Home/getLogByAction",
        type: "POST",
        dataType: "json",
        success: function (e) {
            var arr_obj = [];
            for (var i = 0; i < e.length; i++) {
                var iterate = {
                    action: e[i].action,
                    jumlah_access: e[i].jumlah_access
                }

                arr_obj.push(iterate);
            }

            dataLogAction = arr_obj;
            createChartLogAction();
        }
    });
}

function LogByActionNRP(sAction) {
    $("#title_action_nrp").html("<a href='javascript:void(0)' class='glyphicon glyphicon-arrow-left position-left' onclick='backChart()'></a><i class='icon-stats-bars4 position-left'></i>Log By Action " + sAction + " NRP");
    $("#chart_action").hide();
    $("#chart_action_nrp").show();
    $.ajax({
        url: $("#urlPath").val() + "/Home/getLogByActionNRP?sAction=" + sAction,
        type: "POST",
        dataType: "json",
        success: function (e) {
            var arr_obj = [];
            for (var i = 0; i < e.length; i++) {
                var iterate = {
                    name: e[i].name,
                    jumlah_access: e[i].jumlah_access
                }

                arr_obj.push(iterate);
            }

            dataLogActionNRP = arr_obj;
            createChartLogActionNRP();
        }
    });
}

function createChartLogAction() {
    $("#chart_log_action").empty();
    var existingGrid = $('#chart_log_action').data('kendoChart');
    if (existingGrid) {
        existingGrid.destroy();
    }
    $("#chart_log_action").kendoChart({
        title: {

            font: "bold 10px PopIn, Arial",
            text: "Report Summary Log by Action",
            position: "bottom",

        },
        legend: {
            visible: false
        },
        dataSource: {
            data: dataLogAction
        },
        seriesDefaults: {
            labels: {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
                template: "#= value#",
            }
        },
        categoryAxis:
        {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }
        },
        valueAxis: {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }

        },
        series: [{
            type: "bar",
            field: "jumlah_access",
            categoryField: "action"
        }],
        tooltip: {
            visible: true,
            format: "{0}"
        },
        seriesClick: function (e) {
            //window.location.replace($("#urlPath").val() + '/RMCost/Chartmonthlydistrik?smonthly=' + e.dataItem.months + '&token=' + token);
            LogByActionNRP(e.category);
        },
    });
}

function createChartLogActionNRP() {
    $("#chart_log_action_nrp").empty();
    var existingGrid = $('#chart_log_action_nrp').data('kendoChart');
    if (existingGrid) {
        existingGrid.destroy();
    }
    $("#chart_log_action_nrp").kendoChart({
        title: {

            font: "bold 10px PopIn, Arial",
            text: "Report Summary Log by Action NRP",
            position: "bottom",

        },
        legend: {
            visible: false
        },
        dataSource: {
            data: dataLogActionNRP
        },
        seriesDefaults: {
            labels: {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
                template: "#= value#",
            }
        },
        categoryAxis:
        {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }
        },
        valueAxis: {
            labels:
            {
                font: "9px Tahoma, Arial",
                visible: true,
                background: "transparent",
            }

        },
        series: [{
            type: "bar",
            field: "jumlah_access",
            categoryField: "name"
        }],
        tooltip: {
            visible: true,
            format: "{0}"
        }
    });
}

function backChart() {

    $("#chart_action_nrp").hide();
    $("#chart_action").show();
}

$(document).ready(function () {

    //loadgridTaskMonitoring();
    //loadgridMasterLog(sjob_id);
    //userView();

    //ApprovalPercentage();
    //createChartDetail();
    //LogByUser();
    //LogByAction();

    //setInterval(function () { $("#gridTaskMonitoring").data("kendoGrid").dataSource.read(); }, 5000);
    //setInterval(function () { $("#gridMasterLog").data("kendoGrid").dataSource.read(); }, 5000);
    //setInterval(function () { userView(); }, 5000);

    //if (gp_id == 10) {
    //    $("#change_password").show();
    //}
});