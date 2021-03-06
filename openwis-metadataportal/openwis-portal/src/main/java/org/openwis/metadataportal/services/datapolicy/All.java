/**
 * 
 */
package org.openwis.metadataportal.services.datapolicy;

import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;

import org.fao.geonet.constants.Geonet;
import org.jdom.Element;
import org.openwis.metadataportal.kernel.datapolicy.DataPolicyManager;
import org.openwis.metadataportal.kernel.datapolicy.IDataPolicyManager;
import org.openwis.metadataportal.services.common.json.JeevesJsonWrapper;

/**
 * A Jeeves service to return all data policies in JSON format. <P>
 * The administrator may be able to consult all data policies. <P>
 * 
 */
public class All implements Service {

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

        Dbms dbms = (Dbms) context.getResourceManager().open(Geonet.Res.MAIN_DB);
        
        IDataPolicyManager dpm = new DataPolicyManager(dbms);

        return JeevesJsonWrapper.send(dpm.getAllDataPolicies(true, false));
    }

}
