var gp_id = 99;

function loadgrid(s_gp_id) {
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
                    url: $("#urlPath").val() + "/MappingMenu/AjaxRead?s_gp_id=" + s_gp_id,
                    complete: function() {
                        getChecked();
                    },
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) {
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
                    id: "Primer",
                    fields: {
                        Primer: {
                            type: "number",
                            filterable: false,
                            sortable: true,
                            editable: false
                        },
                        Id: {
                            type: "number",
                            filterable: false,
                            sortable: true,
                            editable: false
                        },
                        GP_ID: {
                            type: "number",
                            filterable: false,
                            sortable: true,
                            editable: false
                        },
                        Menu: {
                            type: "string",
                            filterable: false,
                            sortable: true,
                            editable: false
                        },
                        ischeck: {
                            type: "boolean",
                            filterable: false,
                            sortable: true,
                            editable: true
                        },
                        a_: {
                            type: "boolean",
                            filterable: false,
                            sortable: true,
                            editable: true
                        },
                        d_: {
                            type: "boolean",
                            filterable: false,
                            sortable: true,
                            editable: true
                        },
                        e_: {
                            type: "boolean",
                            filterable: false,
                            sortable: true,
                            editable: true
                        },
                        r_: {
                            type: "boolean",
                            filterable: false,
                            sortable: true,
                            editable: true
                        }
                    }
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
            messages: {}
        },
        columns: [{
                title: "No",
                width: "30px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                field: "pid",
                title: "PID",
                hidden: true
            },
            {
                field: "primer",
                title: "Primer",
                hidden: true
            },
            {
                field: "gp_id",
                title: "GP ID",
                hidden: true
            },
            {
                field: "ischeck",
                title: "Is Check",
                width: "70px",
                template: $('#tmplt_is_check').html()
            },
            {
                field: "menu",
                title: "Menu",
                width: "500px"
            },
            {
                field: "a_",
                title: "Insert",
                width: "70px",
                template: $('#tmplt_a').html()
            },
            {
                field: "d_",
                title: "Delete",
                width: "70px",
                template: $('#tmplt_d').html()
            },
            {
                field: "e_",
                title: "Update",
                width: "70px",
                template: $('#tmplt_e').html()
            },
            {
                field: "r_",
                title: "Read",
                width: "70px",
                template: $('#tmplt_r').html()
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function getChecked() {
    var i = 0;
    $("#grid tbody tr").each(function() {
        var data = $("#grid").data("kendoGrid").dataSource.data();
        var rows = data[i];
        if (rows.ischeck == true) {
            $("#IS_SELECTED_check" + rows.pid).prop('checked', 1);
        }
        if (rows.a_ == true) {
            $("#IS_SELECTED_a" + rows.pid).prop('checked', 1);
        }
        if (rows.d_ == true) {
            $("#IS_SELECTED_d" + rows.pid).prop('checked', 1);
        }
        if (rows.e_ == true) {
            $("#IS_SELECTED_e" + rows.pid).prop('checked', 1);
        }
        if (rows.r_ == true) {
            $("#IS_SELECTED_r" + rows.pid).prop('checked', 1);
        }
        i++;
    });
}

function Save() {
    var arr_obj = [];
    var obj_check, obj_a, obj_d, obj_e, obj_r;
    var totalchecked = $("[type='checkbox']:checked").length;
    var i = 0;
    $("#grid tbody tr").each(function() {
        var data = $("#grid").data("kendoGrid").dataSource.data();
        var rows = data[i];
        if ($("#IS_SELECTED_check" + rows.pid).is(':checked').toString() == "true") {
            obj_check = 1;
        } else {
            obj_check = 0;
        }
        if ($("#IS_SELECTED_a" + rows.pid).is(':checked').toString() == "true") {
            obj_a = true;
        } else {
            obj_a = false;
        }
        if ($("#IS_SELECTED_d" + rows.pid).is(':checked').toString() == "true") {
            obj_d = true;
        } else {
            obj_d = false;
        }
        if ($("#IS_SELECTED_e" + rows.pid).is(':checked').toString() == "true") {
            obj_e = true;
        } else {
            obj_e = false;
        }
        if ($("#IS_SELECTED_r" + rows.pid).is(':checked').toString() == "true") {
            obj_r = true;
        } else {
            obj_r = false;
        }

        var i_cls_data = {
            GP_ID: rows.gp_id,
            Primer: rows.primer,
            isChek: obj_check,
            A: obj_a,
            D: obj_d,
            E: obj_e,
            R: obj_r
        }
        arr_obj.push(i_cls_data);
        i++;
    });

    console.log(arr_obj);

    if (arr_obj.length > 0) {
        $.ajax({
            url: $("#urlPath").val() + "/MappingMenu/AjaxUpdate",
            contentType: "application/json",
            dataType: "json",
            type: "POST",
            data: JSON.stringify(arr_obj),
            complete: function(data) {
                if (data.responseJSON.status == 1) {
                    swal("Success!", data.responseJSON.remarks, "success");
                    $("#grid").data("kendoGrid").dataSource.read();
                } else {
                    swal("Error!", data.responseJSON.remarks, "error");
                    $("#grid").data("kendoGrid").dataSource.read();
                }

            }
        });
    } else {
        swal("Error!", "Tidak ada data yang diproses!", "error");
    }
}

$(document).ready(function() {
    loadgrid(gp_id);

    $("#txt_profile").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "Deskripsi",
        dataValueField: "Deskripsi",
        filter: "contains",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MappingMenu/DD_PROFILE",
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
        select: function(e) {
            var dataItem = this.dataItem(e.item.index());
            //var dataItem = e.dataItem;
            //gp_id = dataItem.gp_id; //commented on 190919 11.36
            gp_id = dataItem.GP_ID;
            loadgrid(gp_id);
            //console.log(dataItem.GP_ID)
            //console.log(gp_id)
        }
    });
});