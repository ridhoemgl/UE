using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Models
{
    public class MenuLeftClass
    {
        private DtClass_UsedEquipmentDataContext db_used_equipment;
        private string str_menuResult = "";
        private string urlPath = System.Configuration.ConfigurationManager.AppSettings["urlAppPath"].ToString();

        public string recursiveMenu(int id = 0, int gpId = 1)
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iListMenu = db_used_equipment.menus.Where(f => f.GP_ID == gpId && f.Id == id).OrderBy(f => f.Id).OrderBy(f => f.Urutan);

            foreach (var itemMenu in iListMenu)
            {
                if (id == 0)
                {
                    str_menuResult += "<li>";
                    if ((int)itemMenu.Menu_link == 0)
                    {
                        str_menuResult += "<a href='"+ urlPath + (string)itemMenu.Link + "'><i class='"
                                       + (string)itemMenu.Style_css + "'></i><span>" + (string)itemMenu.Menu1 + "</span></a>";
                    }
                    else
                    {
                        str_menuResult += "<a href='#'><i class='"
                                       + (string)itemMenu.Style_css + "'></i><span>" + (string)itemMenu.Menu1 + "</span></a>";
                    }
                    
                }

                if ((int)itemMenu.Menu_link > 0)
                {
                    str_menuResult += "<ul>";
                    recursiveSubMenu((int)itemMenu.Menu_link, gpId);
                    str_menuResult += "</ul>";
                }

                if (id == 0)
                {
                    str_menuResult += "</li>";
                }
            }
            str_menuResult += "</ul>";
            db_used_equipment.Dispose();
            return str_menuResult;
        }

        private void recursiveSubMenu(int id = 0, int gpId = 0)
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iListMenu = db_used_equipment.menus.Where(f => f.GP_ID == gpId && f.Id == id).OrderBy(f => f.Id).OrderBy(f => f.Urutan);

            foreach (var itemMenu in iListMenu)
            {
                str_menuResult += "<li>";
                if (itemMenu.Menu_link > 0)
                {
                    str_menuResult += "<a href='#'> " + (string)itemMenu.Menu1 + "</a>";
                }
                else
                {
                    str_menuResult += "<a href='" + urlPath + (string)itemMenu.Link + "'> " + (string)itemMenu.Menu1 + "</a>";
                }

                if ((int)itemMenu.Menu_link > 0)
                {
                    str_menuResult += "<ul>";
                    recursiveSubMenu((int)itemMenu.Menu_link, gpId);
                    str_menuResult += "</ul>";
                }
                str_menuResult += "</li>";
            }
            db_used_equipment.Dispose();
        }
    }
}