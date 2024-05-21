sap.ui.define(
  [
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, formatter, Filter, Sorter, FilterOperator) {
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
          this._oList = oList;
          this._oListFilterState = {
            aFilter: [],
            aSearch: [],
          };
          this.oSF = this.getView().byId("searchField");
        },
        _onRouteMatched: function (oEvent) {},
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
      }
    );
  }
);
