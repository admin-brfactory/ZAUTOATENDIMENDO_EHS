sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, formatter, MessageToast) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaNaoColaborador", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img,
				tipoAtendi: [],
				Atend: [],
				centroMedico: []

			});

			this.getView().setModel(oViewModel, "cpfModel");
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
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var isEnabled = this.getView().byId("comb");
			var CriarArcelo = this.getView().byId("CriarArcel");
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
					this.getView().byId("nome").setValue(oData.Nome);
					console.log(oData);
				}.bind(this),

				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					console.log(oError);
				}.bind(this)

			});
			
			clearTimeout(TimeOut);
			CriarArcelo.setEnabled(!a);
			isEnabled.setEnabled(!a);

			this.getTipoAtendi();
			this.limpaTimeOut();
		},

		getTipoAtendi: function(sCPF, sCentroMedico) {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var cpf = this.getView().byId("CPF").getValue()

			sap.ui.core.BusyIndicator.show();
			oModel.callFunction(
				"/GetTpAtendByCPF", {
					method: "GET",
					urlParameters: {
						CPF: cpf,
						CENTROMEDICO: "50041620"
					},
					success: function(oData, response) {
						sap.ui.core.BusyIndicator.hide();
						var resultadooData = oData.results;
						oViewModel.setProperty("/tipoAtendi", resultadooData);
						oViewModel.setProperty("/Atend", resultadooData);
						console.log(oData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.log(oError);
					}
				});
		},

		onCriarAtendiPress: function(oEvent) {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var tipodeAtendimento = this.getView().byId("comb").getSelectedKey();
			var oRouter = this.getOwnerComponent().getRouter();

			if (valorCPF == "" || tipodeAtendimento == "" || Nome == "") {
				MessageBox.error("Favor preencher todos os campos!");
				return;
			}

			if (valorCPF != "" || tipodeAtendimento != "" || Nome != "") {
				MessageBox.confirm("Confirme Atendimento", {
					title: "Prezado",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(oAction) {
						if (oAction === "YES") {
							this.onCriarAtend();
						}
					}.bind(this),
				});
			}

			clearTimeout(TimeOut);
			this.limpaTimeOut();

		},

		onCriarAtend: function() {
			var oViewModel = this.getView().getModel("cpfModel");
			var oGlobalModel = this.getOwnerComponent().getModel("GlobalModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var tipodeAtendimento = this.getView().byId("comb").getSelectedKey();
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";
			var oRouter = this.getOwnerComponent().getRouter();
			var dadosAtend = oViewModel.getProperty("/Atend");
			var AtendFilter = dadosAtend.filter(val => val.TIPOATEND == tipodeAtendimento);
			var Atend = AtendFilter[0].ATEND;
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed", this.getView().byId('listCentro'));
	
			oModel.callFunction(
				"/GerarSenha", {
					method: "GET",
					urlParameters: {
						NOME: Nome,
						ATEND: Atend,
						CENTROMEDICO: CentroMedico,
						CPF: valorCPF,
						TIPOATEND: tipodeAtendimento
					},
					success: function(oData, response) {
						console.log(oData);
						this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('final_view');
						this.limpaCampos();
					}.bind(this),
					error: function(oError) {
						var erro = JSON.parse(oError.responseText);
						var erroMessage = erro.error.message.value;
						MessageToast.show(erroMessage, {
							duration: 7000
						});
					}
				});
		},

		onCancelar: function(oEvent) {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var oRouter = this.getOwnerComponent().getRouter();

			clearTimeout(TimeOut);
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
		},

		limpaCampos: function() {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var isEnabled = this.getView().byId("comb");

			this.getView().byId("CPF").setValue("");
			this.getView().byId("nome").setValue("");
			this.getView().byId("comb").setSelectedKey("");
			oViewModel.setProperty("/tipoAtendi", []);

			isEnabled.setEnabled(false);
			CriarArcelo.setEnabled(false);
		},

		onExit: function() {
			clearTimeout(TimeOut);
			this.limpaCampos();
		}
	});
});