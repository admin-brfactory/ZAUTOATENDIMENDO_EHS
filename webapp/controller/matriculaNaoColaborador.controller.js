sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"arcelor/brZAUTOATENDIMENTO_EHS/img",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, MessageBox, formatter, MessageToast, Filter, FilterOperator) {
	"use strict";

	var TimeOut = 0;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaNaoColaborador", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img,
				tipoAtendi: [],
				PegaLista: [],
				Atend: [],
				centroMedico: []

			});

			this.getView().setModel(oViewModel, "cpfModel");
			this.initTimeOut();
			this.limpaCampos();

		},

		initTimeOut: function() {
			var oRouter = this.getOwnerComponent().getRouter();

			TimeOut = setTimeout(function() {
				this.limpaCampos();
				oRouter.navTo("inicial_view");
			}.bind(this), 120000);
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
			var isEnabled = this.getView().byId("combo");
			var CriarArcelo = this.getView().byId("CriarArcel");
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";
			var habilitarCampos = false;

			if (valorCPF == "" || Nome == "") {
				MessageBox.error("Favor preencher todos os campos!");
				return;
			}

			sap.ui.core.BusyIndicator.show();
			oModel.read(sUrl, {

				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					this.getView().byId("nome").setValue(oData.Nome);
				}.bind(this),

				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)

			});
			this.getTipoAtendi();
			this.limpaTimeOut();

			clearTimeout(TimeOut);
			CriarArcelo.setEnabled(!habilitarCampos);
			isEnabled.setEnabled(!habilitarCampos);
		},

		getTipoAtendi: function(sCPF, sCentroMedico) {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var cpf = this.getView().byId("CPF").getValue()
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed");

			sap.ui.core.BusyIndicator.show();
			oModel.callFunction(
				"/GetTpAtendByCPF", {
					method: "GET",
					urlParameters: {
						CPF: cpf,
						CENTROMEDICO: CentroMedico
					},
					success: function(oData, response) {
						sap.ui.core.BusyIndicator.hide();
						var resultadooData = oData.results;
						if (oData.results.length > 1) {
							oViewModel.setProperty("/tipoAtendi", resultadooData);
							oViewModel.setProperty("/Atend", resultadooData);
							this.getView().byId("combo").setSelectedKey("");
						} else {
							oViewModel.setProperty("/tipoAtendi", resultadooData);
							oViewModel.setProperty("/Atend", resultadooData);
							this.getView().byId("combo").setSelectedKey(oData.results[0].TIPOATEND);
						}
					}.bind(this),
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						var erro = JSON.parse(oError.responseText);
						var erroMessage = erro.error.message.value;
						MessageToast.show(erroMessage, {
							duration: 7000
						});
					}
				});
		},

		onCriarAtendiPress: function(oEvent) {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var Nome = this.getView().byId("nome").getValue();
			var tipodeAtendimento = this.getView().byId("combo").getSelectedKey();
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
			var tipodeAtendimento = this.getView().byId("combo").getSelectedKey();
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";
			var oRouter = this.getOwnerComponent().getRouter();
			var dadosAtend = oViewModel.getProperty("/Atend");
			var AtendFilter = dadosAtend.filter(val => val.TIPOATEND == tipodeAtendimento);
			var Atend = AtendFilter[0].ATEND;
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed");

			sap.ui.core.BusyIndicator.show();
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
						sap.ui.core.BusyIndicator.hide();
						oGlobalModel.setProperty("/mensagemSucess", oData.Texto);
						this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('final_view');
						this.limpaCampos();
					}.bind(this),
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
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
			var buscaNome = sValue.length;

			if (sLength) {
				this.getView().byId(sID).setValue(sValue.substr(0, sLength));
			}

			if (regExp.test(sValue) || format.test(sValue)) {
				this.getView().byId(sID).setValue(sValue.substring(0, sValue.length - 1));
			}

			if (buscaNome == 11) {
				this.chamadaNome();
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

		chamadaNome: function() {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorCPF = this.getView().byId("CPF").getValue();
			var sUrl = "/zgeehst097Set(Cpf='" + valorCPF + "')";

			sap.ui.core.BusyIndicator.show();
			oModel.read(sUrl, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					var resultadooData = oData.Nome;
					this.getView().byId("nome").setValue(resultadooData);
					this.getTipoAtendi();
				}.bind(this),
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					var erro = JSON.parse(oError.responseText);
					var erroMessage = erro.error.message.value;
					MessageToast.show(erroMessage, {
						duration: 7000
					});
				}.bind(this)
			});
		},

		limpaCampos: function() {
			var oViewModel = this.getView().getModel("cpfModel");
			var oModel = this.getOwnerComponent().getModel();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var isEnabled = this.getView().byId("combo");

			this.getView().byId("CPF").setValue("");
			this.getView().byId("nome").setValue("");
			this.getView().byId("combo").setSelectedKey("");
			oViewModel.setProperty("/tipoAtendi", []);

			isEnabled.setEnabled(false);
			CriarArcelo.setEnabled(false);
		},

		onExit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("inicial_view");
			clearTimeout(TimeOut);
		}
	});
});