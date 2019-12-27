var wnd_addUser;

var txt_gp = $("#txt_gp").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "Deskripsi",
    dataValueField: "GP_ID",
    filter: "contains",
    //onChange: function (e) {
    //    console.log(e);
    //},
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/AddUser/DD_GP",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
        schema: {
            data: "Data",
            total: "Total"
        }
    }
});

var txt_distrik = $("#txt_distrik").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "DSTRCT_CODE",
    dataValueField: "DSTRCT_CODE",
    filter: "contains",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/AddUser/DD_DISTRIK",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
        schema: {
            data: "Data",
            total: "Total"
        }
    }
});

function loadEmployee() {
    wnd_addUser.center().open();

    var grid_emp = $("#grid_emp").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/AddUser/AjaxRead",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data)
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        height: "480px",
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains"
                }
            }
        },
        sortable: true,
        pageable: true,
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
                command: [{ name: "select-data", text: $("#lblSelect").html(), click: SelectEmp }], width: "100px", title: "Action"
            }, {
               field: "NRP", title: "NRP", width: "90px"
           }, {
               field: "NAME", title: "Nama", width: "200px"
           }, {
               field: "DSTRCT_CODE", title: "Distrik", width: "70px"
           }, {
               field: "POS_TITLE", title: "Posisi", width: "150px"
           }, {
               field: "DIV_DESC", title: "Divisi", width: "150px"
           }, {
               field: "DEPT_DESC", title: "Dept", width: "200px"
           }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function SelectEmp(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    $("#txt_nrp").val(dataItem.NRP);
    $("#txt_distrik").data("kendoDropDownList").value(dataItem.DSTRCT_CODE);
    wnd_addUser.close();
}

function Insert() {
    
    var i_cls = {
        nrp: $("#txt_nrp").val(),
        distrik: ($("#txt_distrik").data("kendoDropDownList").value() == "Pilih") ? null : $("#txt_distrik").data("kendoDropDownList").value(),
        gp: ($("#txt_gp").data("kendoDropDownList").value() == "Pilih") ? null : $("#txt_gp").data("kendoDropDownList").value()
    }

    console.log(i_cls.gp_id);

    $.ajax({
        url: $("#urlPath").val() + "/AddUser/AjaxInsert",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(i_cls),
        type: "POST",
        success: function (data) {
            if (data.status == 1) {
                swal("Success!", data.message, "success");
                clear_component();
            } else {
                swal("Error!", data.message, "error");
                clear_component();
            }
        }
    });
}

function Cancel() {
    clear_component();
}

function clear_component() {
    $("#txt_nrp").val("");
    $("#txt_distrik").data("kendoDropDownList").value("");
    $("#txt_gp").data("kendoDropDownList").value("");
}

$(document).ready(function () {
    wnd_addUser = $("#wnd_addUser").kendoWindow({
        title: "Data Karyawan",
        width: "75%",
        height: "85%",
        modal: true,
        visible: false,
        draggable: true,
        actions: [
            "Minimize",
            "Close"
        ],
        pinned: true
    }).data("kendoWindow");
});