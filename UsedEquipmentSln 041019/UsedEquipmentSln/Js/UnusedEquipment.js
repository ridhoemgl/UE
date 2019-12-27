var pid_used = $("#pid").val();
var last_hm = "";
var p_cn;
var p_district;

function loadgrid() {
    $("#grid").empty();
    var existingGrid = $('#grid').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnusedEquipment/ReadUnusedEquipment",
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
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "CN",
                    fields: {
                            CN: { type: "string", filterable: true, sortable: true, editable: false },
                            DISTRICT: { type: "string", filterable: true, sortable: true, editable: false },
                            SN: { type: "string", filterable: true, sortable: true, editable: true },
                            EGI: { type: "string", filterable: true, sortable: true, editable: true },
                            STATUS: { type: "string", filterable: true, sortable: true, editable: true },
                            EQ_Class: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_HM: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_FUEL_DATE: { type: "string", filterable: true, sortable: true, editable: true },
                            WR: { type: "string", filterable: true, sortable: true, editable: true },
                            WR_NUMBER: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_WO_DATE: { type: "string", filterable: true, sortable: true, editable: true },
                            WO_NUMBER: { type: "string", filterable: true, sortable: true, editable: true },
                            AGING: { type: "number", filterable: true, sortable: true, editable: true },
                            MODEL: { type: "string", filterable: true, sortable: true, editable: true },
                            HM: { type: "number", filterable: true, sortable: true, editable: true },
                            STATUS_UNIT_ELLIPS: { type: "string", filterable: true, sortable: true, editable: true },
                            COSTING_FLG: { type: "string", filterable: true, sortable: true, editable: true },
                            ACT_FLG: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_POSTED_DT_WR: { type: "string", filterable: true, sortable: true, editable: true },
                            STATUS_PID: { type: "number", filterable: true, sortable: true, editable: true },
                            STATUS_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                    }
                }
            }
        },
        sortable: true,
        pageable: true,
        //filterable: true,
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
        toolbar: [{
            template: kendo.template($("#export_excel").html())
        }],
        columns: [

            {
                title: "No",
                width: "30px",
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
                             p_cn = dataItem.CN;
                             p_district = dataItem.DISTRICT;
                             wnd_used_equip.open().center();
                         }, iconClass: "glyphicon glyphicon-edit"
                     },
                 ]
                           , width: "150px", locked: true, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
             },
              { field: 'DISTRICT', title: 'District', width: "100px" },
              { field: 'CN', title: 'CN', width: "120px"},
              { field: 'EGI', title: 'EGI', width: "120px" },
              { field: 'MODEL', title: 'Model', width: "250px" },
              { field: 'SN', title: 'SN', width: "90px" },
              { field: 'STATUS', title: 'STATUS', width: "100px" },
              { field: 'EQ_Class', title: 'EQ Class', width: "100px" },
              { field: 'LAST_HM', title: 'Last HM', width: "100px" },
              { field: 'LAST_FUEL_DATE', title: 'Fuel', width: "120px" },
              { field: 'WR', title: 'WR', width: "100px" },
              { field: 'WR_NUMBER', title: 'WR Number', width: "100px" },
              { field: 'LAST_WO_DATE', title: 'WO', width: "120px" },
              { field: 'WO_NUMBER', title: 'WO Number', width: "120px" },
              { field: 'AGING', title: 'Aging', width: "120px" },
              { field: 'STATUS_UNIT_ELLIPS', title: 'Status Unit Ellipse', width: "120px" },
              { field: 'COSTING_FLG', title: 'Costing Flag', width: "120px" },
              { field: 'ACT_FLG', title: 'Act Flag', width: "120px" },
              { field: 'STATUS_DESC', title: 'Actual Status', width: "120px" }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function dd_new_status(container, options) {
    $('<input required data-text-field="desc" data-value-field="code" data-bind="value:' + options.field + '" />')
    .appendTo(container).kendoDropDownList({
        dataSource: [
        { "code": 1, "desc": "Plan Dispose" },
        { "code": 2, "desc": "Stand by" },
        { "code": 3, "desc": "Repair" },
        { "code": 4, "desc": "Break Down" }
        ],
        dataTextField: "desc",
        dataValueField: "code",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
    }

function loadgridSummary() {
    $("#gridSummary").empty();
    var existingGrid = $('#gridSummary').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#gridSummary").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnusedEquipment/ReadSummaryEquipment",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    if (operation != "read") {
                    }
                    return kendo.stringify(data);
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: false,
            serverSorting: false,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "STATUS",
                    fields: {
                        STATUS: { type: "string", filterable: false, sortable: false, editable: false },
                        JUMLAH: { type: "number", filterable: false, sortable: false, editable: false },
                     
                    }
                }
            }
        },
        sortable: false,
        pageable: false,
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
        columns: [
            {
                title: "No",
                width: "20px",
                headerAttributes: { style: "text-align: center" }, attributes: { style: "text-align: center" },
                template: "#= ++rowNo #",
                filterable: false
            },
              { field: 'STATUS', title: 'Status', width: "150px", headerAttributes: { style: "text-align: center" }, attributes: { style: "text-align: center" } },
              { field: 'JUMLAH', title: 'Jumlah', width: "230px", headerAttributes: { style: "text-align: center" }, attributes: { style: "text-align: center" } }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function findData(event) {
    var searchValue = $("#txt_hm").val();
    
    if (searchValue == 0) {
        $.alert({
            title: "Last HM Empty",
            content: "Enter the last HM that you want to search",
            theme: 'material',
            type: "red",
            buttons: {
                okay: {
                    text: 'close',
                    btnClass: 'btn-red'
                }
            }
        });
    }
    else {
        SearcLastHM(searchValue);        
    };
}

function clearSearch() {
    $("#grid").data("kendoGrid").dataSource.filter({});
    $("#txt_hm").val("");
}

wnd_used_equip = $("#wnd_used_equip").kendoWindow({
    modal: true,
    title: "",
    width: "770",
    height: "320",
    visible: false,
    draggable: true,
    pinned: true,
    close: function () {
        $("#txt_district").val("");
        $("#txt_cn").val("");
        $("#txt_egi").val("");
        $("#txt_status_ur1").data('kendoDropDownList').value("");
    },
    open: function (e) {
        $("#txt_status_ur1").kendoDropDownList({
            optionLabel: "Select status",
            dataTextField: "STATUS_DESC",
            dataValueField: "STATUS_PID",
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: $("#urlPath").val() + "/UnusedEquipment/getStatusUR1",
                        contentType: "application/json",
                        type: "POST",
                        cache: false,
                        complete: function (data) {
                        }
                    }
                },
            },
            //filter: "contains",
        });
        getDataUsedEquip();
    }
}).data("kendoWindow").center();

function getDataUsedEquip() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/UnusedEquipment/AjaxGetUsedEquip?s_cn=" + p_cn +"&s_district="+p_district,
        success: function (response) {
            if (response.STATUS_PID != null) {
                $("#txt_status_ur1").data('kendoDropDownList').value(response.STATUS_PID);
            }
            $("#txt_district").val(response.DISTRICT);
            $("#txt_cn").val(response.CN);
            $("#txt_egi").val(response.EGI);
            //$("#txt_status_ur1").val(response.STATUS_DESC);
        },
    });
}

function save() {
    var status = $("#txt_status_ur1").data('kendoDropDownList').value();
    var remCN = p_cn.replace(/\s/g, '');
    var iDataHeader = {
          CN: remCN
        , DSTRCT_CODE: p_district
        , STATUS_PID: status
    }
    if (status == null || status == "") {
        $.alert({
            title: 'Form Not Complete',
            content: "Please fill all component",
            theme: 'material',
            type: 'red',
            buttons: {
                okay: {
                    text: 'OK',
                    btnClass: 'btn-red'
                }
            }
        });
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#urlPath").val() + "/UnusedEquipment/AjaxSaveUsedEquip",
            data: JSON.stringify({ sDataHeader: iDataHeader }),
            success: function (response) {
                wnd_used_equip.close();
                swal("Success!", response.message, "success");
                $("#grid").data("kendoGrid").dataSource.read();
                //window.location.href = $("#urlPath").val() + "/UnusedEquipment"
            },
        });
    }
}

function cancel() {
    wnd_used_equip.close();
}

$(document).ready(function () {
    $("#txt_hm").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#txt_hm").keydown(function (event) {
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
    loadgrid();
    loadgridSummary();
});

$("#btn_clear_stats").click(function(){
    $.confirm({
        title: 'Confirm',
        content: 'You will clear the status on CN '+p_cn+' ?',
        theme: 'material',
        closeIcon: true,
        animation: 'rotateX',
        closeAnimation: 'rotateX',
        animateFromElement: false,
        opacity: 0.5,
        type: 'blue',
        buttons: {
            'confirm': {
                text: 'Update',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        type: "POST",
                        data : {
                            cn : p_cn
                        },
                        url: $("#urlPath").val() + "/UnusedEquipment/ClearStatus",
                        success: function (response) {
                            if(response.error == false){
                                $("#grid").data("kendoGrid").dataSource.read();
                                cancel();
                            }

                            $.alert({
                                title: response.title,
                                content: response.content,
                                theme: 'material',
                                type: response.type,
                                buttons: {
                                    okay: {
                                        text: 'OK',
                                        btnClass: 'btn-'+response.type
                                    }
                                }
                            });
                        },
                    });
                }
            },
            cancel: function () {
                // Do Nothing
            }
        }
    });
    
});

function SearcLastHM(searchValue) {
    $("#grid").empty();
    var existingGrid = $('#grid').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnusedEquipment/SearchUnusedEquipment",
                    contentType: "application/json",
                    type: "POST",
                    data:{
                        dateinput : searchValue
                    },
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
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "CN",
                    fields: {
                            CN: { type: "string", filterable: true, sortable: true, editable: false },
                            DISTRICT: { type: "string", filterable: true, sortable: true, editable: false },
                            SN: { type: "string", filterable: true, sortable: true, editable: true },
                            EGI: { type: "string", filterable: true, sortable: true, editable: true },
                            STATUS: { type: "string", filterable: true, sortable: true, editable: true },
                            EQ_Class: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_HM: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_FUEL_DATE: { type: "string", filterable: true, sortable: true, editable: true },
                            WR: { type: "string", filterable: true, sortable: true, editable: true },
                            WR_NUMBER: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_WO_DATE: { type: "string", filterable: true, sortable: true, editable: true },
                            WO_NUMBER: { type: "string", filterable: true, sortable: true, editable: true },
                            AGING: { type: "number", filterable: true, sortable: true, editable: true },
                            MODEL: { type: "string", filterable: true, sortable: true, editable: true },
                            HM: { type: "number", filterable: true, sortable: true, editable: true },
                            STATUS_UNIT_ELLIPS: { type: "string", filterable: true, sortable: true, editable: true },
                            COSTING_FLG: { type: "string", filterable: true, sortable: true, editable: true },
                            ACT_FLG: { type: "string", filterable: true, sortable: true, editable: true },
                            LAST_POSTED_DT_WR: { type: "string", filterable: true, sortable: true, editable: true },
                            STATUS_PID: { type: "number", filterable: true, sortable: true, editable: true },
                            STATUS_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                    }
                }
            }
        },
        sortable: true,
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
        columns: [

            {
                title: "No",
                width: "30px",
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
                             p_cn = dataItem.CN;
                             p_district = dataItem.DISTRICT;
                             wnd_used_equip.open().center();
                         }, iconClass: "glyphicon glyphicon-edit"
                     },
                 ]
                           , width: "150px", locked: true, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
             },
              { field: 'DISTRICT', title: 'District', width: "100px" },
              { field: 'CN', title: 'CN', width: "120px"},
              { field: 'EGI', title: 'EGI', width: "120px" },
              { field: 'MODEL', title: 'Model', width: "250px" },
              { field: 'SN', title: 'SN', width: "90px" },
              { field: 'STATUS', title: 'STATUS', width: "100px" },
              { field: 'EQ_Class', title: 'EQ Class', width: "100px" },
              { field: 'LAST_HM', title: 'Last HM', width: "100px" },
              { field: 'LAST_FUEL_DATE', title: 'Fuel', width: "120px" },
              { field: 'WR', title: 'WR', width: "100px" },
              { field: 'WR_NUMBER', title: 'WR Number', width: "100px" },
              { field: 'LAST_WO_DATE', title: 'WO', width: "120px" },
              { field: 'WO_NUMBER', title: 'WO Number', width: "120px" },
              { field: 'AGING', title: 'Aging', width: "120px" },
              { field: 'STATUS_UNIT_ELLIPS', title: 'Status Unit Ellipse', width: "120px" },
              { field: 'COSTING_FLG', title: 'Costing Flag', width: "120px" },
              { field: 'ACT_FLG', title: 'Act Flag', width: "120px" },
              { field: 'STATUS_DESC', title: 'Actual Status', width: "120px" }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}
