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
          this.oSF = this.getView().byId("searchField");
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
              break;
            case "bekleyen":
              that._oTable = this.byId("idPersonalFormListSetTableWaiting");
              break;
            case "red":
              that._oTable = this.byId("idPersonalFormListSetTableDeclined");
              break;
            case "onay":
              that._oTable = this.byId("idPersonalFormListSetTableApproved");
              break;
          }
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
            oFilter = new Filter(
              [
                new Filter("TplansT", FilterOperator.Contains, inputValue),
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
                  new Filter("id", function (sText) {
                    return (
                      (String(sText) || "")
                        .toUpperCase()
                        .indexOf(sValue.toUpperCase()) > -1
                    );
                  }),
                  new Filter("TplansT", function (sDes) {
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
      }
    );
  }
);
