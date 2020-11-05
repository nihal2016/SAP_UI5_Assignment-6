sap.ui.define([], function () {
	"use strict";

	var mStatusState = {
		"A": "Success",
		"O": "Warning",
		"D": "Error"
	};

	var formatter = {

		statusText: function (sStatus) {
			if (sStatus === "A")
				return "Available";
			if (sStatus === "O")
				return "Out of Stock";
			if (sStatus === "D")
				return "Discontinued";

			return "Unvailable";
		},

		statusState: function (sStatus) {
			return mStatusState[sStatus] || "None";
		}
	};

	return formatter;
});