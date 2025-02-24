sap.ui.define(
  [
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
  ],
  function (
    BaseController,
    formatter,
    Filter,
    Sorter,
    FilterOperator,
    Fragment
  ) {
    "use strict";

    return BaseController.extend(
      "ozak.com.zhrpersonalrequestform.controller.InitialScreen",
      {
        formatter: formatter,
        onInit: function () {
          var oRouter = this.getRouter();
          oRouter
            .getRoute("initialScreen")
            .attachMatched(this._onRouteMatched, this);
          var oTable = this.byId("idPersonalFormListSetTable");
          this._oTable = oTable;

        },
        _onRouteMatched: function (oEvent) {
          this._getUserInfo().then(() => {
            this._fetchAllFormListData().then(() => {
              this.setTableDataCount();
            });
          });
          // this.getView()
          //   .byId("idPersonalFormListSetTable")
          //   .getModel()
          //   .refresh(true);
        },
        setTableDataCount: function () {
          let oView = this.getView(),
            jsonModel = this.getModel("jsonModel");
          this._oTableWaiting = oView.byId("idPersonalFormListSetTableWaiting");
          this._oTableApproved = oView.byId(
            "idPersonalFormListSetTableApproved"
          );
          this._oTableDeclined = oView.byId(
            "idPersonalFormListSetTableDeclined"
          );
          this._oTableTransfered = oView.byId(
            "idPersonalFormListSetTableTransfered"
          );

          jsonModel.setProperty(
            "/waitingDataCount",
            this._oTableWaiting.getBinding("items").getLength()
          );
          jsonModel.setProperty(
            "/approvedDataCount",
            this._oTableApproved.getBinding("items").getLength()
          );
          jsonModel.setProperty(
            "/declinedDataCount",
            this._oTableDeclined.getBinding("items").getLength()
          );
          jsonModel.setProperty(
            "/transferedDataCount",
            this._oTableTransfered.getBinding("items").getLength()
          );
        },
        _fetchAllFormListData: function () {
          var that = this;
          return new Promise((resolve, reject) => {
            let oModel = this.getView().getModel(),
              jsonModel = this.getModel("jsonModel"),
              oTable = this.getView().byId("idPersonalFormListSetTable"),
              IPernr = this.getModel("userModel").getProperty("/Pernr"),
              that = this,
              sPath = "/PersonalFormListSet";
            oTable.setBusy(true);
            oModel.read(sPath, {
              filters: [new Filter("IPernr", FilterOperator.EQ, IPernr)],
              success: (oData, oResponse) => {
                jsonModel.setProperty("/PersonalFormListSet", oData.results);
                oTable.setBusy(false);
                resolve();
              },
            });
          });
        },

        onIconTabBarSelect: function (oEvent) {
          let oSource = oEvent.getSource(),
            selectedKey = oSource.getSelectedKey(),
            that = this;

          switch (selectedKey) {
            case "All":
              that._oTable = this.byId("idPersonalFormListSetTable");
              this.oSF = this.getView().getControlsByFieldGroupId("searchField").filter(c => c.isA("sap.m.SearchField"))[0]
              break;
            case "bekleyen":
              that._oTable = this.byId("idPersonalFormListSetTableWaiting");
              this.oSF = this.getView().getControlsByFieldGroupId("searchField").filter(c => c.isA("sap.m.SearchField"))[1]
              break;
            case "onay":
              that._oTable = this.byId("idPersonalFormListSetTableApproved");
              this.oSF = this.getView().getControlsByFieldGroupId("searchField").filter(c => c.isA("sap.m.SearchField"))[2]
              break;
            case "red":
              that._oTable = this.byId("idPersonalFormListSetTableDeclined");
              this.oSF = this.getView().getControlsByFieldGroupId("searchField").filter(c => c.isA("sap.m.SearchField"))[3]
              break;
            case "system":
              that._oTable = this.byId("idPersonalFormListSetTableTransfered");
              this.oSF = this.getView().getControlsByFieldGroupId("searchField").filter(c => c.isA("sap.m.SearchField"))[4]
              break;
          }
        },
        onPressCancel: function () {
          this.oNoteDialog.close();
          this.oNoteDialog.destroy();
          this.oNoteDialog = undefined;
        },
        onPressShowDenyText: function () {
          this._openNoteDialog();
        },
        _openNoteDialog: function () {
          if (!this.oNoteDialog) {
            this.oNoteDialog = sap.ui.xmlfragment("ozak.com.zhrpersonalrequestform.fragment.ApproverNote", this);
          }
          this.getView().addDependent(this.oNoteDialog, this);
          this.oNoteDialog.open();
        },
        _onSearchcidMyPYPListTableAll: function (oEvent, tableName, statu) {
          let table = this.getView().byId(tableName),
            oBinding = table.getBinding("items"),
            oFilter = new Filter(
              [new Filter("Statu", FilterOperator.Contains, statu)],
              true
            ),
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            let guid = inputValue.replace(/-/g, "").toUpperCase()
            oFilter = new Filter(
              [
                new Filter("Guid", FilterOperator.Contains, inputValue),
                // new Filter("Tplanstext", FilterOperator.Contains, inputValue),
                // new Filter("Pozisy", FilterOperator.Contains, inputValue),
                // new Filter("Btext", FilterOperator.Contains, inputValue),
                new Filter("Statu", FilterOperator.Contains, statu),
              ],
              true
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
        onSuggest: function (event) {
          var sValue = event.getParameter("suggestValue"),
            aFilters = [];
          if (sValue) {
            aFilters = [
              new Filter(
                [
                  new Filter("Guid", function (sText) {
                    return (
                      (String(sText) || "")
                        .toUpperCase()
                        .indexOf(sValue.toUpperCase()) > -1
                    );
                  }),
                  new Filter("Tplanstext", function (sDes) {
                    return (
                      (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) >
                      -1
                    );
                  }),
                  new Filter("Pozisy", function (sDes) {
                    return (
                      (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) >
                      -1
                    );
                  }),
                ],
                false
              ),
            ];
          }

          this.oSF.getBinding("suggestionItems").filter(aFilters);
          this.oSF.suggest();
        },
        onOpenViewSettings: function (oEvent) {
          var sDialogTab = "filter";
          if (oEvent.getSource() instanceof sap.m.Button) {
            var sButtonId = oEvent.getSource().getId();
            if (sButtonId.match("sort")) {
              sDialogTab = "sort";
            } else if (sButtonId.match("group")) {
              sDialogTab = "group";
            }
          }
          // load asynchronous XML fragment
          if (!this.byId("viewSettingsDialog")) {
            Fragment.load({
              id: this.getView().getId(),
              name: "ozak.com.zhrpersonalrequestform.fragment.ViewSettingsDialog",
              controller: this,
            }).then(
              function (oDialog) {
                // connect dialog to the root view of this component (models, lifecycle)
                this.getView().addDependent(oDialog);
                oDialog.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                oDialog.open(sDialogTab);
              }.bind(this)
            );
          } else {
            this.byId("viewSettingsDialog").open(sDialogTab);
          }
        },
        onConfirmViewSettingsDialog: function (oEvent) {
          this._applySortGroup(oEvent);
        },
        _applySortGroup: function (oEvent) {
          var mParams = oEvent.getParameters(),
            sPath,
            bDescending,
            aSorters = [];

          sPath = mParams.sortItem.getKey();
          bDescending = mParams.sortDescending;
          aSorters.push(new Sorter(sPath, bDescending));
          this._oTable.getBinding("items").sort(aSorters);
        },
        onPersonalFormListSetTableItemPress: function (oEvent) {
          this.navigateToDraftEdit(oEvent);
        },
        onPersonalFormListSetTableSelectionChange: function () {
          let oSource = this.getView().byId(
            "idPersonalFormListSetTableTransfered"
          ),
            selectedRows = oSource.getSelectedItems(),
            oModel = this.getModel(),
            jsonModel = this.getModel("jsonModel");
          this.sendToApproveSPaths = [];
          selectedRows.forEach((element) => {
            let context = jsonModel.getProperty(
              element.getBindingContextPath()
            );
            context = {
              ...context,
            };
            delete context.__metadata;
            context.Statu = "01";
            this.sendToApproveSPaths.push(context);
          });
          jsonModel.setProperty(
            "/sendToApproveSPaths",
            this.sendToApproveSPaths
          );
          jsonModel;
        },
        _denyPopOver: function (oEvent) {
          // let dataPath = oEvent.getSource().getParent().getBindingContext("jsonModel").getProperty("Aciklama")
          let dataPath = oEvent.getSource().getParent().getBindingContext("jsonModel"),
            oView = this.getView(),
            oButton = oEvent.getSource(),
            that = this;
          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: oView.getId(),
              name: "ozak.com.zhrpersonalrequestform.fragment.DenyReasonPopover",
              controller: this
            }).then(function (oPopover) {
              oView.addDependent(oPopover);
              oPopover.bindElement('jsonModel>' + dataPath.getPath());
              return oPopover;
            });
          }
          this._pPopover.then(function (oPopover) {
            oPopover.openBy(oButton);
          });
        },
        _closeDialog: function () {
          this.getView().byId("denyAciklamaButton").close();
          this._pPopover = undefined;
        },
        onOnayaGnderButtonPress: function () {
          let oModel = this.getModel(),
            that = this;
          this.sendToApproveSPaths.forEach((element) => {
            // oModel.read(element, {
            //   success: (oData, oResponse) => {
            //     if (oData.Type === "S") {
            //       that._showMessageBox(oData.Message, oData.Type, true, 1000);
            //       that.refreshTransferedTable("", "idPersonalFormListSetTableTransfered");
            //     } else {
            //       that._showMessageBox(oData.Message, oData.Type, true, 1000);
            //       that.refreshTransferedTable("", "idPersonalFormListSetTableTransfered");
            //     }
            //   },
            // });
            element.Guid = element.Guid.replace(/-/g, '').toUpperCase();
            oModel.callFunction("/CreateForm_Func_Imp", {
              method: "POST",
              urlParameters: element,
              success: function (oData) {
                if (oData.CreateForm_Func_Imp.Type === "S") {
                  that._showMessageBox(oData.CreateForm_Func_Imp.Message, oData.Type, true, 1000);
                  that.refreshTransferedTable(
                    "",
                    "idPersonalFormListSetTableTransfered"
                  );
                } else {
                  that._showMessageBox(oData.CreateForm_Func_Imp.Message, oData.Type, true, 1000);
                  that.refreshTransferedTable(
                    "",
                    "idPersonalFormListSetTableTransfered"
                  );
                }
              },
              error: function (oResponse) {
                console.log(oResponse);
                that.getView().setBusy(false);
              },
            });
          });
        },
        refreshTransferedTable: function () {
          this._fetchAllFormListData().then(() => {
            this.setTableDataCount();
          });
          this.resetSelections("", "idPersonalFormListSetTableTransfered");
        },
        resetSelections: function (oEvent, tableName) {
          let jsonModel = this.getModel("jsonModel");
          this.getView().byId(tableName).removeSelections();
          jsonModel.setProperty("/sendToApproveSPaths", []);
        },
        onEditDraftButton: function (oEvent) {
          this.navigateToDraftEdit(oEvent);
        }
      }
    );
  }
);
