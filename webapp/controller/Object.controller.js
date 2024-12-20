/*global location*/
sap.ui.define([
		"zjblessons/ControlTaskStrelnik/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
		"zjblessons/ControlTaskStrelnik/model/formatter"
	], function (
		BaseController,
		JSONModel,
		History,
		MessageToast,
		formatter
	) {
		"use strict";

		return BaseController.extend("zjblessons.ControlTaskStrelnik.controller.Object", {

			formatter: formatter,


			onInit : function () {

				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						editable: false,
						selectedGroupID: null
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);


				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {

						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},

			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			},

			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				MessageToast.show("Материал с ID: " + sObjectId);
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("zjblessons_base_Materials", {
						MaterialID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},


			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.MaterialID,
					sObjectName = oObject.MaterialDescription;

				oViewModel.setProperty("/busy", false);

				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},
			_bindGroupsTable: function () {
				var oGroupsTable = this.byId("groupsTable");
				var sGroupID = this.getView().getBindingContext().getProperty("GroupID");
				var oBindingInfo = {
					path: "/zjblessons_base_Groups",
					filters: [new Filter("GroupID", FilterOperator.EQ, sGroupID)]
				};
				oGroupsTable.bindItems(oBindingInfo);
			},
			onGroupSelectionChange: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("listItem");
				var oContext = oSelectedItem.getBindingContext();
				var sGroupID = oContext.getProperty("GroupID");
				this.getView().getModel("viewModel").setProperty("/selectedGroupID", sGroupID);
				this.byId("noGroupSelectedText").setVisible(false);
				this.byId("subGroupsTable").setVisible(true);

				var oSubGroupsTable = this.byId("subGroupsTable");
				var oBindingInfo = {
					path: "/zjblessons_base_SubGroups",
					filters: [new Filter("GroupID", FilterOperator.EQ, sGroupID)]
				};
				oSubGroupsTable.bindItems(oBindingInfo);
			}

		});

	}
);