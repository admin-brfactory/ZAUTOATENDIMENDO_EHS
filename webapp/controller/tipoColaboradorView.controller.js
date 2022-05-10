sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	var TimeOut = "";

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.tipoColaboradorView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img:img()[0].img
			});

			this.getView().setModel(oViewModel, "ColaboradorModel");
		},

		initTimeOut: function() {
			var oRouter = this.getOwnerComponent().getRouter();

			TimeOut = setTimeout(function() {
				oRouter.navTo("inicial_view");
			}, 50000);
		},

		onPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("tipoColaboradorView");
		},

		onColaboradorPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("matricula_view");
		},

		onNaoColaboradorPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("matricula_nao_colaborador");
		},

		limpaTimeOut: function() {
			clearTimeout(TimeOut);
			this.initTimeOut();
		},

		limpaCampos: function() {
			var oViewModel = this.getView().getModel("oViewModel");
			this.getView().byId("matric", "nome").setValue("");
			this.getView().byId("comb").setSelectedKey("");
			this.initTimeOut();
		},

		onExit: function() {
			clearTimeout(TimeOut);
			this.limpaCampos();
		}

	});
});