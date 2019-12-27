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

namespace UsedEquipmentSln.Controllers
{
    public class MonitoringReconditionController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        private string filename_ = string.Empty;

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

        public JsonResult ReadMonitoringRecondition(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_005s;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<JsonResult> UploadInput(string user)
        {
            this.pv_CustLoadSession();
            DataTable dt = new DataTable();
            db_used_equipment.ExecuteCommand("delete from staging.STAGING_TBL_T_MONITORING_RECOND");
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

                    List<STAGING_TBL_T_MONITORING_RECOND> MONREC = new List<STAGING_TBL_T_MONITORING_RECOND>();
                    CultureInfo cultur = new CultureInfo("en-US");
                    for (int i = 1; i < noOfRow - 1; i++)
                    {
                        if (obj[i, 1] == null)
                        {
                            break;
                        }
                        else
                        {
                            STAGING_TBL_T_MONITORING_RECOND STAGING_MON_REC = new STAGING_TBL_T_MONITORING_RECOND();
                            bool target_finish = false;
                            bool actual_finish = false;
                            string t_TARGET_FINISH = "";
                            string t_ACTUAL_FINISH_DATE = "";

                            if (Convert.ToDouble(obj[i, 5]) > 0)
                            {
                                target_finish = true;
                                t_TARGET_FINISH = DateTime.FromOADate(Convert.ToDouble(obj[i, 5])).ToString("dd/MM/yyyy");
                            }

                            if (Convert.ToDouble(obj[i, 8]) > 0)
                            {
                                actual_finish = true;
                                t_ACTUAL_FINISH_DATE = DateTime.FromOADate(Convert.ToDouble(obj[i, 8])).ToString("dd/MM/yyyy");
                            }

                            double t_PERSEN = (obj[i, 9] == null ? 0 : Convert.ToDouble(obj[i, 9].ToString().Replace(",", "."), cultur));

                            STAGING_MON_REC.DISTRIK = obj[i, 1].ToString();
                            STAGING_MON_REC.SN = obj[i, 2].ToString();
                            STAGING_MON_REC.CN = obj[i, 3].ToString();
                            STAGING_MON_REC.RECOND_LOCATION = (obj[i, 4] == null) ? null : obj[i, 4].ToString();
                            if (target_finish)
                                STAGING_MON_REC.TARGET_FINISH = Convert.ToDateTime(t_TARGET_FINISH);
                            STAGING_MON_REC.STATUS_UNIT = (obj[i, 6] == null) ? 0 : Convert.ToInt32(obj[i, 6]);
                            STAGING_MON_REC.STATUS_PROCESS = obj[i, 7] == null ? 0 : Convert.ToInt32(obj[i, 7]);
                            if (actual_finish)
                                STAGING_MON_REC.ACTUAL_FINISH_DATE = Convert.ToDateTime(t_ACTUAL_FINISH_DATE);
                            STAGING_MON_REC.PERSEN = t_PERSEN;

                            MONREC.Add(STAGING_MON_REC);
                        }
                    }

                    db_used_equipment.STAGING_TBL_T_MONITORING_RECONDs.InsertAllOnSubmit(MONREC);
                    db_used_equipment.SubmitChanges();

                    db_used_equipment.cusp_update_input_monitoring_recond(user);

                    iStrRemark = string.Concat(" row data successfully uploaded by ", user);

                }
                return Json(new { status = true, title = "Upload Success", content = iStrRemark, type = "green" });
            }
            catch (Exception e)
            {
                var asd = e.Message;
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { status = false, title = "Upload Failed !!", content = e.ToString(), type = "red" });
            }
        }

        [HttpPost]
        public JsonResult getPROGRESS_RECON()
        {
            pv_CustLoadSession();
            try
            {
                var get = db_used_equipment.TBL_M_STATUS_PROGRESS_RECONs;
                return this.Json(new { Data = get, Total = get.Count() });
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DownloadExcelMonitorRecond()
        {
            return File(@"\\jiepfsap401\ocel$\Equip_document\excel_template\template_monitoring_recondition.xlsx", "application/ms-excel", "Template Monitoring Recondition.xlsx");
        }

        [HttpPost]
        public JsonResult UpdateMonitoring(string cn, string location, string @start_date, string @finish_date, string s_proc, string s_prog, string persen, string @actual_date)
        {
            try
            {
                var dt = db_used_equipment.TBL_T_UNIT_FADs.Where(s => s.CN.Equals(cn)).First();

                dt.RECON_LOCATION = location;
                if (@start_date != null && @start_date != "NaN-NaN-NaN")
                {
                    dt.START_RECONDITION = (@start_date == null) ? (DateTime?)null : DateTime.ParseExact(start_date, "yyyy-MM-dd", null);                    
                }

                if (@finish_date != null && @finish_date != "NaN-NaN-NaN")
                {
                    DateTime finis = DateTime.ParseExact(@finish_date, "yyyy-MM-dd", null);
                    dt.TARGET_FINISH_RECONDITION = finis;                    
                }

                if (s_proc != null && s_proc != "NaN" && s_proc != "0")
                {
                    dt.STATUS_PROCESS = Convert.ToInt32(s_proc);                    
                }

                if (s_prog != null && s_prog != "NaN" && s_prog != "0")
                {
                    dt.STATUS_PROGRESS = Convert.ToInt32(s_prog);
                }

                if (persen != null && persen != "NaN" && persen != "0")
                {
                    dt.PERCENTS = double.Parse(persen, System.Globalization.CultureInfo.InvariantCulture);                    
                }

                if (@actual_date != null && @actual_date  != "NaN-NaN-NaN")
                {
                    dt.ACTUAL_FINISH_DATE = (@actual_date == null) ? (DateTime?)null : DateTime.ParseExact(start_date, "yyyy-MM-dd", null);                    
                }

                db_used_equipment.SubmitChanges();

                bool save_log = log_cls.SaveLog("UpdateMonitoring", 5, '0', Session["NRP"].ToString(), cn);
                if (save_log)
                {
                    return Json(new { status = true, title = "Update Success", content = "FAD data has been updated and will be forwarded to the next module. Thank you", type = "green" });
                }
                else
                {
                    log_cls.SaveLog("UpdateMonitoring : GAGAL", 5, '0', Session["NRP"].ToString(), cn);
                    return Json(new { status = true, title = "Update Success", content = "FAD data has been updated and will be forwarded to the next module. LOG failed to save. Thank you", type = "green" });
                }

            }
            catch (Exception exx)
            {
                return Json(new { status = false, title = "Update Failed", content = "Sorry the update process failed, pass this error to the related PIC.<br> Error : " + exx.ToString(), type = "red" });
            }
        }

        [HttpPost]
        public JsonResult getPROCESS_UR5()
        {
            pv_CustLoadSession();
            try
            {
                var get = db_used_equipment.TBL_M_STATUS_PROCESS_UR5s;
                return this.Json(new { Data = get, Total = get.Count() });
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

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
            return View();
        }
    }
}