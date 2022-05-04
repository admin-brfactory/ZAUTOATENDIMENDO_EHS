sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    function (Controller, UIComponent) {
        return Controller.extend("arcelor.brZAUTOATENDIMENTO_EHS.controller.BaseController", {

            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
            },

            getResourceBundle: function () {
                return this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle();
            },

        });
    });