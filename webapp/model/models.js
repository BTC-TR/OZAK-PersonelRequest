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
          },
          sHelpPositionTreeData: {
            text: "Node1",
            ref: "sap-icon://attachment-audio",
            nodes: [
              {
                text: "Node1-1",
                ref: "sap-icon://attachment-e-pub",
                nodes: [
                  {
                    text: "Node1-1-1",
                    ref: "sap-icon://attachment-html",
                  },
                  {
                    text: "Node1-1-2",
                    ref: "sap-icon://attachment-photo",
                    nodes: [
                      {
                        text: "Node1-1-2-1",
                        ref: "sap-icon://attachment-text-file",
                        nodes: [
                          {
                            text: "Node1-1-2-1-1",
                            ref: "sap-icon://attachment-video",
                          },
                          {
                            text: "Node1-1-2-1-2",
                            ref: "sap-icon://attachment-zip-file",
                          },
                          {
                            text: "Node1-1-2-1-3",
                            ref: "sap-icon://course-program",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
        return oModel;
      },
    };
  }
);
