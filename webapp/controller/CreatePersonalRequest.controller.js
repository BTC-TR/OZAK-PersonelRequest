sap.ui.define(
  ["./BaseController", "../model/formatter"],
  function (BaseController, formatter) {
    "use strict";

    return BaseController.extend(
      "ozak.com.zhrpersonalrequestform.controller.CreatePersonalRequest",
      {
        formatter: formatter,
        onInit: function () {
          var oRouter = this.getRouter();
          oRouter
            .getRoute("initialScreen")
            .attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {},
      }
    );
  }
);
