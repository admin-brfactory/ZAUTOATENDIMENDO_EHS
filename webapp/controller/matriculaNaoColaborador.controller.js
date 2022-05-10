sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img"
], function(BaseController, JSONModel, MessageBox, formatter) {
	"use strict";

	var TimeOut = "";

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaNaoColaborador", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img

			});

			this.initTimeOut();
			this.getView().setModel(oViewModel, "cpfModel");

		},

		initTimeOut: function() {
			var oRouter = this.getOwnerComponent().getRouter();

			TimeOut = setTimeout(function() {
				oRouter.navTo("inicial_view");
			}, 50000);
		},

		onPress: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("matriculaNaoColaborador");
		},

		onValidaPress: function(oEvent) {
			var oViewModel = this.getView().getModel("oViewModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var isEnabled = this.getView().byId("comb");
			var CriarArcelo = this.getView().byId("CriarArcel");
			var ArclCancela = this.getView().byId("ArclCancelar");
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";
			var a = false;

			if (valorCPF == "" || Nome == "") {
				MessageBox.error("Favor preencher todos os campos!");
				return;
			}

			sap.ui.core.BusyIndicator.show();
			oModel.read(sUrl, {

				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					console.log(oData);
				}.bind(this),

				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					console.log(oError);
				}.bind(this)

			});

			CriarArcelo.setEnabled(!a);
			isEnabled.setEnabled(!a);

		},

		onCriarAtendiPress: function(oEvent) {
			var oViewModel = this.getView().getModel("oViewModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var Data = new Date();
			var ComboBox = this.getView().byId("comb").getValue();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var ArclCancela = this.getView().byId("ArclCancelar");
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";

			var isEnabled = this.getView().byId("comb");
			var oRouter = this.getOwnerComponent().getRouter();

			if (valorCPF == "" || ComboBox == "" || Nome == "") {
				MessageBox.error("Favor preencher todos os campos!");
				return;
			}

			if (valorCPF != "" || ComboBox != "" || Nome != "") {
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
				if (Data) {

				}
				sap.ui.core.BusyIndicator.show();
				oModel.read(sUrl, {

					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log(oData);
					}.bind(this),

					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.log(oError);
					}.bind(this)
				});

			}

			this.getView().byId("nome").setValue("");
			this.getView().byId("CPF").setValue("");
			this.getView().byId("comb").setSelectedKey("");

			CriarArcelo.setEnabled(false);
			isEnabled.setEnabled(false);

		},

		limpaTimeOut: function() {
			clearTimeout(TimeOut);
			this.initTimeOut();
		},

		onCancelar: function(oEvent) {
			var oViewModel = this.getView().getModel("oViewModel");
			var oRouter = this.getOwnerComponent().getRouter();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var ArclCancela = this.getView().byId("ArclCancelar");
			var isEnabled = this.getView().byId("comb");

			this.getView().byId("nome").setValue("");
			this.getView().byId("CPF").setValue("");
			this.getView().byId("comb").setSelectedKey("");

			CriarArcelo.setEnabled(false);
			isEnabled.setEnabled(false);
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
			this.initTimeOut();
		},

		checaNome: function(sID, sLength) {
			var regExp = /[0-9]/g;
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?°¨¨ºª₢£¢¬§`~´çÇ]+/;
			var sValue = this.getView().byId(sID).getValue();

			if (sLength) {
				this.getView().byId(sID).setValue(sValue.substr(0, sLength));
			}

			if (regExp.test(sValue) || format.test(sValue)) {
				this.getView().byId(sID).setValue(sValue.substring(0, sValue.length - 1));
			}
			this.initTimeOut();
		},

		limpaCampos: function() {
			var oViewModel = this.getView().getModel("oViewModel");
			this.getView().byId("matric").setValue("");
			this.getView().byId("nome").setValue("");
			this.getView().byId("comb").setSelectedKey("");
			this.initTimeOut();
		},

		onExit: function() {
			clearTimeout(TimeOut);
			this.limpaCampos();
		}
	});
});