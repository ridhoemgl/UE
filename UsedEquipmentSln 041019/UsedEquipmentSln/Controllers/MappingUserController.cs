using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class MappingUserController : Controller
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

        public JsonResult AjaxRead(int s_gp_id, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var tbl = db_used_equipment.View_GP_IDs.Where(f => f.GP == s_gp_id).OrderBy(f => f.NAMA);
                return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxDelete(View_GP_ID s_vw_gp)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var itblUser = db_used_equipment.TBL_USERs.Where(f => f.ID == s_vw_gp.ID && f.NRP == s_vw_gp.NRP).FirstOrDefault();

                if (itblUser != null)
                {
                    db_used_equipment.TBL_USERs.DeleteOnSubmit(itblUser);
                    db_used_equipment.SubmitChanges();

                    db_used_equipment.Dispose();
                    return this.Json(new { remarks = "Delete Berhasil!", status = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return this.Json(new { remarks = "Delete Gagal!", status = false }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DD_PROFILE()
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iTbl = db_used_equipment.TBL_Profiles;
            return Json(new { Total = iTbl.Count(), Data = iTbl });
        }
    }
}