using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class MappingMenuController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
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
        public JsonResult AjaxRead(int s_gp_id)
        {
            try
            {
                MenuCrossGPIDClass menuCrossGPID = new MenuCrossGPIDClass();
                var iList = menuCrossGPID.GetMenuCrossGPID(0, s_gp_id);
                return Json(new { Total = iList.Count(), Data = iList });
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, remarks = e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult AjaxUpdate(IEnumerable<SetMenuGP_class> sMenuGP)
        {
            try
            {
                pv_CustLoadSession();
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                foreach (SetMenuGP_class iterate in sMenuGP) {
                    db_used_equipment.sp_update_mapping_menu(iterate.isChek, iterate.GP_ID, iterate.Primer, iterate.A, iterate.D, iterate.E, iterate.R);
                }

                db_used_equipment.Dispose();
                return Json(new { remarks = "Update Success!", status = true });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = e.ToString() });
            }
        }

        [HttpPost]
        public JsonResult DD_PROFILE()
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iTbl = db_used_equipment.TBL_Profiles;
            return Json(new { Total = iTbl.Count(), Data = iTbl });
        }

        public class SetMenuGP_class
        {
            public int Primer { get; set; }
            public int GP_ID { get; set; }
            public int isChek { get; set; }
            public bool A { get; set; }
            public bool D { get; set; }
            public bool E { get; set; }
            public bool R { get; set; }
        }
    }
}