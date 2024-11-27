/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/Worklist",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/Object",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/NotFound",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/Browser",
	"zjblessons/ControlTaskStrelnik/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.ControlTaskStrelnik.view."
	});

	sap.ui.require([
		"zjblessons/ControlTaskStrelnik/test/integration/WorklistJourney",
		"zjblessons/ControlTaskStrelnik/test/integration/ObjectJourney",
		"zjblessons/ControlTaskStrelnik/test/integration/NavigationJourney",
		"zjblessons/ControlTaskStrelnik/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});