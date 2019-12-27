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
                    url: $("#urlPath").val() + "/MappingUser/AjaxRead",
                    data: {
                        "s_gp_id": gp_id
                    },
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $('#urlPath').val() + '/MappingUser/AjaxDelete',
                    type: "POST",
                    contentType: "application/json",
                    cache: false,
                    complete: function (data) {
                        if (data.responseJSON.status == 1) {
                            $("#grid").data("kendoGrid").dataSource.read();
                            swal("Success!", data.responseJSON.remarks, "success");
                        }
                        else {
                            swal("Error!", data.responseJSON.remarks, "error");
                        }
                    }
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
                    id: "GP",
                    fields: {
                        GP: { type: "number", filterable: true, sortable: true, editable: false },
                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        Deskripsi: { type: "string", filterable: true, sortable: true, editable: false },
                        Deskripsi_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        ID: { type: "number", filterable: true, sortable: true, editable: false },
                        DISTRIK: { type: "string", filterable: true, sortable: true, editable: false },
                        NAMA: { type: "string", filterable: true, sortable: true, editable: false },
                        GENDER: { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
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
                command: ["destroy"], title: "Action", width: "50px"
            }, {
                field: "NRP", title: "NRP", width: "40px"
            }, {
                field: "NAMA", title: "NAMA", width: "150px"
            }, {
                field: "DISTRIK", title: "DISTRIK", width: "40px"
            }, {
                field: "Deskripsi_ID", title: "Deskripsi", width: "100px"
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

$(document).ready(function () {
    $("#txt_profile").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "Deskripsi",
        dataValueField: "Deskripsi",
        filter: "contains",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MappingUser/DD_PROFILE",
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
            //gp_id = dataItem.gp_id; //commented on 190919 11.16
            gp_id = dataItem.GP_ID;
            loadgrid();
            //console.log(dataItem.GP_ID);
        }
    });
});