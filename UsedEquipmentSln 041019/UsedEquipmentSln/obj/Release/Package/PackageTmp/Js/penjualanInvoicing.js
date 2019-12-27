$(document).ready(function() {
    loadgrid();

    $("#txt_amount_invoice , #txt_amount_factur , #txt_selling_price").keydown(function(event) {
        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }

        if ($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
            event.preventDefault();

    });
});


$("#btn_save").click(function() {

    var amount_invoice = 0;
    var amount_facture = 0;
    var selling_price = 0;

    $.confirm({
        title: 'Confirmation',
        content: 'Will you change the FAD data with the new input data? ?<br>Click Ok to continue',
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
                action: function() {


                    if ($('#txt_amount_invoice').val().length != 0) {
                        amount_invoice = parseFloat($('#txt_amount_invoice').val());
                    }

                    if ($('#txt_amount_factur').val().length != 0) {
                        amount_facture = parseFloat($('#txt_amount_factur').val());
                    }

                    if ($('#txt_selling_price').val().length != 0) {
                        selling_price = parseFloat($('#txt_selling_price').val());
                    }

                    if ($('#txt_selling_price').val().length != 0) {
                        selling_price = parseFloat($('#txt_selling_price').val());
                    }

                    if ($('#txt_cus_id').val().length == 0) {
                        $.alert({
                            title: "Parameter is Empty",
                            content: "sorry the data you selected doesn't have Some Primary parameter data, contact PIC for details",
                            theme: 'material',
                            type: "red",
                            buttons: {
                                okay: {
                                    text: 'OK',
                                    btnClass: 'btn-red'
                                }
                            }
                        });
                    } else {
                        var values_part = {
                            CN: $('#txt_cn').val(),
                            SALES_STATUS: $('#txt_sales_status').val(),
                            CUSTOMER_ID: $('#txt_cus_id').val(),
                            PJB_NUMBER: (($('#txt_pjb_number').val().length == 0) ? null : $('#txt_pjb_number').val()),
                            SELLING_PRICE: selling_price,
                            INVOICE_NUMBER: (($('#txt_invoice').val().length == 0) ? null : $('#txt_invoice').val()),
                            IVOICE_DATE: (($('#txt_invoice_date').val().length == 0) ? null : $('#txt_invoice_date').val()),
                            AMOUNT_INOVICE: amount_invoice,
                            STATUS_INVOICE: (($('#txt_invoice_status').val().length == 0) ? null : $('#txt_invoice_status').val()),
                            FAKTUR_NUMBER: (($('#txt_factur_number').val().length == 0) ? null : $('#txt_factur_number').val()),
                            STATUS_FAKTUR: (($('#txt_facture_status').val().length == 0) ? null : $('#txt_facture_status').val()),
                            FAKTUR_DATE: (($('#txt_facture_date').val().length == 0) ? null : $('#txt_facture_date').val()),
                            AMOUNT_FAKTUR: amount_facture
                        };
                        //console.log(values_part);
                        $.ajax({
                            url: $("#urlPath").val() + "/PenjualanInvoicing/SaveLastProcessUnitFAD",
                            type: "POST",
                            data: values_part,
                            success: function(resq) {
                                $.alert({
                                    title: resq.title,
                                    content: resq.content,
                                    theme: 'material',
                                    type: resq.type,
                                    buttons: {
                                        okay: {
                                            text: 'OK',
                                            btnClass: 'btn-' + resq.type,
                                            action: function() {
                                                $('#wnd_set_params').data('kendoWindow').close();
                                                $("#grid_ivoicing").data('kendoGrid').dataSource.read();
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

                }
            },
            cancel: function() {
                // Do Nothing
            }
        }
    });
});

$("#btn_browse_customer").click(function() {
    $("#wnd_customer").kendoWindow({
        modal: true,
        title: "Select Your Customer",
        width: "870",
        height: "84%",
        visible: false,
        draggable: true,
        pinned: true,
        resizable: false,
        close: function() {
            $('#grid_customer').data('kendoGrid').destroy();
        },
        open: function(e) {
            loadgcustomer();
        }
    }).data("kendoWindow").center().open();

});

function loadgcustomer() {
    $("#grid_customer").empty();
    var existingGrid = $('#grid_customer').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_customer").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PenjualanInvoicing/GetCustomerData",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {

                    }
                },
                parameterMap: function(data, operation) {
                    if (operation != "read") {

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
                    id: "CUSTOMER_ID",
                    fields: {
                        CUSTOMER_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CUS_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        COUNTRY_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PHONE_NUMBER: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CUS_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EMAIL_ADDR: {
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
            buttonCount: 20,
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
                    name: "update",
                    text: " select",
                    click: function(e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        $('#txt_cus_id').val(dataItem.CUSTOMER_ID);
                        $('#txt_cusname').val(dataItem.CUS_NAME);
                        $('#wnd_customer').data('kendoWindow').close();
                    },
                    iconClass: "glyphicon glyphicon-edit"
                }],
                width: "100px",
                attributes: {
                    style: "text-align: center"
                },
                headerAttributes: {
                    style: "text-align: center"
                },
                locked: true
            },
            {
                field: 'CUS_NAME',
                title: 'Customer Name',
                width: "150px"
            },
            {
                field: 'COUNTRY_NAME',
                title: 'Country Name',
                width: "130px"
            },
            {
                field: 'PHONE_NUMBER',
                title: 'Phone Number',
                width: "110px"
            },
            {
                field: 'CUS_DESC',
                title: 'Customer Description',
                width: "170px"
            },
            {
                field: 'EMAIL_ADDR',
                title: 'Mail Address',
                width: "220px"
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });


}

function loadgrid() {
    $("#grid_ivoicing").empty();
    var existingGrid = $('#grid_ivoicing').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_ivoicing").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "Keputusan Penjualan.xlsx",
            allPages: true,
        },
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PenjualanInvoicing/ReadPenjualanInvoicing",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {

                    }
                },
                parameterMap: function(data, operation) {
                    if (operation != "read") {

                    }
                    return kendo.stringify(data);
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            toolbar: ["excel"] ,
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
                        DISTRIK: {
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
                        MODEL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        DECISSION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        STATUS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        AMOUNT_FAKTUR: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        AMOUNT_INOVICE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CUSTOMER_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAKTUR_DATE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        IVOICE_DATE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAKTUR_NUMBER: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        INVOICE_NUMBER: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        MEDIATOR: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SELLING_PRICE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SALES_STATUS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        STATUS_FAKTUR: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        STATUS_INVOICE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
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
                field: 'CN',
                title: 'CN',
                width: "90px",
                template: '<a class=\"cn_item\">#=CN#</a>'
            },
            {
                field: 'DISTRIK',
                title: 'SITE',
                width: "100px"
            },
            {
                field: 'SN',
                title: 'SN',
                width: "110px"
            },
            {
                field: 'MODEL',
                title: 'DESCRIPTION',
                width: "340px"
            },
            {
                field: 'DECISSION',
                title: 'DECISSION',
                width: "120px"
            },
            {
                field: 'STATUS',
                title: 'STATUS',
                width: "120px"
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function(e) {
            $(".cn_item").bind("click", function(e) {
                var grid = $("#grid_ivoicing").data("kendoGrid");
                var row = $(e.target).closest("tr").toggleClass("k-state-selected");
                var dataItem = grid.dataItem(row);
                detail(dataItem);
            });
        }
    });
}

function detail(data) {
    $("#wnd_set_params").kendoWindow({
        modal: true,
        title: "Input Your Updated Data",
        width: "850",
        height: "87%",
        visible: false,
        draggable: true,
        pinned: true,
        resizable: false,
        close: function() {},
        open: function(e) {
            $("#txt_invoice_date , #txt_facture_date").kendoDatePicker({
                format: "dd/MM/yyyy"
            });
            $('#txt_cn').val(data.CN);
            $('#txt_sales_status').val(data.SALES_STATUS);
            $('#txt_cus_id').val(data.CUSTOMER_ID);
            $('#txt_cusname').val(data.CUS_NAME);
            $('#txt_pjb_number').val(data.PJB_NUMBER);
            $('#txt_selling_price').val(data.SELLING_PRICE);
            $('#txt_invoice').val(data.INVOICE_NUMBER);
            $('#txt_invoice_date').val(data.IVOICE_DATE);
            $('#txt_amount_invoice').val(data.AMOUNT_INOVICE);
            $('#txt_invoice_status').val(data.STATUS_INVOICE);
            $('#txt_factur_number').val(data.FAKTUR_NUMBER);
            $('#txt_facture_status').val(data.STATUS_FAKTUR);
            $('#txt_facture_date').val(data.FAKTUR_DATE);
            $('#txt_amount_factur').val(data.AMOUNT_FAKTUR);
        }
    }).data("kendoWindow").center().open();
}