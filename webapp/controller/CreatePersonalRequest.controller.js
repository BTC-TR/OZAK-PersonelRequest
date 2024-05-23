sap.ui.define(
  ["./BaseController", "../model/formatter"],
  function (BaseController, formatter) {
    "use strict";

    return BaseController.extend(
      "ozak.com.zhrpersonalrequestform.controller.CreatePersonalRequest",
      {
        formatter: formatter,
        onInit: function () {
          var oRouter = this.getRouter();
          oRouter
            .getRoute("initialScreen")
            .attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {},
        _onSaveForm: function() {
          this._checkIfFormInputsValidated();
        },
        _checkIfFormInputsValidated: function() {

        },
        _saveForm: function () {
          const jsonModel = this.getModel("jsonModel"),
            oModel = this.getModel(),
            that = this;

          let formData = {
            Pernr: jsonModel.getProperty(),
            Tneden: jsonModel.getProperty(),
            Abukrs: jsonModel.getProperty(),
            Apernr: jsonModel.getProperty(),
            Tbukrs: jsonModel.getProperty(),
            Torgeh: jsonModel.getProperty(),
            Tplans: jsonModel.getProperty(),
            Tcsayi: jsonModel.getProperty(),
            Werks: jsonModel.getProperty(),
            Btrtl: jsonModel.getProperty(),
            Istnm: jsonModel.getProperty(),
            Tcrb1: jsonModel.getProperty(),
            Tcrb2: jsonModel.getProperty(),
            Tcrb3: jsonModel.getProperty(),
            Egtm4: jsonModel.getProperty(),
            Egtm5: jsonModel.getProperty(),
            Egtm6: jsonModel.getProperty(),
            Egtm7: jsonModel.getProperty(),
            Yas1: jsonModel.getProperty(),
            Yas2: jsonModel.getProperty(),
            Yas3: jsonModel.getProperty(),
            Yas4: jsonModel.getProperty(),
            Yas5: jsonModel.getProperty(),
            Diger: jsonModel.getProperty(),
            Statu: jsonModel.getProperty(),
          };
          let oData = formData,
            sPath = oModel.createKey("/PersonalCreateFormSet", oData);

          oModel.read(sPath, oData, {
            success: (oData, oResponse) => {
              that._showMessageBox("Kayıt Başarılı", 'S', true, 0)
            },
          });
        },
        onSHelpCustomersSetComboBoxChange: function(oEvent) {
          const oSource = oEvent.getSource(),
                oComboBox = this.getView().byId("idSHelpLocationsSetComboBox"),
                oSourceValue = oSource.getValue(),
                oItems = oComboBox.getItems();
          let isContains = false;
          oItems.forEach((item) => {
            if(item.getText() === oSourceValue) {
              isContains = true
            }
          })
          if (!isContains) {
            oComboBox.setValueState("Error")
            oComboBox.setValueStateText("Listede bulunan bir değer giriniz!")
          } else {
            oComboBox.setValueState("None")
          }
        }
      }
    );
  }
);
