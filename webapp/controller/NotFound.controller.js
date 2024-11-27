sap.ui.define([
		"zjblessons/ControlTaskStrelnik/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.ControlTaskStrelnik.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);