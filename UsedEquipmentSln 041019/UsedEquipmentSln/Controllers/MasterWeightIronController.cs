using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class MasterWeightIronController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
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
        [HttpPost]
        public ActionResult UpdateWeightData(TBL_M_TIPE_BERAT_BESI iTBL_M_TIPE_BERAT_BESI)
        {
            try
            {
                string desccr = iTBL_M_TIPE_BERAT_BESI.TYPE_DESC;
                decimal weight = iTBL_M_TIPE_BERAT_BESI.WEIGHT;
                decimal price_iron = iTBL_M_TIPE_BERAT_BESI.PRICE_BESI;
                string pid = iTBL_M_TIPE_BERAT_BESI.PID_TRANS;

                db_used_equipment.cusp_update_weigh_besi(desccr, weight, price_iron, Session["NRP"].ToString(), pid);

                return Json(new { status = true, title = "Update Success", content = "Weight data and price changed successfully. Thank you", type = "green" });
            }
            catch (Exception err)
            {
                return Json(new { status = true, title = "Update Failed", content = "sorry the system was unable to change the data, there were some errors<br>"+err.ToString(), type = "red" });
            }
        }

        public JsonResult save_weight(string egi, string weight, string price , string user , string type_desc)
        {
            decimal weight_ = decimal.Parse(weight, System.Globalization.CultureInfo.InvariantCulture);
            decimal price_ = decimal.Parse(price, System.Globalization.CultureInfo.InvariantCulture);

            try
            {
                TBL_M_TIPE_BERAT_BESI iTBL_M_TIPE_BERAT_BESI = new TBL_M_TIPE_BERAT_BESI();
                iTBL_M_TIPE_BERAT_BESI.EGI = egi;
                iTBL_M_TIPE_BERAT_BESI.PID_TRANS = Guid.NewGuid().ToString();
                iTBL_M_TIPE_BERAT_BESI.WEIGHT = weight_;
                iTBL_M_TIPE_BERAT_BESI.TYPE_DESC = type_desc;
                iTBL_M_TIPE_BERAT_BESI.PRICE_BESI = price_;
                iTBL_M_TIPE_BERAT_BESI.CREATE_DATE = DateTime.Now;
                iTBL_M_TIPE_BERAT_BESI.CREATE_USER = user;
                db_used_equipment.TBL_M_TIPE_BERAT_BESIs.InsertOnSubmit(iTBL_M_TIPE_BERAT_BESI);
                db_used_equipment.SubmitChanges();

                return Json(new { status = true, title = "Insert Success", content = "Weight data and price insert successfully. Thank you", type = "green" });
            }
            catch (Exception err)
            {
                return Json(new { status = true, title = "Insert Failed", content = "Sorry the system was unable to change the data, there were some errors<br>" + err.ToString(), type = "red" });
            }
        }

        public JsonResult ReadEgiFromShare(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            var data = db_used_equipment.VW_EGI_AVALIBALEs;
            return Json(data.ToDataSourceResult(take, skip, sort, filter));
        }

        public JsonResult ReadMasterWeight(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw = db_used_equipment.TBL_M_TIPE_BERAT_BESIs;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
	}
}