/**
 * 
 */
package org.openwis.metadataportal.services.user;

import java.util.ArrayList;
import java.util.List;

import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;

import org.fao.geonet.constants.Geonet;
import org.jdom.Element;
import org.openwis.metadataportal.kernel.user.UserManager;
import org.openwis.metadataportal.model.user.User;
import org.openwis.metadataportal.services.common.json.AcknowledgementDTO;
import org.openwis.metadataportal.services.common.json.JeevesJsonWrapper;
import org.openwis.metadataportal.services.user.dto.UsersDTO;

/**
 * Short Description goes here. <P>
 * Explanation goes here. <P>
 * 
 */
public class Import implements Service {

   /**
    * {@inheritDoc}
    * @see jeeves.interfaces.Service#init(java.lang.String, jeeves.server.ServiceConfig)
    */
   @Override
   public void init(String appPath, ServiceConfig params) throws Exception {

   }

   /**
    * {@inheritDoc}
    * @see jeeves.interfaces.Service#exec(org.jdom.Element, jeeves.server.context.ServiceContext)
    */
   @Override
   public Element exec(Element params, ServiceContext context) throws Exception {
      //Read from Ajax Request.
      Dbms dbms = (Dbms) context.getResourceManager().open(Geonet.Res.MAIN_DB);

      UsersDTO dto = JeevesJsonWrapper.read(params, UsersDTO.class);

      UserManager um = new UserManager(dbms);

      AcknowledgementDTO acknowledgementDTO = new AcknowledgementDTO(true);
      List<String> userNames = new ArrayList<String>();
      for (User user : dto.getUsers()) {
         userNames.add(user.getUsername());
      }
      um.importUser(userNames);

      //Send Acknowledgement
      return JeevesJsonWrapper.send(acknowledgementDTO);
   }

}
