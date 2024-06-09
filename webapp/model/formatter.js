sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Rounds the number unit value to 2 digits
     * @public
     * @param {string} sValue the number string to be rounded
     * @returns {string} sValue with 2 digits rounded
     */
    numberUnit: function (sValue) {
      if (!sValue) {
        return "";
      }
      return parseFloat(sValue).toFixed(2);
    },
    formatDate: function (sValue) {
      return `${sValue.getDate()}/${sValue.getMonth() + 1}/${sValue.getFullYear()}`;
    },
    setStatusText: function (sValue) {
      switch (sValue) {
        case "01":
          return "Onayda";
        case "02":
          return "Onaylandı";
        case "03":
          return "Reddedildi";
        case "04":
          return "Sisteme Aktarıldı";
        case "05":
          return "Taslak";
        default:
          break;
      }
    },
    setStatusIcon: function (sValue) {
      switch (sValue) {
        case "01":
          return "sap-icon://pending";
        case "02":
          return "sap-icon://accept";
        case "03":
          return "sap-icon://decline";
        case "04":
          return "sap-icon://sys-enter";
        case "05":
          return "sap-icon://timesheet";
        default:
          break;
      }
    },
    setStatusState: function (sValue) {
      switch (sValue) {
        case "01":
          return "Warning";
        case "02":
          return "Success";
        case "03":
          return "Error";
        case "04":
          return "Success";
        case "05":
          return "None";
        default:
          break;
      }
    },
    removeDatsFromString: function (data) {
      let removedData = data.replace(/-/g, "").toUpperCase()
      return removedData;
    },
  };
});
