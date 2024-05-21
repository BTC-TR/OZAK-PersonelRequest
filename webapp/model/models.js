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
      createJsonModel: function () {
        var oModel = new JSONModel({
          busy: true,
          today: new Date(),
          myPYPList: [
            {
              id: 1,
              dummyData1: "Ataşehir Ofis",
              dummyData2: "Ataşehir Lokasyonunda Yardımcı Uzman",
              dummyData3: "0-3 Yıl",
              dummyData4: "Ortaokul",
              dummyData5: "40-45",
              dummyData6: "B2 Ehliyet, Askerlik Durumu Yok, Herhangi Bir Engeli Yok",
              statusInfo: {
                status: "2",
                statusText: "Onay Aşamasında",
                statusType: "Warning",
                statusIcon: "sap-icon://warning",
              },
              customerInfo: {
                isCustomerOnTheSystem: "X",
                customerTitle: "İnsu Teknik",
                customerAdress:
                  "Turan Köy Mahallesi Turan Caddesi No:50 Kestel/Bursa",
                customerPostAdress: "16450",
                customerTelNo: "02242131232",
                customerEmail: "insuteknik@insuteknik.com.tr",
                customerTaxOffice: "Uludağ",
                customerTaxNo: "9192389210",
                customerRelevantPerson: "Abdurrahim Aykaç",
                customerRelevantPersonNo: "555555555",
              },
              PYPInfo: {
                PYPName: "ÖZAK GLOBAL",
                PYPDescription: "Uzman Yardımcısı",
                PYPStartDate: new Date(2024, 4, 1, 1, 1, 1, 1),
                PYPEndDate: new Date(2024, 5, 1, 1, 1, 1, 1),
              },
              ProjectInfo: {
                projectTypeId: "3",
                projectProfitCenter: "12120",
                projectLocations: [
                  "BTC_OFIS",
                  "BTC_OFIS_DISI",
                  "INSU_LOKASYON",
                ],
                projectOfficerInfo: {
                  userNo: "214",
                  userFullName: "5",
                },
                projectWorkForceInfo: [
                  {
                    userNo: "227",
                    userFullName: "Hatice Çakmak",
                  },
                  {
                    userNo: "248",
                    userFullName: "Kadri Güven",
                  },
                  {
                    userNo: "302",
                    userFullName: "Mustafa Şahin",
                  },
                ],
              },
            },
            {
                id: 1,
                dummyData1: "İzmir Ofis",
                dummyData2: "İzmir Lokasyonunda Arge Çalışanı",
                dummyData3: "0-3 Yıl",
                dummyData4: "Üniversite",
                dummyData5: "25-30",
                dummyData6: "B2 Ehliyet, Askerlik Durumu Yok, Herhangi Bir Engeli Yok",
                statusInfo: {
                  status: "1",
                  statusText: "Onaylandı",
                  statusType: "Success",
                  statusIcon: "sap-icon://message-success",
                },
                customerInfo: {
                  isCustomerOnTheSystem: "X",
                  customerTitle: "İnsu Teknik",
                  customerAdress:
                    "Turan Köy Mahallesi Turan Caddesi No:50 Kestel/Bursa",
                  customerPostAdress: "16450",
                  customerTelNo: "02242131232",
                  customerEmail: "insuteknik@insuteknik.com.tr",
                  customerTaxOffice: "Uludağ",
                  customerTaxNo: "9192389210",
                  customerRelevantPerson: "Abdurrahim Aykaç",
                  customerRelevantPersonNo: "555555555",
                },
                PYPInfo: {
                  PYPName: "ELTAŞ",
                  PYPDescription: "Arge Mühendisi",
                  PYPStartDate: new Date(2024, 4, 1, 1, 1, 1, 1),
                  PYPEndDate: new Date(2024, 5, 1, 1, 1, 1, 1),
                },
                ProjectInfo: {
                  projectTypeId: "3",
                  projectProfitCenter: "12120",
                  projectLocations: [
                    "BTC_OFIS",
                    "BTC_OFIS_DISI",
                    "INSU_LOKASYON",
                  ],
                  projectOfficerInfo: {
                    userNo: "214",
                    userFullName: "5",
                  },
                  projectWorkForceInfo: [
                    {
                      userNo: "227",
                      userFullName: "Hatice Çakmak",
                    },
                    {
                      userNo: "248",
                      userFullName: "Kadri Güven",
                    },
                    {
                      userNo: "302",
                      userFullName: "Mustafa Şahin",
                    },
                  ],
                },
              },
          ],
        });
        return oModel;
      },
    };
  }
);
