using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class QuotationsController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;

        // GET: Quotations
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

        public JsonResult GetAll(string TO, string DOC, string DATE, string PAGE, string ATTN)
        {
            pv_CustLoadSession();

            ViewBag.MOD = TO;
            ViewBag.DOC = DOC;
            ViewBag.DATE = DATE;
            ViewBag.PAGE = PAGE;
            ViewBag.ATTN = ATTN;

            try
            {
                var vw = db_used_equipment.VW_QUOTATIONs.ToList();
                return Json(vw, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Report_hQuotations(string TITLE, string TO, string DOC, string DATE, string NO3, string NO4, string NO5, string NO7, string NO9, string NO10, string NO11, string NO12, string NO13)
        {
            this.pv_CustLoadSession();

            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                var data = db_used_equipment.VW_QUOTATIONs;
                var dataDeptHead = db_used_equipment.VW_PIC_DEP_HEADs.ToList();
                ViewBag.Data = data;
                ViewBag.TITLE = TITLE;
                ViewBag.TO = TO;
                ViewBag.DOC = DOC;
                ViewBag.DATE = DATE;
                ViewBag.NAMA = dataDeptHead[0].NAMA;
                ViewBag.JABATAN = dataDeptHead[0].JABATAN;

                //  Condition
                ViewBag.NO3 = NO3;
                ViewBag.NO4 = NO4;
                ViewBag.NO5 = NO5;
                ViewBag.NO7 = NO7;
                ViewBag.NO9 = NO9;
                ViewBag.N10 = NO10;
                ViewBag.N11 = NO11;
                ViewBag.N12 = NO12;
                ViewBag.N13 = NO13;

                ViewBag.PAGE = 1;

                return View();
            }
        }

        public ActionResult Report_dQuotations(string TITLE, string TO, string DOC, string DATE)
        {
            this.pv_CustLoadSession();

            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                var data = db_used_equipment.VW_QUOTATIONs;
                var dataDeptHead = db_used_equipment.VW_PIC_DEP_HEADs.ToList();
                ViewBag.Data = data;
                ViewBag.TITLE = TITLE;
                ViewBag.TO = TO;
                ViewBag.DOC = DOC;
                ViewBag.DATE = DATE;
                ViewBag.NAMA = dataDeptHead[0].NAMA;
                ViewBag.JABATAN = dataDeptHead[0].JABATAN;

                ViewBag.PAGE = 2;

                return View();
            }
        }
    }
}