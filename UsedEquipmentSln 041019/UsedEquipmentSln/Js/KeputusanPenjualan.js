var p_cn;
var p_district;
var p_abr;
var p_egi;
var p_tahun;
var p_minimum;

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
                    url: $("#urlPath").val() + "/KeputusanPenjualan/ReadKeputusanPenjualan",
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
                        EGI: {
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
                        BOOK_VALUE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        MINIMUM_PRICE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        MAXIMUM_PRICE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        AVERAGE_PRICE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ABR: {
                            type: "number",
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
                        SUGGEST: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SUGGESTION_PRICE: {
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
        toolbar: ["excel"],
        excel: {
            fileName: "Data keputusan penjualan.xlsx",
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
                command: [{
                    name: "update",
                    text: " EDIT",
                    click: function(e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        p_cn = dataItem.CN;
                        p_district = dataItem.DISTRIK;
                        p_abr = dataItem.ABR;
                        p_egi = dataItem.EGI;
                        //p_tahun = dataItem.PROD_YEAR;
                        p_minimum = dataItem.MINIMUM_PRICE;
                        wnd_keputusan_penjualan.open().center();
                    },
                    iconClass: "glyphicon glyphicon-edit"
                }, ],
                width: "92px",
                attributes: {
                    style: "text-align: center"
                },
                headerAttributes: {
                    style: "text-align: center"
                },
                locked: true
            },
            {
                field: 'PROCESS_STATUS',
                title: 'Status',
                width: "80px",
                locked: true,
                attributes: {
                    style: "text-align: center"
                },
                lockable: false
            },
            {
                field: 'DISTRIK',
                title: 'DISTRIK',
                width: "85px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: 'SN',
                title: 'SN',
                width: "110px"
            },
            {
                field: 'CN',
                title: 'CN',
                width: "80px"
            },
            {
                field: 'PROD_YEAR',
                title: 'PROD YEAR',
                width: "110px"
            },
            {
                field: 'BOOK_VALUE',
                title: 'BOOK VALUE',
                width: "140px"
            },
            {
                field: 'MINIMUM_PRICE',
                title: 'MIN PRICE',
                width: "150px",
                format: "{0:c}",
                template: function(e) {
                    if (e.MINIMUM_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.MINIMUM_PRICE, "Rp ")
                    }
                }
            },
            {
                field: 'MAXIMUM_PRICE',
                title: 'MAX PRICE',
                width: "150px",
                format: "{0:c}",
                template: function(e) {
                    if (e.MAXIMUM_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.MAXIMUM_PRICE, "Rp ")
                    }

                }
            },
            {
                field: 'AVERAGE_PRICE',
                title: 'AVG PRICE',
                width: "150px",
                template: function(e) {
                    if (e.AVERAGE_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.AVERAGE_PRICE, "Rp ")
                    }
                }
            },
            {
                field: 'SUGGEST',
                title: 'SUGGEST',
                width: "120px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: 'SUGGESTION_PRICE',
                title: 'BOTTOM PRICE',
                width: "150px"
            }

        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function loadgridDetailFN1() {
    $("#grid_detail_ur4_detail1").empty();
    var existingGrid = $('#grid_detail_ur4_detail1').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur4_detail1").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KeputusanPenjualan/ReadKeputusanPenjualanDetail1",
                    contentType: "application/json",
                    data: {
                        s_cn: p_cn,
                        s_abr: p_abr
                    },
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
                        SITE: {
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
                        NILAI_NUKUFISKAL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        NET_BOOK_VALUE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
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
                        COST_MOBILISASI: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        ABR: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        TOTAL_COST: {
                            type: "number",
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
        columns: [{
                title: "No",
                width: "35px",
                template: "#= ++rowNo #",
                filterable: false,
                locked: true
            },
            {
                field: 'SITE',
                locked: true,
                title: 'DISTRIK',
                width: "100px"
            },
            {
                field: 'CN',
                locked: true,
                title: 'CN',
                width: "100px"
            },
            {
                field: 'SN',
                title: 'SN',
                width: "100px"
            }, //, format: "{0:yyyy-MM-dd}"
            {
                field: 'DESKRIPSI',
                title: 'DESKRIPSI',
                width: "300px"
            },
            {
                field: 'PROD_YEAR',
                title: 'PROD YEAR',
                width: "110px"
            },
            {
                field: 'HOUR_METER',
                title: 'HOUR METER',
                width: "120px"
            },
            {
                field: 'EXPIRED_LEASING',
                title: 'EXPIRED LEASING',
                width: "160px"
            },
            {
                field: 'NILAI_NUKUFISKAL',
                title: 'NILAI BUKUFISKAL',
                width: "160px"
            },
            {
                field: 'NET_BOOK_VALUE',
                title: 'NET BOOK VALUE',
                width: "160px"
            },
            {
                field: 'STATUS_IMPORT',
                title: 'STATUS IMPORT',
                width: "140px"
            },
            {
                field: 'NO_FAD',
                title: 'FAD',
                width: "200px"
            },
            {
                field: 'NO_FAT',
                title: 'FAT',
                width: "200px"
            },
            {
                field: 'COST_MOBILISASI',
                title: 'COST MOBILISASI',
                width: "160px",
                template: function(e) {
                    if (e.ABR == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.COST_MOBILISASI, "Rp ")
                    }
                }
            },
            {
                field: 'ABR',
                title: 'COST REPAIR ABR',
                width: "160px",
                template: function(e) {
                    if (e.ABR == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.ABR, "Rp ")
                    }
                }
            },
            {
                field: 'TOTAL_COST',
                title: 'TOTAL COST (EST)',
                width: "160px",
                template: function(e) {
                    if (e.TOTAL_COST == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.TOTAL_COST, "Rp ")
                    }
                }
            },
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });

}

function loadgridDetailFN2(tahun) {
    $("#grid_detail_ur4_detail2").empty();
    var existingGrid = $('#grid_detail_ur4_detail2').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur4_detail2").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KeputusanPenjualan/ReadKeputusanPenjualanDetail2",
                    contentType: "application/json",
                    data: {
                        s_egi: p_egi,
                        s_tahun: tahun,
                        s_minimum: p_minimum
                    },
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
                        SALE_METHOD: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MAXIMUM: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        AVERAGE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        MINIMUM: {
                            type: "number",
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
                field: 'SALE_METHOD',
                title: 'SALE METHOD',
                width: "100px"
            },
            {
                field: 'MINIMUM',
                title: 'MINIMUM',
                width: "100px",
                template: function(e) {
                    if (e.MINIMUM_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.MINIMUM, "Rp ")
                    }
                }
            },
            {
                field: 'MAXIMUM',
                title: 'MAXIMUM',
                width: "100px",
                template: function(e) {
                    if (e.MINIMUM_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.MAXIMUM, "Rp ")
                    }
                }
            },
            {
                field: 'AVERAGE',
                title: 'AVERAGE',
                width: "300px",
                template: function(e) {
                    if (e.MINIMUM_PRICE == null) {
                        return "Rp 0";
                    } else {
                        return formatRupiah(e.AVERAGE, "Rp ")
                    }
                }
            },
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function formatRupiah(bilangan, prefix) {
    var number_string = bilangan.toString(),
        sisa = number_string.length % 3,
        rupiah = number_string.substr(0, sisa),
        ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }


    return prefix + rupiah;
}

function loadgridDetailFN3() {
    $("#grid_detail_ur4_detail3").empty();
    var existingGrid = $('#grid_detail_ur4_detail3').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur4_detail3").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KeputusanPenjualan/ReadKeputusanPenjualanDetail3",
                    contentType: "application/json",
                    data: {
                        s_cn: p_cn
                    },
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
                schema: {
                    data: "Data",
                    total: "Total",
                    model: {
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
        toolbar: ["excel"],
        excel: {
            fileName: "Data Cosmo.xlsx",
            allPages: true,
        },
        columns: [{
            title: "No",
            width: "35px",
            template: "#= ++rowNo #",
            filterable: false
        },
        {
            field: 'component',
            title: 'Compnent',
            width: "170px"
        },
        {
            field: 'last_ovh_date',
            title: 'Last OVH Date',
            width: "110px",
            template: "#= kendo.toString(kendo.parseDate(current_hm_date, 'yyyy-MM-dd'), 'yyyy-MM-dd') #"
        },
        {
            field: 'last_ovh_product',
            title: 'Equipment',
            width: "105px"
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
            width: "80px",
            attributes: { style: "text-align: center" },
            headerAttributes: { style: "text-align: center" }
        },
        {
            field: 'current_hm',
            title: 'Curr HM',
            width: "100px"
        },
        {
            field: 'current_hm_date',
            title: 'Curr HM Date',
            width: "120px",
            template: "#= kendo.toString(kendo.parseDate(current_hm_date, 'yyyy-MM-dd'), 'yyyy-MM-dd') #"
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

function loadgridDetailFN4() {
    $("#grid_detail_ur4_detail4").empty();
    var existingGrid = $('#grid_detail_ur4_detail4').data('kendoGrid');
    if (existingGrid) {
        existingGrid.destroy();
    }
    var grid = $("#grid_detail_ur4_detail4").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KeputusanPenjualan/ReadKeputusanPenjualanDetail4",
                    contentType: "application/json",
                    data: {
                        s_cn: p_cn
                    },
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
                title: 'PAP DATE',
                width: "140px",
                format: "{0:yyyy-MM-dd}"
            },
            {
                field: 'component',
                title: 'COMPONENT',
                width: "120px"
            },
            {
                field: 'oilbrand',
                title: 'OILBRAND',
                width: "120px"
            },
            {
                field: 'oiltype',
                title: 'OILTYPE',
                width: "120px"
            },
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}


function loadGridTypeBesi() {
    if ($("#gridTypeBesi").data().kendoGrid != null) {
        $('#gridTypeBesi').data().kendoGrid.destroy(); // to destory instance            
        $('#gridTypeBesi').empty(); // to destroy component
    }
    var RecNumerEq = 0;
    var grid = $("#gridTypeBesi").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KeputusanPenjualan/AjaxReadTypeBesi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) {
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
                    id: "PID_TRANS",
                    fields: {
                        PID_TRANS: {
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
                        TYPE_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        WEIGHT: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        PRICE_BESI: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATE_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATE_USER: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        }
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
            messages: {}
        },
        columns: [{
                command: [{
                    text: "Select",
                    name: "select",
                    click: SelectType
                }],
                title: " ",
                width: "80px"
            },
            {
                field: "PID_TRANS",
                title: "PID_TRANS",
                width: "120px"
            },
            {
                field: "EGI",
                title: "EGI",
                width: "120px"
            },
            {
                field: "TYPE_DESC",
                title: "TYPE_DESC",
                width: "220px"
            },
            {
                field: "WEIGHT",
                title: "WEIGHT",
                width: "120px"
            },
            {
                field: "PRICE_BESI",
                title: "PRICE_BESI",
                width: "120px"
            },

        ],
        dataBinding: function() {
            //window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function SelectType(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $("#txt_browse").val(dataItem.PID_TRANS);
    wnd_type_besi.close();
}

wnd_keputusan_penjualan = $("#wnd_keputusan_penjualan").kendoWindow({
    modal: true,
    title: "",
    width: "100%",
    height: "100%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function() {
        $("#txt_browse").val("");
        $("#txt_decision").val("");
        $("#txt_search").data("kendoDatePicker").value("");
    },
    open: function(e) {
        $("#txt_decision").kendoDropDownList({
            optionLabel: "Select suggestion",
            dataTextField: "SUGGESTION_DESC",
            dataValueField: "SUGGESTION_STATUS",
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: $("#urlPath").val() + "/KeputusanPenjualan/getSuggestion",
                        contentType: "application/json",
                        type: "POST",
                        cache: false,
                        complete: function(data) {}
                    }
                },
            },
            //filter: "contains",
        });
        loadgridDetailFN1();
        loadgridDetailFN2();
        loadgridDetailFN3();
        loadgridDetailFN4();
    }
}).data("kendoWindow").center();

wnd_type_besi = $("#wnd_type_besi").kendoWindow({
    modal: true,
    title: "Select Type",
    width: "65%",
    height: "80%",
    visible: false,
    draggable: true,
    pinned: true,
    close: function() {},
    open: function(e) {
        loadGridTypeBesi();
    }
}).data("kendoWindow").center();

function findData() {
    wnd_type_besi.open().center();
}

function saveDetail() {
    var browse = $("#txt_browse").val();
    var dec = $("#txt_decision").val();
    var iDataHeader = {
        CN: p_cn,
        DSTRCT_DISPOSAL: p_district,
        PID_TRANS_WEIGHT: browse,
        SUGGESTION_STATUS: dec
    }
    if (browse == "" || browse == null) {
        alert("Please fill browse");
    } else if (dec == "" || dec == null) {
        alert("Please fill suggestion");
    } else {
        //alert(browse + "|" + dec);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#urlPath").val() + "/KeputusanPenjualan/AjaxSaveKeputusanPenjualan",
            data: JSON.stringify({
                sDataHeader: iDataHeader
            }),
            success: function(response) {
                wnd_keputusan_penjualan.close();
                swal("Success!", response.message, "success");
                $("#grid").data("kendoGrid").dataSource.read();
            },
        });
    }
}

function cancelDetail() {
    wnd_keputusan_penjualan.close();
}

function searchData() {
    var year = $("#txt_search").data("kendoDatePicker").value().getFullYear();
    if (year == null || year == "") {
        alert("Please fill year");
    } else {
        p_tahun = year;
        loadgridDetailFN2(p_tahun);
    }
}

$(document).ready(function() {
    loadgrid();
    $("#txt_search").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy"
    });
    $("#txt_search").prop("disabled", true);
});