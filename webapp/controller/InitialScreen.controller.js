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
          var oList = this.byId("list");
          var oTable = this.byId("idMyPYPListTable");
          this._oList = oList;
          this._oTable = oTable;
          this._oListFilterState = {
            aFilter: [],
            aSearch: [],
          };
          this.oSF = this.getView().byId("searchField");
        },
        _onRouteMatched: function (oEvent) {
          this._getUserInfo();
        },
        onSearch: function (oEvent) {
          if (oEvent.getParameters().refreshButtonPressed) {
            // Search field's 'refresh' button has been pressed.
            // This is visible if you select any list item.
            // In this case no new search is triggered, we only
            // refresh the list binding.
            this.onRefresh();
            return;
          }

          var sQuery = oEvent.getParameter("query");

          if (sQuery) {
            this._oListFilterState.aSearch = [
              new Filter("PYPInfo/PYPName", FilterOperator.Contains, sQuery),
            ];
          } else {
            this._oListFilterState.aSearch = [];
          }
          this._applyFilterSearch();
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
                  new Filter("PYPInfo/PYPName", function (sDes) {
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
        _applyFilterSearch: function () {
          var aFilters = this._oListFilterState.aSearch.concat(
              this._oListFilterState.aFilter
            ),
            oViewModel = this.getModel("listView");
          this._oList.getBinding("items").filter(aFilters, "Application");
          // changes the noDataText of the list in case there are no filter results
          if (aFilters.length !== 0) {
            oViewModel.setProperty(
              "/noDataText",
              this.getResourceBundle().getText(
                "listListNoDataWithFilterOrSearchText"
              )
            );
          } else if (this._oListFilterState.aSearch.length > 0) {
            // only reset the no data text to default when no new search was triggered
            oViewModel.setProperty(
              "/noDataText",
              this.getResourceBundle().getText("listListNoDataText")
            );
          }
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
        _onSearchcIdMyPYPListTable: function (oEvent) {
          let table = this.getView().byId("idMyPYPListTable"),
            oBinding = table.getBinding("items"),
            oFilter = [],
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            oFilter = new Filter(
              [
                new Filter(
                  "PYPInfo/PYPName",
                  FilterOperator.Contains,
                  inputValue
                ),
                // new Filter("Maktx", FilterOperator.Contains, inputValue),
                // new Filter("Charg", FilterOperator.Contains, inputValue),
                // new Filter("Lgort", FilterOperator.Contains, inputValue),
                // new Filter("Labst", FilterOperator.Contains, inputValue)
              ],
              false
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
      }
    );
  }
);
