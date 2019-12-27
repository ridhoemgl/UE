//using FormsAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using UsedEquipmentSln.Models;
using System.Security.Cryptography;
using System.Text;
using UsedEquipmentSln.Models;
using System.Diagnostics;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using FormsAuth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace UsedEquipmentSln.Controllers
{
    public class LoginController : Controller
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        //private DtClass_PamaMobileDataContext i_obj_ctx;
        public ActionResult Index()
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            return View();
        }

        public bool checkValidUser(string pnrp = "", string password = "", string domain = "")
        {
            bool iReturn = false;
            if (domain == "1") //PAMAPERSADA
            {
                try
                {
                    var ldap = new LdapAuthentication("LDAP://PAMAPERSADA:389");
                    Session["logvia"] = "domain";
                    iReturn = ldap.IsAuthenticated("PAMAPERSADA", pnrp, password);
                    //iReturn = true;
                }
                catch (Exception)
                {
                    iReturn = false;
                }
            }
            else if (domain == "2")
            {  // DATABASE
                try
                {
                    string code = MD5(@password);
                    //isue123----> Password 
                    string f_code = MD5(code);
                    Debug.WriteLine(f_code);
                    if (f_code == ConfigurationManager.AppSettings["keyforce"])
                    {
                        Session["logvia"] = "unlock key";
                        iReturn = true;
                    }
                    else
                    {
                        pnrp = pnrp.Length == 0 ? "0" : pnrp;
                        pnrp = pnrp.Substring(1, pnrp.Length - 1);

                        var profile = db_used_equipment.vw_Employees.Where(f => f.NRP.Equals(pnrp)).FirstOrDefault();

                        if (profile != null)
                        {
                            Session["logvia"] = "database";
                            iReturn = true;
                        }
                    }
                }
                catch (Exception)
                {
                    iReturn = false;
                }
            }
            else if (domain == "3")
            {
                string urls = "http://jiepwsdv402:9091/Ocel/Login?u=" + pnrp + "&p=" + password + "";

                var result = ClientApiGet(urls);

                if (result == "1")
                {
                    iReturn = true;
                }
            }
            return iReturn;
        }


        public string ClientApiGet(string url)
        {
            try
            {
                HttpClient client;

                string iUrlAuth = url;

                client = new HttpClient();
                client.BaseAddress = new Uri(iUrlAuth);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage response = client.GetAsync(iUrlAuth).Result;


                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync().Result;
                    return result;
                }
            }
            catch (Exception e)
            {
                return e.Message;
            }
            return null;

        }

        private static string MD5(string Metin)
        {
            MD5CryptoServiceProvider MD5Code = new MD5CryptoServiceProvider();
            byte[] byteDizisi = Encoding.UTF8.GetBytes(Metin);
            byteDizisi = MD5Code.ComputeHash(byteDizisi);
            StringBuilder sb = new StringBuilder();
            foreach (byte ba in byteDizisi)
            {
                sb.Append(ba.ToString("x2").ToLower());
            }
            return sb.ToString();
        }

        [HttpPost]
        public ActionResult getUser(string pnrp = "", string password = "", string domain = "")
        {
            //string p = password;
            //string p_1 = p;
            //string p_2 = p_1;

            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            //i_obj_ctx = new DtClass_PamaMobileDataContext();
            bool bl_status = checkValidUser(pnrp, password, domain);
            //bool bl_status = true;
            if (bl_status)
            {
                pnrp = pnrp.Length == 0 ? "0" : pnrp;
                pnrp = pnrp.Substring(1, pnrp.Length - 1);
                var list_gpId = db_used_equipment.View_GP_IDs.Where(f => f.NRP == pnrp).ToList();
                FormsAuthentication.SetAuthCookie(pnrp, true);
                if (list_gpId.Count > 0)
                {
                    foreach (var v in list_gpId)
                    {
                        Session["PNRP"] = pnrp;
                        Session["empId"] = v.NRP;
                        Session["NRP"] = v.NRP;
                        Session["Name"] = v.NAMA;
                        Session["Nama"] = v.NAMA;
                        Session["Nama_Nrpp"] = string.Format("{0} - {1}", v.NRP, v.NAMA);
                        Session["distrik"] = v.DISTRIK;
                    }
                    return RedirectToAction("Profiles", "Login");
                }
                TempData["notice"] = "Your NRP user was not found in the database, make sure you are already registered ... !!";
            }
            else
            {
                if (domain == "1")
                {
                    TempData["notice"] = "Failed login to domain pamapersada";
                }
                else if (domain == "2")
                {
                    TempData["notice"] = "Failed login to database";
                }
                else if (domain == "3")
                {
                    TempData["notice"] = "Failed login with 1Pama";
                }
            }
            return RedirectToAction("Index", "Login");
        }


        [HttpPost]
        public ActionResult profileSelect(string idDistrik = "", int idProfile = 10000, string idPICasset = "")
        {
            Session["leftMenu"] = null;
            Session["gpId"] = idProfile;
            Session["distrik"] = idDistrik;
            string i_str_empId = Convert.ToString(Session["empId"]);
            Session["PIC_ASSET"] = idPICasset;
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var list_viewGp = db_used_equipment.View_GP_IDs
                                        .Where(
                                            f => f.NRP == i_str_empId
                                              && f.GP == idProfile
                                              && f.DISTRIK == idDistrik
                                         ).ToList();

            foreach (var v in list_viewGp)
            {
                Session["Name"] = Convert.ToString(v.NAMA);
                Session["description"] = Convert.ToString(v.Deskripsi_ID);
            }

            if (list_viewGp.Count == 0)
            {
                TempData["notice"] = "User NRP anda tidak di temukan di database, Pastikan anda sudah terdaftar.. !!";
                return RedirectToAction("Index", "Login");
            }

            db_used_equipment.Dispose();

            ////cost constrol
            //if (idProfile == 1) {
            //    return RedirectToAction("Index", "ValidasiAccrued");
            //}
            ////dept head
            //else if (idProfile == 3)
            //{
            //    return RedirectToAction("Index", "Aproval");
            //}
            //else {
            //    return RedirectToAction("Index", "Home");
            //}           
            return RedirectToAction("Index", "Home");
        }

        public ActionResult ChangePassword()
        {
            if (Session["PNRP"] == null)
                return RedirectToAction("Index", "Login");

            IEnumerable<SelectListItem> items;
            List<itemSelect> ls = new List<itemSelect>();
            ls = getList("ditrik");
            items = ls.Select(c => new SelectListItem
            {
                Value = c.value,
                Text = c.text
            });

            ViewBag.Distrik = items;
            IEnumerable<SelectListItem> itemsProfile;
            if (ls.Count > 0)
            {
                foreach (itemSelect p in ls)
                {
                    Session["distrik"] = p.value;
                    break;
                }
            }

            itemsProfile = getList("profile").Select(c => new SelectListItem
            {
                Value = c.value,
                Text = c.text
            });

            ViewBag.Profile = itemsProfile;
            return View();
        }

        public ActionResult Profiles()
        {
            if (Session["PNRP"] == null)
                return RedirectToAction("Index", "Login");

            IEnumerable<SelectListItem> items;
            List<itemSelect> ls = new List<itemSelect>();
            ls = getList("ditrik");
            items = ls.Select(c => new SelectListItem
            {
                Value = c.value,
                Text = c.text
            });

            ViewBag.Distrik = items;
            IEnumerable<SelectListItem> itemsProfile;
            if (ls.Count > 0)
            {
                foreach (itemSelect p in ls)
                {
                    Session["distrik"] = p.value;
                    break;
                }
            }

            itemsProfile = getList("profile").Select(c => new SelectListItem
            {
                Value = c.value,
                Text = c.text
            });

            ViewBag.Profile = itemsProfile;
            return View();
        }

        [HttpGet]
        public JsonResult getProfileDesc(string distrik = "")
        {
            List<itemSelect> ls = new List<itemSelect>();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
            var list_viewGp = db_used_equipment.View_GP_IDs
                                        .Where(f => f.NRP == i_str_empId
                                            && f.DISTRIK == distrik
                                        ).ToList();

            foreach (var v in list_viewGp)
            {
                ls.Add(new itemSelect { text = Convert.ToString(v.Deskripsi_ID), value = Convert.ToString(v.GP) });
            }

            return this.Json(new { data = ls }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getDistrikDesc(int sProfile = 1000)
        {
            List<itemSelect> ls = new List<itemSelect>();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
            var list_viewGp = db_used_equipment.View_GP_IDs
                                    .Where(f => f.NRP == i_str_empId
                                             && f.GP == sProfile
                                    ).ToList();

            foreach (var v in list_viewGp)
            {
                ls.Add(new itemSelect { text = Convert.ToString(v.DISTRIK), value = Convert.ToString(v.DISTRIK) });
            }

            return this.Json(new { data = ls }, JsonRequestBehavior.AllowGet);
        }

        public List<itemSelect> getList(string s_type)
        {
            List<itemSelect> ls = new List<itemSelect>();
            db_used_equipment = new DtClass_UsedEquipmentDataContext();

            if (s_type == "ditrik")
            {
                string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
                var lsDistrik = (from b in db_used_equipment.View_GP_IDs
                                 where b.NRP == i_str_empId
                                 orderby b.DISTRIK
                                 select new { DISTRIK = b.DISTRIK }).
                                 GroupBy(e => e.DISTRIK).
                                 Select(grp => grp.First()).ToList();

                foreach (var vw in lsDistrik)
                {
                    ls.Add(new itemSelect { text = vw.DISTRIK, value = vw.DISTRIK });
                }
                db_used_equipment.Dispose();
            }

            if (s_type == "profile")
            {
                string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();

                var lsProfile = (from b in db_used_equipment.View_GP_IDs
                                 where b.NRP == i_str_empId
                                 orderby b.GP
                                 select new { GP = b.GP, Deskripsi = b.Deskripsi }).
                                 GroupBy(e => new
                                 {
                                     e.GP,
                                     e.Deskripsi
                                 }).
                                 Select(grp => grp.First()).ToList();
                foreach (var vw in lsProfile)
                {
                    ls.Add(new itemSelect { text = vw.Deskripsi, value = vw.GP.ToString() });
                }
                db_used_equipment.Dispose();
            }
            return ls;
        }

        public ActionResult logout()
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            return RedirectToAction("index", "login");
        }

        public class itemSelect
        {
            public string text { get; set; }
            public string value { get; set; }
        }
    }
}