var p_cn;
var p_abr;
var p_egi;
var p_total_cost_ellipse;
var p_total_price;

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
					url: $("#urlPath").val() + "/TaksasiFinal/ReadTaksasiFinal",
					contentType: "application/json",
					type: "POST",
					cache: false,
					complete: function (data) {}
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
						EGI: {
							type: "string",
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
						DECISSION: {
							type: "string",
							filterable: true,
							sortable: true,
							editable: true
						},
						RECON_LOCATION: {
							type: "string",
							filterable: true,
							sortable: true,
							editable: true
						},
						START_RECONDITION: {
							type: "date",
							filterable: true,
							sortable: true,
							editable: true
						},
						TARGET_FINISH_RECONDITION: {
							type: "date",
							filterable: true,
							sortable: true,
							editable: true
						},
						STATUS_PROGRESS: {
							type: "number",
							filterable: true,
							sortable: true,
							editable: true
						},
						PROG_DESC: {
							type: "string",
							filterable: true,
							sortable: true,
							editable: true
						},
						STATUS_PROCESS: {
							type: "number",
							filterable: true,
							sortable: true,
							editable: true
						},
						PROCESS_DESC: {
							type: "string",
							filterable: true,
							sortable: true,
							editable: true
						},
						ACTUAL_FINISH_DATE: {
							type: "date",
							filterable: true,
							sortable: true,
							editable: true
						},
						PERCENTS: {
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
						TOTAL_COST: {
							type: "number",
							filterable: true,
							sortable: true,
							editable: true
						},
						PRICE_SALE: {
							type: "number",
							filterable: true,
							sortable: true,
							editable: true
						},
						SLC: {
							type: "boolean",
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
		toolbar: ["excel"],
		excel: {
			fileName: "Taksasi Final.xlsx",
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
						click: function (e) {
							e.preventDefault();
							var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
							p_cn = dataItem.CN;
							p_abr = dataItem.ABR;
							p_egi = dataItem.EGI;
							p_district = dataItem.DISTRIK;
							p_total_cost_ellipse = dataItem.TOTAL_COST;
							p_total_price = dataItem.PRICE_SALE;
							if (p_total_price != null || p_total_price != "") {
								$("#txt_price").val(p_total_price);
							}
							wnd_taksasi_final.open().center();
						},
						iconClass: "glyphicon glyphicon-edit"
					},
					{
						name: "canc",
						text: " Back To Recon",
						click: function (e) {
							e.preventDefault();
							var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
							BackToReconditon_Proc(dataItem);
						},
						iconClass: "glyphicon glyphicon-remove"
					},
				],
				width: "220px",
				attributes: {
					style: "text-align: center"
				},
				headerAttributes: {
					style: "text-align: center"
				},
				locked: true
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
				width: "100px"
			},
			{
				field: 'CN',
				title: 'CN',
				width: "100px"
			},
			{
				field: "SLC",
				title: "Select",
				width: "80px",
				selectable: true,
				headerAttributes: {
					style: "text-align: center"
				},
				locked: true,
				attributes: {
					style: "text-align: center"
				},
				template: "<input id=\"check\" class=\"check_item\" type=\"checkbox\" #= SLC == true ?\"checked\":\"\" #  />"
			},
			{
				field: 'EGI',
				title: 'EGI',
				width: "100px"
			},
			{
				field: 'RECON_LOCATION',
				title: 'RECON LOCATION',
				width: "160px"
			},
			{
				field: 'START_RECONDITION',
				title: 'START RECONDITION',
				width: "200px",
				format: "{0:yyyy-MM-dd}"
			},
			{
				field: 'TARGET_FINISH_RECONDITION',
				title: 'TARGET FINISH RECONDITION',
				width: "200px",
				format: "{0:yyyy-MM-dd}"
			},
			{
				field: 'PROG_DESC',
				title: 'STATUS PROSES',
				width: "140px"
			},
			{
				field: 'STATUS_PROCESS',
				title: 'STATUS PROCESS',
				width: "160px"
			},
			{
				field: 'PROCESS_DESC',
				title: 'PROCESS DESC',
				width: "150px"
			},
			{
				field: 'ACTUAL_FINISH_DATE',
				title: 'ACTUAL FINISH DATE',
				width: "170px",
				format: "{0:yyyy-MM-dd}"
			},
			{
				field: 'PERCENTS',
				title: 'PERCENTS',
				width: "150px"
			},
			{
				field: 'BOOK_VALUE',
				title: 'BOOK VALUE',
				width: "150px",
                template: function (e) {
					if (e.BOOK_VALUE == null) {
						return null;
					} else {
						return formatRupiah(e.BOOK_VALUE, "Rp ")
					}
				}
			},
			{
				field: 'TOTAL_COST',
				title: 'TOTAL COST',
				width: "150px",
                template: function (e) {
					if (e.TOTAL_COST == null) {
						return null;
					} else {
						return formatRupiah(e.TOTAL_COST, "Rp ")
					}
				}
			},
			{
				field: 'PRICE_SALE',
				title: 'PRICE SALE',
                width: "150px",
                template: function (e) {
					if (e.PRICE_SALE == null) {
						return null;
					} else {
						return formatRupiah(e.PRICE_SALE, "Rp ")
					}
				}
			}

		],
		dataBound: function (e) {
			$(".check_item").bind("click", function (e) {
				var grid = $("#grid").data("kendoGrid");
				var row = $(e.target).closest("tr").toggleClass("k-state-selected");
				var dataItem = grid.dataItem(row);
				var is_checked = (row.prevObject[0].checked);

				var values_part = {
					s_cn: dataItem.CN,
					is_selected: is_checked
				};
				//console.log(values_part);
				$.ajax({
					url: $("#urlPath").val() + "/TaksasiFinal/AjaxSelectCN",
					type: "POST",
					data: values_part,
					success: function (resq) {
						if (resq.status == false) {
							$.alert({
								title: resq.header,
								content: resq.message,
								animation: 'rotateX',
								type: "red",
								theme: 'material',
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
					},
					error: function (jqXHR, textStatus, errorThrown) {
						$.alert({
							title: "Error Posting Data",
							content: textStatus,
							animation: 'rotateX',
							type: "red",
							theme: 'material',
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
		dataBinding: function () {
			window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
		}
	});
}

function loadgridDetailFN1() {
	$("#grid_detail_ur6_detail1").empty();
	var existingGrid = $('#grid_detail_ur6_detail1').data('kendoGrid');
	if (existingGrid) {
		existingGrid.destroy();
	}
	var grid = $("#grid_detail_ur6_detail1").kendoGrid({
		dataSource: {
			type: "json",
			transport: {
				read: {
					url: $("#urlPath").val() + "/TaksasiFinal/ReadTaksasiFinalDetail1?s_cn=" + p_cn + "&s_abr=" + p_abr,
					type: "POST",
					contentType: "application/json",
					//data: {
					//    s_cn: p_cn,
					//    s_abr: p_abr
					//},
					cache: false,
					complete: function (data) {}
				},
				parameterMap: function (data, operation) {
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
						COST_REPAIR_ACTUAL: {
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
				locked: true,
				lockable: false
			},
			{
				field: 'SITE',
				title: 'DISTRIK',
				width: "100px",
				locked: true,
				lockable: false
			},
			{
				field: 'CN',
				title: 'CN',
				width: "100px",
				locked: true,
				lockable: false
			},
			{
				field: 'SN',
				title: 'SN',
				width: "100px",
				locked: true,
				lockable: false
			}, //, format: "{0:yyyy-MM-dd}"
			//{ field: 'DESKRIPSI', title: 'DESKRIPSI', width: "300px" },
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
				field: 'NILAI_BUKUFISKAL',
				title: 'NILAI BUKU FISKAL',
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
				field: 'COST_MOBILISASI',
				title: 'COST MOBILISASI',
				width: "160px",
				template: function (e) {
					if (e.COST_MOBILISASI == null) {
						return null;
					} else {
						return formatRupiah(e.COST_MOBILISASI, "Rp ")
					}
				}
			},
			//{ field: 'ABR', title: 'COST REPAIR ABR', width: "160px" },
			{
				field: 'COST_REPAIR_ACTUAL',
				title: 'COST REPAIR ACTUAL',
				width: "160px",
				template: function (e) {
					if (e.COST_REPAIR_ACTUAL == null) {
						return null;
					} else {
						return formatRupiah(e.COST_REPAIR_ACTUAL, "Rp ")
					}
				}
			},
			{
				field: 'TOTAL_COST',
				title: 'TOTAL COST (EST)',
				width: "160px",
				template: function (e) {
					if (e.TOTAL_COST == null) {
						return null;
					} else {
						return formatRupiah(e.TOTAL_COST, "Rp ")
					}
				}
			},
		],
		dataBinding: function () {
			window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
		}
	});
}

function loadgridDetailFN2(tahun) {
	//console.log(p_cn);
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
					url: $("#urlPath").val() + "/TaksasiFinal/ReadTaksasiFinalDetail2_",
					contentType: "application/json",
					data: {
						s_egi: p_egi,
						s_tahun: tahun,
						s_cn : p_cn
					},
					type: "POST",
					cache: false,
					complete: function (data) {}
				},
				parameterMap: function (data, operation) {
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
				template: function (e) {
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
				template: function (e) {
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
				template: function (e) {
					if (e.MINIMUM_PRICE == null) {
						return "Rp 0";
					} else {
						return formatRupiah(e.AVERAGE, "Rp ")
					}
				}
			},
		],
		dataBinding: function () {
			window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
		}
	});
}

// function loadgridDetailFN2() {
//     $("#grid_detail_ur6_detail2").empty();
//     console.log("cn : "+p_cn+" egi : "+p_egi);
// 	var existingGrid = $('#grid_detail_ur6_detail2').data('kendoGrid');
// 	if (existingGrid) {
// 		existingGrid.destroy();
// 	}
// 	var grid = $("#grid_detail_ur6_detail2").kendoGrid({
// 		dataSource: {
// 			type: "json",
// 			transport: {
// 				read: {
// 					url: $("#urlPath").val() + "/TaksasiFinal/ReadTaksasiFinalDetail2",
// 					type: "POST",
// 					contentType: "application/json",
// 					data: {
// 					   s_cn: p_cn,
// 					   s_egi: p_egi
// 					},
// 					cache: false,
// 					complete: function (data) {}
// 				},
// 				parameterMap: function (data, operation) {
// 					if (operation != "read") {}
// 					return kendo.stringify(data);
// 				}
// 			},
// 			pageSize: 10,
// 			serverPaging: true,
// 			serverFiltering: true,
// 			serverSorting: true,
// 			schema: {
// 				data: "Data",
// 				total: "Total",
// 				model: {
// 					//id: "PID", //id is only for edit/update
// 					fields: {
// 						MINIMUM_PRICE: {
// 							type: "number",
// 							filterable: true,
// 							sortable: true,
// 							editable: false
// 						},
// 						MAXIMUM_PRICE: {
// 							type: "number",
// 							filterable: true,
// 							sortable: true,
// 							editable: false
// 						},
// 						AVERAGE_PRICE: {
// 							type: "number",
// 							filterable: true,
// 							sortable: true,
// 							editable: true
// 						},
// 					}
// 				}
// 			}
// 		},
// 		sortable: true,
// 		pageable: true,
// 		filterable: {
// 			extra: false,
// 			operators: {
// 				string: {
// 					contains: "Contains"
// 				}
// 			}
// 		},
// 		editable: "inline",
// 		pageable: {
// 			refresh: true,
// 			buttonCount: 10,
// 			input: true,
// 			pageSizes: [10, 20, 50, 100, 1000, 100000],
// 			info: true,
// 			messages: {}
// 		},
// 		columns: [{
// 				title: "No",
// 				width: "25px",
// 				template: "#= ++rowNo #",
// 				filterable: false
// 			},
// 			{
// 				field: 'MINIMUM_PRICE',
// 				title: 'Bottom price',
// 				width: "100px"
// 			},
// 			{
// 				field: 'MAXIMUM_PRICE',
// 				title: 'MAXIMUM PRICE',
// 				width: "100px"
// 			},
// 			{
// 				field: 'AVERAGE_PRICE',
// 				title: 'AVERAGE PRICE',
// 				width: "100px"
// 			},
// 		],
// 		dataBinding: function () {
// 			window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
// 		}
// 	});
// }

wnd_taksasi_final = $("#wnd_taksasi_final").kendoWindow({
	modal: true,
	title: "",
	width: "100%",
	height: "100%",
	visible: false,
	draggable: true,
	pinned: true,
	close: function () {
		$("#txt_price").val("");
	},
	open: function (e) {
		loadgridDetailFN1();
		loadgridDetailFN2();
	}
}).data("kendoWindow").center();

function saveDetail() {
	var price = $("#txt_price").val();
	if (price == null || price == "") {
		$.alert({
			title: "Error Field",
			content: "Some of the parameters are empty. You must fill in the <b>price</b> field ",
			theme: 'material',
			type: "red"
		});
	} else {
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: $("#urlPath").val() + "/TaksasiFinal/AjaxSaveTaksasiFinal?s_price=" + price + "&s_total_cost=" + p_total_cost_ellipse + "&s_cn=" + p_cn + "&s_district=" + p_district,
			//data: JSON.stringify({ sDataHeader: iDataHeader }),
			success: function (response) {
				wnd_taksasi_final.close();
				swal("Success!", response.message, "success");
				$("#grid").data("kendoGrid").dataSource.read();
			},
		});
	}
}

function cancelDetail() {
	wnd_taksasi_final.close();
}

function searchData() {
	var year = $("#txt_search").data("kendoDatePicker").value().getFullYear();
	if (year == null || year == "") {
		alert("Please fill year");
	} else {
		p_tahun = year;
		console.log(p_tahun);
		loadgridDetailFN2(p_tahun);
	}
}

function BackToReconditon_Proc(dataItem) {
	//console.log(dataItem);
	$.confirm({
		title: 'Konfirmasi',
		content: 'You will update recondition monitoring data ?<br>Click Ok to continue',
		theme: 'material',
		closeIcon: true,
		animation: 'rotateX',
		closeAnimation: 'rotateX',
		animateFromElement: false,
		opacity: 0.7,
		type: 'blue',
		buttons: {
			'confirm': {
				text: 'PROCESS ACTION',
				btnClass: 'btn-orange',
				action: function () {

					if ($('#txt_nrp').val().length == 0) {
						$.alert({
							title: "NRP is empty",
							content: "Refresh this page to reload",
							theme: 'material',
							type: "red"
						});
					} else {

						var part_data = {
							s_cn: dataItem.CN,
							s_district: dataItem.DISTRIK,
							s_usr: $('#txt_nrp').val()
						}

						$.ajax({
							type: "POST",
							url: $("#urlPath").val() + "/TaksasiFinal/AjaxBackToRecond",
							data: part_data,
							success: function (resq) {
								wnd_taksasi_final.close();
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
												$("#grid").data("kendoGrid").dataSource.read();
											}
										}
									}
								});
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
					}
				}
			},
			cancel: function () {
				// Do Nothing
			}
		}
	});

}

$(document).ready(function () {
	loadgrid();

	$("#txt_price").keydown(function (event) {
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

	$("#txt_search").kendoDatePicker({
		start: "decade",
		depth: "decade",
		format: "yyyy"
	});
});

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