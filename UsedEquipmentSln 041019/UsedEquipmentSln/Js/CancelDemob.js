var priceType = "";
var p_cn;
var p_sn;
var p_district;

function loadgrid() {
    $("#gridCancelDemob").empty();
    var existingGrid = $('#gridCancelDemob').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#gridCancelDemob").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/CancelDemob/ReadCancelDemob",
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
                        PO_LAUT: { type: "string", filterable: true, sortable: true, editable: true },
                        PO_DARAT_PRICE: { type: "number", filterable: true, sortable: true, editable: true },
                        PO_LAUT_PRICE: { type: "number", filterable: true, sortable: true, editable: true },
                        ABR_PATH_FILE: { type: "string", filterable: true, sortable: true, editable: true },
                        PRICE_DARAT_INPUT: { type: "number", filterable: true, sortable: true, editable: true },
                        PRICE_LAUT_INPUT: { type: "number", filterable: true, sortable: true, editable: true },
                        TOTAL_ESTIMATE_PLAN_REPAIR: { type: "number", filterable: true, sortable: true, editable: true },
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
        //change: onChange,
        pageable: true,
        filterable: true,
        resizable: true,
        //edit: onEdit,
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
        //toolbar: ["create"],
        columns: [
            {
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                title: "ACTION", command: [
                    {
                        name: "update", text: " EDIT", click: function (e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            p_cn = dataItem.CN;
                            p_sn = dataItem.SN;
                            p_district = dataItem.SITE;
                            console.log(dataItem);
                            wnd_cancel_demob.open().center();
                        }, iconClass: "glyphicon glyphicon-edit"
                    },
                ]
                , width: "130px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
            },
              { field: 'CN', title: 'CN', width: "120px" },
              { field: 'SN', title: 'SN', width: "160px" },
              //{ field: "is_panitia", title: "Status", width: "70px", editor: dd_isPanitia, template: "#=is_panitia==0?'PESERTA':'PANITIA'#" },
              { field: "PO_LAUT", title: "PO LAUT", width: "120px" },
              { field: "PO_DARAT_PRICE", title: "PO DARAT PRICE", width: "120px" },
              { field: "PO_LAUT_PRICE", title: "PO LAUT PRICE", width: "120px" },
              { field: "PRICE_DARAT_INPUT", title: "PRICE DARAT INPUT", width: "120px" },
              { field: "PRICE_LAUT_INPUT", title: "PRICE LAUT INPUT", width: "120px" },
              { field: "ABR_PATH_FILE", title: "ABR FILE", width: "250px"}, //wajib pdf
              //{ field: "ABR_PATH_FILE", title: "ABR FILE", width: "120px", template: $('#tmplt_btn_upload').html(), headerAttributes: { style: "text-align: center" }, attributes: { style: "text-align: center" } }, //wajib pdf

        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
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
                    url: $("#urlPath").val() + "/CancelDemob/AjaxReadPOPrice",
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

function getPriceDarat(container, options) {
    $('<div class="input-group">' +
        '<input type="text" disabled class="form-control" name="PO_DARAT_PRICE" data-text-field="PO_DARAT_PRICE" data-value-field="PO_DARAT_PRICE" data-bind="value:' + options.field + '">' +
        '<span class="input-group-btn">' +
            '<button class="btn btn-default" onclick="openGridEventPOPrice(1)" type="button"><i class="icon-search4"></i></button>' +
        '</span></div>')
   .appendTo(container);
}

function getPriceLaut(container, options) {
    $('<div class="input-group">' +
        '<input type="text" disabled class="form-control" name="PO_LAUT_PRICE" data-text-field="PO_LAUT_PRICE" data-value-field="PO_LAUT_PRICE" data-bind="value:' + options.field + '">' +
        '<span class="input-group-btn">' +
            '<button class="btn btn-default" onclick="openGridEventPOPrice(2)" type="button"><i class="icon-search4"></i></button>' +
        '</span></div>')
   .appendTo(container);
}

function openGridEventPOPrice(type) {
    if (type == 1)
        priceType = "DARAT";
    else if (type == 2)
        priceType = "LAUT";

    loadGridPOPrice();
    wnd_POPrice.open().center();
}

wnd_cancel_demob = $("#wnd_cancel_demob").kendoWindow({
    modal: true,
    title: "",
    width: "55%",
    height: "83%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function () {
        $("#txt_po_price_darat").val("");
        $("#txt_po_price_darat_desc").val("");
        $("#txt_po_price_laut").val("");
        $("#txt_po_price_laut_desc").val("");
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
                autoUpload: false
            },
            multiple: false,

            upload: uploadFile,
            success: onSuccessUpload,
            error: onErrorUpload
        });
        getDataCancelDemob();
    }    
}).data("kendoWindow").center();

function getDataCancelDemob() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/CancelDemob/AjaxGetDetailCancelDemob?s_cn=" + p_cn + "&s_district=" + p_district,
        success: function (response) { 
            console.log(response);
            if (response.PO_DARAT!= null) {
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
            if (response.ABR_PATH_FILE != null) {
                var myElement = document.getElementById("file_abr_desc");
                myElement.innerHTML = "<p style='color:red;'>Uploaded!</p>";
                //$("#file_abr_desc").text("<p>Uploaded!</p>");
                //$("#file_abr_desc").css("color", '#FF0000 !important');
                //$(this).css('color', '#FF0000 !important');
            }
        },
    });
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

function custUploadABR() {
    $("#txt_abr_file").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: false
        },
        multiple: false,

        upload: uploadFile,
        success: onSuccessUpload,
        error: onErrorUpload
    });
}

function uploadFile(e) {
    var files = e.files;
    $.each(files, function () {
        $("#txt_abr_file").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/CancelDemob/UploadPdf';
    });
}

function onSuccessUpload(e) {
    //console.log(e);
    if (e.response.status == 1) {
        swal("Success!", e.response.remarks, "success");
        $(".img-responsive").remove();
        $("#flag_upload").val(e.response.data);
    }
    else {
        swal("Error!", e.response.remarks, "error");
    }
}

//remove class warning kendo upload
/*
$("#files").kendoUpload({
  //...
  success: function () {
     $(".k-upload-files.k-reset").find("li").remove();
  }
});
*/

function onErrorUpload(e) {
    console.log(e);
    //if (e.response.status == 0) {
    //    alert(e.response.remarks);
    //}
    //else {
    //    alert(e.response.remarks);
    //}

    //remove class warning
    //if (this.wrapper.find(".k-file-error").length === 0) {
    //    this.wrapper.find(".k-upload-status-total .k-warning").removeClass("k-warning").addClass("k-i-tick");
    //}
}

function SelectPrice(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    //console.log(dataItem);
    //console.log(priceType);
    if (priceType == "DARAT") {
        $("#txt_po_price_darat").val(dataItem.HARGA);
        $("#txt_po_price_darat_desc").val(dataItem.PO);
    } else {
        $("#txt_po_price_laut").val(dataItem.HARGA);
        $("#txt_po_price_laut_desc").val(dataItem.PO);
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
    var po_price_laut = $("#txt_po_price_laut").val();
    var po_price_laut_desc = $("#txt_po_price_laut_desc").val();
    var price_darat = $("#txt_price_unit_darat").val();
    var price_laut = $("#txt_price_unit_laut").val();
    var total_estimate = $("#txt_total_est_plan_repair").val();
    var flag_upload = $("#flag_upload").val();
    var iDataHeader = {
          CN: p_cn
        , DSTRCT_DISPOSAL: p_district
        , PO_DARAT: po_price_darat_desc //PO Darat Description
        , PO_LAUT: po_price_laut_desc //PO Laut Description
        , PO_DARAT_PRICE: po_price_darat
        , PO_LAUT_PRICE: po_price_laut
        , ABR_PATH_FILE: flag_upload
        , PRICE_DARAT_INPUT: price_darat
        , PRICE_LAUT_INPUT: price_laut
        , TOTAL_ESTIMATE_PLAN_REPAIR: total_estimate
    }
    if (po_price_darat == "" || po_price_darat == null) {
        alert("Please fill PO Price Darat");
    } else if (po_price_laut == "" || po_price_laut == null) {
        alert("Please fill PO Price Laut");
    } else if (price_darat == "" || price_darat == null) {
        alert("Please fill Price Darat");
    } else if (price_laut == "" || price_laut == null) {
        alert("Please fill Price Laut");
    } else if (total_estimate == "" || total_estimate == null) {
        alert("Please fill Total Estimate Plan Repair");
    } else if (flag_upload == "" || flag_upload == null) {
        alert("Please upload ABR File in PDF");
    } else {
        //alert(po_price_darat + "/" + po_price_laut + "/" + price_darat + "/" + price_laut + "/" + total_estimate + "/" + flag_upload);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#urlPath").val() + "/CancelDemob/AjaxSaveCancelDemob",
            data: JSON.stringify({ sDataHeader: iDataHeader }),
            success: function (response) {
                wnd_cancel_demob.close();
                swal("Success!", response.message, "success");
                $("#gridCancelDemob").data("kendoGrid").dataSource.read();
            },
        });
    }
}

function cancel() {
    wnd_cancel_demob.close();
}

$(document).ready(function () {
    loadgrid();
});