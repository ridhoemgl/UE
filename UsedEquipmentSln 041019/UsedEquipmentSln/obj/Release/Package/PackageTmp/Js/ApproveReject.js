var p_district;
var p_model;
var p_cn;
var p_status;

var apprReject = [{
        text: "Approve Demob",
        value: "1"
    },
    {
        text: "Reject Demob",
        value: "0"
    }
]

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
                    url: $("#urlPath").val() + "/ApproveReject/ReadApproveReject",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {

                    }
                },
                parameterMap: function(data, operation) {
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
                        CN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EGI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        SN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SITE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        TYPE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CLASS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CN_MODEL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PROD_YEAR: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        HM: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        LAST_RUNNING: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PO: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        IMPORTATION: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        LEASING: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAD: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAD_OUTS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        APPROVED: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAT_OUTS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATE_FAT: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        DELIVERY: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        RECEIVE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ETD: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ETA: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        STATUS_UNIT_UR2: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PROCESS_STATUS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        IS_APPROVE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        APPRV_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        REMARK: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
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
            messages: {}
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
                title: "ACTION",
                command: [{
                        name: "approve",
                        text: " APPROVE",
                        click: function(e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            p_district = dataItem.SITE;
                            p_model = dataItem.CN_MODEL;
                            p_cn = dataItem.CN;
                            console.log(dataItem);
                            saveApproveReject(1);
                            //wnd_approve_reject.open().center();
                        },
                        iconClass: "glyphicon glyphicon-edit"
                    },
                    {
                        name: "reject",
                        text: " REJECT",
                        click: function(e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            p_district = dataItem.SITE;
                            p_model = dataItem.CN_MODEL;
                            p_cn = dataItem.CN;
                            console.log(dataItem);
                            saveApproveReject(0);
                        },
                        iconClass: "glyphicon glyphicon-trash"
                    },
                ],
                width: "230px",
                attributes: {
                    style: "text-align: center"
                },
                headerAttributes: {
                    style: "text-align: center"
                },
                locked: true
            },
            {
                field: 'CLASS',
                title: 'CLASS',
                width: "100px"
            },
            {
                field: 'SITE',
                title: 'SITE',
                width: "100px"
            },
            {
                field: 'CN_MODEL',
                title: 'MODEL',
                width: "120px"
            },
            {
                field: 'CN',
                title: 'CN',
                width: "90px"
            },
            {
                field: 'SN',
                title: 'SN',
                width: "170px"
            },
            {
                field: 'PROD_YEAR',
                title: 'PROD YEAR',
                width: "120px"
            },
            {
                field: 'PO',
                title: 'PO',
                width: "120px"
            },
            {
                field: 'IMPORTATION',
                title: 'IMPORTATION',
                width: "120px"
            },
            {
                field: 'LEASING',
                title: 'LEASING',
                width: "120px"
            },
            {
                field: 'NO_FAD',
                title: 'FAD',
                width: "220px"
            },
            {
                field: 'APPROVED',
                title: 'APPROVED',
                width: "160px",
                format: "{0:yyyy-MM-dd HH:mm:ss}"
            },
            //{ field: 'AGING', title: 'Aging', width: "120px" },
            {
                field: 'NO_FAT',
                title: 'FAT',
                width: "220px"
            },
            {
                field: 'ETD',
                title: 'ETD',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'ETA',
                title: 'ETA',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'PROCESS_STATUS',
                title: 'PROCESS STATUS',
                width: "120px"
            },
            {
                field: 'REMARK',
                title: 'REMARK',
                width: "220px"
            },
            {
                field: 'IS_APPROVE',
                title: 'IS_APPROVE',
                width: "120px"
            }

        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

wnd_approve_reject = $("#wnd_approve_reject").kendoWindow({
    modal: true,
    title: "",
    width: "55%",
    height: "45%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function() {},
    open: function(e) {
        $("#txt_site").val(p_district);
        $("#txt_model").val(p_model);
        $("#txt_cn").val(p_cn);

        $("#dd_status").kendoDropDownList({
            autoBind: true,
            dataTextField: "text",
            dataValueField: "value",
            dataSource: apprReject,
            change: function(e) {
                var dataItem = this.dataItem(e.item)
                console.log(dataItem.value);
                p_status = dataItem.value
                $("#dd_status").val(p_status);
            },
            optionLabel: "Select"
        })
    }
}).data("kendoWindow").center();

function saveApproveReject(type) {
    if (type == 1) {
        //alert("1");
        var r = confirm("Are you sure to Approve ?");
        if (r == true) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: $("#urlPath").val() + "/ApproveReject/AjaxSaveApprReject?s_cn=" + p_cn + "&s_district=" + p_district + "&s_status=" + type,
                success: function(response) {
                    swal("Success!", response.message, "success");
                    $("#grid").data("kendoGrid").dataSource.read();
                },
            });
        }
    } else {
        //alert("0");
        var r = confirm("Are you sure to Reject ?");
        if (r == true) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: $("#urlPath").val() + "/ApproveReject/AjaxSaveApprReject?s_cn=" + p_cn + "&s_district=" + p_district + "&s_status=" + type,
                success: function(response) {
                    swal("Success!", response.message, "success");
                    $("#grid").data("kendoGrid").dataSource.read();
                },
            });
        }
    }
}

function save() {
    var district = $("#txt_site").val();
    var status_appr = $("#dd_status").data('kendoDropDownList').value();
    var iDataHeader = {
        CN: p_cn,
        DSTRCT_DISPOSAL: p_district,
        IS_APPROVE: status_appr
    }
    if (district == "" || district == null) {
        alert("Please fill District")
    } else if (status_appr == "" || status_appr == null) {
        alert("Please fill Status Demob");
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#urlPath").val() + "/ApproveReject/AjaxSaveApprReject?s_cn=" + p_cn + "&s_district=" + p_district + "&s_status=" + status_appr,
            //data: JSON.stringify({ sDataHeader: iDataHeader }),
            success: function(response) {
                wnd_approve_reject.close();
                swal("Success!", response.message, "success");
                $("#grid").data("kendoGrid").dataSource.read();
            },
        });
    }
}

function cancel() {
    wnd_approve_reject.close();
}

$(document).ready(function() {
    loadgrid();
});