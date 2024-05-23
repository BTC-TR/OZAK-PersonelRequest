sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/library"],
  function (Controller, UIComponent, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend(
      "ozak.com.zhrpersonalrequestform.controller.BaseController",
      {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        navBack: function () {
          this.getRouter().navBack();
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        navigateToCreatePersonalRequest: function () {
          let router = this.getRouter();
          router.navTo("createPersonalRequest");
        },
        navigateToInitialScreen: function () {
          let router = this.getRouter();
          router.navTo("initialScreen");
        },
        onPressHome: function () {
          window.open(
            "/sap/bc/ui5_ui5/sap/zhr_login/index.html#/home",
            "_self"
          );
        },
        onPressUser: function (oEvent) {
          if (!this._oUserMenu) {
            this._oUserMenu = sap.ui.xmlfragment(
              "ozak.com.zhrpersonalrequestform.fragment.UserMenu",
              this
            );
            this.getView().addDependent(this._oUserMenu);
            this._oUserMenu.openBy(oEvent.getSource());
          } else {
            if (this._oUserMenu.isOpen()) {
              this._oUserMenu.close();
            } else {
              this._oUserMenu.openBy(oEvent.getSource());
            }
          }
        },
        onPressSignOut: function () {
          this.getView()
            .getModel("loginModel")
            .callFunction("/DeleteSession", {
              method: "POST",
              urlParameters: {
                LoginId: localStorage.getItem("Guid"),
              },
              success: function (oData) {
                if (oData.Type === "E") {
                  MessageBox.error(oData.Message);
                } else {
                  window.open("/sap/bc/ui5_ui5/sap/zhr_login", "_self");
                  localStorage.removeItem("Guid");
                }
              },
              error: function (oResponse) {
                console.log(oResponse);
              },
            });
        },
        _onlyNumberInput: function (oEvent) {
          var _oInput = oEvent.getSource();
          var val = _oInput.getValue();
          val = val.replace(/[^\d]/g, "");
          _oInput.setValue(val);
        },
        _validateInput: function (oInput) {
          let oView = this.getView();
          let aInputs = [
              oView.byId("formInputValues1"),
              oView.byId("formInputValues2"),
            ],
            bValidationError = false;
          aInputs.forEach(function (oInput) {
            bValidationError = this._validateInput(oInput) || bValidationError;
          }, this);

          return bValidationError;
        },
        _showMessageBox: function (
          message,
          messageType,
          ifSShow,
          ifTrueDelay = 0
        ) {
          if (!ifSShow) return;
          let that = this;
          if (messageType === "S") {
            if (ifTrueDelay > 0) {
              MessageToast.show(message, { duration: ifTrueDelay });
            }
          } else {
            if (ifTrueDelay > 0) {
              MessageToast.show(message, { duration: ifTrueDelay });
              return;
            }
            MessageBox.error(message);
          }
        },
      }
    );
  }
);
