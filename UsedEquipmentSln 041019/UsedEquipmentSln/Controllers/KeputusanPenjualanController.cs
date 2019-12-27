using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class KeputusanPenjualanController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment;
        private LogModel log_cls = new LogModel();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        // GET: KeputusanPenjualan
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                this.pv_CustLoadSession();
                ViewBag.leftMenu = loadMenu();
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
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

        public JsonResult ReadKeputusanPenjualan(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_004s.Distinct();
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadKeputusanPenjualanDetail1(string s_cn, string s_abr, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                decimal conv_abr = Convert.ToDecimal(s_abr, culture);

                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur4_detail(s_cn, conv_abr);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadKeputusanPenjualanDetail2(string s_egi, string s_tahun, string s_minimum, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                decimal conv_minimum = Convert.ToDecimal(s_minimum, culture);

                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                if (s_tahun == null) {
                    var vw = db_used_equipment.cufn_get_ur4_detail2(s_egi, "", conv_minimum);
                    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                } else {
                    var vw = db_used_equipment.cufn_get_ur4_detail2(s_egi, s_tahun, conv_minimum);
                    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                }
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadKeputusanPenjualanDetail3(string s_cn, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                //decimal conv_minimum = Convert.ToDecimal(s_minimum, culture);

                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur2a_detail2(s_cn);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadKeputusanPenjualanDetail4(string s_cn, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                //decimal conv_minimum = Convert.ToDecimal(s_minimum, culture);

                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur2a_detail3(s_cn);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult getSuggestion()
        {
            pv_CustLoadSession();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                var get = db_used_equipment.TBL_M_SUGGESTION_STATUS;
                return Json(get);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxReadTypeBesi(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var tbl = db_used_equipment.TBL_M_TIPE_BERAT_BESIs;
                return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxSaveKeputusanPenjualan(TBL_T_UNIT_FAD sDataHeader)
        {
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                pv_CustLoadSession();
                var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == sDataHeader.CN && f.DSTRCT_DISPOSAL == sDataHeader.DSTRCT_DISPOSAL).FirstOrDefault();
                if (checkData != null)
                {
                    checkData.PID_TRANS_WEIGHT = sDataHeader.PID_TRANS_WEIGHT;
                    checkData.SUGGESTION_STATUS = sDataHeader.SUGGESTION_STATUS;
                    checkData.UPDATE_DATE = DateTime.Now;
                    checkData.UPDATE_NY = Session["NRP"].ToString();
                    db_used_equipment.SubmitChanges();
                    db_used_equipment.cusp_ur4_clear5_7(sDataHeader.CN);
                    bool save_log = log_cls.SaveLog("Keputusan Penjualan Sukses", 5, '0', Session["NRP"].ToString(), checkData.CN);

                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                }
                else {
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data not found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}