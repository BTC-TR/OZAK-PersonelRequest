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
          Btrlt: "",
          guid: "00505696-bacd-1edf-95ae-70788a6d72fd",
        });
      },
      createJsonModel: function () {
        let date = new Date(),
        today = new Date(),
          oneMonthFromNow = new Date(date.setMonth(date.getMonth() + 1));
        var oModel = new JSONModel({
          busy: true,
          today: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
          // today: "08/06/2024",
          todayJS: today,
          oneMonthLater: `${oneMonthFromNow.getDate()}/${oneMonthFromNow.getMonth() + 1}/${oneMonthFromNow.getFullYear()}`,
          oneMonthLaterJS: oneMonthFromNow,
          sendToApproveSPaths: [],
          formInputValues: this._formInputValues(),
          sHelpPositionTreeData: [],
        });
        return oModel;
      },
      _formInputValues: function () {
        return {
          formStartDate: "",
          formCreationTime: "",
          oldEmployee: "",
          requestedCompany: "",
          requestedDepartment: "",
          requestedDepartmentKey: "",
          requestedPosition: "",
          requestedPositionKey: "",
          requestedPositionFreeText: "",
          companyCode: "",
          companyName: "",
          locationInputEnabled: false,
          jobBtrtl: "",
          requestReason: "",
          requestedCompanyKey: "",
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
          requestedCandidateQuantity: undefined,
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
