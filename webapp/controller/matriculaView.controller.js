sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img"
], function(BaseController, JSONModel, MessageBox, Filter, FilterOperator, formatter) {
	"use strict";

	var TimeOut = 1;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img

			});

			this.getView().setModel(oViewModel, "matriculaModel");
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

		onValidaPress: function(oEvent) {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var isEnabled = this.getView().byId("comb");
			var CriarArcelo = this.getView().byId("CriarArcel");
			var sUrl = "/Pernr(Usuario= '" + valorMatricula + "')";
			var a = false;

			this.limpaTimeOut();

			if (valorMatricula == "") {
				MessageBox.error("Favor preencher uma Matricula!");
				return;
			}

			sap.ui.core.BusyIndicator.show();
			oModel.read("/Pernr", {
				// filters: aFilters,
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					console.log(oData);
				}.bind(this),

				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					console.log(oError);
				}.bind(this)
			});

			isEnabled.setEnabled(!a);
			CriarArcelo.setEnabled(!a);

		},

		onCriarAtendiPress: function(oEvent) {
			var oViewModel = this.getView().getModel("oViewModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var ComboBox = this.getView().byId("comb").getValue();
			var oRouter = this.getOwnerComponent().getRouter();

			if (valorMatricula == "" || ComboBox == "") {
				MessageBox.error("Favor preencher todos os campos !");
				return;
			}

			if (valorMatricula != "" || ComboBox != "") {
				MessageBox.confirm("Confirme Atendimento", {
					title: "Prezado",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(oAction) {
						if (oAction === "YES") {
							var that = this;
							that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo('final_view');
						}
					}
				});
			}

			this.getView().byId("matric").setValue("");
			this.getView().byId("nome").setValue("");
			this.getView().byId("comb").setSelectedKey("");
			this.limpaCampos();
			this.limpaTimeOut();

		},

		onCancelar: function(oEvent) {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var oRouter = this.getOwnerComponent().getRouter();

			clearTimeout(TimeOut);
			this.getView().byId("nome").setValue("");
			this.getView().byId("matric").setValue("");
			this.getView().byId("comb").setSelectedKey("");
			this.limpaCampos();

			oRouter.navTo("inicial_view");
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
		},

		limpaCampos: function() {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var isEnabled = this.getView().byId("comb");

			this.getView().byId("matric").setValue("");
			this.getView().byId("nome").setValue("");
			this.getView().byId("comb").setSelectedKey("");

			isEnabled.setEnabled(false);
			CriarArcelo.setEnabled(false);
		},

		onExit: function() {
			clearTimeout(TimeOut);
			this.limpaCampos();
		}
	});
});