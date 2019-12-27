using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UsedEquipmentSln.Models;
using OfficeOpenXml;
using System.Data;
using System.Net;
using System.Threading.Tasks;
using System.Globalization;
using System.Configuration;

namespace UsedEquipmentSln.Controllers
{
    public class UnitTerdapatFADController : Controller
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        private LogModel log_cls = new LogModel();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string iRemarks = string.Empty;
        public int counter_success = 0;
        public int counter_failed = 0;
        // GET: UnitTerdapatFAD
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
            ViewData["sPID"] = Guid.NewGuid().ToString();
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
            return View();
        }

        public ActionResult DownloadExcelInputDataCost()
        {
            string path = @"\\jiepfsap401\ocel$\Equip_document\excel_template\Template_data_unit_telah_fad.xlsx";
            return File(path, "application/ms-excel", "Template Unit FAD.xlsx");
        }

        [HttpPost]
        public async Task<JsonResult> UploadInput(string user)
        {
            db_used_equipment.ExecuteCommand("delete from staging.STAGING_TBL_T_FAD");
            this.pv_CustLoadSession();
            DataTable dt = new DataTable();

            var iStrRemark = string.Empty;

            try
            {
                object[,] obj = null;
                int noOfCol = 0;
                int noOfRow = 0;
                HttpFileCollectionBase file = Request.Files;
                if ((file != null) && (file.Count > 0))
                {
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                    using (var package = new ExcelPackage(Request.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;
                        obj = new object[noOfRow, noOfCol];
                        obj = (object[,])workSheet.Cells.Value;
                    }

                    List<STAGING_TBL_T_FAD> STG = new List<STAGING_TBL_T_FAD>();
                    CultureInfo cultur = new CultureInfo("en-US");
                    for (int i = 1; i < noOfRow; i++)
                    {
                        if (obj[i, 0] == null || obj[i, 4] == null)
                        {
                            break;
                        }
                        else
                        {
                            STAGING_TBL_T_FAD iSTAGING_TBL_T_FAD = new STAGING_TBL_T_FAD();

                            iSTAGING_TBL_T_FAD.DSITRIK = obj[i, 0].ToString();
                            iSTAGING_TBL_T_FAD.TYPE = ((obj[i, 1] == null) ? null : obj[i, 1].ToString());
                            iSTAGING_TBL_T_FAD.CLASS = ((obj[i, 2] == null) ? null : obj[i, 2].ToString());
                            iSTAGING_TBL_T_FAD.EGI = ((obj[i, 3] == null) ? null : obj[i, 3].ToString());
                            iSTAGING_TBL_T_FAD.CN = (obj[i, 4] == null) ? null : obj[i, 4].ToString();
                            iSTAGING_TBL_T_FAD.SN = (obj[i, 5] == null) ? null : obj[i, 5].ToString();
                            iSTAGING_TBL_T_FAD.PROD_YEAR = ((obj[i, 6] == null) ? 0 : Convert.ToInt32(obj[i, 6]));
                            iSTAGING_TBL_T_FAD.HM = ((obj[i, 7] == null) ? 0 : Convert.ToDecimal(obj[i, 7].ToString().Replace(",", "."), cultur));
                            iSTAGING_TBL_T_FAD.LAST_RUNNING = ((obj[i, 8] == null) ? (DateTime?)null : DateTime.ParseExact(obj[i, 8].ToString().Substring(0, 10), "dd/MM/yyyy", CultureInfo.InvariantCulture));
                            iSTAGING_TBL_T_FAD.IMPORTATION = ((obj[i, 9] == null) ? null : obj[i, 9].ToString());
                            iSTAGING_TBL_T_FAD.FAD = ((obj[i, 10] == null) ? null : obj[i, 10].ToString());
                            iSTAGING_TBL_T_FAD.FAD_OUTS = ((obj[i, 11] == null) ? null : obj[i, 11].ToString());
                            iSTAGING_TBL_T_FAD.APPROVED = ((obj[i, 12] == null) ? (DateTime?)null : DateTime.ParseExact(obj[i, 12].ToString().ToString().Substring(0, 10), "dd/MM/yyyy", CultureInfo.InvariantCulture));
                            iSTAGING_TBL_T_FAD.AGING = ((obj[i, 13] == null) ? 0 : Convert.ToInt32(obj[i, 13]));
                            iSTAGING_TBL_T_FAD.FAT = ((obj[i, 14] == null) ? null : obj[i, 14].ToString());
                            iSTAGING_TBL_T_FAD.FAT_OUTS = ((obj[i, 15] == null) ? null : obj[i, 15].ToString());
                            iSTAGING_TBL_T_FAD.LCT = ((obj[i, 16] == null) ? null : obj[i, 16].ToString());
                            iSTAGING_TBL_T_FAD.DELIVERY = ((obj[i, 17] == null) ? null : obj[i, 17].ToString());
                            iSTAGING_TBL_T_FAD.RECEIVE = ((obj[i, 18] == null) ? null : obj[i, 18].ToString());
                            iSTAGING_TBL_T_FAD.PO_NUMBER = ((obj[i, 19] == null) ? null : obj[i, 19].ToString());
                            iSTAGING_TBL_T_FAD.ETD = ((obj[i, 20] == null) ? (DateTime?)null : DateTime.ParseExact(obj[i, 20].ToString().ToString().Substring(0, 10), "dd/MM/yyyy", CultureInfo.InvariantCulture));
                            iSTAGING_TBL_T_FAD.ETA = ((obj[i, 21] == null) ? (DateTime?)null : DateTime.ParseExact(obj[i, 21].ToString().ToString().Substring(0, 10), "dd/MM/yyyy", CultureInfo.InvariantCulture));
                            iSTAGING_TBL_T_FAD.REMARK = ((obj[i, 22] == null) ? null : obj[i, 22].ToString());
                            STG.Add(iSTAGING_TBL_T_FAD);
                        }
                    }

                    db_used_equipment.STAGING_TBL_T_FADs.InsertAllOnSubmit(STG);
                    db_used_equipment.SubmitChanges();

                    db_used_equipment.insert_update_unit_terdapat_fad(user);

                    iStrRemark = string.Concat( STG.Count(), " row data successfully uploaded by ", user);

                }

                return Json(new { status = true, title = "Upload Success", content = iStrRemark, type = "green" });
            }
            catch (Exception e)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { status = false, title = "Upload Failed !!", content = e.ToString(), type = "red" });
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

        public JsonResult ReadUnitTerdapatFAD(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_002s;
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdateUnitTerdapatFAD(UR_002 s_TBL_T_UNIT_FAD)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == s_TBL_T_UNIT_FAD.CN).FirstOrDefault();
                if (checkData != null)
                {
                    checkData.ETD = s_TBL_T_UNIT_FAD.ETD;
                    checkData.ETA = s_TBL_T_UNIT_FAD.ETA;
                    checkData.REMARK = s_TBL_T_UNIT_FAD.REMARK;
                    checkData.UPDATE_DATE = DateTime.Now;
                    checkData.UPDATE_NY = iStrSessNRP;
                    db_used_equipment.SubmitChanges();
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    TBL_T_UNIT_FAD iTbl = new TBL_T_UNIT_FAD();
                    iTbl.CN = s_TBL_T_UNIT_FAD.CN;
                    iTbl.DSTRCT_DISPOSAL = s_TBL_T_UNIT_FAD.SITE;
                    iTbl.ETD = s_TBL_T_UNIT_FAD.ETD;
                    iTbl.ETA = s_TBL_T_UNIT_FAD.ETA;
                    iTbl.REMARK = s_TBL_T_UNIT_FAD.REMARK;
                    iTbl.UPDATE_DATE = DateTime.Now;
                    iTbl.UPDATE_NY = Session["NRP"].ToString();
                    db_used_equipment.TBL_T_UNIT_FADs.InsertOnSubmit(iTbl);
                    db_used_equipment.SubmitChanges();

                    log_cls.SaveLog("UpdateUnitTerdapatFAD : BERHASIL", 2, '0', Session["NRP"].ToString(), s_TBL_T_UNIT_FAD.CN);
                    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
                }              
            }
            catch (Exception e)
            {
                log_cls.SaveLog("UpdateUnitTerdapatFAD : GAGAL", 2, '0', Session["NRP"].ToString(), s_TBL_T_UNIT_FAD.CN);
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ReadFADDetailFN1(string s_cn, string s_district, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur2a_detail1(s_cn, s_district);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ReadFADDetailFN2(string s_cn, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.cufn_get_ur2a_detail2(s_cn);
                return Json(vw.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpPost]
        public JsonResult AjaxGetDetailFAD2(string s_cn)
        {
            pv_CustLoadSession();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                var checkData = db_used_equipment.cufn_get_ur2a_detail2(s_cn);
                //return Json(checkData);
                return Json(new { status = true, data = checkData });
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadFADDetailFN3(string s_cn, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                var checkData = db_used_equipment.cufn_get_ur2a_detail3(s_cn);
                return Json(checkData.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult getStatusUR2()
        {
            pv_CustLoadSession();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            try
            {
                var get = db_used_equipment.TBL_M_STATUS_UR002s.Where(dt => !dt.CODE.Equals(3));
                return Json(get);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxSaveDetail(TBL_T_UNIT_FAD sDataHeader)
        {
            try
            {
                db_used_equipment.cusp_fad_pertama(sDataHeader.ETD, sDataHeader.ETA, sDataHeader.STATUS_UNIT_UR2, Session["NRP"].ToString(), sDataHeader.REMARK, sDataHeader.CN, sDataHeader.DSTRCT_DISPOSAL, Session["NRP"].ToString());
                return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);

                //db_used_equipment = new DtClass_UsedEquipmentDataContext();
                //var checkData = db_used_equipment.TBL_T_UNIT_FADs.Where(f => f.CN == sDataHeader.CN).FirstOrDefault();
                //if (checkData != null)
                //{
                //    checkData.ETD = (sDataHeader.ETD == null) ? (DateTime?)null : sDataHeader.ETD;
                //    checkData.ETA = (sDataHeader.ETA == null) ? (DateTime?)null : sDataHeader.ETD;
                //    checkData.REMARK = sDataHeader.REMARK;
                //    checkData.STATUS_UNIT_UR2 = Convert.ToInt32(sDataHeader.STATUS_UNIT_UR2);
                //    checkData.IS_APPROVE = 0;
                //    checkData.UPDATE_DATE = DateTime.Now;
                //    checkData.UPDATE_NY = Session["NRP"].ToString();
                //    db_used_equipment.SubmitChanges();
                //    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been updated succesfully" }, JsonRequestBehavior.AllowGet);
                //}
                //else {

                //    TBL_T_UNIT_FAD iTbl = new TBL_T_UNIT_FAD();
                //    iTbl.CN = sDataHeader.CN;
                //    iTbl.DSTRCT_DISPOSAL = sDataHeader.DSTRCT_DISPOSAL;
                //    iTbl.ETD = (sDataHeader.ETD == null) ? (DateTime?)null : sDataHeader.ETD;
                //    iTbl.ETA = (sDataHeader.ETA == null) ? (DateTime?)null : sDataHeader.ETD;
                //    iTbl.REMARK = sDataHeader.REMARK;
                //    iTbl.IS_APPROVE = 0;
                //    iTbl.CRETAE_DATE = DateTime.Now;
                //    iTbl.CREATE_BY = Session["NRP"].ToString();
                //    checkData.STATUS_UNIT_UR2 = Convert.ToInt32(sDataHeader.STATUS_UNIT_UR2);
                //    db_used_equipment.TBL_T_UNIT_FADs.InsertOnSubmit(iTbl);
                //    db_used_equipment.SubmitChanges();
                //    return this.Json(new { status = true, type = "SUCCESS", message = "Data has been saved succesfully" }, JsonRequestBehavior.AllowGet);
                //}
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxGetDataDetail(string s_cn)
        {
            pv_CustLoadSession();
            try
            {
                db_used_equipment = new DtClass_UsedEquipmentDataContext();
                var vw = db_used_equipment.UR_002s.Where(f => f.CN == s_cn).FirstOrDefault();
                return Json(vw);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "Error", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}