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
          guid: "00505696-9651-1edf-899d-9a45362f32ee",
        });
      },
      createJsonModel: function () {
        let date = new Date();
        var oModel = new JSONModel({
          busy: true,
          today: new Date(),
          sendToApproveSPaths: [],
          oneMonthLater: new Date(date.setMonth(date.getMonth() + 1)),
          formInputValues: this._formInputValues(),
          sHelpPositionTreeData: [],
        });
        return oModel;
      },
      _formInputValues: function () {
        return {
          formStartDate: "",
          requestedCompany: "",
          requestedDepartment: "",
          requestedDepartmentKey: "",
          requestedPosition: "",
          requestedPositionKey: "",
          requestedPositionFreeText: "",
          positionRequestType: false,
          persStatus01: false,
          persStatus02: false,
          customerFormVisibility: false,
          formYesVisibility: false,
          formNoVisibility: false,
          formNo01Visibility: false,
          formNo02Visibility: false,
          customerFormEnabled: false,
          formYes: false,
          formNo: false,
          requestedCandidateQuantity: Number,
          jobLocation: "",
          jobLocationKey: "",
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
        };
      },
    };
  }
);
