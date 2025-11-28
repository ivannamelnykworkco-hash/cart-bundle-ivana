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
  TextField,
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
import { GeneralQuantityBreack } from "app/components/bundles/GeneralQuantityBreack";
import { CountDownPanel } from "app/components/bundles/CountDownPanel";
import { MostPopularfancy } from "app/components/common/MostPopularfancy";
import { getCountdownTimer, updateCountdownTimer } from "app/models/countdownTimer.server";
import { GeneralBuyXgetYfree } from "app/components/bundles/GeneralBuyXgetYfree";
import { GeneralBundleUpsell } from "app/components/bundles/GeneralBundleUpsell";
import { getGeneralStyle, updateGeneralStyle } from "app/models/generalStyle.server";
import { getVolumeDiscount, updateVolumeDiscount } from "app/models/volumeDiscount.server";
import { getStickyAdd, updateStickyAdd } from "app/models/stickyAdd.server";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
  query getProducts {
  products(first: 100) {
    edges {
      node {
        id
        title
        featuredImage {
          url
        }
        metafields(first: 5) {
        edges {
          node {
            id
            namespace
            key
            value
            type
          }
        }
      }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              inventoryQuantity
              compareAtPrice
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
  collections(first: 20) {
    edges {
      node {
        id
        title
        image {
          url
        }
      }
    }
  }
}
`);
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
  // fetch data from prisma
  try {
    const [countdownTimerConf, generalStyleConf, generalVolumeConf, generalStickyAddConf] = await Promise.all([
      getCountdownTimer(),
      getGeneralStyle(),
      getVolumeDiscount(),
      getStickyAdd()
    ]);

    // Handle error, but note that Promise.all rejects on first error
    return json(
      {
        products,
        collections,
        countdownTimerConf,
        generalStyleConf,
        generalVolumeConf,
        generalStickyAddConf
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

/*********************Action to receive submit data****************/
//Save data in database
export async function action({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const parsedData = {
    ...Object.fromEntries(await request.formData()),
    params
  };
  let data = { ...parsedData };
  try {
    const result = await updateGeneralStyle(data.id, data);
    // const result = await updateCountdownTimer(data.id, data);
    // const result = await updateVolumeDiscount(data.id, data);
    return json({ success: true, result });
  } catch (err) {
    return json(
      { success: false, error: err.message || err },
      { status: 500 }
    );
  }
}

/**************************************************************/

interface BoxQuantity {
  id: number;
}

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

export default function BundleSettingsAdvanced() {
  console.log("~~~load");

  const loaderData = useLoaderData<typeof loader>();
  console.log("~~~loaderData", loaderData);
  /*recevie response from action function*/

  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        showToast("Countdown timer setting updated successfully!", "success");
      } else {
        showToast(`Error: ${actionData.error}`, "error");
      }
    }
  }, [actionData]);

  //id: ==> upsellchecked state
  const [upsellChecked, setUpsellChecked] = useState({});
  const handleUpsellValueChange = (bundlId: string | number, upsellId: boolean, value: boolean | undefined) => {
    setUpsellChecked(prev => ({
      ...prev, [bundlId]: {
        ...(prev[bundlId] || {}),
        [upsellId]: value
      }
    }))
  }

  const [xyupsellChecked, setXyupsellChecked] = useState({});
  const handleXyUpsellValueChange = (bundlId: string | number, upsellId: boolean, value: boolean | undefined) => {
    setXyupsellChecked(prev => ({
      ...prev, [bundlId]: {
        ...(prev[bundlId] || {}),
        [upsellId]: value
      }
    }))
  }

  const [bundleupsellChecked, setBundleupsellChecked] = useState({});
  const handleBundleUpsellValueChange = (bundlId: string | number, upsellId: boolean, value: boolean | undefined) => {
    setBundleupsellChecked(prev => ({
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
  const [generalVolumeData, setGeneralVolumeData] = useState(null);

  const handleCountdownTimerChange = useCallback((updated: any) => {
    setCountdownTimerData(prev => ({ ...prev, ...updated }));
  }, []);
  const handleGeneralVolumeChange = useCallback((updated: any) => {
    setGeneralVolumeData(prev => ({ ...prev, ...updated }));
  }, []);

  // Send data to action
  const submit = useSubmit();

  function saveData() {
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
    //    submit(countdownTimerData, { method: "post" });
    // submit(generalVolumeFormData, { method: "post" });
    submit(generalStyleFormData, { method: "post" });

  }

  /***************Database Migration Part************/
  //id: ==> upsellTexts state.,
  const [boxUpsellSelectedProduct, setBoxUpsellSelectedProduct] = useState({});

  const handleSelectedProductChange = (bundleId: string | number, upsellId: any, value: any) => {
    setBoxUpsellSelectedProduct(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [xyBoxUpsellSelectedProduct, setXyBoxUpsellSelectedProduct] = useState({});

  const handleXySelectedProductChange = (bundleId: string | number, upsellId: any, value: any) => {
    setXyBoxUpsellSelectedProduct(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [bundleBoxUpsellSelectedProduct, setBundleBoxUpsellSelectedProduct] = useState({});

  const handleBundleSelectedProductChange = (bundleId: string | number, upsellId: any, value: any) => {
    setBundleBoxUpsellSelectedProduct(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [addupsellImage, setAddupsellImage] = useState({});

  const handleAddupsellImageChange = (bundleId: string | number, upsellId: any, value: any) => {
    setAddupsellImage(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [xyAddupsellImage, setXyAddupsellImage] = useState({});

  const handleXyAddupsellImageChange = (bundleId: string | number, upsellId: any, value: any) => {
    setXyAddupsellImage(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [bundleAddupsellImage, setBundleAddupsellImage] = useState({});

  const handleBundleAddupsellImageChange = (bundleId: string | number, upsellId: any, value: any) => {
    setBundleAddupsellImage(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };

  useEffect(() => {
    console.log('addupsellImage:', addupsellImage);
  }, [addupsellImage]);

  const [barUpsellTexts, setBarUpsellTexts] = useState({});

  const handleBundlesChooseBarUpsellTextChanges = (bundleId: string | number, upsellId: any, value: any) => {
    setBarUpsellTexts(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [xybarUpsellTexts, setXyBarUpsellTexts] = useState({});

  const handlexyBundlesChooseBarUpsellTextChanges = (bundleId: string | number, upsellId: any, value: any) => {
    setXyBarUpsellTexts(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };
  const [bundleBarUpsellTexts, setBundleBarUpsellTexts] = useState({});

  const handlexyBundleBaraddUpsellTextChanges = (bundleId: string | number, upsellId: any, value: any) => {
    setBundleBarUpsellTexts(prev => ({
      ...prev, [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: value
      }
    }));
  };

  // select layout bar section
  const [selectedId, setSelectedId] = useState(null);

  // right layout add upsell and delete upsell
  const [quantityBreaks, setQuantityBreaks] = useState<BoxQuantity[]>([]);
  const addQuantityBreak = () => [
    setQuantityBreaks(prev => [...prev, { id: Date.now() }])
  ]
  const deleteQuantityBreak = (id: any) => {
    setQuantityBreaks(prev => prev.filter(item => item.id !== id))
  }
  const [buyXGetYs, setBuyXGetYs] = useState<BoxQuantity[]>([]);
  const addBuyXGetY = () => [
    setBuyXGetYs(prev => [...prev, { id: Date.now() }])
  ]
  const deleteBuyXGetY = (id: any) => {
    setBuyXGetYs(prev => prev.filter(item => item.id !== id))
  }
  const [bundleUpsells, setBundleUpsells] = useState<BoxQuantity[]>([]);
  const addBundleUpsell = () => [
    setBundleUpsells(prev => [...prev, { id: Date.now() }])
  ]
  const deleteBundleUpsell = (id: any) => {
    setBundleUpsells(prev => prev.filter(item => item.id !== id))
  }
  // quantity break
  const [openPanel, setOpenPanel] = useState(null);
  const [upsells, setUpsells] = useState<{ [bundleId: string]: any[] }>({});
  const [products, setProducts] = useState<{ [bundleId: string]: any[] }>({});
  const [selectedProduct, setSelectedProduct] = useState(loaderData.selectedProduct);
  const [selectedCountry, setSelectedCountry] = useState(loaderData.selectedCountry);
  const [showOriginal, setShowOriginal] = useState(true)
  const [barTitle, setBarTitle] = useState({});
  const [barSubTitle, setBarSubTitle] = useState({});
  const [bagdeText, setBagdeText] = useState({});
  const [barLabelText, setBarLabelText] = useState({});
  const [badgeSelected, setBadgeSelected] = useState({});
  const [selectedProductChange, setSelectedProductChange] = useState({});
  //buy x and get y free
  const [defaultBasePrice, setDefaultBasePrice] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState({});
  const [xybarTitle, setXyBarTitle] = useState({});
  const [xybarSubTitle, setXyBarSubTitle] = useState({});
  const [xybagdeText, setXysetBagdeText] = useState({});
  const [xybarLabelText, setXyBarLabelText] = useState({});
  const [xybadgeSelected, setXybadgeSelected] = useState({});
  const [xydefaultBasePrice, setXyDefaultBasePrice] = useState({});
  const [xycalculatedPrice, setXyCalculatedPrice] = useState('');
  //Bundle Upsell
  const [bundleUpsellBarTitle, setBundleUpsellBarTitle] = useState({});
  const [bundleUpsellSubTitle, setBundleUpsellSubTitle] = useState({});
  const [bundleUpsellBagdeText, setBundleUpsellBagdeText] = useState({});
  const [bunldeUpsellLabelText, setBunldeUpsellLabelText] = useState({});
  const [bundleUpsellbadgeSelected, setBundleUpsellbadgeSelected] = useState("simple");

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
  const handelonAddUpsellChange = (bundleId: string | number, item: any) => {
    setUpsells(prev => ({
      ...prev,
      [bundleId]: [...(prev[bundleId] || []), item]
    }));
  };
  const handleonDeleteUpsellChange = (bundleId: string | number, upsellId: any) => {
    setUpsells(prev => ({
      ...prev,
      [bundleId]: (prev[bundleId] || []).filter(item => item.id !== upsellId)
    }));
  };

  //product add
  const hanldeonAddProductChange = (bundleId: string | number, item: any) => {
    setProducts(prev => ({
      ...prev,
      [bundleId]: [...(prev[bundleId] || []), item]
    }));
  };

  //product delete on right layout
  const handleonDeleteProductChange = (bundleId: string | number, productId: any) => {
    setProducts(prev => ({
      ...prev,
      [bundleId]: (prev[bundleId] || []).filter(item => item.id !== productId)
    }));
  };

  const handleBarTitleChange = (id: string | number, value: string) => {
    setBarTitle(prev => ({ ...prev, [id]: value }));
  }
  const handlexyBarTitleChange = (id: string | number, value: string) => {
    setXyBarTitle(prev => ({ ...prev, [id]: value }));
  }
  const handleBundleUpsellTitleChange = (id: string | number, value: string) => {
    setBundleUpsellBarTitle(prev => ({ ...prev, [id]: value }));
  }
  const handleBarLabelTextChange = (id: string | number, value: string) => {
    setBarLabelText(prev => ({ ...prev, [id]: value }));
  }
  const handlexyBarLabelTextChange = (id: string | number, value: string) => {
    setXyBarLabelText(prev => ({ ...prev, [id]: value }));
  }
  const handleBundleUpsellLabelTextChange = (id: string | number, value: string) => {
    setBunldeUpsellLabelText(prev => ({ ...prev, [id]: value }));
  }
  const handleBarSubTitleChange = (id: string | number, value: string) => {
    setBarSubTitle(prev => ({ ...prev, [id]: value }));
  }
  const handlexyBarSubTitleChange = (id: string | number, value: string) => {
    setXyBarSubTitle(prev => ({ ...prev, [id]: value }));
  }
  const handleBundleUpsellSubTitleChange = (id: string | number, value: string) => {
    setBundleUpsellSubTitle(prev => ({ ...prev, [id]: value }));
  }
  const handleBagdeTextChange = (id: string | number, value: string) => {
    setBagdeText(prev => ({ ...prev, [id]: value }));
  }
  const handlexyBagdeTextChange = (id: string | number, value: string) => {
    setXysetBagdeText(prev => ({ ...prev, [id]: value }));
  }
  const handleBundleUpsellTextChange = (id: string | number, value: string) => {
    setBundleUpsellBagdeText(prev => ({ ...prev, [id]: value }));
  }
  const handleBadgeSelectedChange = (id: string | number, value: string) => {
    setBadgeSelected(prev => ({ ...prev, [id]: value }));
  }
  const handlexyBadgeSelectedChange = (id: string | number, value: string) => {
    setXybadgeSelected(prev => ({ ...prev, [id]: value }));
  }
  const handleBundleUpsellSelectedChange = (id: string | number, value: string) => {
    setBundleUpsellbadgeSelected(prev => ({ ...prev, [id]: value }));
  }
  const handlePriceChange = (bundleId: any, calc: any, base: any) => {
    setCalculatedPrice(prev => ({
      ...prev,
      [bundleId]: calc
    }));
    setDefaultBasePrice(prev => ({
      ...prev,
      [bundleId]: base
    }));
  };
  const handlexyPriceChange = (bundleId: any, calc: any, base: any) => {
    setXyCalculatedPrice(prev => ({
      ...prev,
      [bundleId]: calc
    }));
    setXyDefaultBasePrice(prev => ({
      ...prev,
      [bundleId]: base
    }));
  };

  //show product information
  const [showSelectedProduct, setShowSelectedProduct] = useState({});

  const handleSeletedProductChange = (bundleId, productObj) => {
    setShowSelectedProduct(prev => ({
      ...prev,
      [bundleId]: {
        ...prev[bundleId],
        ...productObj, // productObj = { [productId]: { imageUrl, title, price } }
      }
    }));
  };

  const [addUpsellcalculatedPrice, setAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [addupselldefaultBasePrice, setAddupselldefaultBasePrice] = useState<Record<number, string>>({});
  const [xyaddUpsellcalculatedPrice, setXyAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [xyaddupselldefaultBasePrice, setXyAddupselldefaultBasePrice] = useState<Record<number, string>>({});
  const [bundleAddUpsellcalculatedPrice, setBundleAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [bundleAddupselldefaultBasePrice, setBundleAddupselldefaultBasePrice] = useState<Record<number, string>>({});
  const [bundleAddProductItemcalculatedPrice, setBundleAddProductItemcalculatedPrice] = useState<Record<number, Record<number, string>>>({});
  const [bundleAddProductItemDefaultBasePrice, setBundleAddProductItemDefaultBasePrice] = useState<Record<number, Record<number, string>>>({});

  const handleAddUpsellPriceChange = (
    bundleId: number,
    upsellId: number,
    price: string,
    defaultPrice?: string
  ) => {
    setAddUpsellcalculatedPrice(prev => ({
      ...prev,
      [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: price
      }
    }));
    if (defaultPrice !== undefined) {
      setAddupselldefaultBasePrice(prev => ({
        ...prev,
        [bundleId]: {
          ...(prev[bundleId] || {}),
          [upsellId]: defaultPrice
        }
      }));
    }
  };
  const handlexyAddUpsellPriceChange = (
    bundleId: number,
    upsellId: number,
    price: string,
    defaultPrice?: string
  ) => {
    setXyAddUpsellcalculatedPrice(prev => ({
      ...prev,
      [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: price
      }
    }));
    if (defaultPrice !== undefined) {
      setXyAddupselldefaultBasePrice(prev => ({
        ...prev,
        [bundleId]: {
          ...(prev[bundleId] || {}),
          [upsellId]: defaultPrice
        }
      }));
    }
  };
  const handleBundleAddUpsellPriceChange = (
    bundleId: number,
    upsellId: number,
    price: string,
    defaultPrice?: string
  ) => {
    setBundleAddUpsellcalculatedPrice(prev => ({
      ...prev,
      [bundleId]: {
        ...(prev[bundleId] || {}),
        [upsellId]: price
      }
    }));

    if (defaultPrice !== undefined) {
      setBundleAddupselldefaultBasePrice(prev => ({
        ...prev,
        [bundleId]: {
          ...(prev[bundleId] || {}),
          [upsellId]: defaultPrice
        }
      }));
    }
  };
  const handleBundleAddProductItemPriceChange = (
    bundleId: number,
    productId: number,
    price: number,
    defaultPrice?: number,
    upsellId?: number // assuming you might want to pass upsellId for upsell updates
  ) => {
    // Update product item calculated price
    setBundleAddProductItemcalculatedPrice(prev => ({
      ...prev,
      [bundleId]: {
        ...(prev[bundleId] || {}),
        [productId]: price
      }
    }));

    // Update upsell calculated price if upsellId is provided
    if (upsellId !== undefined) {
      setBundleAddUpsellcalculatedPrice(prev => ({
        ...prev,
        [bundleId]: {
          ...(prev[bundleId] || {}),
          [upsellId]: price
        }
      }));
    }

    // Update default base price if provided
    if (defaultPrice !== undefined) {
      setBundleAddProductItemDefaultBasePrice(prev => ({
        ...prev,
        [bundleId]: {
          ...(prev[bundleId] || {}),
          [productId]: defaultPrice
        }
      }));
    }
  };
  // Get Bundle Upsell Total price for right layout.
  const getBundleUpsellTotalPrice = (bundleId: number) => {
    const bundleitems = bundleAddProductItemcalculatedPrice[bundleId];
    if (!bundleitems) return 0;

    const total = Object.values(bundleitems).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
  };

  const getBaseBundleUpsellTotalPrice = (bundleId: number) => {
    const basebundleitems = bundleAddProductItemDefaultBasePrice[bundleId];
    if (!basebundleitems) return 0;

    const total = Object.values(basebundleitems).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
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

  const [selectedPrice, setSelectedPrice] = useState({});
  const handlePriceVariantChange = (bundleId, productId, price) => {
    setSelectedPrice(prev => ({
      ...prev,
      [bundleId]: {
        ...(prev[bundleId] || {}),
        [productId]: price,
      }
    }));
  };
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
      title="Kaching Bundles"
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
                <GeneralSettingsPanel open={openPanel === "settings"} onToggle={() => setOpenPanel(openPanel === "settings" ? null : "settings")} />
                <GeneralStylePanel open={openPanel === "style"} onToggle={() => setOpenPanel(openPanel === "style" ? null : "style")}
                  styleHandlers={styleHandlers}
                  layoutStyleOptions={layoutStyleOptions}
                  layoutSelectedStyle={layoutSelectedStyle}
                  onChangeLayoutStyle={setLayoutSelectedStyle} />
                <GeneralVolumePanel open={openPanel === "volume"} onToggle={() => setOpenPanel(openPanel === "volume" ? null : "volume")} onDataChange={handleGeneralVolumeChange} />
                <CountDownPanel open={openPanel === "countDown"} onToggle={() => setOpenPanel(openPanel === "countDown" ? null : "countDown")}
                  onDataChange={handleCountdownTimerChange} />
                <GeneralCheckboxUpsell open={openPanel === "checkBoxUpsell"} onToggle={() => setOpenPanel(openPanel === "checkBoxUpsell" ? null : "checkBoxUpsell")} />
                <GeneralStickyAddToCart open={openPanel === "sticky"} onToggle={() => setOpenPanel(openPanel === "sticky" ? null : "sticky")} />
                {quantityBreaks.map((item) => (
                  <GeneralQuantityBreack
                    id={item.id}
                    key={item.id}
                    bundleId={item.id}
                    open={openPanel === item.id}
                    onToggle={() => setOpenPanel(openPanel === item.id ? null : item.id)}
                    deleteSection={deleteQuantityBreak}
                    heading="Bar #1 - Single"
                    upBundlesChooseTitleChange={handleBarTitleChange}
                    upBundlesChooseSubTitleChange={handleBarSubTitleChange}
                    upBundlesBadgeTextChange={handleBagdeTextChange}
                    upBunlesBarLabelTextChange={handleBarLabelTextChange}
                    upBundlesBarUpsellTextChange={handleBundlesChooseBarUpsellTextChanges}
                    upPriceChange={handlePriceChange}
                    upAddUpsellPriceChange={handleAddUpsellPriceChange}
                    upBadgeSelectedChange={handleBadgeSelectedChange}
                    upSelectedProductChange={handleSelectedProductChange}
                    upAddUpsellImageChange={handleAddupsellImageChange}
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange} />
                ))}


                {buyXGetYs.map((buyitem) => (
                  <GeneralBuyXgetYfree
                    id={buyitem.id}
                    key={buyitem.id}
                    bundleId={buyitem.id}
                    open={openPanel === buyitem.id}
                    onToggle={() => setOpenPanel(openPanel === buyitem.id ? null : buyitem.id)}
                    deleteSection={deleteBuyXGetY}
                    heading=" Buy 3, get 1 free!"
                    upBundlesChooseTitleChange={handlexyBarTitleChange}
                    upBundlesChooseSubTitleChange={handlexyBarSubTitleChange}
                    upBundlesBadgeTextChange={handlexyBagdeTextChange}
                    upBunlesBarLabelTextChange={handlexyBarLabelTextChange}
                    upBundlesBarUpsellTextChange={handlexyBundlesChooseBarUpsellTextChanges}
                    upSelectedProductChange={handleXySelectedProductChange}
                    upPriceChange={handlexyPriceChange}
                    upBadgeSelectedChange={handlexyBadgeSelectedChange}
                    upAddUpsellImageChange={handleXyAddupsellImageChange}
                    upAddUpsellPriceChange={handlexyAddUpsellPriceChange}
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                  />
                ))}
                {bundleUpsells.map((bundleitem) => (
                  <GeneralBundleUpsell
                    id={bundleitem.id}
                    key={bundleitem.id}
                    bundleId={bundleitem.id}
                    open={openPanel === bundleitem.id}
                    onToggle={() => setOpenPanel(openPanel === bundleitem.id ? null : bundleitem.id)}
                    deleteSection={deleteBundleUpsell}
                    heading='Complete the bundle'
                    upBundlesChooseTitleChange={handleBundleUpsellTitleChange}
                    upBundlesChooseSubTitleChange={handleBundleUpsellSubTitleChange}
                    upBundlesBadgeTextChange={handleBundleUpsellTextChange}
                    upBunlesBarLabelTextChange={handleBundleUpsellLabelTextChange}
                    upBundlesBarUpsellTextChange={handlexyBundleBaraddUpsellTextChanges}
                    upSelectedProductChange={handleBundleSelectedProductChange}
                    upBadgeSelectedChange={handleBundleUpsellSelectedChange}
                    upAddUpsellImageChange={handleBundleAddupsellImageChange}
                    upAddUpsellPriceChange={handleBundleAddUpsellPriceChange}
                    upAddProductItemPriceChange={handleBundleAddProductItemPriceChange}
                    onAddUpsell={handelonAddUpsellChange}
                    onAddProduct={hanldeonAddProductChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                    loaderData={loaderData}
                    upSeletedProduct={handleSeletedProductChange}
                    onDeleteProducts={handleonDeleteProductChange}
                    styleOptions={styleOptions}
                    selectedStyle={selectedStyle}
                    onChangeStyle={setSelectedStyle}
                  />
                ))}
                {showOriginal ? (
                  <div style={{ border: "1px dashed  black", borderRadius: '10px', padding: '15px' }}>
                    <Button fullWidth icon={PlusCircleIcon} variant="primary" onClick={() => setShowOriginal(false)}>Add bar</Button>
                  </div>
                ) : (
                  <Card>
                    <InlineGrid columns={3} gap="200">
                      <Button icon={DiscountIcon} onClick={addQuantityBreak}>Quantity break</Button>
                      <Button icon={MegaphoneIcon} onClick={addBuyXGetY}>Buy X, Get Y free</Button>
                      <Button icon={ProductIcon} onClick={addBundleUpsell}>Bundle upsell</Button>
                    </InlineGrid>
                  </Card>
                )
                }
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
                          <p
                            className="barHeading"
                            style={{
                              color: blockTitleColor,
                              fontSize: `${barBlocktitle}px`,
                              fontWeight: fontWeightMap[barBlocktitleFontStyle as keyof typeof fontWeightMap],
                              fontStyle: fontStyleMap[barBlocktitleFontStyle as keyof typeof fontWeightMap],
                            }}
                          >
                            BUNDLE & SAVE
                          </p>
                        </Text>




                        {/* Bundle Options */}
                        <div className="preview-main" style={{ flexDirection: layoutSelectedStyle === 'layout1' ? 'column' : 'row', overflow: layoutSelectedStyle === 'layout1' ? '' : 'auto' }} >
                          {quantityBreaks.map((item) => (
                            <div key={item.id} className="main-quantity-break" onClick={() => setSelectedId(item.id)}>
                              <Box position="relative">
                                {badgeSelected[item.id] === "simple" && bagdeText[item.id] && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content"
                                      style={{
                                        background: barBadgebackColor,
                                        color: barBadgebackColor,
                                      }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {bagdeText[item.id] || ''}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {badgeSelected[item.id] === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="main-section--container"
                                style={{
                                  borderRadius: `${cornerRadius}px`,
                                  border: '2px solid',
                                  borderColor: selectedId === item.id ? borderColor : cardsBgColor,
                                  boxShadow: selectedId === item.id
                                    ? `inset 0 0 0 2px ${borderColor}, #000`
                                    : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                  paddingTop: badgeSelected[item.id] ? `${spacing * 0.5 + 10}px` : badgeSelected[item.id] === "simple" && bagdeText[item.id] ? `${spacing * 0.5}px` : `${spacing * 0.5}px`,
                                  backgroundColor: selectedId === item.id ? selectedBgColor : cardsBgColor,
                                  height: layoutSelectedStyle == 'layout2' ? '100%' : ''
                                }}>
                                <div style={{
                                  padding: `${spacing * 0.5}px ${spacing}px`,
                                  backgroundColor: selectedId === item.id ? selectedBgColor : cardsBgColor, display: "flex",
                                  borderRadius: `${cornerRadius}px`,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: layoutSelectedStyle === 'layout2' ? 'column' : 'row'
                                }}>
                                  <InlineStack gap="200" blockAlign="center" align="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid",
                                        borderColor: selectedId === item.id ? borderColor : "grey",
                                        display: "flex",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <div style={{ width: '12px', height: '12px', borderRadius: "50%", backgroundColor: selectedId === item.id ? borderColor : "white", }}>
                                      </div>
                                    </div>
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
                                          textAlign: 'center',
                                          color: barTitleColor,
                                          fontSize: `${bartitleSize}px`,
                                          fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {barTitle[item.id] || 'Single'}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {barLabelText[item.id] || ''}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        textAlign: layoutSelectedStyle === 'layout2' ? 'center' : ''
                                      }}>
                                        {barSubTitle[item.id] || 'Standard price'}
                                      </span>
                                    </BlockStack>
                                  </InlineStack>
                                  <div style={{ textAlign: "right" }}>
                                    <BlockStack gap="050">
                                      <div className="bar-price" style={{
                                        color: barPriceColor,
                                        fontSize: `${bartitleSize}px`,
                                        fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                      }}>
                                        ${calculatedPrice[item.id]}
                                      </div>
                                      {defaultBasePrice[item.id] && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(defaultBasePrice[item.id]) !== parseFloat(calculatedPrice[item.id] || "0") ? (
                                            <s>${defaultBasePrice[item.id]}</s>
                                          ) : ""}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsells[item.id]?.map((upsell, index) => (
                                    <div key={upsell.id} className="upsell-box" style={{
                                      background: barUpsellBackColor,
                                      borderBottomRightRadius: index === upsells[item.id]?.length - 1 ? cornerRadius : '',
                                      borderBottomLeftRadius: index === upsells[item.id]?.length - 1 ? cornerRadius : '',
                                    }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={upsellChecked[item.id]?.[upsell.id] || false}
                                            onChange={(value) => handleUpsellValueChange(item.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img" style={{ width: `${addupsellImage[item.id]?.[upsell.id]}px`, height: `${addupsellImage[item.id]?.[upsell.id]}px`, }}>
                                            <Thumbnail
                                              source={boxUpsellSelectedProduct[item.id]?.[upsell.id]?.[0]?.imageUrl || ''}
                                              alt=""
                                            />
                                          </div>
                                          <span style={{ color: barUpsellTextColor }}>
                                            {barUpsellTexts[item.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice">
                                            ${addUpsellcalculatedPrice[item.id]?.[upsell.id] || ""}
                                          </div>
                                          {addupselldefaultBasePrice[item.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(addupselldefaultBasePrice[item.id]?.[upsell.id]) !==
                                                parseFloat(addUpsellcalculatedPrice[item.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${addupselldefaultBasePrice[item.id]?.[upsell.id]}</s>
                                                ) : ""
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}




                          {/* {add buy x, get y free!} */}
                          {buyXGetYs.map((buyitem) => (
                            <div key={buyitem.id} className="main-buyX-getY" onClick={() => setSelectedId(buyitem.id)}>
                              <Box position="relative">
                                {/* {bundle most popular} */}
                                {xybadgeSelected[buyitem.id] === "simple" && xybagdeText[buyitem.id] && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {xybagdeText[buyitem.id] || ''}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {xybadgeSelected[buyitem.id] === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="main-section--container"
                                style={{
                                  borderRadius: `${cornerRadius}px`,
                                  border: '2px solid',
                                  borderColor: selectedId === buyitem.id ? borderColor : cardsBgColor,
                                  boxShadow: selectedId === buyitem.id
                                    ? `inset 0 0 0 2px ${borderColor}, #000`
                                    : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                  paddingTop: badgeSelected[buyitem.id] ? `${spacing * 0.5 + 10}px` : badgeSelected[buyitem.id] === "simple" && bagdeText[buyitem.id] ? `${spacing * 0.5}px` : `${spacing * 0.5}px`,
                                  backgroundColor: selectedId === buyitem.id ? selectedBgColor : cardsBgColor,
                                  height: layoutSelectedStyle == 'layout2' ? '100%' : ''
                                }}>
                                <div style={{
                                  padding: `${spacing * 0.5}px ${spacing}px`,
                                  backgroundColor: selectedId === buyitem.id ? selectedBgColor : cardsBgColor,
                                  display: "flex",
                                  borderRadius: `${cornerRadius}px`,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: layoutSelectedStyle === 'layout2' ? 'column' : 'row'
                                }}>
                                  <InlineStack gap="200" blockAlign="center" align="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid",
                                        borderColor: selectedId === buyitem.id ? borderColor : "grey",
                                        display: "flex",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <div style={{ width: '12px', height: '12px', borderRadius: "50%", backgroundColor: selectedId === buyitem.id ? borderColor : "white", }}>
                                      </div>
                                    </div>
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
                                          textAlign: 'center',
                                          color: barTitleColor,
                                          fontSize: `${bartitleSize}px`,
                                          fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {xybarTitle[buyitem.id] || 'Buy 3, Get 1 Free!'}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {xybarLabelText[buyitem.id]}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {xybarSubTitle[buyitem.id]}
                                      </span>
                                    </BlockStack>
                                  </InlineStack>
                                  <div style={{ textAlign: "right" }}>
                                    <BlockStack gap="050">
                                      <div className="bar-price" style={{
                                        color: barPriceColor,
                                        fontSize: `${bartitleSize}px`,
                                        fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                      }}>
                                        ${xycalculatedPrice[buyitem.id]}
                                      </div>
                                      {xydefaultBasePrice[buyitem.id] && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(xydefaultBasePrice[buyitem.id]) !== parseFloat(xycalculatedPrice[buyitem.id] || "0") ? (
                                            <s>${xydefaultBasePrice[buyitem.id]}</s>
                                          ) : ""}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsells[buyitem.id]?.map((upsell, index) => (
                                    <div key={upsell.id} className="upsell-box" style={{
                                      background: barUpsellBackColor,
                                      borderBottomRightRadius: index === upsells[buyitem.id]?.length - 1 ? cornerRadius : '',
                                      borderBottomLeftRadius: index === upsells[buyitem.id]?.length - 1 ? cornerRadius : '',
                                    }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={xyupsellChecked[buyitem.id]?.[upsell.id] || false}
                                            onChange={(value) => handleXyUpsellValueChange(buyitem.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img" style={{ width: `${xyAddupsellImage[buyitem.id]?.[upsell.id]}px`, height: `${xyAddupsellImage[buyitem.id]?.[upsell.id]}px`, }}>
                                            <Thumbnail
                                              source={xyBoxUpsellSelectedProduct[buyitem.id]?.[upsell.id]?.[0]?.imageUrl || ''}
                                              alt=""
                                            />
                                          </div>
                                          <span style={{ color: barUpsellTextColor }}>
                                            {xybarUpsellTexts[buyitem.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${xyaddUpsellcalculatedPrice[buyitem.id]?.[upsell.id] || "20"}</div>
                                          {xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id]) !==
                                                parseFloat(xyaddUpsellcalculatedPrice[buyitem.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id]}</s>
                                                ) : ""
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}




                          {/* {main bundle Upsell} */}
                          {bundleUpsells.map((bundleitem) => (
                            <div key={bundleitem.id} className="main-bundle-upsell" onClick={() => setSelectedId(bundleitem.id)}>
                              <Box position="relative">
                                {/* {bundle most popular} */}
                                {bundleUpsellbadgeSelected[bundleitem.id] === "simple" && bundleUpsellBagdeText[bundleitem.id] && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {bundleUpsellBagdeText[bundleitem.id]}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {bundleUpsellbadgeSelected[bundleitem.id] === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="main-section--container"
                                style={{
                                  borderRadius: `${cornerRadius}px`,
                                  border: '2px solid',
                                  borderColor: selectedId === bundleitem.id ? borderColor : cardsBgColor,
                                  boxShadow: selectedId === bundleitem.id
                                    ? `inset 0 0 0 2px ${borderColor}, #000`
                                    : `inset 0 0 0 1px ${cardsBgColor}, #000`,
                                  paddingTop: badgeSelected[bundleitem.id] ? `${spacing * 0.5 + 10}px` : badgeSelected[bundleitem.id] === "simple" && bagdeText[bundleitem.id] ? `${spacing * 0.5}px` : `${spacing * 0.5}px`,
                                  backgroundColor: selectedId === bundleitem.id ? selectedBgColor : cardsBgColor,
                                  height: layoutSelectedStyle == 'layout2' ? '100%' : ''
                                }}>
                                <div style={{
                                  padding: `${spacing * 0.5}px ${spacing}px`,
                                  backgroundColor: selectedId === bundleitem.id ? selectedBgColor : cardsBgColor, display: "flex",
                                  borderRadius: `${cornerRadius}px`,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: layoutSelectedStyle === 'layout2' ? 'column' : 'row'
                                }}>
                                  <InlineStack gap="200" blockAlign="center" align="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid",
                                        borderColor: selectedId === bundleitem.id ? borderColor : "grey",
                                        display: "flex",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <div style={{ width: '12px', height: '12px', borderRadius: "50%", backgroundColor: selectedId === bundleitem.id ? borderColor : "white", }}>
                                      </div>
                                    </div>
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
                                          textAlign: 'center',
                                          color: barTitleColor,
                                          fontSize: `${bartitleSize}px`,
                                          fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {bundleUpsellBarTitle[bundleitem.id] || 'Complete the bundle'}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {bunldeUpsellLabelText[bundleitem.id]}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {bundleUpsellSubTitle[bundleitem.id] || 'Save $180.49!'}
                                      </span>
                                    </BlockStack>
                                  </InlineStack>
                                  <div style={{ textAlign: "right" }}>
                                    <BlockStack gap="050">
                                      <div className="bar-price" style={{
                                        color: barPriceColor,
                                        fontSize: `${bartitleSize}px`,
                                        fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                      }}>
                                        ${getBundleUpsellTotalPrice(bundleitem.id)}
                                      </div>
                                      {defaultBasePrice && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(getBaseBundleUpsellTotalPrice(bundleitem.id)) !== parseFloat(getBundleUpsellTotalPrice(bundleitem.id) || "0") ? (
                                            <s>${getBaseBundleUpsellTotalPrice(bundleitem.id)}</s>
                                          ) : ''}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* {layout} */}
                                <div className="main_bundles-products--container" style={{ flexDirection: selectedStyle === 'layout1' ? 'row' : 'column', borderColor: borderColor, borderRadius: cornerRadius }}>
                                  {products[bundleitem.id]?.map((product) => (
                                    <div key={product.id} className="bundles-products" style={{ flexDirection: selectedStyle === 'layout1' ? 'row' : 'column' }}>
                                      <div className="bundles-products__divider" style={{ flexDirection: selectedStyle === 'layout1' ? 'column' : 'row' }}>
                                        <div className="products__divider-inline" style={{ width: selectedStyle === 'layout1' ? '1px' : '100%', height: selectedStyle === 'layout1' ? '100%' : '1px', background: borderColor }}></div>
                                        <div className="products__divider-icon">
                                          <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"></circle><path fill="#fff" d="M5 9h10v2H5z"></path><path fill="#fff" d="M11 5v10H9V5z"></path></svg>
                                        </div>
                                        <div className="products__divider-inline" style={{ background: borderColor, width: selectedStyle === 'layout1' ? '1px' : '100%', height: selectedStyle === 'layout1' ? '100%' : '1px', }}></div>
                                      </div>
                                      <div className="bundles-products__product" style={{ flexDirection: selectedStyle === 'layout1' ? 'column' : 'row', justifyContent: selectedStyle === 'layout1' ? 'center' : 'space-between', padding: selectedStyle === 'layout1' ? '10px 0' : '0 10px', }}>

                                        <div className="bundles-products__product--image">
                                          <Thumbnail
                                            source={showSelectedProduct[bundleitem.id]?.[product.id]?.[0]?.imageUrl ?? NoteIcon}
                                            alt=''
                                          />
                                        </div>
                                        <div className="bundles-products__product--title">{showSelectedProduct[bundleitem.id]?.[product.id]?.[0]?.title || ''}</div>
                                        <div className="bundles-products__product--price">
                                          {selectedPrice?.[bundleitem.id]?.[product.id] ? (
                                            <span className="selected-price-tag">
                                              ${selectedPrice[bundleitem.id][product.id]}
                                            </span>
                                          ) : (
                                            <div className="selected-price-tags">
                                              <span className="selected-price-tag">
                                                {
                                                  bundleAddProductItemcalculatedPrice?.[bundleitem.id]?.[product.id]
                                                    ? parseFloat(bundleAddProductItemcalculatedPrice?.[bundleitem.id]?.[product.id]).toFixed(2)
                                                    : "Selected Product"
                                                }
                                              </span>
                                              <span className="selected-price-tag">
                                                {parseFloat(bundleAddProductItemDefaultBasePrice?.[bundleitem.id]?.[product.id]) !==
                                                  parseFloat(bundleAddProductItemcalculatedPrice?.[bundleitem.id]?.[product.id])
                                                  ? (
                                                    <s>
                                                      {bundleAddProductItemcalculatedPrice?.[bundleitem.id]?.[product.id]
                                                        ? parseFloat(bundleAddProductItemcalculatedPrice?.[bundleitem.id]?.[product.id]).toFixed(2)
                                                        : ""}
                                                    </s>
                                                  )
                                                  : ''
                                                }
                                              </span>
                                            </div>
                                          )}
                                          {(showSelectedProduct[bundleitem.id]?.[product.id] || [])?.length > 2 && (
                                            <select className="variant-dropdown" onChange={(e) => handlePriceVariantChange(bundleitem.id, product.id, e.target.value)}>
                                              {(showSelectedProduct[bundleitem.id]?.[product.id] || [])?.map((v, i) => (
                                                <option key={i} value={v.price}>
                                                  ${v.price}
                                                </option>
                                              ))}
                                            </select>
                                          )}
                                          <div className="bundles-produts_product--price-compareprice">{showSelectedProduct[bundleitem.id]?.[product.id]?.[1]?.compareprice || ''}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsells[bundleitem.id]?.map((upsell, index) => (
                                    <div key={upsell.id} className="upsell-box" style={{
                                      background: barUpsellBackColor,
                                      borderBottomRightRadius: index === upsells[bundleitem.id]?.length - 1 ? cornerRadius : '',
                                      borderBottomLeftRadius: index === upsells[bundleitem.id]?.length - 1 ? cornerRadius : '',
                                    }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={bundleupsellChecked[bundleitem.id]?.[upsell.id] || false}
                                            onChange={(value) => handleBundleUpsellValueChange(bundleitem.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img" style={{ width: `${bundleAddupsellImage[bundleitem.id]?.[upsell.id]}px`, height: `${bundleAddupsellImage[bundleitem.id]?.[upsell.id]}px`, }}>
                                            <Thumbnail
                                              source={bundleBoxUpsellSelectedProduct[bundleitem.id]?.[upsell.id]?.[0]?.imageUrl || ''}
                                              alt=""
                                            />
                                          </div>
                                          <span style={{ color: barUpsellTextColor }}>
                                            {bundleBarUpsellTexts[bundleitem.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${bundleAddUpsellcalculatedPrice[bundleitem.id]?.[upsell.id] || "20"}</div>
                                          {bundleAddupselldefaultBasePrice[bundleitem.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(bundleAddupselldefaultBasePrice[bundleitem.id]?.[upsell.id]) !==
                                                parseFloat(bundleAddUpsellcalculatedPrice[bundleitem.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${bundleAddupselldefaultBasePrice[bundleitem.id]?.[upsell.id]}</s>
                                                ) : ""
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
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
                              <Text as="p" variant="bodySm" alignment="center">
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