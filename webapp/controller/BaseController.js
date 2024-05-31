sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (Controller, UIComponent, mobileLibrary, MessageBox, MessageToast) {
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
          var sValueState = "None";
          var bValidationError = false;
          var oBinding = oInput.getBinding("value");
          var selectedKey = false;
          if (oBinding === undefined)
            oBinding = oInput.getBinding("selectedKey");

          try {
            try {
              selectedKey = oInput.getForceSelection() ? false : true;
            } catch (error) {
              selectedKey = false;
            }
            if (selectedKey) {
              oBinding.getType().validateValue(oInput.getSelectedKey());
            } else {
              oBinding.getType().validateValue(oInput.getValue());
            }
          } catch (oException) {
            // console.log(oException)
            // oInput.setValueStateText(oException.message)
            sValueState = "Error";
            bValidationError = true;
          }

          oInput.setValueState(sValueState);

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
            } else {
              MessageBox.success(message);
            }
          } else {
            if (ifTrueDelay > 0) {
              MessageToast.show(message, { duration: ifTrueDelay });
              return;
            }
            MessageBox.error(message);
          }
        },
        _showMessageBoxWithRoute: function (message, messageType, routeName) {
          let that = this;
          if (messageType === "S") {
            MessageBox.success(message, {
              onClose: function (sAction) {
                that.getRouter().navTo(routeName);
              },
            });
          } else {
            MessageBox.error(message, {
              onClose: function (sAction) {
                that.getRouter().navTo(routeName);
              },
            });
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
        _getUserInfo: function () {
          var that = this;

          return new Promise((resolve, reject) => {
            var sPath = that.getOwnerComponent()
              .getModel("loginModel")
              .createKey("PersonalSet", {
                IvLoginId: localStorage.getItem("Guid"),
              });
            that
              .getOwnerComponent()
              .getModel("loginModel")
              .read("/" + sPath, {
                success: function (oData) {
                  if (oData.EvPernr) {
                    let userModel = that
                      .getOwnerComponent()
                      .getModel("userModel");
                    userModel.setProperty("/Pernr", oData.EvPernr);
                    userModel.setProperty("/Ename", oData.EvEname);
                    userModel.setProperty("/Yonetici", oData.EvYonetici);
                    userModel.setProperty("/Werks", oData.Werks);
                    userModel.setProperty("/Stell", oData.Stell);
                    userModel.setProperty("/Bukrs", oData.Bukrs);
                    userModel.refresh(true);
                    resolve(); // Resolve the promise
                  } else {
                    MessageBox.error("Hata oluştu.", {
                      onClose: function () {
                        window.open("/sap/bc/ui5_ui5/sap/zhr_login", "_self");
                      },
                    });
                    reject(new Error("User information is incomplete")); // Reject the promise
                  }
                },
                error: function (oResponse) {
                  console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
      }
    );
  }
);
