using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class ApproveRejectController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private LogModel log_cls = new LogModel();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        // GET: ApproveReject
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            ViewBag.leftMenu = loadMenu();
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

        public JsonResult ReadApproveReject(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_Approvals;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public JsonResult AjaxSaveApprReject(string s_cn, string s_district, int s_status)
        //{
        //    try
        //    {
        //        db_used_equipment = new DtClass_UsedEquipmentDataContext();
        //        pv_CustLoadSession();
        //        if (s_status == 1)
        //        {
        //            var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == s_cn && f.DSTRCT_DISPOSAL == s_district).FirstOrDefault();
        //            if (checkData != null)
        //            {
        //                checkData.IS_APPROVE = 1;
        //                checkData.UPDATE_DATE = DateTime.Now;
        //                checkData.UPDATE_NY = iStrSessNRP;
        //                db_used_equipment.SubmitChanges();
        //                return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
        //            }
        //            else
        //            {
        //                return this.Json(new { status = true, type = "INFO", message = "No data found" }, JsonRequestBehavior.AllowGet);
        //            }
        //        }
        //        else {
        //            var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == s_cn && f.DSTRCT_DISPOSAL == s_district).FirstOrDefault();
        //            if (checkData != null)
        //            {
        //                checkData.IS_APPROVE = 0;
        //                checkData.UPDATE_DATE = DateTime.Now;
        //                checkData.UPDATE_NY = iStrSessNRP;
        //                db_used_equipment.SubmitChanges();
        //                return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
        //            }
        //            else
        //            {
        //                return this.Json(new { status = true, type = "INFO", message = "No data found" }, JsonRequestBehavior.AllowGet);
        //            }
        //        }

        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public JsonResult AjaxSaveApprReject(string s_cn, string s_district, int s_status)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var nrp = Session["NRP"].ToString();
                db_used_equipment.cusp_approve_cn_fad(s_cn, s_district, Session["NRP"].ToString(), s_status);
                log_cls.SaveLog("UpdateMonitoring : GAGAL", 5, '0', Session["NRP"].ToString(), s_cn);
                return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}