var priceType = "";
var p_cn;
var p_sn;
var p_district;

function loadgrid() {
    $("#gridInputDataCost").empty();
    var existingGrid = $('#gridInputDataCost').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#gridInputDataCost").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/InputDataCost/ReadInputDataCost",
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
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: 'CN',
                    fields: {
                        CN: { type: "string", filterable: true, sortable: true, editable: false },
                        SITE: { type: "string", filterable: true, sortable: true, editable: false },
                        SN: { type: "string", filterable: true, sortable: true, editable: true },
                        ABR_PATH: { type: "string", filterable: true, sortable: true, editable: true },
                        PO_LAUT: { type: "string", filterable: true, sortable: true, editable: true },
                        PO_DARAT_PRICE: { type: "number", filterable: true, sortable: true, editable: true },
                        PO_LAUT_PRICE: { type: "number", filterable: true, sortable: true, editable: true },
                        ABR_PATH_FILE: { type: "string", filterable: true, sortable: true, editable: true },
                        PRICE_DARAT_INPUT: { type: "number", filterable: true, sortable: true, editable: true },
                        PRICE_LAUT_INPUT: { type: "number", filterable: true, sortable: true, editable: true },
                        TOTAL_ESTIMATE_PLAN_REPAIR: { type: "number", filterable: true, sortable: true, editable: true },
                        PO_DARAT_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                        PO_LAUT_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                        PO: { type: "string", filterable: true, sortable: true, editable: true },
                        IS_APPROVE: { type: "number", filterable: true, sortable: true, editable: true },
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
        filterable: true,
        resizable: true,
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
        toolbar: ["excel", {
            template: kendo.template($("#aplut").html())
        }, {
            template: kendo.template($("#dowload_ex").html())
        }],
        excel: {
            fileName: "Master_Data_Cost.xlsx",
            allPages: true,
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
                template: function (e) {
                    return getHide(e, "ABR_PATH_FILE")
                },
                width: "240px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, locked: true
            },
              { field: 'CN', title: 'CN', width: "100px" },
              { field: 'SN', title: 'SN', width: "100px" },
              {
                  title: "DOWNLOAD Excel",
                  template: function (e) { return getTemplate(e, "ABR_PATH_FILE") },
                  width: "150px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, locked: false
              },
              { field: "PO_LAUT", title: "PO LAUT", width: "120px" },
              { field: "PO_DARAT_PRICE", title: "PO DARAT PRICE", width: "120px" },
              { field: "PO_LAUT_PRICE", title: "PO LAUT PRICE", width: "120px" },
              { field: "PO_DARAT_DESC", title: "PO DARAT DESC", width: "220px" },
              { field: "PO_LAUT_DESC", title: "PO LAUT DESC", width: "220px" },
              { field: "PRICE_DARAT_INPUT", title: "PRICE DARAT INPUT", width: "120px" },
              { field: "PRICE_LAUT_INPUT", title: "PRICE LAUT INPUT", width: "120px" },

        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
    });
}

function download_excel() {
    window.location = $("#urlPath").val() + "/InputDataCost/DownloadExcelInputDataCost";
}

function getHide(e) {
    var hide = e.HIDE_CANCEL

    if (hide == 0) {
        return '<a class="k-button k-button-icontext k-primary k-grid-update" onclick="hideEdit(\'' + e.CN + "|" + e.SN + "|" + e.SITE + '\')" ><span class="glyphicon glyphicon-edit k-update"></span> EDIT</a>'
    }
    else {
        return '<a class="k-button k-button-icontext k-primary k-grid-update" onclick="hideEdit(\'' + e.CN + "|" + e.SN + "|" + e.SITE + '\')"><span class="glyphicon glyphicon-edit k-update"></span> EDIT</a> ' +
                '<a class="k-button k-button-icontext k-grid-cancel_demob" onclick="hideCancel(\'' + e.CN + "|" + e.SN + "|" + e.SITE + '\')"><span class="glyphicon glyphicon-remove "></span> CANCEL DEMOB</a>'
    }
}

function hideEdit(str) {
    p_cn = str.split('|')[0]
    p_sn = str.split('|')[1]
    p_district = str.split('|')[2]

    wnd_input_data_cost.open().center();
}

function hideCancel(str) {
    CN = str.split('|')[0]
    SITE = str.split('|')[2]

    $.confirm({
        icon: 'fa fa-question',
        title: 'Dephead confirmation',
        content: 'Will you cancel this data cost transaction ?',
        theme: 'material',
        closeIcon: true,
        animation: 'scale',
        type: 'red',
        buttons: {
            'confirm': {
                text: 'continue',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: $("#urlPath").val() + "/InputDataCost/AjaxCancelDemob",
                        data: {
                            s_cn: CN,
                            s_district: SITE
                        },
                        success: function (resq) {
                            $.alert({
                                title: resq.title,
                                content: resq.content,
                                theme: 'material',
                                type: resq.type,
                                buttons: {
                                    okay: {
                                        text: 'OK',
                                        btnClass: 'btn-' + resq.type,
                                        action: function () {
                                            location.reload();
                                        }
                                    }
                                }
                            });
                        },
                    });
                }
            },
            cancel: function () { }
        }
    });
}


function getTemplate(e, fieldName) {
    var param = e.CN + '#' + e.ABR_PATH_FILE

    if (e.ABR_PATH_FILE == null) {
        return ""
    }
    else {
        return '<a class="k-button k-button-icontext k-primary"  onclick="downloadPdf(\'' + param + '\')"><span class="glyphicon glyphicon-download"></span> Download</a>'
    }
}

function loadGridPOPrice() {
    if ($("#grid_po_price").data().kendoGrid != null) {
        $('#grid_po_price').data().kendoGrid.destroy(); // to destory instance            
        $('#grid_po_price').empty(); // to destroy component
    }
    var RecNumerEq = 0;
    var grid = $("#grid_po_price").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/InputDataCost/AjaxReadPOPrice",
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
                    id: "PO",
                    fields: {
                        PO: { type: "string", filterable: true, sortable: true, editable: true },
                        KODE_ITEM: { type: "string", filterable: true, sortable: true, editable: true },
                        DESKRIPSI: { type: "string", filterable: true, sortable: true, editable: true },
                        HARGA: { type: "string", filterable: true, sortable: true, editable: true },
                        FREIGHT_CODE: { type: "string", filterable: true, sortable: true, editable: true }
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
                command: [{ text: "Select", name: "select", click: SelectPrice }], title: "&nbsp;", width: "80px"
            },
            { field: "PO", title: "PO", width: "120px" },
            { field: "KODE_ITEM", title: "KODE_ITEM", width: "120px" },
            { field: "DESKRIPSI", title: "DESKRIPSI", width: "220px" },
            { field: "HARGA", title: "HARGA", width: "120px" },
            { field: "FREIGHT_CODE", title: "FREIGHT_CODE", width: "120px" },

        ],
        dataBinding: function () {
            //window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

//wnd_new_input_data_cost = $("#wnd_new_input_data_cost").kendoWindow({
//    modal: true,
//    title: "",
//    width: "100%",
//    height: "100%",
//    visible: false,
//    draggable: true,
//    pinned: true,
//    close: function () {
//    },
//    open: function (e) {
//    }
//}).data("kendoWindow").center();

wnd_input_data_cost = $("#wnd_input_data_cost").kendoWindow({
    modal: true,
    title: "Input Data Cost",
    width: "800",
    height: "93%",
    visible: false,
    draggable: false,
    pinned: true,
    resizable: false,
    close: function () {
        $("#txt_po_price_darat").val("");
        $("#txt_po_price_darat_desc").val("");
        $("#ta_po_price_darat_desc").val("");
        $("#txt_po_price_laut").val("");
        $("#txt_po_price_laut_desc").val("");
        $("#ta_po_price_laut_desc").val("");
        $("#txt_price_unit_darat").val("");
        $("#txt_price_unit_laut").val("");
        $("#txt_total_est_plan_repair").val("");
        $("#flag_upload").val("");
        $("#file_abr_desc").text("ABR File (PDF)");
    },
    open: function (e) {
        $("#txt_cn").val(p_cn);
        $("#txt_sn").val(p_sn);
        $("#txt_abr_file").kendoUpload({
            async: {
                saveUrl: "save",
                removeUrl: "remove",
                autoUpload: true
            },
            multiple: false,

            upload: uploadFile,
            success: onSuccessUpload,
            error: onErrorUpload
        });

        $(".k-upload-files > li").remove();
        getDataInputDataCost();
    }
}).data("kendoWindow").center();

function getDataInputDataCost() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/InputDataCost/AjaxGetDetailInputDataCost?s_cn=" + p_cn + "&s_district=" + p_district,
        success: function (response) {
            if (response.PO_DARAT != null) {
                $("#txt_po_price_darat_desc").val(response.PO_DARAT);
            }
            if (response.PO_DARAT_PRICE != null) {
                $("#txt_po_price_darat").val(response.PO_DARAT_PRICE);
            }
            if (response.PO_LAUT != null) {
                $("#txt_po_price_laut_desc").val(response.PO_LAUT);
            }
            if (response.PO_LAUT_PRICE != null) {
                $("#txt_po_price_laut").val(response.PO_LAUT_PRICE);
            }
            if (response.PRICE_DARAT_INPUT != null) {
                $("#txt_price_unit_darat").val(response.PRICE_DARAT_INPUT);
            }
            if (response.PRICE_LAUT_INPUT != null) {
                $("#txt_price_unit_laut").val(response.PRICE_LAUT_INPUT);
            }
            if (response.TOTAL_ESTIMATE_PLAN_REPAIR != null) {
                $("#txt_total_est_plan_repair").val(response.TOTAL_ESTIMATE_PLAN_REPAIR);
            }
            if (response.PO_DARAT_DESC != null) {
                $("#ta_po_price_darat_desc").val(response.PO_DARAT_DESC);
            }
            if (response.PO_LAUT_DESC != null) {
                $("#ta_po_price_laut_desc").val(response.PO_LAUT_DESC);
            }
            if (response.ABR_PATH_FILE != null) {
                $("#file_abr_desc").show();
                var myElement = document.getElementById("file_abr_desc");
                myElement.innerHTML = "<p style='color:red;'>Uploaded!</p>";
            }
        },
    });
}

function uploadFile(e) {
    var files = e.files;
    $.each(files, function () {
        $("#txt_abr_file").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/InputDataCost/UploadPdf?CN=' + p_cn;
    });
}
function onErrorUpload(e) {
    console.log(e);
}

function onSuccessUpload(e) {
    if (e.response.status == 1) {
        $("#gridInputDataCost").data("kendoGrid").dataSource.read();
        $(".img-responsive").remove();
        $("#flag_upload").val(e.response.data);
        $("#txt_total_est_plan_repair").val(e.response.excel_val.replace(/,/g, "."));

    }

    $.alert({
        title: e.response.header,
        content: e.response.remarks,
        theme: 'material',
        type : e.response.type,
        buttons: {
            okay: {
                text: 'OK',
                btnClass: 'btn-'+e.response.type
            }
        }
    });
}

function downloadPdf(param) {
    var cn = param.split('#')[0]
    var path = param.split('#')[1]
    window.location =  $("#urlPath").val() +"/InputDataCost/DownloadFile?&cn=" + cn;
}

wnd_POPrice = $("#wnd_POPrice").kendoWindow({
    modal: true,
    title: "Select Price",
    width: "65%",
    height: "80%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function () {
    },
    open: function (e) {
        loadGridPOPrice();
    }
}).data("kendoWindow").center();

function SelectPrice(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    if (priceType == "DARAT") {
        $("#txt_po_price_darat").val(dataItem.HARGA);
        $("#txt_po_price_darat_desc").val(dataItem.PO);
        $("#ta_po_price_darat_desc").val(dataItem.DESKRIPSI);
    } else {
        $("#txt_po_price_laut").val(dataItem.HARGA);
        $("#txt_po_price_laut_desc").val(dataItem.PO);
        $("#ta_po_price_laut_desc").val(dataItem.DESKRIPSI);
    }
    wnd_POPrice.close();
}

function findPrice(type) {
    if (type == 1) {
        priceType = "DARAT";
        wnd_POPrice.open().center();
    } else {
        priceType = "LAUT";
        wnd_POPrice.open().center();
    }
}

function save() {
    var po_price_darat = $("#txt_po_price_darat").val();
    var po_price_darat_desc = $("#txt_po_price_darat_desc").val();
    var ta_po_price_darat_desc = $("#ta_po_price_darat_desc").val();
    var po_price_laut = $("#txt_po_price_laut").val();
    var po_price_laut_desc = $("#txt_po_price_laut_desc").val();
    var ta_po_price_laut_desc = $("#ta_po_price_laut_desc").val();
    var price_darat = $("#txt_price_unit_darat").val();
    var price_laut = $("#txt_price_unit_laut").val();
    var total_estimate = $("#txt_total_est_plan_repair").val();
    var flag_upload = $("#flag_upload").val();

    var len_price_unit_darat = $('#txt_price_unit_darat').val().length;
    var len_price_unit_laut = $('#txt_price_unit_laut').val().length;
    var len_total_estimate = $('#txt_total_est_plan_repair').val().length;
    var iDataHeader = {
        CN: p_cn
        , DSTRCT_DISPOSAL: p_district
        , PO_DARAT: po_price_darat_desc //PO Darat Description
        , PO_LAUT: po_price_laut_desc //PO Laut Description
        , PO_DARAT_PRICE: parseFloat(po_price_darat)
        , PO_LAUT_PRICE: parseFloat(po_price_laut)
        , ABR_PATH_FILE: flag_upload
        , PRICE_DARAT_INPUT: parseFloat(price_darat)
        , PRICE_LAUT_INPUT: parseFloat(price_laut)
        , TOTAL_ESTIMATE_PLAN_REPAIR: total_estimate
        , PO_DARAT_DESC: ta_po_price_darat_desc
        , PO_LAUT_DESC: ta_po_price_laut_desc
    }
    console.log(iDataHeader);
    debugger;
    // if (po_price_darat == "" || po_price_darat == null) {
    //     SetAllertErr("Please fill PO Price Darat");
    // } else if (po_price_laut == "" || po_price_laut == null) {
    //     SetAllertErr("Please fill PO Price Laut");
    // } else if (price_darat == "" || price_darat == null) {
    //     SetAllertErr("Please fill Price Darat");
    // } else if (price_laut == "" || price_laut == null) {
    //     SetAllertErr("Please fill Price Laut");
    // } else if (total_estimate == "" || total_estimate == null) {
    //     SetAllertErr("Please fill Total Estimate Plan Repair");
    // } else if (flag_upload == "" || flag_upload == null) {
    //     SetAllertErr("Please upload ABR File in PDF");
    // }
    if (len_price_unit_darat > 20) {
        SetAllertErr("Maximal Price Unit Darat is 20 characters");
    } else if (len_price_unit_laut > 20) {
        SetAllertErr("Maximal Price Unit Laut is 20 characters");
    } else if (len_total_estimate > 20) {
        SetAllertErr("Maximal Total Estimate Repair is 20 characters");
    }
    else {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#urlPath").val() + "/InputDataCost/AjaxSaveCancelDemob",
            data: JSON.stringify({ sDataHeader: iDataHeader }),
            success: function (response) {
                wnd_input_data_cost.close();
                swal("Success!", response.message, "success");
                $("#gridInputDataCost").data("kendoGrid").dataSource.read();
            },
        });
    }
}

function SetAllertErr(messag) {
    $.alert({
        title: "This Action Contain Error",
        content: messag,
        theme: 'material',
        type: "red"
    });
}

function uploadFileExcel(e) {
    var files = e.files;
    $.each(files, function () {
        $("#fl_upload_exel").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/InputDataCost/UploadInput?user=' + ($('#txt_user_nrp').val());
    });
}

function onErrorUploadExcel(e) {
    console.log(e);
}

function onSuccessUploadExcel(e) {
    var response = e.response;
    $.alert({
        title: response.title,
        content: response.content,
        theme: 'material',
        type: response.type,
        buttons: {
            okay: {
                text: 'close',
                btnClass: 'btn-' + response.type,
                action: function () {
                    $('#wnd_upload_data').data('kendoWindow').close();
                    $("#gridInputDataCost").data("kendoGrid").dataSource.read();
                }
            }
        }
    });
}

function cancel() {
    wnd_input_data_cost.close();
}

function btnCheck() {
    var val = $("#txt_test").val();
    var len = $('#txt_test').val().length;
    if (len > 10) {
        SetAllertErr("Maximal is 10 characters");
    } else { alert(val) }
}

function upload_wnd() {
    $("#wnd_upload_data").kendoWindow({
        modal: true,
        title: "Upload Data Cost",
        width: "50%",
        height: "230",
        visible: false,
        draggable: true,
        pinned: true,
        close: function () {
        },
        open: function (e) {
            loadGridPOPrice();
        }
    }).data("kendoWindow").open().center();
}

$(document).ready(function () {
    loadgrid();
    var arr = [ 1 , 2 ];
    var cur_profilem = parseInt($('#txt_profile').val());
    var resu = jQuery.inArray(cur_profilem, arr);
    if(resu == 0){
        $('#div_upload').show(0);
    }else{
        $('#div_upload').hide(0);
    }

    $("#txt_total_est_plan_repair").change(function() {
        var ev = $(this).val();
        $(this).val(ev.replace(/,/g, "."))
    });

    $("#fl_upload_exel").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: false
        },
        multiple: false,

        upload: uploadFileExcel,
        success: onSuccessUploadExcel,
        error: onErrorUploadExcel
    });

    $("#txt_price_unit_darat , #txt_price_unit_laut , #txt_total_est_plan_repair").keydown(function (event) {
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