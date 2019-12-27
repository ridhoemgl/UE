$(document).ready(function() {
    loadgrid();
});

function loadgrid() {
    $("#grid_plafon").empty();
    var existingGrid = $('#grid_plafon').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_plafon").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PlafonMaster/ReadPlafonData",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {

                    }
                },
                update: {
                    url: $("#urlPath").val() + "/PlafonMaster/UpdatePlafon",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(e) {
                        $.alert({
                            title: e.responseJSON.title,
                            content: e.responseJSON.content,
                            theme: 'material',
                            type: e.responseJSON.type,
                            buttons: {
                                okay: {
                                    text: 'OK',
                                    btnClass: 'btn-' + e.responseJSON.type,
                                    action: function() {
                                        $("#grid_plafon").data("kendoGrid").dataSource.read();
                                    }
                                }
                            }
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
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
            resizable: true,
            editable: {
                confirmation: "Anda yakin akan mengubah data ini ?",
                mode: "inline"
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "EGI",
                    fields: {
                        EGI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EGI_DESCRIPTION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PLAFON: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        REMARK: {
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
                command: ["edit"],
                width: "120px",
                attributes: {
                    style: "text-align: center"
                },
                headerAttributes: {
                    style: "text-align: center"
                },
                locked: true
            },
            {
                field: 'EGI',
                title: 'EGI',
                width: "110px"
            },
            {
                field: 'EGI_DESCRIPTION',
                title: 'KETERANGAN',
                width: "330px"
            },
            {
                field: 'PLAFON',
                title: 'PLAFON',
                width: "170px"
            },
            {
                field: 'REMARK',
                title: 'REMARK',
                width: "180px"
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}