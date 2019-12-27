using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;
using OfficeOpenXml;
using System.Data;
using System.Configuration;
using System.Diagnostics;


namespace UsedEquipmentSln.Controllers
{
    public class InputDataCostController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        private string filename_ = string.Empty;

        // GET: InputDataCost
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            ViewBag.leftMenu = loadMenu();
            ViewBag.NRP = Session["NRP"].ToString();
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
            ViewBag.profile = Convert.ToInt32(Session["gpId"]);

            return View();
        }

        private string loadMenu()
        {
            this.pv_CustLoadSession();
            if (Session["leftMenu"] == null)
            {
                Session["leftMenu"] = menuLeftClass.recursiveMenu(0, Convert.ToInt32(iStrSessGPID));
            }
            return (string)Session["leftMenu"];
        }

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
        }

        [HttpPost]
        public async Task<JsonResult> UploadInput(string user)
        {
            this.pv_CustLoadSession();
            DataTable dt = new DataTable();

            var iStrRemark = string.Empty;

            try
            {
                object[,] obj = null;
                int noOfCol = 0;
                int noOfRow = 0;
                HttpFileCollectionBase file = Request.Files;
                if ((file != null) && (file.Count > 0))
                {
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                    using (var package = new ExcelPackage(Request.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;
                        obj = new object[noOfRow, noOfCol];
                        obj = (object[,])workSheet.Cells.Value;
                    }
                    List<STAGING_DATA_COST> STG = new List<STAGING_DATA_COST>();
                    CultureInfo cultur = new CultureInfo("en-US");
                    for (int i = 1; i < noOfRow; i++)
			        {
                        if (obj[i , 0] == null)
                        {
                            break;
                        }
                        else
                        {
                            //decimal dar_price = Convert.ToDecimal(obj[i, 4].ToString().Replace(",", "."), cultur);
                            //decimal sea_price = Convert.ToDecimal(obj[i, 5].ToString().Replace(",", "."), cultur); ;

                            STAGING_DATA_COST iSTAGING_DATA_COST = new STAGING_DATA_COST();
                            iSTAGING_DATA_COST.CN = obj[i, 0].ToString();
                            iSTAGING_DATA_COST.SN = ((obj[i, 1] == null) ? null : obj[i, 1].ToString());
                            iSTAGING_DATA_COST.PO_LAUT = ((obj[i, 2] == null) ? null: obj[i, 2].ToString());
                            iSTAGING_DATA_COST.PO_DARAT = ((obj[i, 3] == null) ? null : obj[i, 3].ToString());
                            iSTAGING_DATA_COST.PO_DARAT_PRICE = (obj[i, 4] == null || obj[i, 4].ToString().Equals(string.Empty)) ? 0 : Convert.ToDecimal(obj[i, 4].ToString().Replace(",", "."), cultur);
                            iSTAGING_DATA_COST.PO_LAUT_PRICE = (obj[i, 5] == null || obj[i, 5].ToString().Equals(string.Empty)) ? 0 : Convert.ToDecimal(obj[i, 5].ToString().Replace(",", "."), cultur);

                            STG.Add(iSTAGING_DATA_COST);
                        }
			        }

                    db_used_equipment.STAGING_DATA_COSTs.InsertAllOnSubmit(STG);
                    db_used_equipment.SubmitChanges();

                    db_used_equipment.cusp_update_input_datacost(user);

                    iStrRemark = string.Concat(STG.Count()," row data successfully uploaded by ",user);

                }


                return Json(new { status = true, title = "Upload Success", content = iStrRemark, type = "green" });
            }
            catch (Exception e)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { status = false, title = "Upload Failed !!", content = e.ToString(), type = "red" });
            }
        }

        public ActionResult DownloadFile(string cn)
        {
            var path_name = db_used_equipment.TBL_T_UNIT_FADs.Where(d => d.CN.Equals(cn)).First();
            string pdf_db = path_name.ABR_PATH_FILE;
            string cn_ = string.Concat(path_name.CN, ".xlsx");

            string path = @"\\jiepfsap401\ocel$\Equip_document\Upload\" + path_name.ABR_PATH_FILE;

            if (System.IO.File.Exists(path))
            {
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string fileName = cn_;
                return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
            }

            return Content("File Not Found");
        }

        public ActionResult DownloadExcelInputDataCost()
        {
            string path = @"\\jiepfsap401\ocel$\Equip_document\excel_template\template_input_data_cost.xlsx";
            return File(path, "application/ms-excel", "Template Input Data Cost.xlsx");
        }

        public JsonResult ReadInputDataCost(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_003s;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxGetDetailInputDataCost(string s_cn, string s_district)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_003s.Where(f => f.CN == s_cn && f.SITE == s_district).FirstOrDefault();
                return Json(vw);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxReadPOPrice(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var tbl = db_used_equipment.UR003_PO_PRICEs;
                return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<JsonResult> UploadPdf(string CN)
        {
            string message = string.Empty;
            var iStrRemark = string.Empty;
            int iBlStatus = 0;
            string title = null;
            string type = null;
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            db_used_equipment.ExecuteCommand("DELETE FROM staging.STAGING_DATA_COST");
            this.pv_CustLoadSession();
            string id = Guid.NewGuid().ToString();
            string input_excel = null;
            try
            {
                var files = Request.Files;
                foreach (string file in files)
                {
                    var fileContent = Request.Files[file];
                    int fileSize = fileContent.ContentLength;
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(fileContent.FileName);
                        fileName = fileName.Replace(" ", "_");
                        if (fileName.EndsWith(".xlsx"))
                        {
                            object[,] obj = null;
                            int noOfCol = 0;
                            int noOfRow = 0;

                            byte[] fileBytes = new byte[Request.ContentLength];
                            var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                            using (var package = new ExcelPackage(Request.InputStream))
                            {
                                var currentSheet = package.Workbook.Worksheets;
                                var workSheet = currentSheet.First();
                                noOfCol = workSheet.Dimension.End.Column;
                                noOfRow = workSheet.Dimension.End.Row;
                                obj = new object[noOfRow, noOfCol];
                                obj = (object[,])workSheet.Cells.Value;
                            }
                            bool istrue = IsNumeric(obj[10, 13]);

                            if (istrue)
                            {
                                input_excel = obj[10, 13].ToString();
                                iBlStatus = 1;

                                filename_ = "ABR_" + id + "_" + fileName;
                                //nama_file_presentasi = fileName;
                                string path_s = @"\\jiepfsap401\ocel$\Equip_document\Upload\" + filename_;
                                fileContent.SaveAs(path_s);

                                var dt_f = db_used_equipment.TBL_T_UNIT_FADs.Where(df => df.CN.Equals(CN)).FirstOrDefault();
                                dt_f.ABR_PATH_FILE = filename_;
                                db_used_equipment.SubmitChanges();
                                db_used_equipment.Dispose();

                                message = "upload process is successful, make sure the numbers that appear on the total cost are the same as those in Excel";
                                title = "Upload Success";
                                type = "green";
                            }
                            else
                            {
                                input_excel = null;
                                iBlStatus = 0;
                                message = "sorry the excel template you used is incorrect, use the correct template by placing the number in Cell N row 11";
                                title = "Your Template Is Wrong";
                                type = "red";

                            }
                            
                        }
                        else
                        {
                            message = "Sorry, the system only wants to accept 2007 version of .xlsx / excel files";
                            title = "File Extention Template Is Wrong";
                            type = "red";

                        }
                    }
                    else
                    {
                        message = "Sorry, the excel directory you selected is invalid";
                        title = "File Not Found";
                        type = "red";

                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                message = "the upload process failed because there was an incorrect process in the program.<br>" + ex.ToString();
                title = "Error Uploading Data";
                type = "red";

            }
            //return this.Json(new { status = iBlStatus, remarks = message, data = filename_, nama_file_presentasi = nama_file_presentasi });
            return this.Json(new { status = iBlStatus, remarks = message, data = filename_, excel_val = input_excel , header = title , type = type });
        }

        private bool IsNumeric(object Expression)
        {
            double retNum;

            bool isNum = Double.TryParse(Convert.ToString(Expression), System.Globalization.NumberStyles.Any, System.Globalization.NumberFormatInfo.InvariantInfo, out retNum);
            return isNum;
        }

        [HttpPost]
        public JsonResult AjaxSaveCancelDemob(TBL_T_UNIT_FAD sDataHeader)
        {
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                decimal conv_po_darat_price = (sDataHeader.PO_DARAT_PRICE != null) ? Convert.ToDecimal(sDataHeader.PO_DARAT_PRICE, culture) : 0;
                decimal conv_po_laut_price = (sDataHeader.PO_LAUT_PRICE != null) ? Convert.ToDecimal(sDataHeader.PO_LAUT_PRICE, culture) : 0;
                decimal conv_price_darat_input = (sDataHeader.PRICE_DARAT_INPUT != null) ? Convert.ToDecimal(sDataHeader.PRICE_DARAT_INPUT, culture) : 0;
                decimal conv_price_laut_input = (sDataHeader.PRICE_LAUT_INPUT != null) ? Convert.ToDecimal(sDataHeader.PRICE_LAUT_INPUT, culture) : 0;
                decimal conv_estimate = (sDataHeader.TOTAL_ESTIMATE_PLAN_REPAIR != null) ? Convert.ToDecimal(sDataHeader.TOTAL_ESTIMATE_PLAN_REPAIR, culture) : 0;
                 
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                pv_CustLoadSession();
                var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == sDataHeader.CN && f.DSTRCT_DISPOSAL == sDataHeader.DSTRCT_DISPOSAL).FirstOrDefault();
                if (checkData != null)
                {
                    //var convertDecimal = Convert.ToDecimal("1200.00");
                    checkData.PO_DARAT = sDataHeader.PO_DARAT;  //desc by PO
                    checkData.PO_LAUT = sDataHeader.PO_LAUT; //desc by PO
                    checkData.PO_DARAT_PRICE = conv_po_darat_price; //dataType in DB is numeric
                    checkData.PO_LAUT_PRICE = conv_po_laut_price; //dataType in DB is numeric
                    checkData.ABR_PATH_FILE = sDataHeader.ABR_PATH_FILE;
                    checkData.PRICE_DARAT_INPUT = conv_price_darat_input; //dataType in DB is numeric
                    checkData.PRICE_LAUT_INPUT = conv_price_laut_input; //dataType in DB is numeric
                    checkData.TOTAL_ESTIMATE_PLAN_REPAIR = conv_estimate; //dataType in DB is numeric
                    checkData.PO_DARAT_DESC = sDataHeader.PO_DARAT_DESC;
                    checkData.PO_LAUT_DESC = sDataHeader.PO_LAUT_DESC;
                    checkData.UPDATE_DATE = DateTime.Now;
                    checkData.UPDATE_NY = iStrSessNRP;
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    TBL_T_UNIT_FAD iTbl = new TBL_T_UNIT_FAD();
                    iTbl.CN = sDataHeader.CN;
                    iTbl.DSTRCT_DISPOSAL = sDataHeader.DSTRCT_DISPOSAL;
                    checkData.PO_DARAT = sDataHeader.PO_DARAT;  //desc by PO
                    checkData.PO_LAUT = sDataHeader.PO_LAUT; //desc by PO
                    checkData.PO_DARAT_PRICE = conv_po_darat_price; //dataType in DB is numeric
                    checkData.PO_LAUT_PRICE = conv_po_laut_price; //dataType in DB is numeric
                    checkData.ABR_PATH_FILE = sDataHeader.ABR_PATH_FILE;
                    checkData.PRICE_DARAT_INPUT = conv_price_darat_input; //dataType in DB is numeric
                    checkData.PRICE_LAUT_INPUT = conv_price_laut_input; //dataType in DB is numeric
                    checkData.TOTAL_ESTIMATE_PLAN_REPAIR = conv_estimate; //dataType in DB is numeric
                    checkData.PO_DARAT_DESC = sDataHeader.PO_DARAT_DESC;
                    checkData.PO_LAUT_DESC = sDataHeader.PO_LAUT_DESC;
                    iTbl.CRETAE_DATE = DateTime.Now;
                    iTbl.CREATE_BY = iStrSessNRP;
                    db_used_equipment.TBL_T_UNIT_FADs.InsertOnSubmit(iTbl);
                    db_used_equipment.SubmitChanges();

                    log_cls.SaveLog("Input data cost : BERHASIL", 3, '0', Session["NRP"].ToString(), sDataHeader.CN);
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                log_cls.SaveLog("Input data cost : GAGAL", 3, '0', iStrSessNRP, sDataHeader.CN);
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxCancelDemob(string s_cn, string s_district)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();

                var check = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == s_cn && f.DSTRCT_DISPOSAL == s_district).FirstOrDefault();
                if (check != null)
                {
                    db_used_equipment.cusp_approve_cn_fad(s_cn, s_district, iStrSessNRP, 2);
                    return Json(new { status = true, title = "Cancel Success", content = "Data has been cancelled succesfully", type = "green" });
                }
                else {
                    return Json(new { status = true, title = "Cancel Failed", content = "sorry data not found, for further contact the SM or IT", type = "red" });
                }             
            }
            catch (Exception e)
            {
                return Json(new { status = true, title = "Cancel Failed", content = "There seems to be a problem with your connection. You should contact the related PIC", type = "red" });
            }
        }
    }
}