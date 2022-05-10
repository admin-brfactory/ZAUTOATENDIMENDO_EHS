sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.tipoColaboradorView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img
			});

			this.getView().setModel(oViewModel, "ColaboradorModel");
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
			this.initTimeOut();
		},

		onColaboradorPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			
			clearTimeout(TimeOut);
			
			oRouter.navTo("matricula_view");
		},

		onNaoColaboradorPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			
			clearTimeout(TimeOut);
			
			oRouter.navTo("matricula_nao_colaborador");
		},

		onExit: function() {
			clearTimeout(TimeOut);
			this.limpaCampos();
		}

	});
});