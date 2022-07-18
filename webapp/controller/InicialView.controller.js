sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/ui/export/Spreadsheet"
], function(BaseController, JSONModel, MessageBox, Fragment, Filter, FilterOperator, MessageToast, Dialog, Spreadsheet) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.InicialView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				Valor: [],
				centros: []

			});
			
			this.getView().setModel(oViewModel, "InicialModel");
			this.oRouter = this.getOwnerComponent().getRouter();
			this._loadCentro();
		},

		limpaTimeOut: function() {
			clearTimeout(TimeOut);
		},

		onPress: function(oEvent) {
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed", this.getView().byId('listCentro'));
			var oRouter = this.getOwnerComponent().getRouter();
			
			if(CentroMedico == "") {
				MessageToast.show("Selecione um centro médico");
				return;
			}
			
			clearTimeout(TimeOut);
			this.limpaTimeOut();
			oRouter.navTo("tipo_colaborador_view");
		},

		_onAbreCentro: function() {
			var oView = this.getView();

			if (!this.pDialogCentro) {
				this.pDialogCentro = Fragment.load({
					id: oView.getId("centroMedico"),
					name: "arcelor.brZAUTOATENDIMENTO_EHS.view.fragments.ListaCentroMedico",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.pDialogCentro.then(function(oDialog) {
				oDialog.open();
			});
		},

		_onCloseDialog: function(Interval) {
			var oGlobalModel = this.getOwnerComponent().getModel("GlobalModel");
			var selectedCentro = this.getView().byId('listCentro').getSelectedItem();
			var centroMedico = "";
			
			if(selectedCentro == null){
				MessageToast.show("Selecione um centro médico");
				return;
			}
			
			centroMedico = selectedCentro.getProperty("title");
			
			if (this.pDialogCentro) {
				this.byId("centroMedico").close();
				this.getOwnerComponent().getModel("GlobalModel").setProperty("/CentroMed", centroMedico);
			}
		},

		_loadCentro: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("InicialModel");

			sap.ui.core.BusyIndicator.show();
			oModel.read("/zgeehst113Set?$filter", {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.results.length > 0) {
						oViewModel.setProperty("/centros", oData.results);
						this._onAbreCentro();
					}
				}.bind(this),
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					var error = JSON.parse(oError.responseText);
					var errorMessage = error.error.message.value;
					MessageToast.show(errorMessage);
				}
			});
		}

	});
});