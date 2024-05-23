sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  /**
   * provide app-view type models (as in the first "V" in MVVC)
   *
   * @param {typeof sap.ui.model.json.JSONModel} JSONModel
   * @param {typeof sap.ui.Device} Device
   *
   * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
   */
  function (JSONModel, Device) {
    "use strict";

    return {
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },
      createUserModel: function () {
        return new JSONModel({
          Ename: "",
          Yonetici: "",
          Werks: "",
        });
      },
      createJsonModel: function () {
        var oModel = new JSONModel({
          busy: true,
          today: new Date(),
          formInputValues: {
            requestedCompany: "",
            requestedDepartmen: "",
            requestedPosition: "",
            requestedCandidateQuantity: Number,
            jobLocation: "",
            jobDefinition: "",
            jobDefinitionAttachment: {
              items: []
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
          },
        });
        return oModel;
      },
    };
  }
);
