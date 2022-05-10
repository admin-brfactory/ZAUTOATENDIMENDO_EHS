sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.InicialView", {

		onInit: function() {
			var oViewModel = new JSONModel({

			});
			
			this.getView().setModel(oViewModel, "InicialModel");
			this.initTimeOut();
		},
		initTimeOut: function() {
			var oRouter = this.getOwnerComponent().getRouter();

			TimeOut = setTimeout(function() {
				oRouter.navTo("inicial_view");
			}, 60000);
		},

		limpaTimeOut: function() {
			clearTimeout(TimeOut);
			TimeOut = 0;
			this.initTimeOut();
		},
		
		onPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			this.limpaTimeOut();
			oRouter.navTo("tipo_colaborador_view");
		},

		onPress1: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			this.limpaTimeOut();
			oRouter.navTo("InicialView");
		}
	});
});