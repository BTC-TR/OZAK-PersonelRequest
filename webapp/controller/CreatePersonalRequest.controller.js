sap.ui.define(
  ["./BaseController", "../model/formatter", "../model/models"],
  function (BaseController, formatter, models) {
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
        _onSaveForm: function () {
          this._checkIfFormInputsValidated();
          this._checkIfFormCheckBoxesValidated();
        },
        _clearFormInputs: function () {
          let jsonModel = this.getView().getModel("jsonModel");

          jsonModel.setProperty("/formInputValues", {
            requestedCompany: "",
            requestedDepartment: "",
            requestedPosition: "",
            requestedCandidateQuantity: Number,
            jobLocation: "",
            jobDefinition: "",
            jobDefinitionAttachment: {
              items: [],
            },
            candidateExperienceLevel: {
              checkboxValues: [false, false, false],
            },
            candidateEducationalLevel: {
              checkboxValues: [false, false, false, false, false],
            },
            candidateAge: {
              checkboxValues: [false, false, false, false, false],
            },
            otherCandidateFeatures: "",
          });
          this._resetAllFormInputsValueState();
        },

        _resetAllFormInputsValueState: function () {
          let oView = this.getView();
          oView.byId("formInputValues1").setValueState("None");
          oView.byId("formInputValues2").setValueState("None");
          oView.byId("formInputValues3").setValueState("None");
          oView.byId("formInputValues4").setValueState("None");
          oView.byId("formInputValues5").setValueState("None");
          oView.byId("formInputValues6").setValueState("None");
          oView.byId("formInputValues7").setValueState("None");
          oView.byId("experienceCheckBox1").setValueState("None");
          oView.byId("experienceCheckBox2").setValueState("None");
          oView.byId("experienceCheckBox3").setValueState("None");
          oView.byId("educationCheckBox1").setValueState("None");
          oView.byId("educationCheckBox2").setValueState("None");
          oView.byId("educationCheckBox3").setValueState("None");
          oView.byId("educationCheckBox4").setValueState("None");
          oView.byId("educationCheckBox5").setValueState("None");
          oView.byId("ageCheckBox1").setValueState("None");
          oView.byId("ageCheckBox2").setValueState("None");
          oView.byId("ageCheckBox3").setValueState("None");
          oView.byId("ageCheckBox4").setValueState("None");
          oView.byId("ageCheckBox5").setValueState("None");
        },
        _checkIfFormInputsValidated: function () {
          let oView = this.getView();
          let aInputs = [
              oView.byId("formInputValues1"),
              oView.byId("formInputValues2"),
              oView.byId("formInputValues3"),
              oView.byId("formInputValues4"),
              oView.byId("formInputValues5"),
              oView.byId("formInputValues6"),
              oView.byId("formInputValues7"),
            ],
            bValidationError = false;
          aInputs.forEach(function (oInput) {
            bValidationError = this._validateInput(oInput) || bValidationError;
          }, this);

          return bValidationError;
        },
        _checkIfFormCheckBoxesValidated: function () {
          let jsonModel = this.getView().getModel("jsonModel"),
            oView = this.getView(),
            candidateExperienceLevelCheckBoxValues = jsonModel.getProperty(
              "/formInputValues/candidateExperienceLevel/checkboxValues"
            ),
            candidateEducationalLevelCheckBoxValues = jsonModel.getProperty(
              "/formInputValues/candidateEducationalLevel/checkboxValues"
            ),
            candidateAgeCheckBoxValues = jsonModel.getProperty(
              "/formInputValues/candidateAge/checkboxValues"
            );
          if (!candidateExperienceLevelCheckBoxValues.includes(true)) {
            oView.byId("experienceCheckBox1").setValueState("Error");
            oView.byId("experienceCheckBox2").setValueState("Error");
            oView.byId("experienceCheckBox3").setValueState("Error");
          }
          if (!candidateEducationalLevelCheckBoxValues.includes(true)) {
            oView.byId("educationCheckBox1").setValueState("Error");
            oView.byId("educationCheckBox2").setValueState("Error");
            oView.byId("educationCheckBox3").setValueState("Error");
            oView.byId("educationCheckBox4").setValueState("Error");
            oView.byId("educationCheckBox5").setValueState("Error");
          }
          if (!candidateAgeCheckBoxValues.includes(true)) {
            oView.byId("ageCheckBox1").setValueState("Error");
            oView.byId("ageCheckBox2").setValueState("Error");
            oView.byId("ageCheckBox3").setValueState("Error");
            oView.byId("ageCheckBox4").setValueState("Error");
            oView.byId("ageCheckBox5").setValueState("Error");
          }
        },
        _resetExperienceCheckBoxesValueStates: function () {
          let oView = this.getView();
          oView.byId("experienceCheckBox1").setValueState("None");
          oView.byId("experienceCheckBox2").setValueState("None");
          oView.byId("experienceCheckBox3").setValueState("None");
        },
        _resetEducationCheckBoxesValueStates: function () {
          let oView = this.getView();
          oView.byId("educationCheckBox1").setValueState("None");
          oView.byId("educationCheckBox2").setValueState("None");
          oView.byId("educationCheckBox3").setValueState("None");
          oView.byId("educationCheckBox4").setValueState("None");
          oView.byId("educationCheckBox5").setValueState("None");
        },
        _resetAgeCheckBoxesValueStates: function () {
          let oView = this.getView();
          oView.byId("ageCheckBox1").setValueState("None");
          oView.byId("ageCheckBox2").setValueState("None");
          oView.byId("ageCheckBox3").setValueState("None");
          oView.byId("ageCheckBox4").setValueState("None");
          oView.byId("ageCheckBox5").setValueState("None");
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
              that._showMessageBox("Kayıt Başarılı", "S", true, 0);
            },
          });
        },
        onSHelpCustomersSetComboBoxChange: function (oEvent) {
          const oSource = oEvent.getSource(),
            oComboBox = this.getView().byId("formInputValues5"),
            oSourceValue = oSource.getValue(),
            oItems = oComboBox.getItems();
          let isContains = false;
          oItems.forEach((item) => {
            if (item.getText() === oSourceValue) {
              isContains = true;
            }
          });
          if (!isContains) {
            oComboBox.setValueState("Error");
            oComboBox.setValueStateText("Listede bulunan bir değer giriniz!");
          } else {
            oComboBox.setValueState("None");
          }
        },
      }
    );
  }
);
