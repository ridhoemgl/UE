$(document).ready(function() {
    loadgrid();
});
var grid;

$('#txt_search').on('input', function(e) {
    var grid = $('#grid_selec_CN').data('kendoGrid');
    var columns = grid.columns;

    var filter = {
        logic: 'or',
        filters: []
    };
    columns.forEach(function(x) {
        if (x.field) {
            var type = grid.dataSource.options.schema.model.fields[x.field].type;
            if (type == 'string') {
                filter.filters.push({
                    field: x.field,
                    operator: 'contains',
                    value: e.target.value
                })
            } else if (type == 'number') {
                if (isNumeric(e.target.value)) {
                    filter.filters.push({
                        field: x.field,
                        operator: 'eq',
                        value: e.target.value
                    });
                }

            } else if (type == 'date') {
                var data = grid.dataSource.data();
                for (var i = 0; i < data.length; i++) {
                    var dateStr = kendo.format(x.format, data[i][x.field]);
                    // change to includes() if you wish to filter that way https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
                    if (dateStr.startsWith(e.target.value)) {
                        filter.filters.push({
                            field: x.field,
                            operator: 'eq',
                            value: data[i][x.field]
                        })
                    }
                }
            } else if (type == 'boolean' && getBoolean(e.target.value) !== null) {
                var bool = getBoolean(e.target.value);
                filter.filters.push({
                    field: x.field,
                    operator: 'eq',
                    value: bool
                });
            }
        }
    });
    grid.dataSource.filter(filter);
});

$("#btn_uncheck").click(function() {
    if ($('#txt_search').val().length == 0) {
        $.alert({
            title: 'Parameter is incomplete',
            content: 'Enter the correct cn type. value is still empty',
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
        var datax = {
            type: $('#txt_search').val(),
            action: 0
        }
        $.ajax({
            url: $("#urlPath").val() + "/SelectCN/SelectCheckedList",
            type: "POST",
            data: datax,
            success: function(resq) {
                console.log(resq);
                if (resq.status == true) {
                    $("#grid_selec_CN").data('kendoGrid').dataSource.read();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }

});

$("#btn_check").click(function() {
    if ($('#txt_search').val().length == 0) {
        $.alert({
            title: 'Param Error',
            content: 'type CN is Empty',
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
        var datax = {
            type: $('#txt_search').val(),
            action: 1
        }
        $.ajax({
            url: $("#urlPath").val() + "/SelectCN/SelectCheckedList",
            type: "POST",
            data: datax,
            success: function(resq) {
                console.log(resq);

                if (resq.status == true) {
                    $("#grid_selec_CN").data('kendoGrid').dataSource.read();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }

});

function loadgrid() {
    $("#grid_selec_CN").empty();
    var existingGrid = $('#grid_selec_CN').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }

    var grid = $("#grid_selec_CN").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SelectCN/readSelectedCN",
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
            pageSize: 30,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            resizable: true,
            editable: {
                mode: "inline"
            },
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
                        IS_CHECK: {
                            type: "boolean",
                            filterable: true,
                            sortable: true,
                            editable: false,
                            filterable: true,
                            locked: true
                        },
                        DATE_SELECTED: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EQ_CLASS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TYPE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        }
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
        persistSelection: true,
        sortable: true,
        columns: [{
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false,
                locked: true
            },
            {
                field: "IS_CHECK",
                title: "Active",
                width: "90px",
                selectable: true,
                attributes: {
                    style: "text-align: center"
                },
                template: "<input id=\"check\" class=\"check_item\" type=\"checkbox\" #= IS_CHECK == true ?\"checked\":\"\" #  />"
            },
            {
                field: 'CN',
                title: 'CN',
                width: "80px"
            },

            {
                field: 'EQ_CLASS',
                title: 'Class',
                width: "90px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: 'TYPE',
                title: 'Type',
                width: "90px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: 'DATE_SELECTED',
                title: 'DATE SELECTED',
                width: "160px"
            },
        ],
        dataBound: function(e) {
            $(".check_item").bind("click", function(e) {
                var grid = $("#grid_selec_CN").data("kendoGrid");
                var row = $(e.target).closest("tr").toggleClass("k-state-selected");
                var dataItem = grid.dataItem(row);
                var is_checked = (row.prevObject[0].checked);

                var values_part = {
                    CN: dataItem.CN,
                    isChecked: is_checked
                };

                $.ajax({
                    url: $("#urlPath").val() + "/SelectCN/DeleteCNSelected",
                    type: "POST",
                    data: values_part,
                    success: function(resq) {
                        if (resq.status == true) {
                            //grid.dataSource.read();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $.alert({
                            title: "Error Posting Data",
                            content: textStatus,
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
        },
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getBoolean(str) {
    if ("true".startsWith(str)) {
        return true;
    } else if ("false".startsWith(str)) {
        return false;
    } else {
        return null;
    }
}