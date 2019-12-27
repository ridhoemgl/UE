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
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Controllers
{
    public class SelectCNController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;

        public JsonResult DeleteCNSelected(string CN, bool isChecked)
        {
            try
            {
                if (isChecked == true)
                {
                    TBL_T_SELECTED_CN iTBL_T_SELECTED_CN = new TBL_T_SELECTED_CN();
                    iTBL_T_SELECTED_CN.CN = CN;
                    iTBL_T_SELECTED_CN.CREATE_DATE = DateTime.Now;
                    db_used_equipment.TBL_T_SELECTED_CNs.InsertOnSubmit(iTBL_T_SELECTED_CN);
                    db_used_equipment.SubmitChanges();
                }
                else if (isChecked == false)
                {
                    TBL_T_SELECTED_CN iTBL_T_SELECTED_CN = db_used_equipment.TBL_T_SELECTED_CNs.Where(s => s.CN.Equals(CN)).First();
                    db_used_equipment.TBL_T_SELECTED_CNs.DeleteOnSubmit(iTBL_T_SELECTED_CN);
                    db_used_equipment.SubmitChanges();
                }
                
                return Json(new { status = true});
            }
            catch (Exception ex)
            {
                return Json(new { status = false , error = ex.ToString()});
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
        public JsonResult readSelectedCN(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw = db_used_equipment.VW_SELECTED_CNs;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SelectCheckedList(string type, int action)
        {
            try
            {
                db_used_equipment.cusp_set_selected_cn(type,action);
                return this.Json(new { status = true });
            }
            catch (Exception e)
            {
                return this.Json(new { status = false});
            }
        }

        
	}
    
}

