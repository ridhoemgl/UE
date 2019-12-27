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
    public class PenjualanInvoicingController : Controller
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
            else
            {
                this.pv_CustLoadSession();
                ViewBag.leftMenu = loadMenu();
                ViewBag.NRP = (string)Session["NRP"].ToString();
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
                return View();
            }

        }

        [HttpPost]
        public JsonResult ReadPenjualanInvoicing(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw = db_used_equipment.UR_007s;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetCustomerData(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var vw = db_used_equipment.VW_CUSTOMERs;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveLastProcessUnitFAD(string CN, string SALES_STATUS, string CUSTOMER_ID, string PJB_NUMBER, string SELLING_PRICE, string MEDIATOR, string INVOICE_NUMBER, string IVOICE_DATE, string AMOUNT_INOVICE, string STATUS_INVOICE, string FAKTUR_NUMBER, string STATUS_FAKTUR, string FAKTUR_DATE, string AMOUNT_FAKTUR, string CONDITIONAL_DETAIL, string EXPORT_DOMESTIK, string SALES_TERM, string DELIVERY_TERM, string DELIVERY_LOCATION, string PRICE_INCL_VAT_RP, string PRICE_INCL_VAT_US, string PRICE_EXCL_VAT_RP, string PRICE_EXCL_VAT_US)
        {
            decimal AMOUNT_INVO = decimal.Parse(AMOUNT_INOVICE, System.Globalization.CultureInfo.InvariantCulture);
            decimal AMOUNT_FACTUR = decimal.Parse(AMOUNT_FAKTUR, System.Globalization.CultureInfo.InvariantCulture);
            decimal SELL_PRODUCT = decimal.Parse(SELLING_PRICE, System.Globalization.CultureInfo.InvariantCulture);
            decimal INCL_VAT_RP = decimal.Parse(PRICE_INCL_VAT_RP, System.Globalization.CultureInfo.InvariantCulture);
            decimal INCL_VAT_US = decimal.Parse(PRICE_INCL_VAT_US, System.Globalization.CultureInfo.InvariantCulture);
            decimal EXCL_VAT_RP = decimal.Parse(PRICE_EXCL_VAT_RP, System.Globalization.CultureInfo.InvariantCulture);
            decimal EXCL_VAT_US = decimal.Parse(PRICE_EXCL_VAT_US, System.Globalization.CultureInfo.InvariantCulture);

            var DSTRCT_DISPOSAL = db_used_equipment.TBL_T_UNIT_FADs.Where(data => data.CN.Equals(CN)).First().DSTRCT_DISPOSAL;

            if (Session["NRP"].ToString() == null || Session["NRP"].ToString() == string.Empty)
            {
                return Json(new { status = false, title = "Session Time Out", content = "Your browser session has expired", type = "red" });
            }
            else
            {
                try
                {
                    db_used_equipment.cusp_save_last_process_fad(CN, DSTRCT_DISPOSAL, SALES_STATUS, CUSTOMER_ID, PJB_NUMBER, SELL_PRODUCT, MEDIATOR, INVOICE_NUMBER, IVOICE_DATE, AMOUNT_INVO, STATUS_INVOICE, FAKTUR_NUMBER, STATUS_FAKTUR, FAKTUR_DATE, AMOUNT_FACTUR, CONDITIONAL_DETAIL, EXPORT_DOMESTIK, SALES_TERM, DELIVERY_TERM, DELIVERY_LOCATION, INCL_VAT_RP, INCL_VAT_US, EXCL_VAT_RP, EXCL_VAT_US, Session["NRP"].ToString());
                    return Json(new { status = true, title = "Update Success", content = "FAD data has been updated and will be forwarded to the next module. LOG failed to save. Thank you", type = "green" });
                }
                catch (Exception exx)
                {
                    return Json(new { status = false, title = "Update Failed", content = "Sorry the update process failed, pass this error to the related PIC.<br> Error : " + exx.ToString(), type = "red" });
                }
            }
        }

        public ActionResult ExportToExcel()
        {
            var gv = new GridView();

            gv.DataSource = db_used_equipment.export_ur7_excels
                .Select(x => new
                {
                    YEAR = x.YEAR,
                    MONTH = x.MONTH,
                    PJB_NUMBER = x.PJB_NUMBER,
                    TYPE = x.TYPE,
                    EGI = x.EGI,
                    CN = x.CN,
                    SN = x.SN,
                    SALES_DECISSION = x.SALES_DECISSION,
                    PROD_YEAR = x.PROD_YEAR,
                    HM = x.HM,
                    CONDITIONAL_DETAIL = x.CONDITIONAL_DETAIL,
                    EXPORT_DOMESTIK = x.EXPORT_DOMESTIK,
                    SALES_TERM = x.SALES_TERM,
                    DELIVERY_TERM = x.DELIVERY_TERM,
                    DELIVERY_LOCATIONS = x.DELIVERY_LOCATIONS,
                    PRICE_INCL_VAT_RP = x.PRICE_INCL_VAT_RP,
                    PRICE_INCL_VAT_US = x.PRICE_INCL_VAT_US,
                    PRICE_EXCL_VAT_RP = x.PRICE_EXCL_VAT_RP,
                    PRICE_EXCL_VAT_US = x.PRICE_EXCL_VAT_US
                })
                .OrderBy(o => o.MONTH).ThenBy(p => p.YEAR);

            gv.DataBind();

            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=PenjualanInvoicing.xls");
            Response.ContentType = "application/ms-excel";

            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);

            gv.RenderControl(objHtmlTextWriter);

            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();

            return View("Index");
        }
    }
}