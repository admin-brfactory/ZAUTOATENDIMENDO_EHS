sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaView", {

		onInit: function() {
			var oViewModel = new JSONModel({

			});
		},
		
		onPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("matriculaView");
		},
		
		onValidaPress: function(oEvent) {
			var oViewModel = this.getView().getModel("oViewModel");
			var valorMatricula = this.getView().byId("matric").getValue();
			var IsVisible = this.getView().byId("isVisible");
			var isEnabled = this.getView().byId("isEnabled");
			var a = false;
			
			if (valorMatricula == "") {
				MessageBox.error("Favor preencher uma Matricula!");
				return;
			}
			IsVisible.setVisible(!a);
			isEnabled.setEnabled(!a);
			
		},
		
		ValidaSelec: function() {
			var oViewModel = this.getView().getModel("oViewModel");

		},
		
		checaNumerico: function(sID, sLength) {
			var regExp = /[a-zA-Z]/g;
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?°¨¨ºª₢£¢¬§`~´çÇ]+/;
			var sValue = this.getView().byId(sID).getValue();

			if (sLength) {
				this.getView().byId(sID).setValue(sValue.substr(0, sLength));
			}

			if (regExp.test(sValue) || format.test(sValue)) {
				this.getView().byId(sID).setValue(sValue.substring(0, sValue.length - 1));
			}
		}
	});
});