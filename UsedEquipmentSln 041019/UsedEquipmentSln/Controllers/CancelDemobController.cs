using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class CancelDemobController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        private string filename_ = string.Empty;
        // GET: CancelDemob
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            ViewBag.leftMenu = loadMenu();
            //ViewData["sPID"] = Guid.NewGuid().ToString();
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
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

        public JsonResult ReadCancelDemob(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
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
        public async Task<JsonResult> UploadPdf()
        {
            string message = string.Empty;
            var iStrRemark = string.Empty;
            int iBlStatus = 0;
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            this.pv_CustLoadSession();
            string id = Guid.NewGuid().ToString();
            try
            {
                var files = Request.Files;
                foreach (string file in files)
                {
                    var fileContent = Request.Files[file];
                    int fileSize = fileContent.ContentLength;
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        if (fileSize <= 6194304)
                        {
                            var fileName = Path.GetFileName(fileContent.FileName);
                            fileName = fileName.Replace(" ", "_");
                            if (fileName.EndsWith(".pdf"))
                            {
                                filename_ = "ABR_" + id + "_" + fileName;
                                //nama_file_presentasi = fileName;
                                var path = Path.Combine(Server.MapPath("~/Upload"), filename_);
                                fileContent.SaveAs(path);
                                iBlStatus = 1;
                                message = "Success";
                            }
                            else
                            {
                                message = "Not valid file";
                            }
                        }
                        else
                        {
                            message = "File tidak boleh lebih dari 6MB";
                        }
                    }
                    else
                    {
                        message = "File not found";
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Upload Failed. Error detailed: " + ex.Message);
            }
            //return this.Json(new { status = iBlStatus, remarks = message, data = filename_, nama_file_presentasi = nama_file_presentasi });
            return this.Json(new { status = iBlStatus, remarks = message, data = filename_ });
        }

        [HttpPost]
        public JsonResult AjaxSaveCancelDemob(TBL_T_UNIT_FAD sDataHeader)
        {
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                decimal conv_po_darat_price = Convert.ToDecimal(sDataHeader.PO_DARAT_PRICE, culture);
                decimal conv_po_laut_price = Convert.ToDecimal(sDataHeader.PO_LAUT_PRICE, culture);
                decimal conv_price_darat_input = Convert.ToDecimal(sDataHeader.PRICE_DARAT_INPUT, culture);
                decimal conv_price_laut_input = Convert.ToDecimal(sDataHeader.PRICE_LAUT_INPUT, culture);
                decimal conv_estimate = Convert.ToDecimal(sDataHeader.TOTAL_ESTIMATE_PLAN_REPAIR, culture);

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
                    iTbl.CRETAE_DATE = DateTime.Now;
                    iTbl.CREATE_BY = iStrSessNRP;
                    db_used_equipment.TBL_T_UNIT_FADs.InsertOnSubmit(iTbl);
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxGetDetailCancelDemob(string s_cn, string s_district)
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
    }
}