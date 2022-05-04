sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.tipoColaboradorView", {
		
		onInit: function(){
		},
		
		onPress: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("tipoColaboradorView");
        },
        
        onColaboradorPress: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("matricula_view");
        }
	});
});