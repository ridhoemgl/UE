using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class AddUserController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
        public DtClass_DBShareDataContext db_Share;
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

        public JsonResult AjaxRead(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var tbl = db_used_equipment.vw_Employees.Where(f => f.EMP_STATUS == "A").OrderBy(f => f.NAME);
                return Json(tbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxInsert(string nrp , int gp , string distrik)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                if (nrp == null)
                    return this.Json(new { message = "Harap isi NRP!", status = false }, JsonRequestBehavior.AllowGet);

                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var iUser_ = db_used_equipment.TBL_USERs.Where(f => f.NRP.Equals(nrp) && f.GP.Equals(gp) && f.DISTRIK.Equals(distrik));

                if (iUser_.Count() <= 0)
                {
                    TBL_USER iTblUser = new TBL_USER();
                    iTblUser.NRP = nrp;
                    iTblUser.GP = gp;
                    iTblUser.DISTRIK = distrik;

                    db_used_equipment.TBL_USERs.InsertOnSubmit(iTblUser);
                    db_used_equipment.SubmitChanges();
                    db_used_equipment.Dispose();

                    return this.Json(new { message = "NRP " + nrp + " tersimpan di database!", status = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return this.Json(new { message = "NRP " + nrp + " sudah terdaftar!", status = false }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DD_GP()
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iTbl = db_used_equipment.TBL_Profiles;
            return Json(new { Total = iTbl.Count(), Data = iTbl });
        }

        [HttpPost]
        public JsonResult DD_DISTRIK()
        {
            //db_share
            db_Share = new DtClass_DBShareDataContext();
            var iTbl = db_Share.TBL_DWH_DISTRICTs.Where(f => f.DSTRCT_STATUS == "ACTIVE");
            return Json(new { Total = iTbl.Count(), Data = iTbl });
        }
    }
}