sap.ui.define(
  [
    "./BaseController",
    "../model/formatter",
    "../model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/UploadCollectionParameter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (
    BaseController,
    formatter,
    models,
    JSONModel,
    Filter,
    FilterOperator,
    UploadCollectionParameter,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    return BaseController.extend(
      "ozak.com.zhrpersonalrequestform.controller.CreatePersonalRequest",
      {
        formatter: formatter,
        models: models,
        onInit: function () {
          var oRouter = this.getRouter();
          this.treeData = [];
          oRouter
            .getRoute("createPersonalRequest")
            .attachMatched(this._onRouteMatched, this);
          oRouter
            .getRoute("createPersonalRequest")
            .attachMatched(this._onBeforeRouteMatched, this);
          oRouter
            .getRoute("draftEdit")
            .attachMatched(this._onDraftMatched, this);
          oRouter
            .getRoute("draftEdit")
            .attachBeforeMatched(this._onBeforeRouteMatched, this);
          oRouter
            .getRoute("showDetail")
            .attachMatched(this._onDraftMatched, this);
          oRouter
            .getRoute("showDetail")
            .attachBeforeMatched(this._onBeforeRouteMatched, this);

          this.getView()
            .byId("initialPageCountingYearInput")
            .getBindingInfo("value")
            .parts[0].type.setConstraints({
              minimum: this.getOwnerComponent().getModel("jsonModel").getProperty("/today"),
              maximum: this.getOwnerComponent().getModel("jsonModel").getProperty("/oneMonthLater"),
            });
        },
        _onRouteMatched: function () {
          let jsonModel = this.getView().getModel("jsonModel");
          this._getUserInfo();
          this._fetchLocations();
        },
        _onBeforeRouteMatched: function () {
          this._clearFormInputs();
        },
        _onDraftMatched: function (oEvent) {
          this.draftGuid = oEvent
            .getParameter("arguments")
            .guid.replace(/-/g, "")
            .toUpperCase();
          this.draftGuidWithDash = oEvent.getParameter("arguments");
          this._onRouteMatched();
          this._setDraftedInputs();
          this._getAttachment();
        },
        _setDraftedInputs: function () {
          let jsonModel = this.getModel("jsonModel"),
            oView = this.getView(),
            draftData = jsonModel.getProperty("/draftData");

          draftData.Guid = draftData.Guid.replace(/-/g, "").toUpperCase();

          jsonModel.setProperty("/draftGuid", `${draftData.Guid}`);

          jsonModel.setProperty(
            "/formInputValues/requestedCompany",
            `${draftData.Tbukrs}`
          );
          jsonModel.setProperty(
            "/formInputValues/requestedDepartment",
            draftData.Pozisy
          );
          jsonModel.setProperty(
            "/formInputValues/requestedDepartmentKey",
            draftData.Torgeh
          );
          jsonModel.setProperty(
            "/formInputValues/requestedPosition",
            draftData.TplansT
          );
          jsonModel.setProperty(
            "/formInputValues/requestedPositionFreeText",
            draftData.TplansT
          );
          jsonModel.setProperty(
            "/formInputValues/requestedPositionKey",
            draftData.Tplans
          );
          jsonModel.setProperty(
            "/formInputValues/requestedCandidateQuantity",
            Number(draftData.Tcsayi)
          );
          jsonModel.setProperty("/formInputValues/jobWerks", draftData.Werks);
          jsonModel.setProperty("/formInputValues/jobBtrtl", draftData.Btrtl);

          if (draftData.Btrtl !== "") {
            jsonModel.setProperty(
              "/formInputValues/jobLocation",
              jsonModel.getProperty("/SHelp_LocationsSet").find((element) => {
                return element.Btrtl === draftData.Btrtl;
              }).Btext
            );
          }
          jsonModel.setProperty(
            "/formInputValues/jobLocationKey",
            draftData.Btrtl
          );
          jsonModel.setProperty(
            "/formInputValues/jobDefinition",
            draftData.Istnm
          );

          oView
            .byId("experienceCheckBox1")
            .setSelected(draftData.Tcrb1 === "X" ? true : false);
          oView
            .byId("experienceCheckBox2")
            .setSelected(draftData.Tcrb2 === "X" ? true : false);
          oView
            .byId("experienceCheckBox3")
            .setSelected(draftData.Tcrb3 === "X" ? true : false);

          oView
            .byId("educationCheckBox1")
            .setSelected(draftData.Egtm1 === "X" ? true : false);
          oView
            .byId("educationCheckBox2")
            .setSelected(draftData.Egtm2 === "X" ? true : false);
          oView
            .byId("educationCheckBox3")
            .setSelected(draftData.Egtm3 === "X" ? true : false);
          oView
            .byId("educationCheckBox4")
            .setSelected(draftData.Egtm4 === "X" ? true : false);
          oView
            .byId("educationCheckBox5")
            .setSelected(draftData.Egtm5 === "X" ? true : false);
          // oView.byId("educationCheckBox6").setSelected(draftData.Egtm1 === 'X' ? true : false);
          // oView.byId("educationCheckBox7").setSelected(draftData.Egtm1 === 'X' ? true : false);

          oView
            .byId("ageCheckBox1")
            .setSelected(draftData.Yas1 === "X" ? true : false);
          oView
            .byId("ageCheckBox2")
            .setSelected(draftData.Yas2 === "X" ? true : false);
          oView
            .byId("ageCheckBox3")
            .setSelected(draftData.Yas3 === "X" ? true : false);
          oView
            .byId("ageCheckBox4")
            .setSelected(draftData.Yas4 === "X" ? true : false);
          oView
            .byId("ageCheckBox5")
            .setSelected(draftData.Yas5 === "X" ? true : false);

          jsonModel.setProperty(
            "/formInputValues/persStatus01",
            draftData.PAltDu === "01" ? true : false
          );
          jsonModel.setProperty(
            "/formInputValues/persStatus02",
            draftData.PAltDu === "02" ? true : false
          );
          jsonModel.setProperty(
            "/formInputValues/requestedPosition",
            draftData.Pozisy
          );
          jsonModel.setProperty(
            "/formInputValues/otherCandidateFeatures",
            draftData.Diger
          );
          jsonModel.setProperty(
            "/formInputValues/formYes",
            draftData.Pdurum === "01" ? true : false
          );
          jsonModel.setProperty(
            "/formInputValues/formNo",
            draftData.Pdurum === "02" ? true : false
          );

          jsonModel.setProperty(
            "/formInputValues/customerFormVisibility",
            draftData.Pdurum === "01" ? true : false
          );
        },
        _fetchSHelpPositionTreeData: function () {
          let oModel = this.getView().getModel(),
            jsonModel = this.getModel("jsonModel"),
            oElement = this.getView().byId("idSHelpPositionTreeDataTree"),
            sPath = "/SHelp_OrgTreeHeaderSet",
            that = this;
          oElement.setBusy(true);
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
              oElement.setBusy(false);
            },
            error: (e) => {
              oElement.setBusy(false);
            },
          });
        },
        onCustomerRadioButtonsChange: function (oEvent) {
          const selectedItemIndex = oEvent.getSource().getSelectedIndex();
          this.setCustomerCredentialsFormVisibility(
            selectedItemIndex === 1 ? false : true
          );
          this.getModel("jsonModel").setProperty(
            "/formInputValues/selectedRequestType",
            "0" + String(selectedItemIndex + 1)
          );
          this._getCompanyCode();
          this.setYesNoVisibility(selectedItemIndex);
        },
        setYesNoVisibility: function (selectedItemIndex) {
          let jsonModel = this.getModel("jsonModel");

          jsonModel.setProperty(
            "/formInputValues/formYesVisibility",
            selectedItemIndex === 1 ? false : true
          );
          jsonModel.setProperty(
            "/formInputValues/formNoVisibility",
            selectedItemIndex === 1 ? true : false
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
          if (oSelected === false) {
            oSource.setSelected(true);
            return;
          }
          if (unselectCheckBox && oSelected) {
            this.getView().byId(unselectCheckBox).setSelected(false);
          }
        },
        setCustomerCredentialsFormVisibility: function (value) {
          const jsonModel = this.getModel("jsonModel");

          jsonModel.setProperty(
            "/formInputValues/customerFormVisibility",
            value
          );
        },
        _createTreeDataForOrgTree: function (oData) {
          let jsonModel = this.getView().getModel("jsonModel"),
            result = oData.results[0];
          this.treeConnectionList = result.OrgTreeHeaderToOrgItem.results;
          this.treeNodeInfo = result.OrgTreeHeaderToPersonItem.results;
          this._addNodes();
          // jsonModel.setProperty("/sHelpPositionTreeData", this.treeData);
        },
        _addNodes: function () {
          const map = [];
          const roots = [];

          // İlk olarak, her öğeyi bir haritada saklıyoruz
          this.treeConnectionList.forEach((item) => {
            map[item.Seqnr] = {
              Seqnr: item.Seqnr,
              Pup: item.Pup,
              Objid: item.Objid,
              Otype: item.Otype,
              nodes: [],
              added: false,
            };
          });

          // Şimdi her öğeyi uygun yere yerleştiriyoruz
          this.treeConnectionList.forEach((item) => {
            if (item.Pup !== 0) {
              // Eğer öğenin bir parent'ı varsa, onu parent'ın nodes arrayine ekliyoruz
              if (map[item.Pup]) {
                map[item.Pup].nodes.push(map[item.Seqnr]);
                map[item.Seqnr].added = true; // Bu öğe artık başka bir öğeye eklendi
              }
            } else {
              // Eğer öğenin bir parent'ı yoksa, bu bir root öğesidir
              roots.push(map[item.Seqnr]);
            }
          });
          this.treeNodeInfo.forEach((desc) => {
            for (let key in map) {
              if (map[key].Objid === desc.Objid) {
                map[key].text = desc.Stext;
                switch (desc.Otype) {
                  case "P":
                    map[key].ref = "sap-icon://employee";
                    break;
                  case "S":
                    map[key].ref = "sap-icon://family-care";
                    break;
                  case "O":
                    map[key].ref = "sap-icon://overview-chart";
                    break;
                  default:
                    map[key].ref = "";
                }
              }
            }
          });
          let filteredMap = map.filter((item) => {
            return !item.added;
          });
          this.getModel("jsonModel").setProperty(
            "/sHelpPositionTreeData",
            filteredMap
          );
        },
        _clearFormInputs: function () {
          let jsonModel = this.getView().getModel("jsonModel");

          jsonModel.setProperty("/formInputValues", models._formInputValues());
          this.getView().byId("idUploadCollection").destroyItems();
          this.treeData = [];
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
                .expandToLevel(10);
              this.oDialog;
              this._fetchSHelpPositionTreeData();
            }.bind(this)
          );
        },
        _locationValueHelp: function () {
          if (!this.oMPDialog) {
            this.oMPDialog = this.loadFragment({
              name: "ozak.com.zhrpersonalrequestform.fragment.vHelpLocation",
            });
          }
          this.oMPDialog.then(
            function (oDialog) {
              this.oDialog = oDialog;
              this.oDialog.open();
              this.oDialog;
            }.bind(this)
          );
        },
        _closeDialog: function () {
          this.oDialog.close();
          this.oDialog.destroy();
          this.oMPDialog = undefined;
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
          let oView = this.getView(),
            jsonModel = this.getModel("jsonModel"),
            aInputs = [],
            bValidationError = false,
            selectedRequestType = jsonModel.getProperty(
              "/formInputValues/selectedRequestType"
            );

          if (selectedRequestType === "01") {
            aInputs = [
              oView.byId("formInputValues1"),
              oView.byId("formInputValues2"),
              oView.byId("formInputValues3"),
              // oView.byId("formInputValues4"),
              oView.byId("formInputValues5"),
              oView.byId("initialPageCountingYearInput"),
              // oView.byId("formInputValues7"),
            ];
          }

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
        _onSaveForm: function () {
          let boxValidation = this._checkIfFormCheckBoxesValidated();
          let formValidation = this._checkIfFormInputsValidated();
          if (!boxValidation && !formValidation) {
            this._saveForm("01", false);
          } else {
            MessageToast.show("Gerekli Alanları Doldurunuz !");
          }
        },
        _onDraftSave: function () {
          this._saveForm("05", false);
        },
        _onDraftUpdate: function () {
          this._saveForm("05", true);
        },
        _saveForm: function (statu, isUpdate) {
          const jsonModel = this.getModel("jsonModel"),
            oModel = this.getModel(),
            oView = this.getView(),
            Ttarih = jsonModel
              .getProperty("/formInputValues/formStartDate")
              .split("/"),
            that = this;

          let formData = {
            Guid: isUpdate
              ? this.getModel("jsonModel").getProperty("/draftGuid")
              : "",
            Pernr: this.getModel("userModel").getProperty("/Pernr"),
            Tneden: "I",
            Abukrs: jsonModel.getProperty(
              "/formInputValues/requestedDepartmentKey"
            )
              ? jsonModel
                  .getProperty("/formInputValues/requestedDepartmentKey")
                  .split(" ")[0]
              : "",
            Apernr: "",
            Tbukrs: jsonModel.getProperty("/formInputValues/requestedCompany"),
            Torgeh: jsonModel.getProperty(
              "/formInputValues/requestedDepartmentKey"
            )
              ? jsonModel.getProperty("/formInputValues/requestedDepartmentKey")
              : "",
            Tplans: jsonModel.getProperty(
              "/formInputValues/requestedPositionKey"
            )
              ? jsonModel.getProperty("/formInputValues/requestedPositionKey")
              : "",
            Tcsayi:
              typeof jsonModel.getProperty(
                "/formInputValues/requestedCandidateQuantity"
              ) === typeof 1
                ? jsonModel.getProperty(
                    "/formInputValues/requestedCandidateQuantity"
                  )
                : "1",
            Werks: jsonModel.getProperty("/formInputValues/jobWerks")
              ? jsonModel.getProperty("/formInputValues/jobWerks")
              : "",
            Btrtl: jsonModel.getProperty("/formInputValues/jobBtrtl")
              ? jsonModel.getProperty("/formInputValues/jobBtrtl")
              : "",
            Istnm: jsonModel.getProperty("/formInputValues/jobDefinition")
              ? jsonModel.getProperty("/formInputValues/jobDefinition")
              : "",
            Ttarih: new Date(
              Number(Ttarih[2]),
              Number(Ttarih[1] - 1),
              Number(Ttarih[0])
            ),
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
            PAltDu:
              jsonModel.getProperty("/formInputValues/persStatus01") === true
                ? "01"
                : "02",
            Pozisy:
              jsonModel.getProperty("/formInputValues/persStatus01") === true
                ? jsonModel.getProperty(
                    "/formInputValues/requestedPositionFreeText"
                  )
                : jsonModel.getProperty("/formInputValues/requestedPosition"),
            Pdurum:
              jsonModel.getProperty("/formInputValues/formYes") === true
                ? "01"
                : "02",
            Diger: jsonModel.getProperty(
              "/formInputValues/otherCandidateFeatures"
            ),
            Statu: statu,
          };
          let oData = formData;
          // sPath = oModel.createKey("/PersonalCreateFormSet", oData);
          this.getView()
            .getModel()
            .callFunction("/CreateForm_Func_Imp", {
              method: "POST",
              urlParameters: oData,
              success: function (oData) {
                if (oData.CreateForm_Func_Imp.Type === "S") {
                  that._showMessageBoxWithRoute(
                    "Kayıt Başarılı",
                    oData.CreateForm_Func_Imp.Type,
                    "initialScreen"
                  );
                  // that.onSendDocuments();
                  that._uploadAttachment(oData.CreateForm_Func_Imp.Guid);
                } else {
                  that._showMessageBox(
                    oData.CreateForm_Func_Imp.Message,
                    oData.CreateForm_Func_Imp.Type,
                    true,
                    0
                  );
                }
              },
              error: function (oResponse) {
                console.log(oResponse);
                that.getView().setBusy(false);
              },
            });
        },

        onUCDocument: function (oEvent) {
          var oUploadCollection = this.getView().byId("idUCDocument");
          let oModel = this.getView().getModel(),
            sCSRF;
          sap.ui.getCore().getModel().refreshSecurityToken();
          sCSRF = this.getOwnerComponent().getModel().getSecurityToken();
          this._addParameter(oUploadCollection, "x-csrf-token", sCSRF);
        },

        _addParameter: function (oCollection, sName, sValue) {
          var oUploadParameter = new sap.m.UploadCollectionParameter({
            name: sName,
            value: sValue,
          });
          oCollection.addHeaderParameter(oUploadParameter);
        },

        onBUSDocument: function (oEvent) {
          var oUploadParameter = new sap.m.UploadCollectionParameter({
            name: "slug",
            value: encodeURIComponent(oEvent.getParameter("fileName")),
          });
          oEvent.getParameters().addHeaderParameter(oUploadParameter);
        },

        // uploadcollection

        onBeforeUploadStarts: function (oEvent) {
          String.prototype.toTurkishToEnglish = function () {
            return this.replace(/Ğ/gm, "G")
              .replace(/Ü/gm, "U")
              .replace(/Ş/gm, "S")
              .replace(/İ/gm, "I")
              .replace(/Ö/gm, "O")
              .replace(/Ç/gm, "C")
              .replace(/ğ/gm, "g")
              .replace(/ü/gm, "u")
              .replace(/ş/gm, "s")
              .replace(/ı/gm, "i")
              .replace(/ö/gm, "o")
              .replace(/ç/gm, "c");
          };

          oEvent.getParameters().addHeaderParameter(
            new UploadCollectionParameter({
              name: "slug",
              value: oEvent.getParameter("fileName").toTurkishToEnglish(),
            })
          );
        },
        onChangeUploadCollection: function (oEvent) {
          this.getView().setBusyIndicatorDelay(0);
          this.getView().setBusy(true);

          var oUploadCollection = oEvent.getSource(),
            that = this,
            sSecurityToken;

          if (oEvent.getParameter("mParameters").fromDragDrop) {
            window.setTimeout(function () {
              oUploadCollection.removeItem(0);
              MessageBox.error("Please do not use drag&drop.");
              that.getView().setBusy(false);
            }, 2000);
          } else {
            this.getView().getModel().refreshSecurityToken(null, null, false);
            sSecurityToken = this.getView().getModel().getSecurityToken();

            oUploadCollection.addHeaderParameter(
              new UploadCollectionParameter({
                name: "X-CSRF-Token",
                value: sSecurityToken,
              })
            );

            oUploadCollection.addHeaderParameter(
              new UploadCollectionParameter({
                name: "X-Requested-With",
                value: "X",
              })
            );

            this.getView().setBusy(false);
          }
        },
        onUploadComplete: function (oEvent) {
          var that = this,
            bIsCompleted = true;

          if (
            this.getView().byId("idUploadCollection").getItems().length === 0
          ) {
            bIsCompleted = true;
          } else {
            for (var i in this.getView()
              .byId("idUploadCollection")
              .getItems()) {
              if (
                !this.getView()
                  .byId("idUploadCollection")
                  .getItems()
                  [i].getBindingContext("attachmentModel")
              ) {
                bIsCompleted = false;
              }
            }
          }

          if (bIsCompleted) {
            MessageToast.show("İzin talebiniz oluşturulmuştur");

            window.setTimeout(function () {
              that.getView().setBusy(false);
              that.onPressBack();
            }, 1000);
          }
        },
        onDeletePressAttachment: function (oEvent) {
          var sFilename = oEvent
              .getSource()
              .getBindingContext("attachmentModel")
              .getProperty("FileName"),
            sPath = this.getView().getModel().createKey("DeleteAttachmentSet", {
              Guid: this.draftGuidWithDash.guid,
              FileName: sFilename,
              IType: "D",
            }),
            that = this;

          MessageBox.show(
            "'" +
              sFilename +
              "' adlı dosyayı silmek istediğinize emin misiniz?",
            {
              title: "Dosya Sil",
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              onClose: function (sAction) {
                that.getView().setBusyIndicatorDelay(0);
                that.getView().setBusy(true);

                if (sAction === "YES") {
                  that
                    .getView()
                    .getModel()
                    .read("/" + sPath, {
                      success: function (oData) {
                        if (oData.Type === "S") {
                          MessageToast.show(oData.Message);
                          that._getAttachment(that);
                        } else {
                          MessageBox.error(oData.Message);
                          that.getView().setBusy(false);
                        }
                      },
                      error: function (oResponse) {
                        console.log(oResponse);
                        that.getView().setBusy(false);
                      },
                    });
                } else {
                  that.getView().setBusy(false);
                }
              },
            }
          );
        },
        _uploadAttachment: function (sGuid) {
          var parts = [];

          parts.push(sGuid.slice(0, 8));
          parts.push(sGuid.slice(8, 12));
          parts.push(sGuid.slice(12, 16));
          parts.push(sGuid.slice(16, 20));
          parts.push(sGuid.slice(20, 32));
          sGuid = parts.join("-");

          var sPath = this.getView()
              .getModel()
              .createKey("CreateAttachmentSet", {
                Guid: sGuid,
                IType: "I",
              }),
            sURL =
              "/sap/opu/odata/sap/ZHR_PERSONAL_REQUEST_FORM_SRV/" +
              sPath +
              "/ToAttachment";

          for (
            var i = 0;
            i <
            this.getView().byId("idUploadCollection")
              ._aFileUploadersForPendingUpload.length;
            i++
          ) {
            this.getView()
              .byId("idUploadCollection")
              ._aFileUploadersForPendingUpload[i].setUploadUrl(sURL);
          }

          this.getView().byId("idUploadCollection").upload();
        },

        // uploadcollection
        // **********************

        onUploadSetBeforeUploadStarts: function (oEvent) {
          // this.getView().getModel().bUseBatch = false;
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
              IPdurum: jsonModel.getProperty(
                "/formInputValues/selectedRequestType"
              ),
            },
            sPath = oModel.createKey("/SHelp_CompanyCodesSet", oData);
          if (IPlans === "") {
            return;
          }
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
          oDocumentUS.setUploadUrl(sServiceUrl);
          if (iDocumentItemsCount > 0) {
            await oDocumentUS.upload();
          }
        },

        // _uploadDocument: function () {
        //   var oUploadCollection = this.getView().byId("idUCDocument");
        //   if (
        //     oUploadCollection &&
        //     oUploadCollection._aFileUploadersForPendingUpload.length > 0
        //   ) {
        //     this._updateUploadUrl();
        //     oUploadCollection.upload();
        //   }
        // },

        // _updateUploadUrl: function () {
        //   var sDocumentPath = "",
        //     sPath = this.getModel().createKey("/CreateAttachmentSet", {
        //       Guid: localStorage.getItem("Guid")
        //         ? localStorage.getItem("Guid")
        //         : this.getModel("userModel").getProperty("/guid"),
        //       IType: "I",
        //     });
        //   sDocumentPath = this.getModel().sServiceUrl + sPath + "/ToAttachment";
        //   this.getView()
        //     .byId("idUCDocument")
        //     ._aFileUploadersForPendingUpload.forEach(function (
        //       oPendingUploads
        //     ) {
        //       oPendingUploads.setUploadUrl(sDocumentPath);
        //     });
        // },

        getUploadUrl: function () {
          var oModel = this.getModel();
          let Guid = localStorage.getItem("Guid")
            ? localStorage.getItem("Guid").replace(/-/g, "").toUpperCase()
            : this.getModel("userModel")
                .getProperty("/guid")
                .replace(/-/g, "")
                .toUpperCase();
          var sPath = oModel.createKey("/CreateAttachmentSet", {
            Guid: Guid,
            IType: "I",
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
        _getAttachment: function () {
          let jsonModel = this.getModel("jsonModel");
          let uploadcollection = this.getView().byId("idUploadCollection");
          let that = this;
          uploadcollection.setBusy(true);
          this.getView()
            .getModel()
            .read("/AttachmentListSet", {
              filters: [
                new Filter(
                  "Guid",
                  FilterOperator.EQ,
                  this.draftGuidWithDash.guid
                ),
              ],
              success: function (oData) {
                that
                  .getView()
                  .setModel(new JSONModel(oData.results), "attachmentModel");
                uploadcollection.setBusy(false);
              },
              error: function (oResponse) {
                console.log(oResponse);
                that.getView().setBusy(false);
                uploadcollection.setBusy(false);
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
              ancestors[0].Objid
            );
            oEvent.getSource().getSelectedItem().setSelected(false);
            this._clearValidationValueState("formInputValues3");
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
        _positionTreeSearch: function (oEvent) {
          let oTree = this.getView().byId("idSHelpPositionTreeDataTree"),
            oBinding = oTree.getBinding("items"),
            oFilter = [],
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            oFilter = new Filter(
              [new Filter("text", FilterOperator.Contains, inputValue)],
              true
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
        _locationVHelpSearch: function (oEvent) {
          let oTree = this.getView().byId("idLocationVHelp"),
            oBinding = oTree.getBinding("items"),
            oFilter = [],
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            oFilter = new Filter(
              [new Filter("Btext", FilterOperator.Contains, inputValue)],
              true
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
        onSHelpCustomersSetVHelpChange: function (oEvent) {
          let oSource = oEvent.getSource().getSelectedItem(),
            oText = oSource.getProperty("title"),
            oKey = oSource.getProperty("info"),
            oAdditionalText = oSource.getProperty("description"),
            jsonModel = this.getView().getModel("jsonModel");
          jsonModel.setProperty("/formInputValues/jobLocation", oText);
          jsonModel.setProperty("/formInputValues/jobWerks", oAdditionalText);
          jsonModel.setProperty("/formInputValues/jobBtrtl", oKey);
          oEvent.getSource().getSelectedItem().setSelected(false);
          this._clearValidationValueState("formInputValues5");
          this._closeDialog();
        },
      }
    );
  }
);
