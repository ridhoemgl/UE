var url = $("#urlPath").val();
var p_cn;
var p_district;
var p_is_approve;

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
                    url: $("#urlPath").val() + "/UnitTerdapatFAD/ReadUnitTerdapatFAD",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {}
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
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "PID",
                    fields: {
                        PID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        SITE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TYPE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CLASS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        EGI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PROD_YEAR: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        HM: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        LAST_RUNNING: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        IMPORTATION: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAD: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAD_OUTS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        APPROVED: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        AGING: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        FAT_OUTS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        LCT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        DELIVERY: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        RECEIVE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ETD: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ETA: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        REMARK: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        STATUS_UNIT_UR2: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PROCESS_STATUS: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        IS_APPROVE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PO: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        LEASING: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATE_FA: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        APPRV_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
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
        toolbar: ["excel", {
            template: kendo.template($("#aplut").html())
        }, {
            template: kendo.template($("#dowload_ex").html())
        }],
        excel: {
            fileName: "unit has FAD.xlsx",
            allPages: true,
        },
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
                command: [{
                        name: "detail",
                        text: " DETAIL",
                        click: function(e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            p_cn = dataItem.CN;
                            p_district = dataItem.SITE;
                            wnd_detail_fad.open().center();
                        },
                        iconClass: "glyphicon glyphicon-list"
                    },
                    {
                        name: "update",
                        text: " EDIT",
                        click: function(e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            p_cn = dataItem.CN;
                            p_district = dataItem.SITE
                            wnd_update_fad.open().center();
                        },
                        iconClass: "glyphicon glyphicon-edit"
                    },
                ],
                width: "200px",
                attributes: {
                    style: "text-align: center"
                },
                headerAttributes: {
                    style: "text-align: center"
                },
                locked: true
            },
            {
                field: 'SITE',
                title: 'SITE',
                width: "100px"
            },
            {
                field: 'TYPE',
                title: 'TYPE',
                width: "100px"
            },
            {
                field: 'CLASS',
                title: 'CLASS',
                width: "100px"
            },
            {
                field: 'EGI',
                title: 'EGI',
                width: "110px"
            },
            {
                field: 'CN',
                title: 'CN',
                width: "90px"
            },
            {
                field: 'SN',
                title: 'SN',
                width: "100px"
            },
            {
                field: 'PROD_YEAR',
                title: 'PROD YEAR',
                width: "110px"
            },
            {
                field: 'HM',
                title: 'HM',
                width: "100px"
            },
            {
                field: 'LAST_RUNNING',
                title: 'LAST RUNNING',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'IMPORTATION',
                title: 'IMPORTATION',
                width: "120px"
            },
            {
                field: 'NO_FAD',
                title: 'NO FAD',
                width: "210px"
            },
            {
                field: 'FAD_OUTS',
                title: 'FAD OUTS',
                width: "120px"
            },
            {
                field: 'APPROVED',
                title: 'APPROVED',
                width: "160px",
                format: "{0:yyyy-MM-dd HH:mm:ss}"
            },
            {
                field: 'AGING',
                title: 'AGING',
                width: "120px"
            },
            {
                field: 'NO_FAT',
                title: 'FAT',
                width: "220px"
            },
            {
                field: 'FAT_OUTS',
                title: 'FAT OUTS',
                width: "120px"
            },
            {
                field: 'LCT',
                title: 'LCT',
                width: "230px"
            },
            {
                field: 'DELIVERY',
                title: 'DELIVERY',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'RECEIVE',
                title: 'RECEIVE',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'PO',
                title: 'PO UNIT',
                width: "120px",
            },
            {
                field: 'ETD',
                title: 'ETD',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'ETA',
                title: 'ETA',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'REMARK',
                title: 'REMARK',
                width: "300px"
            }

        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function uploadFileExcel(e) {
    var files = e.files;
    $.each(files, function() {
        $("#fl_upload_exel").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/UnitTerdapatFAD/UploadInput?user=' + ($('#txt_user_nrp').val());
    });
}

function onErrorUploadExcel(e) {
    console.log(e);
}

function download_excel() {
    window.location = $("#urlPath").val() + "/UnitTerdapatFAD/DownloadExcelInputDataCost";
}

function onSuccessUploadExcel(e) {

    var response = e.response;
    if (response.status == true) {
        $("#grid").data("kendoGrid").dataSource.read();
    }
    // $.alert({
    //     title: response.title,
    //     content: response.content,
    //     theme: 'material',
    //     type: response.type,
    //     buttons: {
    //         okay: {
    //             text: 'close',
    //             btnClass: 'btn-'+response.type,
    //             action: function(){
    //                 $('#wnd_upload_data').data('kendoWindow').close();
    //                 $("#gridInputDataCost").data("kendoGrid").dataSource.read();
    //             }
    //         }
    //     }
    // });
}

function loadgridDetailFN1() {
    $("#grid_detail_ur_fn1").empty();
    var existingGrid = $('#grid_detail_ur_fn1').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur_fn1").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnitTerdapatFAD/ReadFADDetailFN1?s_cn=" + p_cn + "&s_district=" + p_district,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {}
                },
                parameterMap: function(data, operation) {
                    if (operation != "read") {}
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
                    //id: "PID", //id is only for edit/update
                    fields: {
                        DISTRIK: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CN: {
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
                        DESKRIPSI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PROD_YEAR: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        HOUR_METER: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        EXPIRED_LEASING: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        //NILAI_NUKU_FISKAL: { type: "string", filterable: true, sortable: true, editable: true },
                        //NET_BOOK_VALUE: { type: "string", filterable: true, sortable: true, editable: true },
                        STATUS_IMPORT: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAD: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NO_FAT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
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
        columns: [{
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                field: 'DISTRIK',
                title: 'District',
                width: "100px"
            },
            {
                field: 'CN',
                title: 'CN',
                width: "100px"
            },
            {
                field: 'SN',
                title: 'SN',
                width: "100px"
            },
            {
                field: 'DESKRIPSI',
                title: 'Deskripsi',
                width: "260px"
            },
            {
                field: 'PROD_YEAR',
                title: 'Prod year',
                width: "100px"
            },
            {
                field: 'HOUR_METER',
                title: 'Hour meter',
                width: "100px"
            },
            {
                field: 'EXPIRED_LEASING',
                title: 'Expired leasing',
                width: "150px"
            },
            {
                field: 'STATUS_IMPORT',
                title: 'Status import',
                width: "120px"
            },
            {
                field: 'NO_FAD',
                title: 'No FAD',
                width: "220px"
            },
            {
                field: 'NO_FAT',
                title: 'No FAT',
                width: "220px"
            },
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function loadgridDetailFN2() {
    $("#grid_detail_ur_fn2").empty();
    var existingGrid = $('#grid_detail_ur_fn2').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur_fn2").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnitTerdapatFAD/ReadFADDetailFN2?s_cn=" + p_cn,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {}
                },
                parameterMap: function(data, operation) {
                    if (operation != "read") {}
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
                    //id: "PID", //id is only for edit/update
                    fields: {
                        component: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        last_ovh_date: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        last_ovh_product: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        dstrct_ovh: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        posisi: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        ovhke: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        current_hm_date: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        current_hm: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        lifetime_comp: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        aktif_unit: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        fleet_status: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        last_ovh_sncomp: {
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
        toolbar: ["excel"],
        excel: {
            fileName: "Data Cosmo.xlsx",
            allPages: true,
        },
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
        columns: [{
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                field: 'component',
                title: 'Description',
                width: "170px"
            },
            {
                field: 'last_ovh_product',
                title: 'Equipment',
                width: "120px"
            },
            {
                field: 'dstrct_ovh',
                title: 'Distrik OVH',
                width: "78px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: 'ovhke',
                title: 'OVH Ke',
                width: "70px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: 'current_hm_date',
                title: 'Curr HM Date',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'current_hm_date',
                title: 'Curr HM Date',
                width: "120px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'last_ovh_sncomp',
                title: 'OVH SN Comp',
                width: "110px",
                attributes: { style: "text-align: left" },
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: 'lifetime_comp',
                title: 'Life Time',
                width: "90px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: 'aktif_unit',
                title: 'Aktif',
                width: "70px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: 'fleet_status',
                title: 'Fleet Status',
                width: "100px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" }
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function loadgridDetailFN3() {
    $("#grid_detail_ur_fn3").empty();
    var existingGrid = $('#grid_detail_ur_fn3').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur_fn3").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/UnitTerdapatFAD/ReadFADDetailFN3?s_cn=" + p_cn,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function(data) {
                        console.log(data);
                    }
                },
                parameterMap: function(data, operation) {
                    if (operation != "read") {}
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
                    id: "PAP_DATE", //id is only for edit/update
                    fields: {
                        PAP_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        component: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        oilbrand: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        oiltype: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
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
        toolbar: ["excel"],
        excel: {
            fileName: "Data PAP.xlsx",
            allPages: true,
        },
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
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false
            },
            {
                field: 'PAP_DATE',
                title: 'PAP Date',
                width: "200px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'component',
                title: 'Component',
                width: "120px"
            },
            {
                field: 'oilbrand',
                title: 'Oil Brand',
                width: "130px"
            },
            {
                field: 'oiltype',
                title: 'Oil Type',
                width: "120px"
            },
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function getDetailFAD2() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/UnitTerdapatFAD/AjaxGetDetailFAD2?s_cn=" + p_cn,
        success: function(response) {},
    });
}

wnd_detail_fad = $("#wnd_detail_fad").kendoWindow({
    modal: true,
    title: "",
    width: "100%",
    height: "100%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function() {},
    open: function(e) {
        $("#id_cn").val(p_cn);
        $("#id_district").val(p_district);
        getDetailFAD2();
        loadgridDetailFN1();
        loadgridDetailFN2();
        loadgridDetailFN3();
    }
}).data("kendoWindow").center();

wnd_update_fad = $("#wnd_update_fad").kendoWindow({
    modal: true,
    title: "",
    width: "55%",
    height: "75%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function() {},
    open: function(e) {
        $("#txt_status_ur2").kendoDropDownList({
            optionLabel: "Select status",
            dataTextField: "DESCRIPTION",
            dataValueField: "CODE",
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: $("#urlPath").val() + "/UnitTerdapatFAD/getStatusUR2",
                        contentType: "application/json",
                        type: "POST",
                        cache: false,
                        complete: function(data) {}
                    }
                },
            },
            //filter: "contains",
        });
        getDataDetail();
    }
}).data("kendoWindow").center();

function saveDetail() {
    var etd = $("#txt_etd").val();
    var eta = $("#txt_eta").val();
    var status = ($("#txt_status_ur2").data('kendoDropDownList').value() === '') ? 3 : parseInt($("#txt_status_ur2").data('kendoDropDownList').value());
    var remark = $("#ta_remark").val();
    var iDataHeader = {
        CN: p_cn,
        DSTRCT_DISPOSAL: p_district,
        ETD: etd,
        ETA: eta,
        REMARK: remark,
        STATUS_UNIT_UR2: status
    }
    //if (etd == null || etd == "") {
    //    alert("Please fill ETD");
    //} else if (eta == null || eta == "") {
    //    alert("Please fill ETA");
    //} else if (status == null || status == "") {
    //    alert("Please fill Status");
    //} else if (remark == null || remark == "") {
    //    alert("Please fill remark");
    //} else {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/UnitTerdapatFAD/AjaxSaveDetail",
        data: JSON.stringify({
            sDataHeader: iDataHeader
        }),
        success: function(response) {
            wnd_update_fad.close();
            swal("Success!", response.message, "success");
            $("#grid").data("kendoGrid").dataSource.read();
            //window.location.href = $("#urlPath").val() + "/UnitTerdapatFAD"
        },
    });
    //}
}

function cancelDetail() {
    wnd_update_fad.close();
}

function getDataDetail() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#urlPath").val() + "/UnitTerdapatFAD/AjaxGetDataDetail?s_cn=" + p_cn,
        success: function(response) {
            $("#ta_remark").val(response.REMARK);
            $("#txt_etd").val(kendo.toString(kendo.parseDate(response.ETD), "yyyy-MM-dd"));
            $("#txt_eta").val(kendo.toString(kendo.parseDate(response.ETA), "yyyy-MM-dd"));
            $("#txt_status_ur2").data('kendoDropDownList').value(response.STATUS_UNIT_UR2);
        },
    });
}

$(document).ready(function() {

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

    $("#txt_etd").kendoDatePicker({
        format: "yyyy-MM-dd"
    });
    $("#txt_etd").prop("disabled", true);

    $("#txt_eta").kendoDatePicker({
        format: "yyyy-MM-dd"
    });
    $("#txt_eta").prop("disabled", true);

    loadgrid();
});

function upload_wnd() {
    $("#wnd_upload_data").kendoWindow({
        modal: true,
        title: "Upload Unit Contain FAD",
        width: "50%",
        height: "230",
        visible: false,
        draggable: true,
        pinned: true,
        close: function() {},
        open: function(e) {
            $(".k-upload-files.k-reset").find("li").remove();
        }
    }).data("kendoWindow").open().center();
}