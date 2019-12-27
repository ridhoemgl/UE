$(document).ready(function () {
    loadgrid();

    $("#fl_upload_exel").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: false
        },
        multiple: false,

        upload: uploadFileExcel,
        success: onSuccessUploadExcel,
        error: onErrorUploadExcel
    });

    $("#txt_percent").keydown(function (event) {
        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }
        
        if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
            event.preventDefault();

    });


    $("#btn_save").click(function () {
        var val = true;
        var message = "";
        // if ($('#txt_location').val().length == 0) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>location</b> correctly";
        // } else if ($("#txt_start").val().length == 0) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>start date</b> correctly";
        // } else if ($("#txt_finish").val().length == 0) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>finish date</b> correctly";
        // } else if ($("#drp_prog").val().length == 0) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>Progress Status</b> correctly";
        // } else if ($("#drp_proc").val().length == 0) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>Process Status</b> correctly";
        // }
        // //else if ($("#txt_actual").val().length == 0) {
        // //    val = false;
        // //    message = "sorry there is still an empty field, please enter the <b>Actual Date</b> correctly";
        // //}
        // else if ($("#txt_percent").val().length == 0 || parseFloat($("#txt_percent").val()) > 100) {
        //     val = false;
        //     message = "sorry there is still an empty field, please enter the <b>Percentage</b> correctly";
        // } else {
        //     val = true;
        // }

        if (val == true) {
            $.confirm({
                title: 'Konfirmasi',
                content: 'You will update recondition monitoring data ?<br>Click Ok to continue',
                theme: 'material',
                closeIcon: true,
                animation: 'rotateX',
                closeAnimation: 'rotateX',
                animateFromElement: false,
                opacity: 0.5,
                type: 'blue',
                buttons: {
                    'confirm': {
                        text: 'Save',
                        btnClass: 'btn-blue',
                        action: function () {
                            var values_part = {
                                cn : $('#txt_cn').val(),
                                location : $('#txt_location').val(),
                                finish_date : formatDate($('#txt_finish').val()),
                                start_date : formatDate($('#txt_start').val()),
                                s_proc : parseInt($('#drp_proc').val()),
                                s_prog : parseInt($('#drp_prog').val()),
                                persen : parseFloat($('#txt_percent').val()),
                                actual_date : formatDate($('#txt_actual').val())
                            };
                            //console.log(values_part);
                            $.ajax({
                                url: $("#urlPath").val() + "/MonitoringRecondition/UpdateMonitoring",
                                type: "POST",
                                data: values_part ,
                                success: function (resq) {
                                    $.alert({
                                        title: resq.title,
                                        content: resq.content,
                                        theme: 'material',
                                        type: resq.type,
                                        buttons: {
                                            okay: {
                                                text: 'OK',
                                                btnClass: 'btn-'+resq.type,
                                                action: function(){
                                                    $("#grid_monitoring").data('kendoGrid').dataSource.read();
                                                    $('#wnd_update_monitoring').data('kendoWindow').close();
                                                }
                                            }
                                        }
                                    });
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                   console.log(textStatus, errorThrown);
                                }
                            });
                        }
                    },
                    cancel: function () {
                        // Do Nothing
                    }
                }
            });
        } else if (val == false) {
            $.alert({
                title: "Error Input",
                content: message,
                animation: 'rotateX',
                type: "red",
                theme: 'bootstrap',
                closeAnimation: 'rotateXR',
                backgroundDismiss: true,
                buttons: {
                    oke: {
                        text: 'tutup',
                        btnClass: 'btn-red'
                    }
                }
            });
        }
    });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function loadgrid() {
    $("#grid_monitoring").empty();
    var existingGrid = $('#grid_monitoring').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_monitoring").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MonitoringRecondition/ReadMonitoringRecondition",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {

                    }
                },
                parameterMap: function (data, operation) {
                    if (operation != "read") {
                        //data.achieve = $("#achieve").val();
                    }
                    return kendo.stringify(data);
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            resizable: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "CN",
                    fields: {
                        CN: { type: "string", filterable: true, sortable: true, editable: false },
                        DISTRIK: { type: "string", filterable: true, sortable: true, editable: false },
                        SN: { type: "string", filterable: true, sortable: true, editable: true },
                        DECISSION: { type: "string", filterable: true, sortable: true, editable: true },
                        RECON_LOCATION: { type: "string", filterable: true, sortable: true, editable: true },
                        START_RECONDITION: { type: "date", filterable: true, sortable: true, editable: false },
                        TARGET_FINISH_RECONDITION: { type: "date", filterable: true, sortable: false, editable: false },
                        STATUS_PROGRESS: { type: "number", filterable: true, sortable: true, editable: true },
                        STATUS_PROCESS: { type: "number", filterable: true, sortable: true, editable: true },
                        PROG_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        PROCESS_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        ACTUAL_FINISH_DATE: { type: "date", filterable: true, sortable: true, editable: true },
                        PERCENTS: { type: "number", filterable: true, sortable: true, editable: true }
                    }
                }
            }
        },
        sortable: true,
        pageable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains"
                }
            }
        },
        editable: "inline",
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        toolbar: ["excel" , {
            template: kendo.template($("#aplut").html())
        }, {
            template: kendo.template($("#dowload_ex").html())
        }],
        excel: {
            fileName: "Master_Data_Cost.xlsx",
            allPages: true,
        },
        columns: [

            {
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false,
                locked: true
            },
            {
                title: "ACTION", command: [
                    {
                        name: "update", text: " EDIT", click: function (e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            launchModal(dataItem);
                            
                        }, iconClass: "glyphicon glyphicon-edit"
                    }
                ]
                           , width: "140px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, locked: true
            },
              { field: 'DISTRIK', title: 'DISTRIK', width: "80px" },
              { field: 'SN', title: 'SN', width: "70px" },
              { field: 'CN', title: 'CN', width: "70px" },
              { field: 'DECISSION', title: 'DECISSION', width: "120px" },
              { field: 'RECON_LOCATION', title: 'RECON LOCATION', width: "130px" },
              { field: 'START_RECONDITION', title: 'START RECONDITION', width: "120px", format: "{0:yyyy-MM-dd}" },
              { field: 'TARGET_FINISH_RECONDITION', title: 'TARGET FINISH', width: "120px", format: "{0:yyyy-MM-dd}" },
              { field: 'PROG_DESC', title: 'STATUS PROGRESS', width: "90px" },
              { field: 'PROCESS_DESC', title: 'STATUS PROSES', width: "120px" },
              { field: 'ACTUAL_FINISH_DATE', title: 'ACTUAL FINISH DATE', width: "180px", format: "{0:yyyy-MM-dd}" },
              { field: 'PERCENTS', title: 'PERCENTS', width: "160px" }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });

    function launchModal(e) {
        $('#txt_cn').val(e.CN);
        //console.log(e);
        $("#wnd_update_monitoring").kendoWindow({
            modal: true,
            title: "",
            width: "67%",
            height: "68%",
            visible: false,
            draggable: true,
            pinned: true,
            resizable: false,
            close: function () {
            },
            open: function (e) {
                $("#txt_finish , #txt_start , #txt_actual").kendoDatePicker();

                var SourceProgress = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: $("#urlPath").val() + "/MonitoringRecondition/getPROGRESS_RECON",
                            dataType: "json",
                            type: "POST",
                            ache: false
                        }
                    },
                    schema: {
                        data: "Data",
                        total: "Total",
                    }

                });

                var SourceProcess = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: $("#urlPath").val() + "/MonitoringRecondition/getPROCESS_UR5",
                            dataType: "json",
                            type: "POST",
                            ache: false
                        }
                    },
                    schema: {
                        data: "Data",
                        total: "Total",
                    }

                });

                $("#drp_prog").kendoDropDownList({
                    optionLabel: "Select Progress",
                    dataTextField: "DESCRIPTION",
                    dataValueField: "PID_STATUS_RECON",
                    dataSource: SourceProgress,
                    filter: "contains"
                });

                $("#drp_proc").kendoDropDownList({
                    optionLabel: "Select Process",
                    dataTextField: "CODE_DETAIL",
                    dataValueField: "CODE_STATUS",
                    dataSource: SourceProcess,
                    filter: "contains",
                });

            }
        }).data("kendoWindow").center().open();

        $("#drp_proc").data('kendoDropDownList').value(e.STATUS_PROCESS);
        $("#drp_prog").data('kendoDropDownList').value(e.STATUS_PROGRESS);
        $("#txt_finish").data('kendoDatePicker').value(e.TARGET_FINISH_RECONDITION);
        $("#txt_start").data('kendoDatePicker').value(e.START_RECONDITION);
        $("#txt_actual").data('kendoDatePicker').value(e.ACTUAL_FINISH_DATE);
        $("#txt_location").val(e.RECON_LOCATION);
        $("#txt_percent").val(e.PERCENTS);

        if(e.STATUS_PROCESS == 1){
            $('#btn_save').hide(0);
        }else{
            $('#btn_save').show(0);
        }
    }
}

function download_excel(){
    window.location = $("#urlPath").val() +"/MonitoringRecondition/DownloadExcelMonitorRecond";
}

function upload_wnd(){
    $("#wnd_upload_data").kendoWindow({
        modal: true,
        title: "Upload Data Monitoring Recondition",
        width: "50%",
        height: "230",
        visible: false,
        draggable: true,
        pinned: true,
        close: function () {
        },
        open: function (e) {

        }
    }).data("kendoWindow").open().center();
}

function uploadFileExcel(e) {
    var files = e.files;
    $.each(files, function () {
        $("#fl_upload_exel").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/MonitoringRecondition/UploadInput?user='+($('#txt_user_nrp').val());
    });
}

function onErrorUploadExcel(e) {
    console.log(e);
}

function onSuccessUploadExcel(e) {
    var response = e.response;
    $.alert({
        title: response.title,
        content: response.content,
        theme: 'material',
        type: response.type,
        buttons: {
            okay: {
                text: 'close',
                btnClass: 'btn-'+response.type,
                action: function(){
                    $('#wnd_upload_data').data('kendoWindow').close();
                    $("#grid_monitoring").data('kendoGrid').dataSource.read();
                }
            }
        }
    });
}