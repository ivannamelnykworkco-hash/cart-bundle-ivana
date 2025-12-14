import { useCallback, useEffect, useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { PlusCircleIcon, DiscountIcon, MegaphoneIcon, ProductIcon, NoteIcon } from '@shopify/polaris-icons';

import {
  Page,
  Layout,
  Card,
  BlockStack,
  Select,
  InlineStack,
  Button,
  Text,
  Divider,
  Box,
  Badge,
  InlineGrid,
  Checkbox,
  Toast,
  Frame,
  Thumbnail,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import bundleVertical from "app/asset/bundleVertical.svg";
import bundleHorizon from "app/asset/bundleHorizon.svg";
import { GeneralSettingsPanel } from "app/components/bundles/GeneralSettingsPanel";
import { GeneralStylePanel } from "app/components/bundles/GeneralStylePanel";
import { GeneralVolumePanel } from "app/components/bundles/GeneralVolumePanel";
import { GeneralCheckboxUpsell } from "app/components/bundles/GeneralCheckboxUpsell";
import { GeneralStickyAddToCart } from "app/components/bundles/GeneralStickyAddToCart";
import { CountDownPanel } from "app/components/bundles/CountDownPanel";
import { MostPopularfancy } from "app/components/common/MostPopularfancy";
import { getCountdownTimer, updateCountdownTimer } from "app/models/countdownTimer.server";
import { GeneralQuantityBreack, createNewQuantityBreak } from "app/components/bundles/GeneralQuantityBreack";
import { GeneralBuyXgetYfree, createNewBuyXGetY } from "app/components/bundles/GeneralBuyXgetYfree";
import { GeneralBundleUpsell, createNewBundleUpsell } from "app/components/bundles/GeneralBundleUpsell";
import { getGeneralStyle, updateGeneralStyle } from "app/models/generalStyle.server";
import { getVolumeDiscount, updateVolumeDiscount } from "app/models/volumeDiscount.server";
import { getStickyAdd, updateStickyAdd } from "app/models/stickyAdd.server";
import { getCheckboxUpsell, updateCheckboxUpsell } from "app/models/checkboxUpsell.server";
import { getGeneralSetting, updateGeneralSetting } from "app/models/generalSetting.server";
import { getQuantityBreaks, updateQuantityBreak, updateQuantityBreaks } from "app/models/quantityBreak.server";
import { getBuyXGetYs, updateBuyXGetY, updateBuyXGetYs } from "app/models/buyXGetY.server";
import { getBundleUpsells, updateBundleUpsell, updateBundleUpsells } from "app/models/bundleUpsell.server";
import { getUpsellItems } from "app/models/upsellItem.server";
import type { QuantityBreak, BuyXGetY, BundleUpsell } from "../models/types";

import {
  GET_DISCOUNT_QUERY,
  CREATE_DISCOUNT_QUERY,
  UPDATE_DISCOUNT_QUERY
} from "../graphql/discount";
import {
  ADD_METAFIELD_QUERY
} from "../graphql/metafield";
import {
  GET_PRODUCT_QUERY
} from "../graphql/product";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(GET_PRODUCT_QUERY);
  const body = await response.json();
  //Product data from backend
  const productEdges = body?.data?.products?.edges ?? [];
  const products = productEdges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    imageUrl: node.featuredImage?.url ?? "",
    price: node.variants?.edges?.[0]?.node?.price ?? null,
    compareAtPrice: node.variants?.edges?.[0]?.node?.compareAtPrice ?? null,
    variants: node.variants?.edges ?? null,
    metafields: node.metafields?.edges ?? null
  }));
  //Collection data from backend
  const collectionEdges = body?.data?.collections.edges ?? [];
  const collections = collectionEdges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    imageUrl: node.image?.url ?? "",
  }));
  const shopifyFunctionsEdges = body?.data?.shopifyFunctions?.edges ?? [];
  const shopifyFunctions = shopifyFunctionsEdges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    apiType: node.apiType
  }));

  // fetch data from prisma
  try {
    const [
      countdownTimerConf,
      generalStyleConf,
      generalVolumeConf,
      generalStickyAddConf,
      checkboxUpsellConf,
      generalSettingConf,
      quantityBreakConf,
      buyXGetYConf,
      bundleUpsellConf,
    ] = await Promise.all([
      getCountdownTimer(),
      getGeneralStyle(),
      getVolumeDiscount(),
      getStickyAdd(),
      getCheckboxUpsell(),
      getGeneralSetting(),
      getQuantityBreaks(),
      getBuyXGetYs(),
      getBundleUpsells(),
    ]);

    // Handle error, but note that Promise.all rejects on first error
    return json(
      {
        products,
        collections,
        shopifyFunctions,
        countdownTimerConf,
        generalStyleConf,
        generalVolumeConf,
        generalStickyAddConf,
        checkboxUpsellConf,
        generalSettingConf,
        quantityBreakConf,
        buyXGetYConf,
        bundleUpsellConf,
      }
    );
  }
  catch (err) {
    // Handle error, but note that Promise.all rejects on first error
    return json(
      { success: false, error: err.message || err },
      { status: 500 }
    );
  }
};

async function getAutomaticAppDiscount(admin: any, discountId: string) {
  const getDiscountQuery = GET_DISCOUNT_QUERY;
  const getDiscountVariables = {
    id: discountId
  };
  try {
    const graphqlResult = await admin.graphql(getDiscountQuery, { variables: getDiscountVariables });
    const body = await graphqlResult.json();
    const automaticDiscount = body?.data?.automaticDiscountNode?.automaticDiscount ?? null;
    return automaticDiscount;
  } catch (err: any) {
    // Network or other exceptions
    return null;
  }
}

async function createDiscountAutomaticApp(admin: any, variables: any) {
  const createDiscountQuery = CREATE_DISCOUNT_QUERY;
  try {
    const graphqlResult = await admin.graphql(createDiscountQuery, { variables: variables });
    const body = await graphqlResult.json();
    const userErrors = body.data?.discountAutomaticAppCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return null;
    }
    const automaticAppDiscount = body?.data?.discountAutomaticAppCreate?.automaticAppDiscount ?? null;
    return automaticAppDiscount;
  } catch (err: any) {
    // Network or other exceptions
    return null;
  }
}

async function updateDiscountAutomaticApp(admin: any, discountId: string, discountData: any) {
  const updateDiscountQuery = UPDATE_DISCOUNT_QUERY;
  const updateVariables = {
    id: discountId,
    automaticAppDiscount: {
      title: discountData.discountName,
      startsAt: discountData.startsAt,
      endsAt: discountData.endsAt === "" ? null : discountData.endsAt,
    }
  };
  try {
    const graphqlResult = await admin.graphql(updateDiscountQuery, { variables: updateVariables });
    const body = await graphqlResult.json();
    const userErrors = body.data?.discountAutomaticAppUpdate?.userErrors || [];
    if (body.errors?.length) {
      // return body.errors.map((e: any) => e.message).join(", ");
      return "body error";
    }
    if (userErrors.length > 0) {
      // return userErrors.map(e => e.message).join(", ");
      return "usererror";
    }
    const automaticAppDiscount = body?.data?.discountAutomaticAppUpdate?.automaticAppDiscount ?? null;
    if (automaticAppDiscount == null)
      return body.errors[0].message;
    if (!automaticAppDiscount) {
      return "Unknown error: discountAutomaticAppUpdate returned null";
    }
    return automaticAppDiscount;
  } catch (err: any) {
    // Network or other exceptions
    // return err.message;
    return "othererror";
  }
}

async function addMetafield(admin: any, variables: any) {
  try {
    const addMetafieldQuery = ADD_METAFIELD_QUERY;
    const response = await admin.graphql(addMetafieldQuery, { variables: variables });
    const json = await response.json?.() || response;
    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }
    const userErrors = json.data?.metafieldsSet?.userErrors;
    if (userErrors?.length) {
      throw new Error(userErrors[0].message);
    }
    return json.data.metafieldsSet.metafields;
  } catch (err) {
    throw new Error(`Failed to set metafields: ${err.message}`);
  }
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
/*********************Action to receive submit data****************/
//Save data in database
export async function action({ request, params }) {

  const { admin, session } = await authenticate.admin(request);
  const parsedData = {
    ...Object.fromEntries(await request.formData()),
    params
  };
  let form = { ...parsedData };
  const countdownTimer = JSON.parse(form.countdownTimer);
  const volumeDiscount = JSON.parse(form.volumeDiscount);
  const stickyAdd = JSON.parse(form.stickyAdd);
  const checkboxUpsell = JSON.parse(form.checkboxUpsell);
  const generalSetting = JSON.parse(form.generalSetting);
  const generalStyle = JSON.parse(form.generalStyle);
  const discountData = JSON.parse(form.discountData);
  const quantityBreak = JSON.parse(form.quantityBreak);
  const buyXGetY = JSON.parse(form.buyXGetY);
  const bundleUpsell = JSON.parse(form.bundleUpsell);

  const existingDiscount = await getAutomaticAppDiscount(admin, generalSetting.discountId);
  //if no discount exists, create a new discount   
  if (existingDiscount == null) {
    const createVariables = {
      automaticAppDiscount: {
        title: discountData.discountName,
        functionId: discountData.functionId,
        startsAt: discountData.startsAt,
        endsAt: discountData.endsAt === "" ? null : discountData.endsAt,
        combinesWith: {
          orderDiscounts: true,
          productDiscounts: true,
          shippingDiscounts: true
        },
        discountClasses: "PRODUCT"
      }
    };
    const automaticAppDiscount = await createDiscountAutomaticApp(admin, createVariables);
    if (automaticAppDiscount == null) {
      return json(
        { success: false, error: "Discount create failed" },
        { status: 500 }
      );
    }
    const automaticAppDiscountId = automaticAppDiscount.discountId;
    generalSetting.discountId = automaticAppDiscountId;
    // update prisma db
    try {
      await Promise.all([
        updateCountdownTimer(countdownTimer.id, countdownTimer),
        updateVolumeDiscount(volumeDiscount.id, volumeDiscount),
        updateStickyAdd(stickyAdd.id, stickyAdd),
        updateCheckboxUpsell(checkboxUpsell.id, checkboxUpsell),
        updateGeneralSetting(generalSetting.id, generalSetting),
        updateGeneralStyle(generalStyle.id, generalStyle),
        updateQuantityBreaks(quantityBreak),
        updateBuyXGetYs(buyXGetY),
        updateBundleUpsells(bundleUpsell)
      ]);
      return json({ success: true, automaticAppDiscount });
    } catch (err) {
      return json(
        { success: false, error: err || "Database update failed" },
        { status: 500 }
      );
    }
  }
  //if a discount exists, update it
  else {
    const discountId = generalSetting.discountId;
    let productList;
    let collectionList;
    // apply discount to specific products(4 types - all, except, specific, collection)
    const productScope = generalSetting.visibility;

    switch (productScope) {
      case "specific":
        productList = generalSetting.selectedProductData;
        break;
      case "collections":
        collectionList = generalSetting.selectedCollectionData;
        break;
      case "except":
        collectionList = generalSetting?.excludedCollectionData ?? [];
        productList = generalSetting?.excludedProductData ?? [];
        break;
      default:
        productList = [];
        collectionList = [];
    }
    productList = safeParse(productList);
    collectionList = safeParse(collectionList);
    // discountConf type: quantity_break, buyx_gety, bundle_upsell
    // discout Type: default, percent, fixed_amount, total_price
    const discountConf: any[] = [];
    const priceTypeMap = {
      "discounted%": "percent",
      "discounted$": "fixed_amount",
      "specific": "total_price"
    };
    quantityBreak.forEach(record => {
      discountConf.push({
        type: "quantity_break",
        quantity: record.quantity,
        discountType: priceTypeMap[record.selectPrice] || "default",
        discountPricePerItem: record.discountPrice,
        upsellItems: record.upsellItems.map(item => ({
          id: "", // item.selectedProduct
          quantity: item.quantity,
          discountType: priceTypeMap[item.selectPrice] || "default",
          discountPricePerItem: item.discountPricePerItem
        }))
      });
    });

    buyXGetY.forEach(record => {
      discountConf.push({
        type: "buyx_gety",
        buyQuantity: record.buyQuantity,
        getQuantity: record.getQuantity,
        upsellItems: record.upsellItems.map(item => ({
          id: "", // item.selectedProduct
          quantity: item.quantity,
          discountType: priceTypeMap[item.selectPrice] || "default",
          discountPricePerItem: item.discountPricePerItem
        }))
      });
    });

    bundleUpsell.forEach(record => {
      discountConf.push({
        type: "bundle_upsell",
        defaultProduct: {
          id: "gid://shopify/Product/10110757142807", // record.defaultProduct
          quantity: record.quantity,
          discountType: priceTypeMap[record.selectPrice] || "default",
          discountPricePerItem: record.discountPrice
        },
        addedProducts: record.productItems.map(product => ({
          id: "", // product.selectedProduct
          quantity: product.quantity,
          discountType: priceTypeMap[product.selectPrice] || "default",
          discountPricePerItem: product.discountPricePerItem
        }))
      });
    });

    // {
    //   "type": "bundle_upsell",
    //     "defaultProduct": {
    //     "id": "gid://shopify/Product/10110757798167",
    //       "quantity": 1,
    //         "discountType": "fixed_amount",
    //           "discountPricePerItem": 50
    //   },
    //   "addedProducts": [
    //     {
    //       "id": "gid://shopify/Product/10110757142807",
    //       "quantity": 2,
    //       "discountType": "percent",
    //       "discountPricePerItem": 50
    //     }]
    // }

    const automaticAppDiscount = await updateDiscountAutomaticApp(admin, discountId, discountData);
    if (automaticAppDiscount == null) {
      return json(
        { success: false, error: "Discount update failed" },
        { status: 500 }
      );
    }

    // add metafields of product info
    const addMetafieldVariables = {
      metafields: [
        {
          ownerId: discountId,
          namespace: "$app:discountInfo",
          key: "productInfo",
          type: "json",
          value: JSON.stringify({
            productScope: productScope,
            productList: productList,
            selectedCollectionIds: collectionList,
            discountConf: discountConf
          })
        }
      ]
    };

    try {
      const result = await addMetafield(admin, addMetafieldVariables);
      try {
        // update prisma db
        await Promise.all([
          updateCountdownTimer(String(countdownTimer.id), countdownTimer),
          updateVolumeDiscount(volumeDiscount.id, volumeDiscount),
          updateStickyAdd(stickyAdd.id, stickyAdd),
          updateCheckboxUpsell(checkboxUpsell.id, checkboxUpsell),
          updateGeneralSetting(generalSetting.id, generalSetting),
          updateGeneralStyle(generalStyle.id, generalStyle),
          updateQuantityBreaks(quantityBreak),
          updateBuyXGetYs(buyXGetY),
          updateBundleUpsells(bundleUpsell)
        ]);
        return json({ success: true, result });
      } catch (err) {
        return json(
          { success: false, error: err.message || "Database update failed" },
          { status: 500 }
        );
      }

    } catch (err) {
      return json(
        { success: false, error: err.message || "Metafield update failed" },
        { status: 500 }
      );
    }
  }
}

/**************************************************************/

interface BoxQuantity {
  id: number;
};
const fontWeightMap = {
  styleLight: '200',
  styleLightItalic: '200',
  styleRegular: '400',
  styleMedium: '400',
  styleMediumItalic: '400',
  styleBold: '700',
  styleBoldItalic: '700',
};
const fontStyleMap = {
  styleLight: 'normal',
  styleLightItalic: 'italic',
  styleRegular: 'normal',
  styleMedium: 'normal',
  styleMediumItalic: 'italic',
  styleBold: 'normal',
  styleBoldItalic: 'italic',
};
/************************************************************* */
export default function BundleSettingsAdvanced() {
  const loaderData = useLoaderData<typeof loader>();
  const checkboxUpsellConf = loaderData.checkboxUpsellConf;
  const shopifyFunctions = loaderData.shopifyFunctions;
  console.log("generalconf>>>", loaderData.generalSettingConf);
  /**************recevie response from action function************/
  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        console.log("Data updated successfully!", JSON.stringify(actionData, null, 2));
        showToast("Data updated successfully!", "success");
      } else {
        showToast(`Error: ${actionData.error} `, "error");
        console.log("Data updated failed!", JSON.stringify(actionData, null, 2));

      }
    }
  }, [actionData]);
  const [upsellChecked, setUpsellChecked] = useState({});
  const handleUpsellValueChange = (bundlId: string | number, upsellId: boolean, value: boolean | undefined) => {
    setUpsellChecked(prev => ({
      ...prev, [bundlId]: {
        ...(prev[bundlId] || {}),
        [upsellId]: value
      }
    }))
  }

  /************Database Migration Part**************/
  //Receive data from CountdownTimer

  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastError, setToastError] = useState(false); // For styling, optional

  const showToast = (message, type = 'success') => {
    setToastContent(message);
    setToastActive(true);
    setToastError(type === 'error');
  };

  const handleToastDismiss = () => {
    setToastActive(false);
  };
  const [countdownTimerData, setCountdownTimerData] = useState(loaderData.countdownTimerConf);
  const [generalVolumeData, setGeneralVolumeData] = useState(loaderData.generalVolumeConf);
  const [checkboxUpsellData, setCheckboxUpsellData] = useState(loaderData.checkboxUpsellConf);
  const [generalStickyAddData, setGeneralStickyAddData] = useState(loaderData.generalStickyAddConf);
  const [generalSettingData, setGeneralSettingData] = useState(loaderData.generalSettingConf);
  // const [quantityBreakData, setQuantityBreakData] = useState(loaderData.quantityBreakConf);
  // const [buyXGetYData, setBuyXGetYData] = useState(loaderData.buyXGetYConf);
  // const [bundleUpsellData, setBundleUpsellData] = useState(loaderData.bundleUpsellConf);


  const handleCountdownTimerChange = useCallback((updated: any) => {
    setCountdownTimerData(prev => ({ ...prev, ...updated }));
  }, []);
  const handleGeneralVolumeChange = useCallback((updated: any) => {
    setGeneralVolumeData(prev => ({ ...prev, ...updated }));
  }, []);
  const handleCheckboxUpsellChange = useCallback((updated: any) => {
    setCheckboxUpsellData(updated);
  }, []);
  const handleGeneralStickyAddChange = useCallback((updated: any) => {
    setGeneralStickyAddData(prev => ({ ...prev, ...updated }));
  }, []);
  const handleGeneralSetting = useCallback((updated: any) => {
    setGeneralSettingData(prev => ({ ...prev, ...updated }));
  }, []);

  // const upsellItemList = [{
  //   isSelectedProduct: true,
  //   selectedVariants: "",
  //   selectPrice: "Specific (e.g. $29)",
  //   discountPrice: 20,
  //   priceText: "==+ Add at 20% discount",
  //   isSelectedByDefault: true,
  //   isVisibleOnly: true,
  //   isShowAsSoldOut: true,
  //   labelTitle: "==labelTitle",
  //   opacity: 0.5,
  //   bgColor: "#FF0000",
  //   textColor: "#00FF00",
  //   labelSize: 15,
  // }];
  // const productItemList = [{
  //   quantity: 5,
  //   selectPrice: "Specific (e.g. $29)",
  //   discountPrice: 20,
  //   selectedVariants: ""
  // }, {
  //   quantity: 10,
  //   selectPrice: "Specific (e.g. $29)",
  //   discountPrice: 10,
  //   selectedVariants: ""
  // },];
  // const bundleUpsellData = [{
  //   bundleId: Math.random().toString(36).substr(2, 9),
  //   isOpen: "true",
  //   layoutOption: "layoutOption1",
  //   title: "Title",
  //   subtitle: "Subtitle",
  //   badgeText: "==badgeText",
  //   badgeStyle: "Simple",
  //   label: "==label",
  //   isSelectedByDefault: "true",
  //   isShowAsSoldOut: "true",
  //   isShowQuantitySelector: "true",
  //   productCounts: 5,
  //   selectPrice: "Specific (e.g. $29)",
  //   discountPrice: 10,
  //   labelTitle: "==labelTitle",
  //   opacity: 0.5,
  //   bgColor: "#ffffff",
  //   textColor: "#000000",
  //   labelSize: 15,
  //   productItems: productItemList,
  //   upsellItems: upsellItemList,
  //   upsellItemsToDeleteIds: [],
  //   productItemsToDeleteIds: []
  // }];

  // Send data to action
  const submit = useSubmit();

  function formDataToObject(fd) {
    return Object.fromEntries(fd.entries());
  }

  async function saveData() {
    const countdownTimerFormData = new FormData();
    Object.entries(countdownTimerData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        countdownTimerFormData.append(key, JSON.stringify(value));
      }
      else {
        countdownTimerFormData.append(key, value as string);
      }
    });

    const generalVolumeFormData = new FormData();
    Object.entries(generalVolumeData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        generalVolumeFormData.append(key, JSON.stringify(value));
      }
      else {
        generalVolumeFormData.append(key, value as string);
      }
    });
    //Save Sticky add to cart data
    const generalStickyAddFormData = new FormData();
    Object.entries(generalStickyAddData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        generalStickyAddFormData.append(key, JSON.stringify(value));
      }
      else {
        generalStickyAddFormData.append(key, value as string);
      }
    });
    //Save General setting data
    const generalSettingFormData = new FormData();
    Object.entries(generalSettingData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        generalSettingFormData.append(key, JSON.stringify(value));
      }
      else {
        generalSettingFormData.append(key, value as string);
      }
    });
    //Save Checkbox upsell data
    const checkboxUpsellFormData = new FormData();
    checkboxUpsellFormData.append("id", checkboxUpsellConf.id);
    checkboxUpsellFormData.append("bundleId", checkboxUpsellConf.bundleId);
    checkboxUpsellFormData.append("upsellData", JSON.stringify(checkboxUpsellData));
    //Save General style setting data
    const generalStyleFormData = new FormData();
    generalStyleFormData.append("id", GeneralStyleConf.id);
    generalStyleFormData.append("bundleId", GeneralStyleConf.bundleId);
    generalStyleFormData.append("cornerRadius", cornerRadius);
    generalStyleFormData.append("spacing", spacing);
    generalStyleFormData.append("cardsBgColor", cardsBgColor);
    generalStyleFormData.append("selectedBgColor", selectedBgColor);
    generalStyleFormData.append("borderColor", borderColor);
    generalStyleFormData.append("blockTitleColor", blockTitleColor);
    generalStyleFormData.append("barTitleColor", barTitleColor);
    generalStyleFormData.append("barSubTitleColor", barSubTitleColor);
    generalStyleFormData.append("barPriceColor", barPriceColor);
    generalStyleFormData.append("barFullPriceColor", barFullPriceColor);
    generalStyleFormData.append("barLabelBackColor", barLabelBack);
    generalStyleFormData.append("barLabelTextColor", barLabelTextColor);
    generalStyleFormData.append("barBadgebackColor", barBadgebackColor);
    generalStyleFormData.append("barBadgeTextColor", barBadgeTextColor);
    generalStyleFormData.append("barUpsellBackColor", barUpsellBackColor);
    generalStyleFormData.append("barUpsellTextColor", barUpsellTextColor);
    generalStyleFormData.append("barUpselSelectedBackColor", barUpsellSelectedBackColor);
    generalStyleFormData.append("barUpsellSelectedTextColor", barUpsellSelectedTextColor);
    generalStyleFormData.append("barBlocktitle", barBlocktitle);
    generalStyleFormData.append("barBlocktitleFontStyle", barBlocktitleFontStyle);
    generalStyleFormData.append("bartitleSize", bartitleSize);
    generalStyleFormData.append("bartitleFontStyle", bartitleFontStyle);
    generalStyleFormData.append("subTitleSize", subTitleSize);
    generalStyleFormData.append("subTitleStyle", subTitleStyle);
    generalStyleFormData.append("labelSize", labelSize);
    generalStyleFormData.append("labelStyle", labelStyle);
    generalStyleFormData.append("upsellSize", upsellSize);
    generalStyleFormData.append("upsellStyle", upsellStyle);
    generalStyleFormData.append("unitLabelSize", unitLabelSize);
    generalStyleFormData.append("unitLabelStyle", unitLabelStyle);
    generalStyleFormData.append("createdAt", GeneralStyleConf.createdAt);
    // Create discount automatic app 
    const functionId = shopifyFunctions.find((f) => f.title === "bundle-discount").id;
    const discountFormData = new FormData();
    const discountName = generalSettingData.discountName;
    const startsAt = new Date(`${generalSettingData.startDate}T${generalSettingData.startTime}`).toISOString();
    const endsAt = generalSettingData.setEndDate ? new Date(`${generalSettingData.endDate}T${generalSettingData.endTime}`).toISOString() : "";
    discountFormData.append("discountName", discountName);
    discountFormData.append("functionId", functionId);
    discountFormData.append("startsAt", startsAt);
    discountFormData.append("endsAt", endsAt);

    const fd = new FormData();
    fd.append("countdownTimer", JSON.stringify(formDataToObject(countdownTimerFormData)));
    fd.append("volumeDiscount", JSON.stringify(formDataToObject(generalVolumeFormData)));
    fd.append("stickyAdd", JSON.stringify(formDataToObject(generalStickyAddFormData)));
    fd.append("checkboxUpsell", JSON.stringify(formDataToObject(checkboxUpsellFormData)));
    fd.append("generalSetting", JSON.stringify(formDataToObject(generalSettingFormData)));
    fd.append("generalStyle", JSON.stringify(formDataToObject(generalStyleFormData)));
    fd.append("discountData", JSON.stringify(formDataToObject(discountFormData)));
    //Save quantityBreak data
    fd.append("quantityBreak", JSON.stringify(quantityBreakData));
    // Save buyXGetY data
    fd.append("buyXGetY", JSON.stringify(buyXGetYData));
    // Save bundleUpsell data
    fd.append("bundleUpsell", JSON.stringify(bundleUpsellData));
    submit(fd, { method: "post" });
  }
  /***************Database Migration Part************/
  const [quantityBreakData, setQuantityBreakData] = useState(loaderData.quantityBreakConf ?? []);
  const [buyXGetYData, setBuyXGetYData] = useState(loaderData.buyXGetYConf ?? []);
  const [bundleUpsellData, setBundleUpsellData] = useState(loaderData.bundleUpsellConf ?? []);

  const [selectedId, setSelectedId] = useState(null);
  // const [quantityBreaks, setQuantityBreaks] = useState<QuantityBreak[]>(quantityBreakConf);
  // const [buyXGetYs, setBuyXGetYs] = useState<BoxQuantity[]>([]);
  const [bundleUpsells, setBundleUpsells] = useState<BoxQuantity[]>([]);

  // right layout add upsell and delete upsell
  const addQuantityBreak = () => [
    setQuantityBreakData(prev => [...prev, createNewQuantityBreak()])
  ];
  const deleteQuantityBreak = (id: any) => {
    setQuantityBreakData(prev => prev.filter(item => item.id !== id));
  }
  const addBuyXGetY = () => [
    setBuyXGetYData(prev => [...prev, createNewBuyXGetY()])
  ];
  const deleteBuyXGetY = (id: any) => {
    setBuyXGetYData(prev => prev.filter(item => item.id !== id));
  }
  const addBundleUpsell = () => [
    setBundleUpsellData(prev => [...prev, createNewBundleUpsell()])
  ];
  const deleteBundleUpsell = (id: any) => {
    setBundleUpsellData(prev => prev.filter(item => item.id !== id))
  }
  ///////////////////////////////////////////////////////////////// quantity break////////////////////////////////////////////////
  const [openPanel, setOpenPanel] = useState(null);
  const [upsells, setUpsells] = useState<{ [barId: string]: any[] }>({});
  const [products, setProducts] = useState<{ [bundleId: string]: any[] }>({});
  const [selectedProduct, setSelectedProduct] = useState(loaderData.selectedProduct);
  const [selectedCountry, setSelectedCountry] = useState(loaderData.selectedCountry);
  const [showOriginal, setShowOriginal] = useState(true)
  const [badgeSelected, setBadgeSelected] = useState({});
  // const [addUpsells, setAddUpsells] = useState<Record<number, Record<number, AddUpsellData>>>({});
  const [addProducts, setAddProducts] = useState<Record<number, Record<number, AddUpsellData>>>({});

  // const handleDataAddUpsellChange = useCallback(
  //   (id: number, bundleId: number, updated: AddUpsellData) => {
  //     setAddUpsells(prev => ({
  //       ...prev,
  //       [bundleId]: {
  //         ...(prev[bundleId] ?? {}),
  //         [id]: {
  //           ...(prev[bundleId]?.[id] ?? {}),
  //           ...updated,
  //         },
  //       },
  //     }));

  //   },
  //   [setAddUpsells],
  // );
  // useEffect(() => {
  //   Object.keys(addUpsells).forEach((itemId) => {
  //     console.log('addUpsells for item:', itemId, addUpsells[itemId]);
  //   });
  // }, [addUpsells]);

  const handleQbDataObj = useCallback((id, updated) => {
    setQuantityBreakData(prev => {
      // CASE 1: child removed → updated === null
      if (updated === null) {
        return prev.filter(item => item.id !== id);
      }
      // const exists = prev.findIndex(item => item.id === id);
      // CASE 2: update existing
      const found = prev.some(item => item.id === id);
      if (found) {
        return prev.map(item =>
          item.id === id ? { ...item, ...updated } : item
        );
      }
      // CASE 3: add new
      return [...prev, updated];
    });
  }, []);
  //////////////////////////////////////////////////////////////////////////////buy x,get y free
  const [defaultBasePrice, setDefaultBasePrice] = useState({});
  const [xyDataObj, setXyDataObj] = useState({});

  const handleXyDataObj = useCallback((id, updated) => {
    setBuyXGetYData(prev => {
      // CASE 1: child removed → updated === null
      if (updated === null) {
        return prev.filter(item => item.id !== id);
      }
      const exists = prev.findIndex(item => item.id === id);
      // CASE 2: update existing
      if (exists !== -1) {
        const copy = [...prev];
        copy[exists] = { ...copy[exists], ...updated };
        return copy;
      }
      // CASE 3: add new
      return [...prev, { id, ...updated }];
    });
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////////// bundleUpsell 

  //Bundle Upsell
  const [buDataObj, setBuDataObj] = useState({});
  type buData = any;
  const handleBuDataObj = useCallback(
    (id, updated) => {
      setBundleUpsellData(prev => {
        // CASE 1: child removed → updated === null
        if (updated === null) {
          return prev.filter(item => item.id !== id);
        }
        const exists = prev.findIndex(item => item.id === id);
        // CASE 2: update existing
        if (exists !== -1) {
          const copy = [...prev];
          copy[exists] = { ...copy[exists], ...updated };
          return copy;
        }
        // CASE 3: add new
        return [...prev, { id, ...updated }];
      });
    }, []);
  useEffect(() => {
    console.log('bundleUpsellData ==>', bundleUpsellData);
  }, [bundleUpsellData]);

  type AddProductData = any;
  const handleDataAddProductChange = useCallback(
    (id: number, barId: number, updated: AddProductData) => {
      setAddProducts(prev => ({
        ...prev,
        [barId]: {
          ...(prev[barId] ?? {}),
          [id]: {
            ...(prev[barId]?.[id] ?? {}),
            ...updated,
          },
        },
      }));
      console.log("product>>>", products);
    },
    [setAddProducts],
  );

  useEffect(() => {
    Object.keys(addProducts).forEach((itemId) => {
      console.log('addProducts for item:', itemId, addProducts[itemId]);
    });
  }, [addProducts]);
  /////////////////////////////////////////////////////////////////////////



  /// set layout
  const layoutStyleOptions = [
    { id: "layout1", src: bundleVertical },
    { id: "layout2", src: bundleHorizon },
  ];
  const [layoutSelectedStyle, setLayoutSelectedStyle] = useState("layout1");
  // bundleupsell set layout
  const styleOptions = [
    { id: "layout1", src: bundleHorizon },
    { id: "layout2", src: bundleVertical },
  ];
  const [selectedStyle, setSelectedStyle] = useState("layout1");

  // right layout add upsell and delete Upsell
  const handelonAddUpsellChange = (barId: string | number, item: any) => {
    setUpsells(prev => ({
      ...prev,
      [barId]: [...(prev[barId] || []), item]
    }));

  };
  const handleonDeleteUpsellChange = (barId: string | number, upsellId: any) => {
    setUpsells(prev => ({
      ...prev,
      [barId]: (prev[barId] || []).filter(item => item.id !== upsellId)
    }));
  };
  //add and delete bundleUpsell
  const hanldeonAddProductChange = (barId: string | number, item: any) => {
    setProducts(prev => ({
      ...prev,
      [barId]: [...(prev[barId] || []), item]
    }));
  };

  const handleonDeleteProductChange = (bundleId: string | number, productId: any) => {
    setProducts(prev => ({
      ...prev,
      [bundleId]: (prev[bundleId] || []).filter(item => item.id !== productId)
    }));
  };


  // color style and text style
  const GeneralStyleConf = loaderData.generalStyleConf;
  const [cornerRadius, setCornerRadius] = useState(GeneralStyleConf.cornerRadius ?? null);
  const [spacing, setSpacing] = useState(GeneralStyleConf?.spacing ?? null);
  const [cardsBgColor, setCardsBgColor] = useState(GeneralStyleConf?.cardsBgColor) ?? null;
  const [selectedBgColor, setSelectedBgColor] = useState(GeneralStyleConf?.selectedBgColor) ?? null;
  const [borderColor, setBorderColor] = useState(GeneralStyleConf?.borderColor) ?? null;
  const [blockTitleColor, setBlockTitleColor] = useState(GeneralStyleConf?.blockTitleColor) ?? null;
  const [barTitleColor, setBarTitleColor] = useState(GeneralStyleConf?.barTitleColor) ?? null;
  const [barSubTitleColor, setBarSubTitleColor] = useState(GeneralStyleConf?.barSubTitleColor) ?? null;
  const [barPriceColor, setBarPriceColor] = useState(GeneralStyleConf?.barPriceColor) ?? null;
  const [barFullPriceColor, setBarFullPriceColor] = useState(GeneralStyleConf?.barFullPriceColor) ?? null;
  const [barLabelBack, setBarLabelBack] = useState(GeneralStyleConf?.barFullPriceColor) ?? null;
  const [barLabelTextColor, setBarLabelTextColor] = useState(GeneralStyleConf?.barLabelTextColor) ?? null;
  const [barBadgebackColor, setBarBadgebackColor] = useState(GeneralStyleConf?.barBadgebackColor) ?? null;
  const [barBadgeTextColor, setBarBadgeTextColor] = useState(GeneralStyleConf?.barBadgeTextColor) ?? null;
  const [barUpsellBackColor, setBarUpsellBackColor] = useState(GeneralStyleConf?.barUpsellBackColor) ?? null;
  const [barUpsellTextColor, setBarUpsellTextColor] = useState(GeneralStyleConf?.barUpsellTextColor) ?? null;
  const [barUpsellSelectedBackColor, setBarUpsellSelectedBackColor] = useState(GeneralStyleConf?.barUpsellSelectedBackColor) ?? null;
  const [barUpsellSelectedTextColor, setBarUpsellSelectedTextColor] = useState(GeneralStyleConf?.barUpsellSelectedTextColor) ?? null;
  const [barBlocktitle, setBarBlocktitle] = useState(GeneralStyleConf?.barBlocktitle ?? null);
  const [barBlocktitleFontStyle, setBarBlocktitleFontStyle] = useState(GeneralStyleConf?.barBlocktitleFontStyle ?? null);
  const [bartitleSize, setBartitleSize] = useState(GeneralStyleConf?.bartitleSize ?? null);
  const [bartitleFontStyle, setBartitleFontStyle] = useState(GeneralStyleConf?.bartitleFontStyle ?? null);  //subtitle size
  const [subTitleSize, setSubTitleSize] = useState(GeneralStyleConf?.subTitleSize ?? null);
  const [subTitleStyle, setSubTitleStyle] = useState(GeneralStyleConf?.subTitleStyle ?? null);
  const [labelSize, setLabelSize] = useState(GeneralStyleConf?.labelSize ?? null);
  const [labelStyle, setLabelStyle] = useState(GeneralStyleConf?.labelStyle ?? null);  //
  const [upsellSize, setUpsellSizeChange] = useState(GeneralStyleConf?.upsellSize ?? null);  //
  const [upsellStyle, setUpsellStyleChange] = useState(GeneralStyleConf?.upsellStyle ?? null);  //
  const [unitLabelSize, setUnitLabelSizeChange] = useState(GeneralStyleConf?.unitLabelSize ?? null);  //
  const [unitLabelStyle, setUnitLabelStyleChange] = useState(GeneralStyleConf?.unitLabelStyle ?? null);  //

  const productOptions = [
    { label: "Gift Card", value: "Gift Card" },
    { label: "Product A", value: "Product A" },
    { label: "Product B", value: "Product B" },
  ];
  const countryOptions = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
  ];
  const styleHandlers = {
    upCornerRadiusChange: setCornerRadius,
    upSpacingChange: setSpacing,
    upCardsBgColorChange: setCardsBgColor,
    upSelectedBgColorChange: setSelectedBgColor,
    upBorderColorChange: setBorderColor,
    upBlockTitleColorChange: setBlockTitleColor,
    upBarTitleColorChange: setBarTitleColor,
    upBarSubTitleColorChange: setBarSubTitleColor,
    upBarPriceColorChange: setBarPriceColor,
    upBarFullPriceColorChange: setBarFullPriceColor,
    upBarlabelBackChange: setBarLabelBack,
    upBarlabelTextColorChange: setBarLabelTextColor,
    upBarBadgeBackColorChange: setBarBadgebackColor,
    upBarBadgeTextColorChange: setBarBadgeTextColor,
    upBarUpsellBackColorChange: setBarUpsellBackColor,
    upBarUpsellTextColorChange: setBarUpsellTextColor,
    upSelectedBackColorChange: setBarUpsellSelectedBackColor,
    upSelectedTextColorChange: setBarUpsellSelectedTextColor,
    //text
    upBlockTitleChange: setBarBlocktitle,
    upBlockTitleFontStyleChange: setBarBlocktitleFontStyle,
    upTitleChange: setBartitleSize,
    upTitleFontStyleChange: setBartitleFontStyle,
    upSubTitleChange: setSubTitleSize,
    upSubTitleStyleChange: setSubTitleStyle,
    upLabelChange: setLabelSize,
    upLabelStyleChange: setLabelStyle,
    upUpsellSizeChange: setUpsellSizeChange,
    upUpsellStyleChange: setUpsellStyleChange,
    upUnitLabelSizeChange: setUnitLabelSizeChange,
    upUnitLabelStyleChange: setUnitLabelStyleChange
  };

  return (
    <Page
      title="Carting Bundles"
      backAction={{ content: "Back", url: "/app" }}
      primaryAction={{
        content: "Save",
        onAction: saveData, /////////////
      }}
      secondaryActions={[
        {
          content: "Preview",
          onAction: () => console.log("Preview clicked"),
        },
      ]}
    >
      <Layout>
        <Box width="70%">
          {/* Left Panel - Settings with Tabs */}
          <InlineGrid columns={2} gap="400">
            <Layout.Section>
              <BlockStack gap="200">
                <GeneralSettingsPanel
                  open={openPanel === "settings"}
                  onToggle={() =>
                    setOpenPanel(openPanel === "settings" ? null : "settings")
                  }
                  onDataChange={handleGeneralSetting}
                />

                <GeneralStylePanel
                  open={openPanel === "style"}
                  onToggle={() =>
                    setOpenPanel(openPanel === "style" ? null : "style")
                  }
                  styleHandlers={styleHandlers}
                  layoutStyleOptions={layoutStyleOptions}
                  layoutSelectedStyle={layoutSelectedStyle}
                  onChangeLayoutStyle={setLayoutSelectedStyle}
                />

                <GeneralVolumePanel
                  open={openPanel === "volume"}
                  onToggle={() =>
                    setOpenPanel(openPanel === "volume" ? null : "volume")
                  }
                  onDataChange={handleGeneralVolumeChange}
                />

                <CountDownPanel
                  open={openPanel === "countDown"}
                  onToggle={() =>
                    setOpenPanel(openPanel === "countDown" ? null : "countDown")
                  }
                  onDataChange={handleCountdownTimerChange}
                />

                <GeneralCheckboxUpsell
                  open={openPanel === "checkBoxUpsell"}
                  onToggle={() =>
                    setOpenPanel(
                      openPanel === "checkBoxUpsell" ? null : "checkBoxUpsell",
                    )
                  }
                  onUpsellChange={handleCheckboxUpsellChange}
                />

                <GeneralStickyAddToCart
                  open={openPanel === "sticky"}
                  onToggle={() =>
                    setOpenPanel(openPanel === "sticky" ? null : "sticky")
                  }
                  onDataChange={handleGeneralStickyAddChange}
                />

                {quantityBreakData.map((item) => (
                  <GeneralQuantityBreack
                    key={item.id}
                    id={item.id}
                    barId={item.id}
                    open={openPanel === item.id}
                    itemData={item}
                    onToggle={() =>
                      setOpenPanel(openPanel === item.id ? null : item.id)
                    }
                    deleteSection={deleteQuantityBreak}
                    heading="Bar #1 - Single"
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                    onDataObjChange={handleQbDataObj}
                  // onDataAddUpsellChange={handleDataAddUpsellChange}
                  />
                ))}
                {buyXGetYData.map((item) => (
                  <GeneralBuyXgetYfree
                    key={item.id}
                    id={item.id}
                    barId={item.id}
                    open={openPanel === item.id}
                    itemData={item}
                    onToggle={() =>
                      setOpenPanel(openPanel === item.id ? null : item.id)
                    }
                    deleteSection={deleteBuyXGetY}
                    heading="Buy 3, get 1 free!"
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                    onDataObjChange={handleXyDataObj}
                  // onDataAddUpsellChange={handleDataAddUpsellChange}
                  />
                ))}

                {bundleUpsellData.map((item) => (
                  <GeneralBundleUpsell
                    key={item.id}
                    id={item.id}
                    barId={item.id}
                    open={openPanel === item.id}
                    onToggle={() =>
                      setOpenPanel(openPanel === item.id ? null : item.id)
                    }
                    deleteSection={deleteBundleUpsell}
                    heading="Complete the bundle"
                    itemData={item}
                    styleOptions={styleOptions}
                    selectedStyle={selectedStyle}
                    onAddUpsell={handelonAddUpsellChange}
                    onAddProduct={hanldeonAddProductChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                    onDeleteProducts={handleonDeleteProductChange}
                    onChangeStyle={setSelectedStyle}
                    onDataObjChange={handleBuDataObj}
                    // onDataAddUpsellChange={handleDataAddUpsellChange}
                    onDataAddProductItemChange={handleDataAddProductChange}
                  />
                ))}
                {showOriginal ? (
                  <div
                    style={{
                      border: "1px dashed black",
                      borderRadius: "10px",
                      padding: "15px",
                    }}
                  >
                    <Button
                      fullWidth
                      icon={PlusCircleIcon}
                      variant="primary"
                      onClick={() => setShowOriginal(false)}
                    >
                      Add bar
                    </Button>
                  </div>
                ) : (
                  <Card>
                    <InlineGrid columns={3} gap="200">
                      <Button icon={DiscountIcon} onClick={addQuantityBreak}>
                        Quantity break
                      </Button>
                      <Button icon={MegaphoneIcon} onClick={addBuyXGetY}>
                        Buy X, Get Y free
                      </Button>
                      <Button icon={ProductIcon} onClick={addBundleUpsell}>
                        Bundle upsell
                      </Button>
                    </InlineGrid>
                  </Card>
                )}
              </BlockStack>

            </Layout.Section>
            {/* Right Panel - Preview */}
            <Layout.Section >
              <div className="rightLayout">
                <Card>
                  <BlockStack gap="400">
                    {/* Preview Header */}
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="h2" variant="headingMd">
                        Preview 🔗
                      </Text>
                      <Button>Run A/B test</Button>
                    </InlineStack>
                    <Divider />
                    {/* Preview Selectors */}
                    <InlineStack gap="400">
                      <Box minWidth="48%">
                        <Select
                          label="Product previewing"
                          options={productOptions}
                          onChange={setSelectedProduct}
                          value={selectedProduct}
                        />
                      </Box>
                      <Box minWidth="48%">
                        <Select
                          label="Country previewing"
                          options={countryOptions}
                          onChange={setSelectedCountry}
                          value={selectedCountry}
                        />
                      </Box>
                    </InlineStack>
                    <Divider />
                    {/* Bundle Preview Card */}
                    <Box
                      padding="400"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <BlockStack gap="300">
                        <Text
                          as="p"
                          variant="bodyMd"
                          alignment="center"
                          fontWeight="bold"
                        >
                          <span
                            className="barHeading"
                            style={{
                              color: blockTitleColor,
                              fontSize: `${barBlocktitle}px`,
                              fontWeight: fontWeightMap[barBlocktitleFontStyle as keyof typeof fontWeightMap],
                              fontStyle: fontStyleMap[barBlocktitleFontStyle as keyof typeof fontWeightMap],
                            }}
                          >
                            BUNDLE & SAVE
                          </span>
                        </Text>
                        {/* Bundle Options */}
                        <div className="preview-main" style={{ flexDirection: layoutSelectedStyle === 'layout1' ? 'column' : 'row', overflow: layoutSelectedStyle === 'layout1' ? '' : 'auto' }} >

                          {/* { coundownTimerData right} */}
                          {countdownTimerData.showCountdownTimer && (
                            <div className="countdown-timer" style={{ background: countdownTimerData.msgBgColor, borderRadius: `${cornerRadius}px` }}>
                              <div
                                className="countdown-timer-container"
                                style={{
                                  textAlign:
                                    countdownTimerData.activeAlignmentButtonIndex === 0
                                      ? "left"
                                      : countdownTimerData.activeAlignmentButtonIndex === 1
                                        ? "center"
                                        : "right",
                                }}
                              >
                                <span style={{ color: countdownTimerData.msgTextColor, fontWeight: countdownTimerData.activeTextBoldButton ? "bold" : "normal", fontStyle: countdownTimerData.activeTextItalicButton ? "italic" : 'normal', fontSize: `${countdownTimerData.textFontSize}px` }}>
                                  {(countdownTimerData.textValue || "").split("{{timer}}").join(
                                    countdownTimerData.formatted ?? "--:--"
                                  )}{" "}
                                </span>
                              </div>
                            </div>
                          )}
                          {/* {add quantity Breaks} */}
                          {quantityBreakData.map((item) => {
                            const qbData = item;
                            const currentIsSelected = selectedId === item.id;

                            const qbCalc = qbData?.calc != null ? Number(qbData.calc) : 0;
                            const qbBase = qbData?.base != null ? Number(qbData.base) : 0;

                            return (
                              <div
                                key={item.id}
                                className="main-quantity-break"
                                onClick={() => setSelectedId(item.id)}
                              >
                                <Box position="relative">
                                  {(qbData?.badgeStyle || "") === "simple" && qbData?.badgeText && (
                                    <div className="bundle_bar_most_popular">
                                      <div
                                        className="bundle_bar_most_popular_content"
                                        style={{
                                          background: barBadgebackColor,
                                          color: barBadgebackColor,
                                        }}
                                      >
                                        <span style={{ color: barBadgeTextColor }}>
                                          {qbData?.badgeText || ""}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {(qbData?.badgeStyle || "") === "mostpopular" && (
                                    <div className="bundle_bar_most_popular_fancy">
                                      <MostPopularfancy
                                        barBadgeTextColor={barBadgeTextColor}
                                        barBadgebackColor={barBadgebackColor}
                                      />
                                    </div>
                                  )}
                                </Box>

                                <div
                                  className="main-section--container"
                                  style={{
                                    borderRadius: `${cornerRadius}px`,
                                    border: "2px solid",
                                    borderColor: currentIsSelected ? borderColor : cardsBgColor,
                                    boxShadow: currentIsSelected
                                      ? `inset 0 0 0 2px ${borderColor}, #000`
                                      : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                    backgroundColor: currentIsSelected ? selectedBgColor : cardsBgColor,
                                    height: layoutSelectedStyle === "layout2" ? "100%" : "",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: `${spacing * 0.5}px ${spacing}px`,
                                      backgroundColor: currentIsSelected ? selectedBgColor : cardsBgColor,
                                      display: "flex",
                                      borderRadius: `${cornerRadius}px`,
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      flexDirection: layoutSelectedStyle === "layout2" ? "column" : "row",
                                    }}
                                  >
                                    <InlineStack gap="200" blockAlign="center" align="center">
                                      {/* radio indicator */}
                                      <div
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "50%",
                                          border: "2px solid",
                                          borderColor: currentIsSelected ? borderColor : "grey",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor: currentIsSelected ? borderColor : "white",
                                          }}
                                        />
                                      </div>

                                      <BlockStack gap="050">
                                        <InlineStack gap="100">
                                          <span
                                            className="barTitle"
                                            style={{
                                              textAlign: "center",
                                              color: barTitleColor,
                                              fontSize: `${bartitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {qbData?.title || ""}
                                          </span>

                                          <div
                                            className="bar-label--text-container"
                                            style={{
                                              background: qbData?.barLabelText ? barLabelBack : null,
                                              borderRadius: `${cornerRadius}px`,
                                            }}
                                          >
                                            <span
                                              className="bar-label--text"
                                              style={{
                                                color: barLabelTextColor,
                                                fontSize: `${labelSize}px`,
                                                fontWeight:
                                                  fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                                fontStyle:
                                                  fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                              }}
                                            >
                                              {qbData?.labelTitle || ""}
                                            </span>
                                          </div>
                                        </InlineStack>

                                        <span
                                          className="barSubTitle"
                                          style={{
                                            color: barSubTitleColor,
                                            fontSize: `${subTitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                            fontStyle:
                                              fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                            textAlign: layoutSelectedStyle === "layout2" ? "center" : "",
                                          }}
                                        >
                                          {qbData?.subtitle || ""}
                                        </span>
                                      </BlockStack>
                                    </InlineStack>

                                    <div style={{ textAlign: "right" }}>
                                      <BlockStack gap="050">
                                        <div
                                          className="bar-price"
                                          style={{
                                            color: barPriceColor,
                                            fontSize: `${bartitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                            fontStyle:
                                              fontStyleMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                          }}
                                        >
                                          {qbData?.calc != null ? `$${qbCalc.toFixed(2)}` : ""}
                                        </div>

                                        {qbData?.base != null && (
                                          <div
                                            className="bar-fullPrice"
                                            style={{
                                              color: barFullPriceColor,
                                              fontSize: `${subTitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {qbBase !== qbCalc ? <s>${qbBase.toFixed(2)}</s> : ""}
                                          </div>
                                        )}
                                      </BlockStack>
                                    </div>
                                  </div>

                                  {/* Add Upsell */}
                                  <div className="bar-upsell-container-main">
                                    {item?.upsellItems?.map((upsell, index) => {
                                      const upsellData = upsell;
                                      console.log("upsellData++>", upsellData);
                                      const imageSize = upsellData?.imageSize || 40;
                                      const upsellCalc = upsellData?.calc != null ? Number(upsellData.calc) : 0;
                                      const upsellBase = upsellData?.base != null ? Number(upsellData.base) : 0;
                                      const isLastIndex = index === (item?.upsellItems?.length ?? 0) - 1;
                                      return (
                                        <div
                                          key={upsell.id}
                                          className="upsell-box"
                                          style={{
                                            background: barUpsellBackColor,
                                            borderBottomRightRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                            borderBottomLeftRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                          }}
                                        >
                                          <div className="bar-upsell-container">
                                            <div className="bar-upsell-checkbox-content">
                                              <Checkbox
                                                label=""
                                                checked={
                                                  upsellChecked[item.id]?.[upsell.id] || false
                                                }
                                                onChange={(value) =>
                                                  handleUpsellValueChange(item.id, upsell.id, value)
                                                }
                                              />
                                              <div
                                                className="bar-upsell-img"
                                                style={{
                                                  width: `${imageSize}px`,
                                                  height: `${imageSize}px`,
                                                }}
                                              >
                                                <Thumbnail
                                                  source={
                                                    upsellData?.selectedProduct?.[0]?.imageUrl || ""
                                                  }
                                                  alt=""
                                                />
                                              </div>
                                              <span style={{ color: barUpsellTextColor }}>
                                                {upsellData?.priceText ?? ""}
                                              </span>
                                            </div>

                                            <div className="bar-upsell-price">
                                              <div className="bar-upsell-discountprice">
                                                {upsellData?.calc != null
                                                  ? `$${upsellCalc.toFixed(2)}`
                                                  : ""}
                                              </div>

                                              {upsellData?.base != null && upsellBase !== upsellCalc && (
                                                <div className="bar-upsell-fullprice">
                                                  <s>${upsellBase.toFixed(2)}</s>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* {add buy x, get y free!} */}
                          {buyXGetYData.map((item) => {
                            const xyData = item;
                            console.log("xyData==>", xyData);

                            const currentIsSelected = selectedId === item.id;
                            const xyCalc = xyData?.calc != null ? Number(xyData.calc) : 0;
                            const xyBase = xyData?.base != null ? Number(xyData.base) : 0;

                            return (
                              <div
                                key={item.id}
                                className="main-buyX-getY"
                                onClick={() => setSelectedId(item.id)}
                              >
                                <Box position="relative">
                                  {/* simple badge */}
                                  {(xyData?.badgeStyle || "") === "simple" && xyData?.badgeText && (
                                    <div className="bundle_bar_most_popular">
                                      <div
                                        className="bundle_bar_most_popular_content"
                                        style={{
                                          background: barBadgebackColor,
                                          color: barBadgebackColor,
                                        }}
                                      >
                                        <span style={{ color: barBadgeTextColor }}>
                                          {xyData?.badgeText || ""}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* fancy badge */}
                                  {(xyData?.badgeStyle || "") === "mostpopular" && (
                                    <div className="bundle_bar_most_popular_fancy">
                                      <MostPopularfancy
                                        barBadgeTextColor={barBadgeTextColor}
                                        barBadgebackColor={barBadgebackColor}
                                      />
                                    </div>
                                  )}
                                </Box>

                                <div
                                  className="main-section--container"
                                  style={{
                                    borderRadius: `${cornerRadius}px`,
                                    border: "2px solid",
                                    borderColor: currentIsSelected ? borderColor : cardsBgColor,
                                    boxShadow: currentIsSelected
                                      ? `inset 0 0 0 2px ${borderColor}, #000`
                                      : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                    paddingTop: badgeSelected[item.id]
                                      ? `${spacing * 0.5 + 10}px`
                                      : `${spacing * 0.5}px`,
                                    backgroundColor: currentIsSelected ? selectedBgColor : cardsBgColor,
                                    height: layoutSelectedStyle === "layout2" ? "100%" : "",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: `${spacing * 0.5}px ${spacing}px`,
                                      backgroundColor: currentIsSelected ? selectedBgColor : cardsBgColor,
                                      display: "flex",
                                      borderRadius: `${cornerRadius}px`,
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      flexDirection: layoutSelectedStyle === "layout2" ? "column" : "row",
                                    }}
                                  >
                                    <InlineStack gap="200" blockAlign="center" align="center">
                                      {/* radio dot */}
                                      <div
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "50%",
                                          border: "2px solid",
                                          borderColor: currentIsSelected ? borderColor : "grey",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor: currentIsSelected ? borderColor : "white",
                                          }}
                                        />
                                      </div>

                                      <BlockStack gap="050">
                                        <InlineStack gap="100">
                                          <span
                                            className="barTitle"
                                            style={{
                                              textAlign: "center",
                                              color: barTitleColor,
                                              fontSize: `${bartitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {xyData?.title || "Buy 3, Get 1 Free!"}
                                          </span>

                                          <div
                                            className="bar-label--text-container"
                                            style={{
                                              background: xyData?.labelText ? barLabelBack : null,
                                              borderRadius: `${cornerRadius}px`,
                                            }}
                                          >
                                            <span
                                              className="bar-label--text"
                                              style={{
                                                color: barLabelTextColor,
                                                fontSize: `${labelSize}px`,
                                                fontWeight:
                                                  fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                                fontStyle:
                                                  fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                              }}
                                            >
                                              {xyData?.labelText || ""}
                                            </span>
                                          </div>
                                        </InlineStack>

                                        <span
                                          className="barSubTitle"
                                          style={{
                                            color: barSubTitleColor,
                                            fontSize: `${subTitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                            fontStyle:
                                              fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                          }}
                                        >
                                          {xyData?.subtitle || ""}
                                        </span>
                                      </BlockStack>
                                    </InlineStack>

                                    <div style={{ textAlign: "right" }}>
                                      <BlockStack gap="050">
                                        <div
                                          className="bar-price"
                                          style={{
                                            color: barPriceColor,
                                            fontSize: `${bartitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                            fontStyle:
                                              fontStyleMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                          }}
                                        >
                                          {xyData?.calc != null ? `$${xyCalc.toFixed(2)}` : ""}
                                        </div>

                                        {xyData?.base != null && (
                                          <div
                                            className="bar-fullPrice"
                                            style={{
                                              color: barFullPriceColor,
                                              fontSize: `${subTitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {xyBase !== xyCalc ? <s>${xyBase.toFixed(2)}</s> : ""}
                                          </div>
                                        )}
                                      </BlockStack>
                                    </div>
                                  </div>

                                  {/* Add Upsell */}
                                  <div className="bar-upsell-container-main">
                                    {item?.upsellItems?.map((upsell, index) => {
                                      const upsellData = upsell;
                                      console.log("upsellData++>", upsellData);
                                      const imageSize = upsellData?.imageSize || 40;
                                      const upsellCalc = upsellData?.calc != null ? Number(upsellData.calc) : 0;
                                      const upsellBase = upsellData?.base != null ? Number(upsellData.base) : 0;
                                      const isLastIndex = index === (item?.upsellItems?.length ?? 0) - 1;
                                      return (
                                        <div
                                          key={upsell.id}
                                          className="upsell-box"
                                          style={{
                                            background: barUpsellBackColor,
                                            borderBottomRightRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                            borderBottomLeftRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                          }}
                                        >
                                          <div className="bar-upsell-container">
                                            <div className="bar-upsell-checkbox-content">
                                              <Checkbox
                                                label=""
                                                checked={
                                                  upsellChecked[item.id]?.[upsell.id] || false
                                                }
                                                onChange={(value) =>
                                                  handleUpsellValueChange(item.id, upsell.id, value)
                                                }
                                              />
                                              <div
                                                className="bar-upsell-img"
                                                style={{
                                                  width: `${imageSize}px`,
                                                  height: `${imageSize}px`,
                                                }}
                                              >
                                                <Thumbnail
                                                  source={
                                                    upsellData?.selectedProduct?.[0]?.imageUrl || ""
                                                  }
                                                  alt=""
                                                />
                                              </div>
                                              <span style={{ color: barUpsellTextColor }}>
                                                {upsellData?.priceText ?? ""}
                                              </span>
                                            </div>

                                            <div className="bar-upsell-price">
                                              <div className="bar-upsell-discountprice">
                                                {upsellData?.calc != null
                                                  ? `$${upsellCalc.toFixed(2)}`
                                                  : ""}
                                              </div>

                                              {upsellData?.base != null && upsellBase !== upsellCalc && (
                                                <div className="bar-upsell-fullprice">
                                                  <s>${upsellBase.toFixed(2)}</s>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* {main bundle Upsell} */}
                          {bundleUpsellData.map((item) => {
                            const buData = item;
                            console.log('buData==>', buData);
                            const bundleProducts = item?.productItems ?? []; // use the whole array
                            const getBundleUpsellTotalPrice = () => {
                              return bundleProducts
                                .reduce((sum, product) => {
                                  const value = Number(product?.calc ?? 0); // sum each product's calc
                                  return sum + value;
                                }, 0)
                                .toFixed(2);
                            };

                            const getBaseBundleUpsellTotalPrice = () => {
                              const total = bundleProducts.reduce((sum, product) => {
                                const value = Number(product?.base ?? 0); // sum each product's calc
                                return sum + value;
                              }, 0);
                              return total.toFixed(2);
                            };

                            return (
                              <div
                                key={item.id}
                                className="main-bundle-upsell"
                                onClick={() => setSelectedId(item.id)}
                              >
                                <Box position="relative">
                                  {/* simple badge */}
                                  {(buData?.badgeStyle || "") === "simple" && buData?.badgeText && (
                                    <div className="bundle_bar_most_popular">
                                      <div
                                        className="bundle_bar_most_popular_content"
                                        style={{
                                          background: barBadgebackColor,
                                          color: barBadgebackColor,
                                        }}
                                      >
                                        <span style={{ color: barBadgeTextColor }}>
                                          {buData?.badgeText}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* fancy badge */}
                                  {(buData?.badgeStyle || "") === "mostpopular" && (
                                    <div className="bundle_bar_most_popular_fancy">
                                      <MostPopularfancy
                                        barBadgeTextColor={barBadgeTextColor}
                                        barBadgebackColor={barBadgebackColor}
                                      />
                                    </div>
                                  )}
                                </Box>

                                <div
                                  className="main-section--container"
                                  style={{
                                    borderRadius: `${cornerRadius}px`,
                                    border: "2px solid",
                                    borderColor: selectedId === item.id ? borderColor : cardsBgColor,
                                    boxShadow:
                                      selectedId === item.id
                                        ? `inset 0 0 0 2px ${borderColor}, #000`
                                        : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                    paddingTop: badgeSelected[item.id]
                                      ? `${spacing * 0.5 + 10}px`
                                      : `${spacing * 0.5}px`,
                                    backgroundColor:
                                      selectedId === item.id ? selectedBgColor : cardsBgColor,
                                    height: layoutSelectedStyle === "layout2" ? "100%" : "",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: `${spacing * 0.5}px ${spacing}px`,
                                      backgroundColor:
                                        selectedId === item.id ? selectedBgColor : cardsBgColor,
                                      display: "flex",
                                      borderRadius: `${cornerRadius}px`,
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      flexDirection:
                                        layoutSelectedStyle === "layout2" ? "column" : "row",
                                    }}
                                  >
                                    <InlineStack gap="200" blockAlign="center" align="center">
                                      {/* radio indicator */}
                                      <div
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "50%",
                                          border: "2px solid",
                                          borderColor: selectedId === item.id ? borderColor : "grey",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor:
                                              selectedId === item.id ? borderColor : "white",
                                          }}
                                        />
                                      </div>

                                      <BlockStack gap="050">
                                        <InlineStack gap="100">
                                          <span
                                            className="barTitle"
                                            style={{
                                              textAlign: "center",
                                              color: barTitleColor,
                                              fontSize: `${bartitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                bartitleFontStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {buData?.title || "Complete the bundle"}
                                          </span>
                                          <div
                                            className="bar-label--text-container"
                                            style={{
                                              background: buData?.labelText ? barLabelBack : null,
                                              borderRadius: `${cornerRadius}px`,
                                            }}
                                          >
                                            <span
                                              className="bar-label--text"
                                              style={{
                                                color: barLabelTextColor,
                                                fontSize: `${labelSize}px`,
                                                fontWeight:
                                                  fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                                fontStyle:
                                                  fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                              }}
                                            >
                                              {buData?.labelText}
                                            </span>
                                          </div>
                                        </InlineStack>

                                        <span
                                          className="barSubTitle"
                                          style={{
                                            color: barSubTitleColor,
                                            fontSize: `${subTitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                            fontStyle:
                                              fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                          }}
                                        >
                                          {buData?.subtitle || "Save $180.49!"}
                                        </span>
                                      </BlockStack>
                                    </InlineStack>

                                    <div style={{ textAlign: "right" }}>
                                      <BlockStack gap="050">
                                        <div
                                          className="bar-price"
                                          style={{
                                            color: barPriceColor,
                                            fontSize: `${bartitleSize}px`,
                                            fontWeight:
                                              fontWeightMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                            fontStyle:
                                              fontStyleMap[
                                              bartitleFontStyle as keyof typeof fontWeightMap
                                              ],
                                          }}
                                        >
                                          ${getBundleUpsellTotalPrice()}
                                        </div>

                                        {defaultBasePrice && (
                                          <div
                                            className="bar-fullPrice"
                                            style={{
                                              color: barFullPriceColor,
                                              fontSize: `${subTitleSize}px`,
                                              fontWeight:
                                                fontWeightMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                              fontStyle:
                                                fontStyleMap[
                                                subTitleStyle as keyof typeof fontWeightMap
                                                ],
                                            }}
                                          >
                                            {parseFloat(getBaseBundleUpsellTotalPrice()) !==
                                              parseFloat(getBundleUpsellTotalPrice() || "0") ? (
                                              <s>${getBaseBundleUpsellTotalPrice()}</s>
                                            ) : null}
                                          </div>
                                        )}
                                      </BlockStack>
                                    </div>
                                  </div>

                                  {/* Products in bundle */}
                                  <div
                                    className="main_bundles-products--container"
                                    style={{
                                      flexDirection:
                                        selectedStyle === "layout1" ? "row" : "column",
                                      borderColor: bundleProducts.length > 0 ? borderColor : null,
                                      border: bundleProducts.length > 0 ? '1px solid' : '',
                                      borderRadius: cornerRadius,
                                    }}
                                  >
                                    {item?.productItems?.map((product) => {
                                      const productData = product;
                                      const title = product?.selectedProduct?.[0]?.title ?? '';
                                      const imageSource = product?.selectedProduct?.[0]?.imageUrl ?? NoteIcon;

                                      return (
                                        <div
                                          key={product.id}
                                          className="bundles-products"
                                          style={{
                                            flexDirection:
                                              selectedStyle === "layout1" ? "row" : "column",
                                          }}
                                        >
                                          <div
                                            className="bundles-products__divider"
                                            style={{
                                              flexDirection:
                                                selectedStyle === "layout1" ? "column" : "row",
                                            }}
                                          >
                                            <div
                                              className="products__divider-inline"
                                              style={{
                                                width:
                                                  selectedStyle === "layout1" ? "1px" : "100%",
                                                height:
                                                  selectedStyle === "layout1" ? "100%" : "1px",
                                                background: borderColor,
                                              }}
                                            />
                                            <div className="products__divider-icon">
                                              <svg
                                                width="20"
                                                height="20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle cx="10" cy="10" r="10" fill="currentColor" />
                                                <path fill="#fff" d="M5 9h10v2H5z" />
                                                <path fill="#fff" d="M11 5v10H9V5z" />
                                              </svg>
                                            </div>
                                            <div
                                              className="products__divider-inline"
                                              style={{
                                                background: borderColor,
                                                width:
                                                  selectedStyle === "layout1" ? "1px" : "100%",
                                                height:
                                                  selectedStyle === "layout1" ? "100%" : "1px",
                                              }}
                                            />
                                          </div>

                                          <div
                                            className="bundles-products__product"
                                            style={{
                                              flexDirection:
                                                selectedStyle === "layout1" ? "column" : "row",
                                              justifyContent:
                                                selectedStyle === "layout1"
                                                  ? "center"
                                                  : "space-between",
                                              padding:
                                                selectedStyle === "layout1"
                                                  ? "10px 0"
                                                  : "0 10px",
                                            }}
                                          >
                                            <div className="bundles-products__product--image">
                                              <Thumbnail source={imageSource} alt="" />
                                            </div>

                                            <div className="bundles-products__product--title">
                                              {title}
                                            </div>

                                            <div className="bundles-products__product--price">
                                              {productData?.calc ? (
                                                <span className="selected-price-tag">
                                                  ${Number(productData.calc).toFixed(2)}
                                                </span>
                                              ) : (
                                                <div className="selected-price-tags">
                                                  <span className="selected-price-tag">
                                                    {productData?.base
                                                      ? Number(productData.base).toFixed(2)
                                                      : "Selected Product"}
                                                  </span>
                                                  {productData?.base &&
                                                    Number(productData.base) !==
                                                    Number(productData.calc) && (
                                                      <span className="selected-price-tag">
                                                        <s>
                                                          $
                                                          {Number(
                                                            productData.base,
                                                          ).toFixed(2)}
                                                        </s>
                                                      </span>
                                                    )}
                                                </div>
                                              )}

                                              {Array.isArray(product.variants) &&
                                                product.variants.length > 2 && (
                                                  <select
                                                    className="variant-dropdown"
                                                    onChange={(e) =>
                                                      handlePriceVariantChange(
                                                        item.id,
                                                        product.id,
                                                        e.target.value,
                                                      )
                                                    }
                                                  >
                                                    {product.variants.map((v, i) => (
                                                      <option key={i} value={v.price}>
                                                        ${v.price}
                                                      </option>
                                                    ))}
                                                  </select>
                                                )}

                                              {productData?.base && (
                                                <s className="bundles-produts_product--price-compareprice">
                                                  ${Number(productData.base).toFixed(2)}
                                                </s>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Add Upsell */}
                                  <div className="bar-upsell-container-main">
                                    {item?.upsellItems?.map((upsell, index) => {
                                      const upsellData = upsell;
                                      console.log("upsellData++>", upsellData);
                                      const imageSize = upsellData?.imageSize || 40;
                                      const upsellCalc = upsellData?.calc != null ? Number(upsellData.calc) : 0;
                                      const upsellBase = upsellData?.base != null ? Number(upsellData.base) : 0;
                                      const isLastIndex = index === (item?.upsellItems?.length ?? 0) - 1;
                                      return (
                                        <div
                                          key={upsell.id}
                                          className="upsell-box"
                                          style={{
                                            background: barUpsellBackColor,
                                            borderBottomRightRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                            borderBottomLeftRadius:
                                              isLastIndex
                                                ? cornerRadius
                                                : "",
                                          }}
                                        >
                                          <div className="bar-upsell-container">
                                            <div className="bar-upsell-checkbox-content">
                                              <Checkbox
                                                label=""
                                                checked={
                                                  upsellChecked[item.id]?.[upsell.id] || false
                                                }
                                                onChange={(value) =>
                                                  handleUpsellValueChange(item.id, upsell.id, value)
                                                }
                                              />
                                              <div
                                                className="bar-upsell-img"
                                                style={{
                                                  width: `${imageSize}px`,
                                                  height: `${imageSize}px`,
                                                }}
                                              >
                                                <Thumbnail
                                                  source={
                                                    upsellData?.selectedProduct?.[0]?.imageUrl || ""
                                                  }
                                                  alt=""
                                                />
                                              </div>
                                              <span style={{ color: barUpsellTextColor }}>
                                                {upsellData?.priceText ?? ""}
                                              </span>
                                            </div>

                                            <div className="bar-upsell-price">
                                              <div className="bar-upsell-discountprice">
                                                {upsellData?.calc != null
                                                  ? `$${upsellCalc.toFixed(2)}`
                                                  : ""}
                                              </div>

                                              {upsellData?.base != null && upsellBase !== upsellCalc && (
                                                <div className="bar-upsell-fullprice">
                                                  <s>${upsellBase.toFixed(2)}</s>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        </div>
                      </BlockStack>
                    </Box>
                    <Divider />
                    {/* Cart Drawer Preview */}
                    <BlockStack gap="300">
                      <Text as="h3" variant="headingSm">
                        Cart Drawer Preview
                      </Text>
                      <Card background="bg-surface-secondary">
                        <BlockStack gap="300">
                          {/* Timer and Progress Bar */}
                          <Box
                            padding="300"
                            background="bg-surface"
                            borderRadius="100"
                          >
                            <BlockStack gap="200">
                              <Text as="span" variant="bodySm" alignment="center">
                                Your cart will expire in{" "}
                                <Text as="span" fontWeight="bold" tone="critical">
                                  09:59 ⏰
                                </Text>
                              </Text>

                              <Text
                                as="p"
                                variant="bodySm"
                                alignment="center"
                                tone="subdued"
                              >
                                Free shipping unlocked! Add $12.00 to unlock 10%
                                discount!
                              </Text>

                              {/* Progress indicators */}
                              <InlineStack gap="200" align="center">
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "#10b981",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    height: "4px",
                                    background: "#10b981",
                                    borderRadius: "2px",
                                  }}
                                />
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "#e5e5e5",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                  }}
                                >
                                  📦
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    height: "4px",
                                    background: "#e5e5e5",
                                    borderRadius: "2px",
                                  }}
                                />
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "#e5e5e5",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                  }}
                                >
                                  🎁
                                </div>
                              </InlineStack>

                              <InlineStack gap="300" align="center" wrap={false}>
                                <Badge tone="success">Free shipping</Badge>
                                <Badge>10% discount</Badge>
                                <Badge>Free gift</Badge>
                              </InlineStack>
                            </BlockStack>
                          </Box>

                          {/* Upsell Products */}
                          <Box
                            padding="300"
                            background="bg-surface"
                            borderRadius="100"
                          >
                          </Box>
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </div>
            </Layout.Section>
          </InlineGrid>
        </Box>
        {
          toastActive && (
            <Frame>
              <Toast
                content={toastContent}
                onDismiss={handleToastDismiss}
                error={toastError}
              />
            </Frame>
          )
        }
      </Layout >
    </Page >
  );
}