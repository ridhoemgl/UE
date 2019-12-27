using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using UsedEquipmentSln.Models;

namespace UsedEquipmentSln.Models
{
    public class MenuCrossGPIDClass
    {
        public DtClass_UsedEquipmentDataContext db_used_equipment;
        List<vw_menucross_gpid> iList = new List<vw_menucross_gpid>();

        public List<vw_menucross_gpid> GetMenuCrossGPID(int id = 0, int gpId = 0)
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iListMenu = db_used_equipment.vw_menucross_gpids
                            .Where(f => f.gp_id == gpId && f.id_ == id)
                            .OrderBy(f => f.id_).OrderBy(f => f.urutan);

            foreach (var itemMenu in iListMenu)
            {
                if (id == 0)
                {
                    iList.Add(itemMenu);
                }

                if ((int)itemMenu.menu_link > 0)
                {
                    recursiveSubMenu((int)itemMenu.menu_link, gpId);
                }
            }
            db_used_equipment.Dispose();
            return iList;
        }

        private void recursiveSubMenu(int id = 0, int gpId = 0)
        {
            db_used_equipment = new DtClass_UsedEquipmentDataContext();
            var iListMenu = db_used_equipment.vw_menucross_gpids
                            .Where(f => f.gp_id == gpId && f.id_ == id)
                            .OrderBy(f => f.id_).OrderBy(f => f.urutan);

            foreach (var itemMenu in iListMenu)
            {
                itemMenu.menu = "    --    " + itemMenu.menu;
                iList.Add(itemMenu);
                if ((int)itemMenu.menu_link > 0)
                {
                    recursiveSubMenu((int)itemMenu.menu_link, gpId);
                }
            }
            db_used_equipment.Dispose();
        }
    }
}