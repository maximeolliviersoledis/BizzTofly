export class ConstService {
    /***URL***/
    addCommentDir = "/add_comment";
    adresses = '/addresses';
    appliSettingsDir="/appli_settings";
    base_url = 'https://restaurantrestapi.herokuapp.com/';
    baseDir = "http://www.bizztofly.com/api";
    baseDirApiSoledis = "http://www.bizztofly.com/api-soledis";
    cartDir = "/carts";
    carrierDir = "/carriers";
    carrierDetailsDir = "/carrier_details";
    categoryDir = "/categories";
    categoriesListing = "/categories_listing";
    combinationDir = "/combinations";
    commentsDir="/comments";
    commentUsefulnessDir = "/comment_usefulness";
    contactDir = "/contacts";
    customerDir = "/customers";
    familyProductDir = "/family_product";
    imageDir = "/images";
    notificationDir = "http://www.bizztofly.com/modules/sld_notification/mobile-notification.php";
    favouriteDir = "/favourite";
    orderDir = "/orders";
    paymentDir = "/payments";
    productDetail = "/product_detail";
    productDir = "/products";
    productsInPromoDir= "/product_promo";
    reductionDir = "/reduction";
    reportCommentDir = "/report_comment";
    resetPasswordDir ="/reset_password";
    search = "/search";
    specificPriceRulesDir = "/specific_price_rules";
    specificPriceDir = "/specific_prices";
    storesDir = "/stores";

    /***Parameters***/
    action = "&action=";
    email = "&mail=";
    fcm = "&fcm=";
    idCustomer = "&id_customer=";
    idCart = "&id_cart=";
    idCartRule = "&id_cart_rule=";
    idProduct = "&id_product=";
    idProductAttribute = "&id_product_attribute=";
    keyDir = "?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL";
    formatDir = "&output_format=JSON";
    limitQuery = "&limit=";
    quantity = "&quantity="
    sortIdDesc = "&sort=[id_DESC]";
    uselfuness = "&usefulness=";
    uuid = "&uuid=";


    /***Filters***/
    filterActive = "&filter[active]=";
    filterIdCart = "&filter[id_cart]=";
    filterIdCustomer = "&filter[id_customer]=";
    filterDeleted = "&filter[deleted]=";
    filterNeedRange = "&filter[need_range]=";
    filterUser = "&filter[user]=";
}
