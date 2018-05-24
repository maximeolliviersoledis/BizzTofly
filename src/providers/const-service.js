var ConstService = /** @class */ (function () {
    function ConstService() {
        this.action = "&action=";
        this.adresses = '/addresses';
        this.base_url = 'https://restaurantrestapi.herokuapp.com/';
        this.baseDir = "http://www.bizztofly.com/api";
        this.baseDirApiSoledis = "http://www.bizztofly.com/api-soledis";
        this.cartDir = "/carts";
        this.carrierDir = "/carriers";
        this.carrierDetailsDir = "/carrier_details";
        this.categoryDir = "/categories";
        this.categoriesListing = "/categories_listing";
        this.combinationDir = "/combinations";
        this.contactDir = "/contacts";
        this.customerDir = "/customers";
        this.idCustomer = "&id_customer=";
        this.idCart = "&id_cart=";
        this.idProduct = "&id_product=";
        this.idProductAttribute = "&id_product_attribute=";
        this.imageDir = "/images";
        this.keyDir = "?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL";
        this.favouriteDir = "/favourite";
        this.filterActive = "&filter[active]=";
        this.filterIdCart = "&filter[id_cart]=";
        this.filterIdCustomer = "&filter[id_customer]=";
        this.filterDeleted = "&filter[deleted]=";
        this.filterNeedRange = "&filter[need_range]=";
        this.formatDir = "&output_format=JSON";
        this.limitQuery = "&limit=";
        this.orderDir = "/orders";
        this.paymentDir = "/payments";
        this.productDetail = "/product_detail";
        this.quantity = "&quantity=";
        this.search = "/search";
        this.specificPriceRulesDir = "/specific_price_rules";
        this.specificPriceDir = "/specific_prices";
        this.sortIdDesc = "&sort=[id_DESC]";
        this.notificationDir = "http://www.bizztofly.com/modules/sld_notification/mobile-notification.php";
        //base_url= 'http://192.168.1.19:8000/'
        //'https://restaurantrestapi.herokuapp.com/'
    }
    return ConstService;
}());
export { ConstService };
//# sourceMappingURL=const-service.js.map