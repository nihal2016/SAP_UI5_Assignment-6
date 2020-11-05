sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"com/yash/assignment6/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, Log, formatter, Filter, FilterOperator, MessageBox, MessageToast, JSONModel) {
	"use strict";

	var oCartProducts;
	var oCartProduct;
	var sideContentshow = false;
	// var checkOutShow = false;
	var itemPressed = false;
	var TotalPrice = 0.00;
	return Controller.extend("com.yash.assignment6.controller.welcome", {
		formatter: formatter,
		onInit: function () {
			this.getView().setModel(new JSONModel(), "cartProducts");
			this.handleSideContentShow(sideContentshow);
			// this.handleChekOutContent(checkOutShow);
			this.byId("productDetailtoCart").setPressed(itemPressed);
			this.byId("welcometoCart").setPressed(itemPressed);
		},
		searchCategory: function (oEvent) {
			this.getView().byId("masterCategoryCatalogList").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						path: "CategoryName",
						operator: FilterOperator.Contains,
						value1: oEvent.getSource().getValue()
					})
				],
				and: false
			}));
		},
		backToHome: function () {
			this.byId("SplitAppDemo").toDetail(this.createId("detail"));
		},
		onPressMasterBack: function () {
			this.byId("SplitAppDemo").backMaster();
		},
		goToCategoryMaster: function (oEvent) {
			this.byId("categoryMaster").bindElement(oEvent.getParameter("listItem").getBindingContextPath() + "/");
			this.byId("SplitAppDemo").toMaster(this.createId("categoryMaster"));
			this.byId("categoryList").bindElement(oEvent.getParameter("listItem").getBindingContextPath() + "/Products");
		},
		onCategoryListItemPress: function (oEvent) {
			this.byId("productDetail").bindElement(oEvent.getParameter("listItem").getBindingContextPath() + "/");
			this.byId("SplitAppDemo").toDetail(this.createId("productDetail"));
		},
		handleSideContentShow: function (oContent) {
			if (oContent) {
				this.byId("cartSplitor").setSize("30%");
			} else {
				this.byId("cartSplitor").setSize("0%");
			}
		},
		// handleChekOutContent: function (oContent) {
		// 	if (oContent) {
		// 		this.byId("checkOut").setSize("100%");
		// 	} else {
		// 		this.byId("checkOut").setSize("0%");
		// 	}
		// }
		onCart: function (oEvent) {
			if (oEvent.getSource().getPressed()) {
				sideContentshow = true;
				itemPressed = true;
			} else {
				sideContentshow = false;
				itemPressed = false;
			}
			this.handleSideContentShow(sideContentshow);
		},
		addToCart: function (oEvent) {
			this.validateProduct(oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().getPath()), this.getView().getModel(
				"cartProducts"));
		},
		validateProduct: function (oProduct, oCartModel) {
			if (oProduct.Product !== undefined) {
				oProduct = oProduct.Product;
			}
			switch (oProduct.Status) {
			case "D":
				MessageBox.show("This Product is discontinued!", {
					icon: MessageBox.Icon.ERROR,
					actions: [MessageBox.Action.CLOSE]
				});
				break;
			case "O":
				MessageBox.show("This Product is Out of Stock", {
					icon: MessageBox.Icon.ERROR,
					actions: [MessageBox.Action.CLOSE]
				});
				break;
			case "A":
				this.updateCart("add", oProduct, oCartModel);
				break;
			default:
				break;
			}
		},
		updateCart: function (oMode, oProduct, oCartModel) {
			oCartProducts = Object.assign({}, oCartModel.getData()["cartItems"]);
			oCartProduct = oCartProducts[oProduct.ProductId];

			if (oMode === "delete") {
				delete oCartProducts[oProduct.ProductId];
				MessageToast.show("Product Deleted from Cart", [oProduct.Name]);
			}
			if (oMode === "add") {
				if (oCartProduct === undefined) {
					oCartProduct = Object.assign({}, oProduct);
					oCartProduct.Quantity = 1;
					oCartProducts[oProduct.ProductId] = oCartProduct;
				} else {
					oCartProduct.Quantity += 1;
				}
				MessageToast.show("Product Added to Cart", [oProduct.Name]);
			}
			oCartModel.setProperty("/cartItems", Object.assign({}, oCartProducts));
			oCartModel.refresh(true);
			this.getView().byId("cartDetail").setModel(oCartModel);
			this.getView().byId("totalPrice").setText(this.totalPrice(oCartProducts));
		},
		deleteCartItem: function (oEvent) {
			this.updateCart("delete", oEvent.getParameter("listItem").getBindingContext().getObject(), oEvent.getParameter("listItem").getBindingContext()
				.getModel());
		},
		editCartList: function (oEvent) {
			this.byId("cartProductList").setMode("Delete");
			oEvent.getSource().setVisible(false);
			this.byId("saveEditedCart").setVisible(true);
			this.byId("checkoutButton").setVisible(false);
		},
		saveCartList: function (oEvent) {
			this.byId("cartProductList").setMode("None");
			oEvent.getSource().setVisible(false);
			this.byId("cartEditButton").setVisible(true);
			this.byId("checkoutButton").setVisible(true);
		},
		totalPrice: function (oCartItmes) {
			TotalPrice = 0;
			Object.values(oCartItmes).forEach(function (item) {
				TotalPrice += parseFloat(item.Price) * item.Quantity;
			});
			return TotalPrice;
		},
		checkout: function () {
			if (Object.values(this.getView().byId("cartProductList").getModel().getData()["cartItems"]).length) {
				console.log(Object.values(this.getView().byId("cartProductList").getModel().getData()["cartItems"]));
			} else {
				MessageBox.show("There is no Product in Cart, Please add a product first!", {
					icon: MessageBox.Icon.ERROR,
					actions: [MessageBox.Action.CLOSE]
				});
			}

		}

	});
});