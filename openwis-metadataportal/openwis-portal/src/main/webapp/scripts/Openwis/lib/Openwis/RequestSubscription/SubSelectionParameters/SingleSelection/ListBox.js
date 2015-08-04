Ext.ns('Openwis.RequestSubscription.SubSelectionParameters.SingleSelection');

Openwis.RequestSubscription.SubSelectionParameters.SingleSelection.ListBox = Ext.extend(Ext.ux.form.MultiSelect, {
	
	initComponent: function() {
		Ext.apply(this, 
		{
			store: this.getSSPStore(),
			displayField: 'value',
			valueField: 'code',
			allowBlank: false,
//			width: 170,
			width: 300,
//			autoScroll: true,
			maxSelections: 1,
			style: {
			    overflow: 'visible'
			},
			listeners : {
				change: function() {
					this.fireEvent("valueChanged");
				},
				afterrender: function() {
				    var items = this.getItems();
				    this.getSSPStore().loadData(items);
				
				    var selectedItemCodes = [];
            		Ext.each(items, 
            		    function(item, index, allItems) {
            		        if(item.selected) {
            		            selectedItemCodes.push(item.code);
            		        }
            		    },
            		    this
            		);
            		this.setValue(selectedItemCodes.join());
				},
				scope: this
			}
		});
		Openwis.RequestSubscription.SubSelectionParameters.SingleSelection.ListBox.superclass.initComponent.apply(this, arguments);
		
	    this.addEvents("valueChanged");
	},
	
	//----------------------------------------------------------------- Initialization of the panels.
	
	getSSPStore: function() {
        if(!this.sspStore) {
            this.sspStore = new Ext.data.JsonStore ({
				idProperty: 'code',
				fields: [
					{
						name:'code'
					},{
						name:'value'
					}
				]
			});
        }
        return this.sspStore;
    },
    
    getItems: function() {
	    //Build the list of values (filter if previous specified, false otherwise).
	    var matcher = new Openwis.RequestSubscription.SubSelectionParameters.Helper.Matcher();    
    
        var matchingValues = [];
        if(this.config.previous) {
            Ext.each(this.config.parameter.values, 
                function(item, index, allItems) {
                    if(matcher.matches(item.availableFor, this.config.previous.type, this.config.previous.selection)) {
                        matchingValues.push(item);
                    }
                },
                this
            );
        } else {
            matchingValues = this.config.parameter.values;
        }
	    
	    //Re-initiates to the old selection if available.
	     var overridenSelection = {};
	     if(this.config.editValue || this.config.currentElementSelection) {
	         var elementsToKeepSelected = [];
    	     if(this.config.editValue) {
    	         elementsToKeepSelected.push(this.config.editValue);
    	     } else if(this.config.currentElementSelection) {
                Ext.each(matchingValues, 
                    function(item, index, allItems) {
                        if(this.config.currentElementSelection.indexOf(item.code) != -1) {
                            elementsToKeepSelected.push(item.code);
                        }
                    },
                    this
                );
             }
        	    
            //Set as selected/unselected if elements were selected, stay by default otherwise.
            if(!Ext.isEmpty(elementsToKeepSelected)) {
                Ext.each(matchingValues, 
                    function(item, index, allItems) {
                        overridenSelection[item.code] = (elementsToKeepSelected.indexOf(item.code) != -1);
                    },
                    this
                );
            }
    	}
	    
	    //Build the radio components.
	    var items = [];
	    Ext.each(matchingValues, 
	        function(item, index, allItems) {
	            var selected = overridenSelection[item.code] != null ? overridenSelection[item.code] : item.selected;
	            items.push({
	                code: item.code,
	                value: item.value,
	                selected: selected
	            });    
	        },
	        this
	    );
	    return items;
	},
	
	//----------------------------------------------------------------- Generic methods used by the wizard.

	buildValue: function() {
	    return this.getRawValue();
	}
});