$(document).ready(function () {
    loadgrid();

      $(document).on('keypress', '#txt_cus_name', function (event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $('#btn-cancel').click(function(){
        $("#wnd_frm_customer").data("kendoWindow").close();
    });

    $(document).on("input", "#txt_phone_number", function() {
        this.value = this.value.replace(/\D/g,'');
    });

    $('#btn-sbmit-update').click(function(){
        var email = $('#txt_EMAIL_ADDR').val();
        if(IsEmail(email)){
            var val = false;
            var message = "";
            if ($('#txt_cus_name').val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>customer name</b> correctly";
            } else if ($("#txt_cus_address").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Customer Adrress</b> correctly";
            } else if ($("#txt_phone_number").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Phone Number</b> correctly";
            }else if ($("#txt_EMAIL_ADDR").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Email Address</b> correctly";
            }else if ($("#drp_country").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Country</b> correctly";
            }else if ($("#drp_country").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>drp_status</b> correctly";
            }else{
                val = true
            }

            if (val == true) {
                $.confirm({
                    title: 'Confirmation',
                    content: 'You will Update this Customer ?<br>Click Save to continue',
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
                                var is_act = false;

                                if(document.getElementById('cbx_is_active').checked) {
                                    is_act = true;
                                } else {
                                    is_act = false;
                                }

                                var values_part = {
                                    cus_name : $('#txt_cus_name').val(),
                                    cus_addr : $('#txt_cus_address').val(),
                                    cus_phone : $('#txt_phone_number').val(),
                                    mail : $('#txt_EMAIL_ADDR').val(),
                                    country : parseInt($('#drp_country').val()),
                                    status : parseInt($('#drp_status').val()),
                                    is_active : is_act,
                                    pic : $('#txt_pic').val(),
                                    pid : $('#txt_pid_customer').val()
                                };

                                $.ajax({
                                    url: $("#urlPath").val() + "/CustomerData/UpdateCustomer",
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
                                                        $("#grid_customer").data('kendoGrid').dataSource.read();
                                                        $('#wnd_frm_customer').data('kendoWindow').close();
                                                    }
                                                }
                                            }
                                        });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        //console.log(textStatus, errorThrown);
                                        $.alert({
                                            title: "Error Jquery Post",
                                            content: errorThrown,
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
        }else{
            $.alert({
                title: 'Email Not Valid',
                content: 'Please input valid email with true format',
                theme: 'material',
                type: 'red',
                buttons: {
                    okay: {
                        text: 'OK',
                        btnClass: 'btn-red',
                        action: function(){
                            $('#txt_EMAIL_ADDR').val("");
                        }
                    }
                }
            });
        }
    });

    $('#btn-sbmit-insert').click(function(){
        var email = $('#txt_EMAIL_ADDR').val();
        if(IsEmail(email)){
            var val = false;
            var message = "";
            if ($('#txt_cus_name').val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>customer name</b> correctly";
            } else if ($("#txt_cus_address").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Customer Adrress</b> correctly";
            } else if ($("#txt_phone_number").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Phone Number</b> correctly";
            }else if ($("#txt_EMAIL_ADDR").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Email Address</b> correctly";
            }else if ($("#drp_country").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>Country</b> correctly";
            }else if ($("#drp_country").val().length == 0) {
                val = false;
                message = "sorry there is still an empty field, please enter the <b>drp_status</b> correctly";
            }else{
                val = true
            }

            if (val == true) {
                $.confirm({
                    title: 'Confirmation',
                    content: 'You will Insert New Customer ?<br>Click Save to continue',
                    theme: 'material',
                    closeIcon: true,
                    animation: 'rotateX',
                    closeAnimation: 'rotateX',
                    animateFromElement: false,
                    opacity: 0.5,
                    type: 'orange',
                    buttons: {
                        'confirm': {
                            text: 'Save',
                            btnClass: 'btn-orange',
                            action: function () {
                                var is_act = false;

                                if(document.getElementById('cbx_is_active').checked) {
                                    is_act = true;
                                } else {
                                    is_act = false;
                                }

                                var values_part = {
                                    cus_name : $('#txt_cus_name').val(),
                                    cus_addr : $('#txt_cus_address').val(),
                                    cus_phone : $('#txt_phone_number').val(),
                                    mail : $('#txt_EMAIL_ADDR').val(),
                                    country : parseInt($('#drp_country').val()),
                                    status : parseInt($('#drp_status').val()),
                                    is_active : is_act,
                                    pic : $('#txt_pic').val()
                                };
                                console.log(values_part);
                                $.ajax({
                                    url: $("#urlPath").val() + "/CustomerData/AddCustomer",
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
                                                        $("#grid_customer").data('kendoGrid').dataSource.read();
                                                        $('#wnd_frm_customer').data('kendoWindow').close();
                                                    }
                                                }
                                            }
                                        });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        console.log(textStatus, errorThrown);
                                        $.alert({
                                            title: "Error Jquery Post",
                                            content: errorThrown,
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
        }else{
            $.alert({
                title: 'Email Not Valid',
                content: 'Please input valid email with true format',
                theme: 'material',
                type: 'red',
                buttons: {
                    okay: {
                        text: 'OK',
                        btnClass: 'btn-red',
                        action: function(){
                            $('#txt_EMAIL_ADDR').val("");
                        }
                    }
                }
            });
        }
    });

    var source_country = new kendo.data.DataSource({
        transport: {
            read: {
                url: $("#urlPath").val() + "/CustomerData/GetCountry",
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

    var source_status = new kendo.data.DataSource({
        transport: {
            read: {
                url: $("#urlPath").val() + "/CustomerData/GetCusStatus",
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

    $("#drp_country").kendoDropDownList({
        dataTextField: "NICENAME",
        dataValueField: "ID",
        optionLabel: "Choose Country...",
        dataSource: source_country,
        filter: "contains",
        suggest: true
        // change: function (e) {
        //     var dataItem = this.dataItem(e.item);
        //     i_ujian_code = dataItem.JENIS_UJIAN_CODE;
        // }
    });

    $("#drp_status").kendoDropDownList({
        dataTextField: "CUS_DESC",
        dataValueField: "CUS_STATUS",
        dataSource: source_status,
        filter: "contains",
        suggest: true
    });

});

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(email)) {
       return false;
    }else{
       return true;
    }
  }

function add_new_customer(){
    $("#wnd_frm_customer").kendoWindow({
        modal: true,
        title: "Customer Update",
        width: "457",
        height: "95%",
        visible: false,
        draggable: true,
        pinned: true,
        resizable: false,
        close: function () {
        },
        open: function (e) {
            $('#btn-sbmit-update').hide();
            $('#btn-sbmit-insert').show();
        }
    }).data("kendoWindow").center().open();
}

function loadgrid() {
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
                    url: $("#urlPath").val() + "/CustomerData/ReadCustomerData",
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
            editable: {
                confirmation: "Anda yakin akan mengubah data ini ?",
                mode: "inline"
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "CUSTOMER_ID",
                    fields: {
                        CUSTOMER_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        CUS_NAME: { type: "string", filterable: true, sortable: true, editable: false,filterable: false,
                        locked: true },
                        CUS_ADDRESS: { type: "string", filterable: true, sortable: true, editable: true },
                        COUNTRY_CODE: { type: "number", filterable: true, sortable: true, editable: false },
                        COUNTRY_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        PIC: { type: "string", filterable: true, sortable: true, editable: false },
                        CUS_STATUS: { type: "number", filterable: true, sortable: true, editable: false },
                        CUS_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        EMAIL_ADDR: { type: "string", filterable: true, sortable: true, editable: false },
                        IS_ACTIVE: { type: "boolean", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
        sortable: true,
        toolbar: [{ template: kendo.template($("#tbh_n_custmr").html()) }],
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

                            var dataItem =  this.dataItem($(e.currentTarget).closest("tr"));
                            detail_customer(dataItem);
                        }, iconClass: "glyphicon glyphicon-edit"
                    }
                ]
                           , width: "140px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, locked: true
            },
              { field: 'CUS_NAME', title: 'Customer Name', width: "160px" },
              { field: 'CUS_ADDRESS', title: 'Address Of Customer', width: "250px" },
              { field: 'COUNTRY_NAME', title: 'COUNTRY', width: "170px"},
              { field: 'EMAIL_ADDR', title: 'MAIL', width: "180px" },
              { field: 'PIC', title: 'PIC', width: "110px" },
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}


function detail_customer(data){
    $("#wnd_frm_customer").kendoWindow({
        modal: true,
        title: "Customer Update",
        width: "457",
        height: "100%",
        visible: false,
        draggable: true,
        pinned: true,
        resizable: false,
        close: function () {
        },
        open: function (e) {
            $('#btn-sbmit-update').show();
            $('#btn-sbmit-insert').hide();

            $("#drp_country").data('kendoDropDownList').value(data.COUNTRY_CODE);
            $("#drp_status").data('kendoDropDownList').value(data.CUS_STATUS);
            $('#txt_cus_name').val(data.CUS_NAME);
            $('#txt_cus_address').val(data.CUS_ADDRESS);
            $('#txt_phone_number').val(data.PHONE_NUMBER);
            $('#txt_EMAIL_ADDR').val(data.EMAIL_ADDR);
            $('#cbx_is_active').prop('checked', data.IS_ACTIVE);
            $('#txt_pic').val(data.PIC);
            $('#txt_pid_customer').val(data.CUSTOMER_ID);
        }
    }).data("kendoWindow").center().open();
}

