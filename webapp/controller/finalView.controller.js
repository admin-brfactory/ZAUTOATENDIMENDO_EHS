sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.finalView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				mensagem: ""
			});
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("final_view").attachPatternMatched(this.getMensagem, this);
			this.limpaTimeOut();
			this.getView().setModel(oViewModel, "finalModel");
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
		},

		onPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			this.limpaTimeOut();
			oRouter.navTo("inicial_view");
		},
		
		getMensagem: function(){
			var oViewModel = this.getView().getModel("finalModel");
			oViewModel.setProperty("/mensagem",this.getOwnerComponent().getModel("GlobalModel").getProperty("/mensagemSucess"));
		}

	});
});