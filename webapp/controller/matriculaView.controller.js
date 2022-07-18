sap.ui.define([
	"arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"arcelor/brZAUTOATENDIMENTO_EHS/img",
	"sap/m/MessageToast"

], function(BaseController, JSONModel, MessageBox, Filter, FilterOperator, formatter, MessageToast) {
	"use strict";

	var TimeOut = 1;

	return BaseController.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.matriculaView", {

		onInit: function() {
			var oViewModel = new JSONModel({
				img: img()[0].img,
				PegaLista: [],
				Cpff: "",
				TipoAtendime: [],
				Atend: [],
				centroMedico: [],
				isEnabled: false
			});
			this.getView().setModel(oViewModel, "matriculaModel");
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
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var valorCpf = "";
			var SelectNome = this.getView().byId("nome").getSelectedKey();
			var isEnabled = this.getView().byId("comb");
			var CriarArcelo = this.getView().byId("CriarArcel");
			var habilitarCampos = false;

			if (valorMatricula == "" || SelectNome == "") {
				MessageBox.error("Favor preencher todos os campos!");
				return;
			}

			this.getTipoAtendi();
			this.limpaTimeOut();

			oViewModel.setProperty("/isEnabled", true);
			clearTimeout(TimeOut);
			isEnabled.setEnabled(!habilitarCampos);
			CriarArcelo.setEnabled(!habilitarCampos);

		},

		linhaSelecionada: function(oEvent) {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var valorCpf = "";
			var SelectNome = this.getView().byId("nome").getSelectedKey();

			this.getTipoAtendi();
			this.limpaTimeOut();
		},

		getTipoAtendi: function(sCPF, sCentroMedico) {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var cpf = this.getView().byId("nome").getSelectedKey();
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed");
			oViewModel.setProperty("/Cpff", cpf);

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
							oViewModel.setProperty("/TipoAtendime", resultadooData);
							oViewModel.setProperty("/Atend", resultadooData);
							this.getView().byId("comb").setSelectedKey("");
						} else {
							oViewModel.setProperty("/TipoAtendime", resultadooData);
							oViewModel.setProperty("/Atend", resultadooData);
							this.getView().byId("comb").setSelectedKey(oData.results[0].TIPOATEND);
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
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var tipodeAtendimento = this.getView().byId("comb").getSelectedKey();
			var oRouter = this.getOwnerComponent().getRouter();

			if (valorMatricula == "" || tipodeAtendimento == "") {
				MessageBox.error("Favor preencher todos os campos !");
				return;
			}

			if (valorMatricula != "" || tipodeAtendimento != "") {
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
			var oViewModel = this.getView().getModel("matriculaModel");
			var oGlobalModel = this.getOwnerComponent().getModel("GlobalModel");
			var oModel = this.getOwnerComponent().getModel();
			var valorMatricula = this.getView().byId("matric").getValue();
			var Nome = this.getView().byId("nome").getSelectedItem().getText();
			var tipodeAtendimento = this.getView().byId("comb").getSelectedKey();
			var oRouter = this.getOwnerComponent().getRouter();
			var dadosAtend = oViewModel.getProperty("/Atend");
			var AtendFilter = dadosAtend.filter(val => val.TIPOATEND == tipodeAtendimento);
			var Atend = AtendFilter[0].ATEND;
			var cpff = oViewModel.getProperty("/Cpff");
			var CentroMedico = this.getOwnerComponent().getModel("GlobalModel").getProperty("/CentroMed");

			sap.ui.core.BusyIndicator.show();
			oModel.callFunction(
				"/GerarSenha", {
					method: "GET",
					urlParameters: {
						ATEND: Atend,
						CENTROMEDICO: CentroMedico,
						CPF: cpff,
						NOME: Nome,
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

			this.limpaCampos();
		},

		onCancelar: function(oEvent) {
			var oViewModel = this.getView().getModel("matriculaModel");
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

			if (buscaNome == 8) {
				this.chamadaNome();
			}
		},

		chamadaNome: function() {
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var matricula = this.getView().byId("matric").getValue();
			var isEnabled = oViewModel.getProperty("/isEnabled");
			var aFilters = [
				new Filter("Pernr", FilterOperator.EQ, matricula)
			];

			sap.ui.core.BusyIndicator.show();
			oModel.read("/zgeehst097Set", {
				filters: aFilters,
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					var resultadoData = oData.results;
					oViewModel.setProperty("/PegaLista", resultadoData);
					if (isEnabled) {
						this.getTipoAtendi();
					}
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
			var oViewModel = this.getView().getModel("matriculaModel");
			var oModel = this.getOwnerComponent().getModel();
			var CriarArcelo = this.getView().byId("CriarArcel");
			var isEnabled = this.getView().byId("comb");
			var iSEnabled = this.getView().byId("nome");

			this.getView().byId("matric").setValue("");
			this.getView().byId("nome").setSelectedKey("");
			this.getView().byId("comb").setSelectedKey("");
			oViewModel.setProperty("/PegaLista", []);
			oViewModel.setProperty("/TipoAtendime", []);

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