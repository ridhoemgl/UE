using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class UnusedEquipmentController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        // GET: UnusedEquipment
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            ViewBag.leftMenu = loadMenu();
            ViewData["sPID"] = Guid.NewGuid().ToString(); //to generate ID
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
            //ViewData["SessionUpload"] = Guid.NewGuid().ToString(); //to generate Session Upload
            //ViewData["SessionDetail"] = Guid.NewGuid().ToString(); //to generate Session Detail
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



        public JsonResult ReadUnusedEquipment( int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                //if (s_last_hm == "" || s_last_hm == null)
                //{
                    db_used_equipment = new DtClass_UsedEquipmentDataContext();
                    var vw = db_used_equipment.UR_001s;
                    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                //}
                //else {
                //    db_used_equipment = new DtClass_UsedEquipmentDataContext();
                //    var vw = db_used_equipment.UR_001s.Where(f => f.LAST_HM == s_last_hm);
                //    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                //}
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SearchUnusedEquipment(string dateinput , int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            DateTime oDate = DateTime.ParseExact(dateinput, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.SearchDataUR001(oDate);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ExportExcelUnUsed()
        {
            var gv = new GridView();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            gv.DataSource = db_used_equipment.UR_001s.OrderBy(datax => datax.CN).ThenBy(s => s.DISTRICT);
            gv.DataBind();

            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=Data UnUsed Equipment.xls");
            Response.ContentType = "application/ms-excel";

            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);

            gv.RenderControl(objHtmlTextWriter);

            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();

            return View("Index");
        }

        [HttpPost]
        public JsonResult ClearStatus(string cn)
        {
            db_used_equipment = db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var update = db_used_equipment.TBL_T_LAST_TRANSACTION_UNITs.Where(j => j.CN.Equals(cn)).FirstOrDefault();
            if (update != null)
            {
                try
                {
                    update.STATUS_PID = 0;
                    db_used_equipment.SubmitChanges();
                    return Json(new {error = false, title = "Clearing Status Success", content = "The data has been successfully cleared, the status has not yet been processed", type = "green" });
                }
                catch (Exception ex)
                {
                    return Json(new { error = true, title = "Clearing Status Failed", content = string.Concat("This Operation contain error :<br>",ex.ToString()), type = "red" });
                }
            }
            else
            {
                return this.Json(new { error = true, title = "Clearing Status Failed", content = "Data Not Found" });
            }
        }

        [HttpPost]
        public JsonResult SaveUnusedEquipment(UR_001 s_str_transaction)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var checkData = db_used_equipment.TBL_T_LAST_TRANSACTION_UNITs.Where(f => f.CN == s_str_transaction.CN).FirstOrDefault();
                if (checkData != null)
                {
                    checkData.STATUS_PID = Convert.ToInt32(s_str_transaction.STATUS_PID);
                    db_used_equipment.SubmitChanges();
                } else {
                    TBL_T_LAST_TRANSACTION_UNIT iTbl = new TBL_T_LAST_TRANSACTION_UNIT();
                    iTbl.CN = s_str_transaction.CN;
                    iTbl.DSTRCT_CODE = s_str_transaction.DISTRICT;
                    iTbl.STATUS_PID = Convert.ToInt32(s_str_transaction.STATUS_PID);
                    iTbl.CREATE_DATE = DateTime.Now;
                    iTbl.CREATE_BY = iStrSessNRP;
                    iTbl.UPDATE_DATE = DateTime.Now;
                    iTbl.UPDATE_BY = iStrSessNRP;
                    db_used_equipment.TBL_T_LAST_TRANSACTION_UNITs.InsertOnSubmit(iTbl);
                    db_used_equipment.SubmitChanges();
                }
                return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ReadSummaryEquipment(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.VW_UR001_SUMMARies;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DD_STATUS()
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iTbl = db_used_equipment.TBL_M_STATUS_UR001s;
            return Json(new { Total = iTbl.Count(), Data = iTbl });
        }

        [HttpPost]
        public JsonResult AjaxFindLastHM(string s_last_hm)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var iTbl = db_used_equipment.UR_001s.Where(f => f.LAST_HM == s_last_hm);
                return Json(iTbl);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult getStatusUR1()
        {
            pv_CustLoadSession();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                var get = db_used_equipment.TBL_M_STATUS_UR001s;
                return Json(get);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxGetUsedEquip(string s_cn, string s_district)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_001s.Where(f => f.CN == s_cn && f.DISTRICT == s_district).FirstOrDefault();
                return Json(vw);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxSaveUsedEquip(TBL_T_LAST_TRANSACTION_UNIT sDataHeader)
        {
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                pv_CustLoadSession();
                var checkData = db_used_equipment.TBL_T_LAST_TRANSACTION_UNITs.Where(f => f.CN == sDataHeader.CN && f.DSTRCT_CODE == sDataHeader.DSTRCT_CODE).FirstOrDefault();
                if (checkData != null)
                {
                    checkData.STATUS_PID = sDataHeader.STATUS_PID;
                    checkData.UPDATE_DATE = DateTime.Now;
                    checkData.UPDATE_BY = iStrSessNRP;
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    TBL_T_LAST_TRANSACTION_UNIT iTbl = new TBL_T_LAST_TRANSACTION_UNIT();
                    iTbl.CN = sDataHeader.CN;
                    iTbl.DSTRCT_CODE = sDataHeader.DSTRCT_CODE;
                    iTbl.STATUS_PID = sDataHeader.STATUS_PID;
                    iTbl.CREATE_DATE = DateTime.Now;
                    iTbl.CREATE_BY = iStrSessNRP;
                    db_used_equipment.TBL_T_LAST_TRANSACTION_UNITs.InsertOnSubmit(iTbl);
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}