sap.ui.define([
    "arcelor/brZAUTOATENDIMENTO_EHS/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("app.galeao.cons_fat_aeroportuarias.controller.App", {

        onInit : function () {
                var oViewModel,
                    fnSetAppNotBusy,
                    iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

                oViewModel = new JSONModel({
                    busy : false,
                    delay : 0
                });
                this.getView().setModel(oViewModel, "appView");

                fnSetAppNotBusy = function() {
                    oViewModel.setProperty("/busy", false);
                    oViewModel.setProperty("/delay", iOriginalBusyDelay);
                };

                /*this.getOwnerComponent().getModel().metadataLoaded().
                    then(fnSetAppNotBusy);*/

                // apply content density mode to root view
                //this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            }
        });

});