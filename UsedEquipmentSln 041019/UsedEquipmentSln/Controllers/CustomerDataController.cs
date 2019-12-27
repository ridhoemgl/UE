using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class CustomerDataController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;

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

        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            this.pv_CustLoadSession();
            ViewBag.leftMenu = loadMenu();
            ViewBag.NRP = (string)Session["NRP"].ToString();
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
            return View();
        }

        [HttpPost]
        public ActionResult UpdateCustomer(string pid ,string cus_name, string cus_addr, string cus_phone, string mail, string pic, int country, int status, bool is_active)
        {
            try
            {
                TBL_M_CUSTOMER iTBL_M_CUSTOMER = db_used_equipment.TBL_M_CUSTOMERs.Where(s => s.CUSTOMER_ID.Equals(pid)).First();
                iTBL_M_CUSTOMER.CUS_NAME = cus_name;
                iTBL_M_CUSTOMER.CUS_ADDRESS = cus_addr;
                iTBL_M_CUSTOMER.COUNTRY_CODE = country;
                iTBL_M_CUSTOMER.PHONE_NUMBER = cus_phone;
                iTBL_M_CUSTOMER.CUS_STATUS = status;
                iTBL_M_CUSTOMER.PIC = pic;
                iTBL_M_CUSTOMER.EMAIL_ADDR = mail;
                iTBL_M_CUSTOMER.IS_ACTIVE = Convert.ToBoolean(is_active);
                iTBL_M_CUSTOMER.UPDATE_DATE = DateTime.Now;
                iTBL_M_CUSTOMER.UPDATE_BY = Session["NRP"].ToString();
                db_used_equipment.SubmitChanges();
                db_used_equipment.Dispose();

                return Json(new { status = true, title = "Update Success", content = "The process of updating customer data has been successful", type = "green" });
            }
            catch (Exception ex)
            {
                return Json(new { status = true, title = "Update Failed", content = "There seems to be a problem with your connection. You should contact the related PIC<br>" + ex.ToString(), type = "red" });
            }
        }

        [HttpPost]
        public ActionResult AddCustomer(string cus_name, string cus_addr, string cus_phone, string mail, string pic, int country, int status, bool is_active)
        {
            try
            {
                TBL_M_CUSTOMER iTBL_M_CUSTOMER = new TBL_M_CUSTOMER();
                iTBL_M_CUSTOMER.CUSTOMER_ID = Guid.NewGuid().ToString();
                iTBL_M_CUSTOMER.CUS_NAME = cus_name;
                iTBL_M_CUSTOMER.CUS_ADDRESS = cus_addr;
                iTBL_M_CUSTOMER.COUNTRY_CODE = country;
                iTBL_M_CUSTOMER.PHONE_NUMBER = cus_phone;
                iTBL_M_CUSTOMER.CUS_STATUS = status;
                iTBL_M_CUSTOMER.PIC = pic;
                iTBL_M_CUSTOMER.EMAIL_ADDR = mail;
                iTBL_M_CUSTOMER.IS_ACTIVE = Convert.ToBoolean(is_active);
                iTBL_M_CUSTOMER.CREATE_DATE = DateTime.Now;
                iTBL_M_CUSTOMER.CREATE_BY = Session["NRP"].ToString();
                iTBL_M_CUSTOMER.UPDATE_DATE = DateTime.Now;
                iTBL_M_CUSTOMER.UPDATE_BY = Session["NRP"].ToString();

                db_used_equipment.TBL_M_CUSTOMERs.InsertOnSubmit(iTBL_M_CUSTOMER);
                db_used_equipment.SubmitChanges();

                return Json(new { status = true, title = "Insert Success", content = "The process of adding customer data has been successful", type = "green" });
            }
            catch (Exception exc)
            {
                return Json(new { status = true, title = "Insert Failed", content = "There seems to be a problem with your connection. You should contact the related PIC<br>"+exc.ToString(), type = "red" });
            }
        }

        public JsonResult ReadCustomerData(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.VW_CUSTOMERs;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetCountry()
        {
            var country = db_used_equipment.TBL_R_COUNTRies;
            return this.Json(new { Data = country, Total = country.Count() });
        }

        [HttpPost]
        public JsonResult GetCusStatus()
        {
            var c_sta = db_used_equipment.TBL_R_CUSTOMER_STATUS;
            return this.Json(new { Data = c_sta, Total = c_sta.Count() });
        }
	}
}