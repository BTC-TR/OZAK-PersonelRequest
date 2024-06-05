sap.ui.define(
  [
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, formatter, JSONModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend(
      "ozak.com.zhrpersonalrequestform.controller.CreatePersonalRequest",
      {
        formatter: formatter,
        onInit: function () {
          var oRouter = this.getRouter();
          oRouter
            .getRoute("createPersonalRequest")
            .attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
          let jsonModel = this.getView().getModel("jsonModel");
          this._clearFormInputs();
          this._fetchSHelpPositionTreeData();
          this._fetchLocations();
          jsonModel.setProperty(
            "/guid",
            oEvent.getParameter("arguments").guid
              ? oEvent.getParameter("arguments").guid
              : "00000000-0000-0000-0000-000000000000"
          );
          this._getAttachment(oEvent);
        },
        _fetchSHelpPositionTreeData: function () {
          let oModel = this.getView().getModel(),
            jsonModel = this.getModel("jsonModel"),
            sPath = "/SHelp_OrgTreeHeaderSet",
            that = this;
          let oFilter = new Filter(
            [
              new Filter(
                "IPernr",
                FilterOperator.EQ,
                this.getModel("userModel").getProperty("/Pernr")
              ),
            ],
            false
          );
          oModel.read(sPath, {
            filters: [oFilter],
            urlParameters: {
              $expand:
                "OrgTreeHeaderToOrgItem,OrgTreeHeaderToPersonItem,OrgTreeHeaderToPositionItem",
            },
            success: (oData, oResponse) => {
              this._createTreeDataForOrgTree(oData);
            },
          });
        },
        onCustomerRadioButtonsChange: function (oEvent) {
          const selectedItemIndex = oEvent.getSource().getSelectedIndex();
          this.setCustomerCredentialsFormVisibility(
            selectedItemIndex === 1 ? false : true
          );
        },
        _onPersStatusClicked: function (oEvent, unselectCheckBox) {
          this._unselectCheckBox(oEvent, unselectCheckBox);
          if (unselectCheckBox === "persStatus02") {
          }
        },
        _unselectCheckBox: function (oEvent, unselectCheckBox) {
          let oSource = oEvent.getSource(),
            oSelected = oSource.getSelected();
          if (unselectCheckBox && oSelected) {
            this.getView().byId(unselectCheckBox).setSelected(false);
          }
        },
        setCustomerCredentialsFormVisibility: function (value) {
          const jsonModel = this.getModel("jsonModel");

          jsonModel.setProperty("/formInputValues/customerFormVisibility", value);
        },
        _createTreeDataForOrgTree: function (oData) {
          let jsonModel = this.getView().getModel("jsonModel"),
            result = oData.results[0],
            treeData = [];
          result.OrgTreeHeaderToOrgItem.results.forEach((item, index) => {
            treeData.push({
              text: item.OrgehT,
              key: item.Orgeh,
              ref: "sap-icon://overview-chart",
              nodes: [],
            });
          });
          result.OrgTreeHeaderToPositionItem.results.forEach(
            (item, positionIndex) => {
              let orgIndex = Number(item.IPernr);
              treeData[orgIndex - 1].nodes.push({
                text: item.PlansT,
                key: item.Plans,
                ref: "sap-icon://family-care",
                nodes: [],
              });
            }
          );
          result.OrgTreeHeaderToPersonItem.results.forEach((item, index) => {
            let positionIndex = Number(item.IPernr);
            treeData[0].nodes[positionIndex - 1].nodes.push({
              text: item.Ename,
              key: item.Pernr,
              ref: "sap-icon://employee",
              nodes: [],
            });
          });
          jsonModel.setProperty("/sHelpPositionTreeData", treeData);
        },
        _onSaveForm: function () {
          if (
            !this._checkIfFormInputsValidated() &&
            !this._checkIfFormCheckBoxesValidated() &&
            !this.sHelcustomerComboBoxIsValid
          ) {
            this._saveForm();
          } else {
            this._showMessageBox(
              "Gerekli Alanları Doldurunuz!",
              "E",
              true,
              2000
            );
          }
        },
        _clearFormInputs: function () {
          let jsonModel = this.getView().getModel("jsonModel");

          jsonModel.setProperty("/formInputValues", {
            requestedCompany: "",
            requestedDepartment: "",
            requestedPosition: "",
            requestedCandidateQuantity: Number,
            jobLocation: "",
            positionRequestType: false,
            persStatus01: false,
            persStatus02: true,
            customerFormVisibility: true,
            customerFormEnabled: false,
            formYes: true,
            formNo: false,
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
        _positionValueHelp: function () {
          if (!this.oMPDialog) {
            this.oMPDialog = this.loadFragment({
              name: "ozak.com.zhrpersonalrequestform.fragment.vHelpPosition",
            });
          }
          this.oMPDialog.then(
            function (oDialog) {
              this.oDialog = oDialog;
              this.oDialog.open();
              this.getView()
                .byId("idSHelpPositionTreeDataTree")
                .expandToLevel(3);
              this.oDialog;
            }.bind(this)
          );
        },
        _closeDialog: function () {
          this.oDialog.close();
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
              // oView.byId("formInputValues5"),
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
            bValidationError = false,
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
            bValidationError = true;
          }
          if (!candidateEducationalLevelCheckBoxValues.includes(true)) {
            oView.byId("educationCheckBox1").setValueState("Error");
            oView.byId("educationCheckBox2").setValueState("Error");
            oView.byId("educationCheckBox3").setValueState("Error");
            oView.byId("educationCheckBox4").setValueState("Error");
            oView.byId("educationCheckBox5").setValueState("Error");
            bValidationError = true;
          }
          if (!candidateAgeCheckBoxValues.includes(true)) {
            oView.byId("ageCheckBox1").setValueState("Error");
            oView.byId("ageCheckBox2").setValueState("Error");
            oView.byId("ageCheckBox3").setValueState("Error");
            oView.byId("ageCheckBox4").setValueState("Error");
            oView.byId("ageCheckBox5").setValueState("Error");
            bValidationError = true;
          }
          return bValidationError;
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
            oView = this.getView(),
            that = this;

          let formData = {
            Pernr: this.getModel("userModel").getProperty("/Pernr"),
            Tneden: "01",
            Abukrs: "",
            Apernr: "",
            Tbukrs: "",
            Torgeh: jsonModel.getProperty(
              "/formInputValues/requestedDepartmentKey"
            ),
            Tplans: jsonModel.getProperty(
              "/formInputValues/requestedPositionKey"
            ),
            Tcsayi: jsonModel.getProperty(
              "/formInputValues/requestedCandidateQuantity"
            ),
            Werks: jsonModel.getProperty("/formInputValues/jobWerks"),
            Btrtl: jsonModel.getProperty("/formInputValues/jobBtrtl"),
            Istnm: jsonModel.getProperty("/formInputValues/jobDefinition"),
            Tcrb1: oView.byId("experienceCheckBox1").getSelected() ? "X" : "",
            Tcrb2: oView.byId("experienceCheckBox2").getSelected() ? "X" : "",
            Tcrb3: oView.byId("experienceCheckBox3").getSelected() ? "X" : "",
            Egtm1: oView.byId("educationCheckBox1").getSelected() ? "X" : "",
            Egtm2: oView.byId("educationCheckBox2").getSelected() ? "X" : "",
            Egtm3: oView.byId("educationCheckBox3").getSelected() ? "X" : "",
            Egtm4: oView.byId("educationCheckBox4").getSelected() ? "X" : "",
            Egtm5: oView.byId("educationCheckBox5").getSelected() ? "X" : "",
            Egtm6: "",
            Egtm7: "",
            Yas1: oView.byId("ageCheckBox1").getSelected() ? "X" : "",
            Yas2: oView.byId("ageCheckBox2").getSelected() ? "X" : "",
            Yas3: oView.byId("ageCheckBox3").getSelected() ? "X" : "",
            Yas4: oView.byId("ageCheckBox4").getSelected() ? "X" : "",
            Yas5: oView.byId("ageCheckBox5").getSelected() ? "X" : "",
            Diger: jsonModel.getProperty(
              "/formInputValues/otherCandidateFeatures"
            ),
            Statu: "",
          };
          let oData = formData,
            sPath = oModel.createKey("/PersonalCreateFormSet", oData);

          oModel.read(sPath, {
            success: (oData, oResponse) => {
              if (oData.Type === "S") {
                that._showMessageBoxWithRoute(
                  "Kayıt Başarılı",
                  oData.Type,
                  "initialScreen"
                );
                that.onSendDocuments();
              } else {
                that._showMessageBox(oData.Message, oData.Type, true, 0);
              }
            },
          });
        },
        onUploadSetBeforeUploadStarts: function (oEvent) {
          var oHeaderItem = oEvent.getParameter("item"),
            slugVal = oHeaderItem.getFileName();
          oHeaderItem.removeAllStatuses();
          oHeaderItem.addHeaderField(
            new sap.ui.core.Item({
              key: "slug",
              text: slugVal,
            })
          );
          oHeaderItem.addHeaderField(
            new sap.ui.core.Item({
              key: "x-csrf-token",
              text: this.getOwnerComponent().getModel().getSecurityToken(),
            })
          );
        },
        _fetchLocations: function () {
          var that = this;
          return new Promise((resolve, reject) => {
            let oModel = this.getView().getModel(),
              jsonModel = this.getModel("jsonModel"),
              IPernr = this.getModel("userModel").getProperty("/Pernr"),
              that = this,
              sPath = "/SHelp_LocationsSet";
            oModel.read(sPath, {
              filters: [new Filter("IPernr", FilterOperator.EQ, IPernr)],
              success: (oData, oResponse) => {
                jsonModel.setProperty("/SHelp_LocationsSet", oData.results);
                resolve();
              },
            });
          });
        },
        _getCompanyCode: function () {
          let oModel = this.getView().getModel(),
            jsonModel = this.getModel("jsonModel"),
            IPernr = this.getModel("userModel").getProperty("/Pernr"),
            IPlans = this.getModel("jsonModel").getProperty(
              "/formInputValues/requestedPositionKey"
            ),
            that = this,
            oData = {
              IPernr: IPernr,
              IPlans: IPlans,
              IPdurum: jsonModel.getProperty("/formInputValues/persStatus01") ? "01" : "02",
            },
            sPath = oModel.createKey("/SHelp_CompanyCodesSet", oData);
          oModel.read(sPath, {
            success: (oData, oResponse) => {
              jsonModel.setProperty("/companyCode", oData.Bukrs);
              jsonModel.setProperty("/companyName", oData.Butxt);
              jsonModel.setProperty(
                "/formInputValues/requestedCompany",
                `${oData.Bukrs} ${oData.Butxt}`
              );
              jsonModel.setProperty("/oldEmployee", oData.Ename);
            },
          });
        },
        onSendDocuments: async function () {
          // var oDocumentUS = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUS");
          var oDocumentUS = this.getView().byId("idUploadCollection");
          var oViewModel = this.getModel("attachmentModel");
          var aDevaredDocuments = oViewModel.getProperty("/");
          var oData = {};

          if (oDocumentUS) {
            this.addDevaredDocuments();
          }

          oData.Documents = aDevaredDocuments.length ? aDevaredDocuments : [];

          await this.uploadDocument();

          // if (oUploadCollection) {
          // 	this.oDocument.destroy();
          // 	this.oDocument = null;
          // 	oViewModel.setProperty("/Documents", []);
          // }
        },
        addDevaredDocuments: function () {
          var oDocumentUS = this.byId("idUploadCollection");
          var oViewModel = this.getModel("attachmentModel");
          var aDevaredDocuments = oViewModel.getProperty("/");
          var aOriginDocuments = oDocumentUS
            .getBinding("items")
            .getCurrentContexts();
          var aNewDocuments = oDocumentUS.getItems();
          var sID = oViewModel.getProperty("/ID");
          var aOriginDocumentID = [];
          var aNewDocumentID = [];

          aOriginDocumentID = aOriginDocuments.map((oOriginDocument) => {
            return {
              DocumentID: oOriginDocument.getObject("DocumentID"),
            };
          });

          aNewDocumentID = aNewDocuments.map((oNewDocument) => {
            return {
              DocumentID: oViewModel.getProperty(
                oNewDocument.getBindingContext("model").getPath() +
                  "/DocumentID"
              ),
            };
          });

          aOriginDocumentID.forEach((oOriginDocumentID) => {
            if (
              aNewDocumentID.findIndex(
                (oNewDocumentID) =>
                  oNewDocumentID.DocumentID === oOriginDocumentID.DocumentID
              ) === -1
            ) {
              aDevaredDocuments.push({
                ID: sID,
                DocumentID: oOriginDocumentID.DocumentID,
              });
            }
          });

          oViewModel.setProperty("/DevaredDocuments", aDevaredDocuments);
        },
        uploadDocument: async function () {
          var oDocumentUS = this.byId("idUploadCollection");
          var iDocumentItemsCount = 0;
          var sServiceUrl = "";

          if (!oDocumentUS) {
            return;
          }

          iDocumentItemsCount = oDocumentUS.getIncompleteItems().length;
          sServiceUrl = this.getUploadUrl();

          oDocumentUS.getIncompleteItems().forEach((oItem) => {
            oItem.setUploadUrl(sServiceUrl);
          });

          if (iDocumentItemsCount > 0) {
            await oDocumentUS.upload();
          }
        },
        getUploadUrl: function () {
          var oModel = this.getModel();
          var sPath = oModel.createKey("/CreateAttachmentSet", {
            Guid: localStorage.getItem("Guid")
              ? localStorage.getItem("Guid")
              : this.getModel("userModel").getProperty("/guid"),
            IType: "1",
          });
          var sDocumentPath = "";

          sDocumentPath = oModel.sServiceUrl + sPath + "/ToAttachment";

          return sDocumentPath;
        },
        onUploadSetUploadCompleted: function (oEvent) {
          var oStatus = oEvent.getParameter("status"),
            oItem = oEvent.getParameter("item"),
            oUploadSet = this.getView().byId("idUploadCollection");
          if (oStatus && oStatus !== 201) {
            oItem.setUploadState("Error");
            oItem.removeAllStatuses();
          } else {
            oUploadSet.removeIncompleteItem(oItem);
            // this.setAttachmentModel();
          }
        },
        _getAttachment: function (oEvent) {
          let that = this;
          this.getView()
            .getModel()
            .read("/AttachmentListSet", {
              filters: [
                new Filter(
                  "IGuid",
                  FilterOperator.EQ,
                  localStorage.getItem("Guid")
                    ? localStorage.getItem("Guid")
                    : this.getModel("userModel").getProperty("/guid")
                ),
              ],
              success: function (oData) {
                that
                  .getView()
                  .setModel(new JSONModel(oData.results), "attachmentModel");
                that.getView().setBusy(false);
              },
              error: function (oResponse) {
                console.log(oResponse);
                that.getView().setBusy(false);
              },
            });
        },
        onSHelpPositionTreeDataTreeSelectionChange: function (oEvent) {
          let jsonModel = this.getView().getModel("jsonModel"),
            oTitle = oEvent.getSource().getSelectedItem().getProperty("title"),
            oHighlightText = oEvent
              .getSource()
              .getSelectedItem()
              .getProperty("highlightText"),
            oIcon = oEvent.getSource().getSelectedItem().getProperty("icon");
          if (oIcon === "sap-icon://family-care") {
            jsonModel.setProperty("/formInputValues/requestedPosition", oTitle);
            jsonModel.setProperty(
              "/formInputValues/requestedPositionKey",
              oHighlightText
            );
            let { found, ancestors } = this.findNodeAndAncestors(
              jsonModel.getProperty("/sHelpPositionTreeData"),
              oTitle
            );
            jsonModel.setProperty(
              "/formInputValues/requestedDepartment",
              ancestors[0].text
            );
            jsonModel.setProperty(
              "/formInputValues/requestedDepartmentKey",
              ancestors[0].key
            );
            this._closeDialog();
            this._getCompanyCode();
          }
        },
        findNodeAndAncestors: function (nodes, searchText, ancestors = []) {
          for (const node of nodes) {
            if (node.text === searchText) {
              return { found: node, ancestors };
            }
            if (node.nodes) {
              const result = this.findNodeAndAncestors(node.nodes, searchText, [
                ...ancestors,
                node,
              ]);
              if (result.found) {
                return result;
              }
            }
          }
          return { found: null, ancestors: [] };
        },
        onSHelpCustomersSetComboBoxChange: function (oEvent) {
          if (!this._checkSHelpCustomersSetComboBoxIsValıd(oEvent)) {
            let oSource = oEvent.getSource().getSelectedItem(),
              oText = oSource.getProperty("text"),
              oKey = oSource.getProperty("key"),
              oAdditionalText = oSource.getProperty("additionalText"),
              jsonModel = this.getView().getModel("jsonModel");
            jsonModel.setProperty("/formInputValues/jobLocation", oText);
            jsonModel.setProperty("/formInputValues/jobWerks", oAdditionalText);
            jsonModel.setProperty("/formInputValues/jobBtrtl", oKey);
          }
        },
        _checkSHelpCustomersSetComboBoxIsValıd: function (oEvent) {
          const oSource = oEvent.getSource(),
            oComboBox = this.getView().byId("formInputValues5"),
            oSourceValue = oSource.getValue(),
            oItems = oComboBox.getItems();
          let bValidationError = false;
          let isContains = false;
          oItems.forEach((item) => {
            if (item.getText() === oSourceValue) {
              isContains = true;
            }
          });
          if (!isContains) {
            oComboBox.setValueState("Error");
            oComboBox.setValueStateText("Listede bulunan bir değer giriniz!");
            bValidationError = true;
          } else {
            oComboBox.setValueState("None");
          }
          this.sHelcustomerComboBoxIsValid = bValidationError;
          return bValidationError;
        },
      }
    );
  }
);
