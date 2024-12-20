/*global location history */
sap.ui.define([
		"zjblessons/ControlTaskStrelnik/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/ControlTaskStrelnik/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("zjblessons.ControlTaskStrelnik.controller.Worklist", {

			formatter: formatter,

	
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");


				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

				this._aTableSearchState = [];

				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				oTable.attachEventOnce("updateFinished", function(){

					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},


			onUpdateFinished : function (oEvent) {
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");

				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},


			onPress : function (oEvent) {
				this._showObject(oEvent.getSource());
			},

			onNavBack : function() {
				history.go(-1);
			},


			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {

					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("MaterialDescription", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},


			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},


			_showObject : function (oEvent) {
				var oButton = oEvent.getSource();
   				var oContext = oButton.getBindingContext();
    			var sMaterialID = oContext.getProperty("MaterialID");
				this.getRouter().navTo("object", {
					objectId: sMaterialID
				});
			},

			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			},
			onStudentButtonPress: function () {
				var oTable = this.byId("table");
    			var iSelectedIndex = oTable.getSelectedIndex();
        		var oContext = oTable.getContextByIndex(iSelectedIndex);
        		var sCreatedByFullName = oContext.getProperty("CreatedByFullName");
				sap.m.MessageBox.information(sCreatedByFullName, {
					title: "Информация",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function () {
					}
				});
			},
			onShowMaterialIDPress: function () {
				var oTable = this.byId("table");
				var oSelectedContext = oTable.getContextByIndex(oTable.getSelectedIndex());
				var sMaterialID = oSelectedContext.getProperty("MaterialID");
				sap.m.MessageBox.information("Выбранный MaterialID: " + sMaterialID, {
					title: "Информация",
					actions: [sap.m.MessageBox.Action.OK]
				});

			},


		});
	}
);