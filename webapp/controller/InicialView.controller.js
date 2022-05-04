sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.InicialView", {
		
		onInit: function(){
		},
		onPress: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("tipo_colaborador_view");
        }
	});
});