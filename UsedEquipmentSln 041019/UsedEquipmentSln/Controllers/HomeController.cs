using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class HomeController : Controller
    {
		public DtClass_UsedEquipmentDataContext db_used_equipment;
        //public DtClass_PamaMobileDataContext db_PamaMobile;
        //private DtClass_MobileServiceDataContext db_MobileService;
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
		 public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            if (iStrSessGPID == "1" || iStrSessGPID == "10" || iStrSessGPID == "12")
            {
                ViewBag.leftMenu = loadMenu();
                return View();
            }
            else {
                return RedirectToAction("NonAdmin", "Home");
            }
        }

        public ActionResult NonAdmin()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            if (iStrSessGPID == "0" || iStrSessGPID == "10" || iStrSessGPID == "12" )
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                return View();
            }
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


        //public JsonResult AjaxReadTaskMonitoring(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        //{
        //    pv_CustLoadSession();
        //    try
        //    {
        //        db_MobileService = new DtClass_MobileServiceDataContext();
        //        var tbl = db_MobileService.task_monitoring_status;
        //        return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpPost]
        //public JsonResult AjaxSaveTask(vw_task_monitoring_status sVW_task_monitoring_status)
        //{
        //    try
        //    {
        //        pv_CustLoadSession();
        //        db_MobileService = new DtClass_MobileServiceDataContext();
        //        var dataExist = db_MobileService.tbl_t_upload_job_masters.Where(f => f.job_id == sVW_task_monitoring_status.job_id).FirstOrDefault();

        //        if (dataExist == null)
        //        {
        //            if (sVW_task_monitoring_status.duration < 0)
        //            {
        //                return Json(new { remarks = "Minimal Duration adalah 0!", status = false });
        //            }
        //            else {
        //                tbl_t_upload_job_master iTbl = new tbl_t_upload_job_master();

        //                iTbl.job_id = sVW_task_monitoring_status.job_id;
        //                iTbl.server_id = "TEST";
        //                iTbl.script_code = sVW_task_monitoring_status.job_id;
        //                iTbl.run_datetime = DateTime.Now;
        //                iTbl.finish_datetime = DateTime.Now;
        //                iTbl.job_status = 1;
        //                iTbl.job_remark = "queuing";
        //                iTbl.db_server_name = sVW_task_monitoring_status.db_server_name;
        //                iTbl.database_name = sVW_task_monitoring_status.database_name;
        //                iTbl.script_location = sVW_task_monitoring_status.script_location;
        //                iTbl.script_location_server = "jiepsqdv403";
        //                iTbl.longrun_insecond = 0;
        //                iTbl.interval_type = sVW_task_monitoring_status.interval_type;
        //                iTbl.duration = sVW_task_monitoring_status.duration;
        //                iTbl.active_status = sVW_task_monitoring_status.active_status;
        //                db_MobileService.tbl_t_upload_job_masters.InsertOnSubmit(iTbl);

        //                db_MobileService.SubmitChanges();
        //                db_MobileService.Dispose();

        //                return Json(new { remarks = "Insert Success !", status = true });
        //            }                    
        //        }
        //        else
        //        {
        //            return Json(new { remarks = "Job sudah ada !", status = false });
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { remarks = "Unhandle Exeption Error!", error = e.ToString(), status = false }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public JsonResult AjaxReadMasterLog(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter, string sJobID)
        //{
        //    pv_CustLoadSession();
        //    try
        //    {
        //        db_MobileService = new DtClass_MobileServiceDataContext();
        //        if (sJobID == null || sJobID == "" || sJobID == "All")
        //        {
        //            var tbl = db_MobileService.tbl_t_upload_job_master_logs.OrderByDescending(f => f.log_date);
        //            return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
        //        }
        //        else {
        //            var tbl = db_MobileService.tbl_t_upload_job_master_logs.Where(f => f.job_id == sJobID).OrderByDescending(f => f.log_date);
        //            return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
        //        }
                
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpPost]
        //public ActionResult AjaxReset(string sJobID)
        //{
        //    pv_CustLoadSession();

        //    try
        //    {
        //        db_MobileService = new DtClass_MobileServiceDataContext();
        //        db_MobileService.sp_resetServiceJobID(sJobID);
        //        db_MobileService.Dispose();
        //        return Json(new { remarks = "Reset Success!", status = true });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { status = false, remarks = e.ToString() });
        //    }
        //}

        //[HttpPost]
        //public JsonResult GetCountUser()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    var iTbl = db_PamaMobile.vw_count_users;
        //    return Json(new { Data = iTbl });
        //}

        //[HttpPost]
        //public JsonResult GetUserOnline()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    var iTbl = db_PamaMobile.fn_getListUserOnline("userOnline");
        //    return Json(new { Data = iTbl });
        //}

        //[HttpPost]
        //public JsonResult GetUserActive()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    var iTbl = db_PamaMobile.fn_getListUserOnline("userActive");
        //    return Json(new { Data = iTbl });
        //}

        //[HttpPost]
        //public JsonResult GetLoginToday()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    var iTbl = db_PamaMobile.fn_getListUserOnline("loginToday");
        //    return Json(new { Data = iTbl });
        //}

        //[HttpPost]
        //public JsonResult DD_JOB_ID()
        //{
        //    db_MobileService = new DtClass_MobileServiceDataContext();
        //    var iTbl = db_MobileService.task_monitoring_status;
        //    return Json(new { Total = iTbl.Count(), Data = iTbl });
        //}

        //[HttpPost]
        //public JsonResult getApprovalPercentage()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    return Json(db_PamaMobile.vw_approval_percentages);
        //}

        //[HttpPost]
        //public JsonResult getApprovalPercentageDetail2()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    return Json(db_PamaMobile.vw_approval_percentage_details.OrderBy(f => f.app_id));
        //}


        //[HttpPost]
        //public JsonResult getLogByUser()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    return Json(db_PamaMobile.vw_summary_log_by_users.OrderByDescending(f => f.jumlah_access).Take(20));

        //}

        //[HttpPost]
        //public JsonResult getLogByAction()
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    return Json(db_PamaMobile.vw_summary_log_by_actions.OrderByDescending(f => f.jumlah_access).Take(20));

        //}

        //[HttpPost]
        //public JsonResult getLogByActionNRP(string sAction)
        //{
        //    db_PamaMobile = new DtClass_PamaMobileDataContext();
        //    return Json(db_PamaMobile.vw_summary_log_by_action_nrps.Where(f => f.action == sAction).OrderByDescending(f => f.jumlah_access).Take(20));

        //}

        //[HttpPost]
        //public ActionResult changePassword( string s_password, string s_nrp)
        //{
        //    try
        //    {
        //        db_PamaMobile = new DtClass_PamaMobileDataContext();
        //        pv_CustLoadSession();

        //        var iTblUpdate = db_PamaMobile.tbl_change_passwords.Where(f => f.nrp == s_nrp).FirstOrDefault();
        //        iTblUpdate.password = s_password;
        //        db_PamaMobile.SubmitChanges();

        //        return this.Json(new { status = true, type = "SUCCESS", message = "Password has been updated sucesfully" }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}