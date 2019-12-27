using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.Globalization;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class PlafonMasterController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();
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
            ViewBag.leftMenu = loadMenu();
            ViewBag.NRP = Session["NRP"].ToString();
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

        public JsonResult ReadPlafonData(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.VW_EGI_PLAFONs;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdatePlafon(VW_EGI_PLAFON obj)
        {
            try
            {
                db_used_equipment.cusp_update_egi_plafon(obj.EGI, obj.PLAFON);
                return Json(new { status = true, title = "Update Success", content = "the ceiling of "+obj.EGI_DESCRIPTION+" has been updated", type = "green" });
            }
            catch (System.Exception ex)
            {
                return Json(new { status = true, title = "Update Failed", content = "plafon update failed , because contain some error like <br>"+ex.ToString(), type = "red" });
            }
        }
	}
}