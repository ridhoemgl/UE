using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace UsedEquipmentSln.Models
{
    public class LogModel
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment = new DtClass_UsedEquipmentDataContext();
        public bool SaveLog(string Action , int ur , char sub_ur , string user , string cn )
        {
            try
            {
                TBL_T_LOG_ANYTHINK iTBL_T_LOG_ANYTHINK = new TBL_T_LOG_ANYTHINK();
                iTBL_T_LOG_ANYTHINK.PID = Guid.NewGuid().ToString();
                iTBL_T_LOG_ANYTHINK.ACTION = Action;
                iTBL_T_LOG_ANYTHINK.TANGGAL_LOG = DateTime.Now;
                iTBL_T_LOG_ANYTHINK.UR = ur;
                iTBL_T_LOG_ANYTHINK.SUB_UR = sub_ur;
                iTBL_T_LOG_ANYTHINK.USER_NRP = user;
                iTBL_T_LOG_ANYTHINK.CN = cn;
                db_used_equipment.TBL_T_LOG_ANYTHINKs.InsertOnSubmit(iTBL_T_LOG_ANYTHINK);
                db_used_equipment.SubmitChanges();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}