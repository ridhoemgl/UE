$(document).ready(function () {
    loadgrid();

    $("#txt_price , #txt_weight").keydown(function (event) {
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
});

$('#btn_save_egi_besi').click(function() {

    var values_part = {
        user : $('#session_nrp').val(),
        price : parseFloat($('#txt_price').val()),
        weight : parseFloat($('#txt_weight').val()),
        egi : $('#txt_egi_').val(),
        type_desc : $('#txt_type').val()
    };

    var val = false;
        var message = "";
        if ($('#session_nrp').val().length == 0) {
            val = false;
            message = "sorry there is still an empty field, please enter the <b>NRP USER</b> correctly";
        } else if ($("#txt_price").val().length == 0) {
            val = false;
            message = "sorry there is still an empty field, please enter the <b>PRICE</b> correctly";
        } else if ($("#txt_weight").val().length == 0) {
            val = false;
            message = "sorry there is still an empty field, please enter the <b>WEIGHT</b> correctly";
        } else if ($("#txt_egi_").val().length == 0) {
            val = false;
            message = "sorry there is still an empty field, please enter the <b>EGI</b> correctly";
        }else{
            val = true;
        }

        if(val == true){
            $.ajax({
                url: $("#urlPath").val() + "/MasterWeightIron/save_weight",
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
                                    $("#grid_besi").data('kendoGrid').dataSource.read();
                                    $('#wnd_add_new , #wnd_egi_list').data('kendoWindow').close();
                                }
                            }
                        }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                   console.log(textStatus, errorThrown);
                }
            });
        }else{
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
})

$('#btn_bowse').click(function() {
    $("#wnd_egi_list").kendoWindow({
        modal: true,
        title: "",
        width: "43%",
        height: "78%",
        visible: false,
        draggable: true,
        pinned: true,
        resizable: false,
        close: function () {
        },
        open: function (e) {
            load_list_egi();
        }
    }).data("kendoWindow").center().open();
});

function load_list_egi(){
    if ($("#grid_egi").data().kendoGrid != null) {
        $('#grid_egi').data().kendoGrid.destroy(); // to destory instance            
        $('#grid_egi').empty(); // to destroy component
    }
    var RecNumerEq = 0;
    var grid = $("#grid_egi").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterWeightIron/ReadEgiFromShare",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    fields: {
                        EGI : { type: "string", filterable: true, sortable: true, editable: false },
                        EGI_DESCRIPTION : { type: "string", filterable: true, sortable: true, editable: false },
                        EQUIP_CLASS : { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
        height: 450,
        filterable: true,
        sortable: true,
        pageable: true,
        reorderable: true,
        resizable: true,
        groupable: true,
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
                title: "ACTION", command: [
                    {
                        name: "select", text: " select", click: function (e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            $('#txt_egi_').val($.trim(dataItem.EGI));
                            $('#wnd_egi_list').data('kendoWindow').close();
                        }, iconClass: "glyphicon glyphicon-ok"
                    }
                ]
                           , width: "110px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, locked: true
            },
            { field: "EGI", title: "EGI", width: "90px" },
            { field: "EGI_DESCRIPTION", title: "Description", width: "170px" },
            { field: "EQUIP_CLASS", title: "Class", width: "70px" }

        ],
        dataBinding: function () {
            //window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function loadgrid() {
    $("#grid_besi").empty();
    var existingGrid = $('#grid_besi').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }

    var grid = $("#grid_besi").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterWeightIron/ReadMasterWeight",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                create: {
                    url: $("#urlPath").val() + "/MasterWeightIron/CreateMasterWeight",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridEGI").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/MasterWeightIron/UpdateWeightData",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            $("#grid_besi").data("kendoGrid").dataSource.read();
                        }

                        $.alert({
                            title: e.responseJSON.title,
                            content: e.responseJSON.content,
                            theme: 'material',
                            type: e.responseJSON.type,
                            buttons: {
                                okay: {
                                    text: 'OK',
                                    btnClass: 'btn-'+e.responseJSON.type
                                }
                            }
                        });
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
                    id: "PID_TRANS",
                    fields: {
                        PID_TRANS: { type: "string", filterable: true, sortable: true, editable: false },
                        EGI: { type: "string", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                        WEIGHT: { type: "number", filterable: true, sortable: true, editable: true },
                        PRICE_BESI: { type: "number", filterable: true, sortable: true, editable: true },
                        CREATE_DATE: { type: "date", filterable: true, sortable: true, editable: false }
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
        toolbar: [{ template: kendo.template($("#add_btn_kendo").html()) }],
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
                command: ["edit"], title: "Action", width: "50px" ,
                text: {
                    edit: "Update Data",
                    update: "Update",
                    cancel: "Cancel"
                },
                attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
            }, {
                field: "EGI", title: "EGI", width: "40px"
            }, {
                field: "TYPE_DESC", title: "Jenis", width: "150px"
            }, {
                field: "WEIGHT", title: "Berat (kg)", width: "40px"
            }, {
                field: "PRICE_BESI", title: "Harga", width: "100px"
            }
        ],
        editable: {
            mode: "popup",
            confirmation: true
        },
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function grid_add(){
    $("#wnd_add_new").kendoWindow({
        modal: true,
        title: "",
        width: "270",
        height: "50%",
        visible: false,
        draggable: true,
        pinned: true,
        title: "Add New EGI Weight Price",
        resizable: false,
        close: function () {
        },
        open: function (e) {
            $("#btn_bowse").kendoButton();
        }
    }).data("kendoWindow").center().open();
}