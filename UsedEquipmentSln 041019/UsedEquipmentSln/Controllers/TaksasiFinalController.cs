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
    public class TaksasiFinalController : Controller
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
        // GET: TaksasiFinal
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

        [HttpPost]
        public JsonResult ReadTaksasiFinalDetail2_(string s_egi, string s_tahun,string s_cn, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                CultureInfo culture = new CultureInfo("en-US");
                var data = db_used_equipment.UR_004s.Where(s => s.CN.Equals(s_cn)).FirstOrDefault();
                decimal min = 0;
                
                if (data != null)
                {
                    if (data.MINIMUM_PRICE == null)
                    {
                        min = Convert.ToDecimal(db_used_equipment.UR_004s.Where(s => s.CN.Equals(s_cn)).FirstOrDefault().MINIMUM_PRICE, culture);
                    }
                }

                if (s_tahun == null)
                {
                    var vw = db_used_equipment.cufn_get_ur4_detail2(s_egi, "", min);
                    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                }
                else
                {
                    var vw = db_used_equipment.cufn_get_ur4_detail2(s_egi, s_tahun, min);
                    return Json(vw.ToDataSourceResult(take, skip, sort, filter));
                }
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
        }

        public JsonResult ReadTaksasiFinal(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_006s;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadTaksasiFinalDetail1(string s_cn, string s_abr, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                int abr;
                Int32.TryParse(s_abr, out abr);
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur4_detail(s_cn, abr);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadTaksasiFinalDetail2(string s_cn, string s_egi, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur7_detail(s_cn, s_egi);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxSaveTaksasiFinal(string s_price, string s_total_cost, string s_cn, string s_district)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                CultureInfo culture = new CultureInfo("en-US");
                decimal conv_total_cost = Convert.ToDecimal(s_total_cost, culture);
                decimal conv_price_sale = Convert.ToDecimal(s_price, culture);

                var check = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == s_cn && f.DSTRCT_DISPOSAL == s_district).FirstOrDefault();
                if (check != null)
                {
                    check.PRICE_SALE = conv_price_sale;
                    check.TOTAL_COST_ELLIPSE = conv_total_cost;
                    check.UPDATE_DATE = DateTime.Now;
                    check.UPDATE_NY = iStrSessNRP;
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return this.Json(new { status = true, type = "ERROR", message = "sorry data not found, for further contact the SM or IT" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return Json(new { status = true, title = "Cancel Failed", content = "There seems to be a problem with your connection. You should contact the related PIC", type = "red" });
            }
        }

        [HttpPost]
        public JsonResult AjaxSelectCN(string s_cn, bool is_selected)
        {
            try
            {
                var iTBL_T_UNIT_FAD = db_used_equipment.TBL_T_UNIT_FADs.Where(h => h.CN.Equals(s_cn)).FirstOrDefault();
                if (iTBL_T_UNIT_FAD != null)
                {
                    iTBL_T_UNIT_FAD.IS_SELED_FOQUOT = is_selected;
                    db_used_equipment.SubmitChanges();
                }

                return this.Json(new { status = true }, JsonRequestBehavior.AllowGet); 
            }
            catch (Exception ex)
            {
                return this.Json(new { status = false , type = "red", header = "ERROR SELECTED DATA", message = "<b>Error When Updating data in database</b><br>"+ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
            
        }

        [HttpPost]
        public JsonResult AjaxBackToRecond(string s_cn, string s_district, string s_usr)
        {
            try
            {
                if (s_cn != null)
                {
                    s_cn = s_cn.Replace(" ", string.Empty);

                    db_used_equipment.cusp_back_to_recond(s_cn, s_district, s_usr);
                    return Json(new { status = true, title = "Back Recond Success", content = "After this process is successful, the data returns to the <b>Monitoring Reconditioning process</b>", type = "green" });
                }
                else
                {
                    return Json(new { status = true, title = "CN Empty", content = "Sorry we can't read the CN data that you are referring to, try reloading this page by pressing F5", type = "red" });
                }
            }
            catch (Exception e)
            {
                return Json(new { status = true, title = "Back Recond Failed", content = string.Concat("There is a problem with your network connection,<br>here are the details: " , e.ToString()), type = "red" });
            }
        }
    }
}