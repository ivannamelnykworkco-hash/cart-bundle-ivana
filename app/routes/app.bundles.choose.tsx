import { useCallback, useEffect, useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { PlusCircleIcon, DiscountIcon, MegaphoneIcon, ProductIcon } from '@shopify/polaris-icons';

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
  hsbToHex,
  Checkbox,
  TextField,
  Toast,
  Frame,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { GeneralSettingsPanel } from "app/components/bundles/GeneralSettingsPanel";
import { GeneralStylePanel } from "app/components/bundles/GeneralStylePanel";
import { GeneralVolumePanel } from "app/components/bundles/GeneralVolumePanel";
import { GeneralCheckboxUpsell } from "app/components/bundles/GeneralCheckboxUpsell";
import { GeneralStickyAddToCart } from "app/components/bundles/GeneralStickyAddToCart";
import { GeneralQuentityBreack } from "app/components/bundles/GeneralQuentityBreack";
import { CountDownPanel } from "app/components/bundles/CountDownPanel";
import { MostPopularfancy } from "app/components/common/MostPopularfancy";
import { createCountdownTimer, getCountdownTimer, updateCountdownTimer } from "app/models/countdownTimer.server";
import { CountdownTimer } from "app/models/types";
import { GeneralBuyXgetYfree } from "app/components/bundles/GeneralBuyXgetYfree";
import { GeneralBundleUpsell } from "app/components/bundles/GeneralBundleUpsell";
import { builtinModules } from "module";
// import { getCountdownTimer } from "app/models/countdownTimer.server";
// import { CountdownTimer } from "app/models/types";

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
    variants: node.variants?.edges ?? null
  }));
  //Collection data from backend
  const collectionEdges = body?.data?.collections.edges ?? [];
  const collections = collectionEdges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    imageUrl: node.image?.url ?? "",
  }));

  //  const createPrisma = await createCountdownTimer();
  const countdownTimerConf = await getCountdownTimer();

  return json({
    bundleName: "Bundle",
    unitLabel: '',
    discountName: "",
    blockTitle: "BUNDLE & SAVE",
    visibility: "all",
    markets: "all",
    roundingValue: '.90',
    updatePriceSelect: 'Price per item',
    excludeB2B: false,
    excludePOS: false,
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:09",
    selectedProduct: "Gift Card",
    selectedCountry: "United States",
    showStock: 1,
    // Design settings
    primaryColor: "#000000",
    secondaryColor: "#10b981",
    borderRadius: 8,
    fontSize: 14,
    barTitle: 'Single',
    barSubTitle: 'Standard price',
    bagdeText: '',
    barLabelText: "",
    barDefaultQuality: '1',
    barDefaultPrice: '702.45',
    barAddUpsellDefaultPrice: '20',
    barUpsellText: '+ Add at 20% discount',
    xybarTitle: 'Buy 3, get 1 free!',
    xybarSubTitle: '',
    xybagdeText: '',
    xybarLabelText: '',
    bundleUpsellTitle: 'Complete the bundle',
    bundleUpsellSubtitle: 'Save {{saved_amount}}!',
    bundleUpsellBagdeText: '',
    bunldeUpsellLabelText: '',
    buyQualityalue: 3,
    getQualityalue: 1,

    // Upsell products
    upsellProducts: [
      { id: "1", title: "Product A", price: "$25.00", image: "" },
      { id: "2", title: "Product B", price: "$35.00", image: "" },
    ],
    products,
    collections,
    countdownTimerConf
  });
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
    const result = await updateCountdownTimer(data.id, data);
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
  const loaderData = useLoaderData<typeof loader>();
  /*recevie response from action function*/
  const actionData = useActionData();
  console.log("---", actionData);
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

  const handleCountdownTimerChange = useCallback((updated: any) => {
    setCountdownTimerData(prev => ({ ...prev, ...updated }));
  }, []);

  // Send data to action
  const submit = useSubmit();

  function saveData() {
    const data = new FormData();
    Object.entries(countdownTimerData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        data.append(key, JSON.stringify(value));
      }
      else {
        data.append(key, value as string);
      }
    });
    console.log("ididid", data.id);
    console.log("Formdata", data.id);

    submit(data, { method: "post" });
    //   const result = response.json();

    //   if (response.ok) {
    //     console.log("response-ok", response);
    //     showToast('Countdown timer created successfully!', 'success');
    //   } else {
    //     showToast(`Error: ${result.error || 'Unknown error'}`, 'error');
    //     console.log("unknow error", response);
    //   }
    // } catch (error) {
    //   showToast(`Network error: ${error.message}`, 'error');

    // }
  }
  /***************Database Migration Part************/

  //id: ==> upsellTexts state.,
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
  const [upsellsState, setUpsellsState] = useState<{ [bundleId: string]: any[] }>({});
  const [productsState, setProductsState] = useState<{ [bundleId: string]: any[] }>({});
  const [selectedProduct, setSelectedProduct] = useState(loaderData.selectedProduct);
  const [selectedCountry, setSelectedCountry] = useState(loaderData.selectedCountry);
  const [showOriginal, setShowOriginal] = useState(true)
  const [barTitle, setBarTitle] = useState({});
  const [barSubTitle, setBarSubTitle] = useState({});
  const [bagdeText, setBagdeText] = useState({});
  const [barLabelText, setBarLabelText] = useState({});
  const [badgeSelected, setBadgeSelected] = useState({});
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

  // right layout add upsell and delete Upsell
  const handelonAddUpsellChange = (bundleId: string | number, item: any) => {
    setUpsellsState(prev => ({
      ...prev,
      [bundleId]: [...(prev[bundleId] || []), item]
    }));
  };

  const handleonDeleteUpsellChange = (bundleId: string | number, upsellId: any) => {
    setUpsellsState(prev => ({
      ...prev,
      [bundleId]: (prev[bundleId] || []).filter(item => item.id !== upsellId)
    }));
  };

  //product add
  const hanldeonAddProductChange = (bundleId: string | number, item: any) => {
    setProductsState(prev => ({
      ...prev,
      [bundleId]: [...(prev[bundleId] || []), item]
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

  const [addUpsellcalculatedPrice, setAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [addupselldefaultBasePrice, setAddupselldefaultBasePrice] = useState<Record<number, string>>({});
  const [xyaddUpsellcalculatedPrice, setXyAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [xyaddupselldefaultBasePrice, setXyAddupselldefaultBasePrice] = useState<Record<number, string>>({});
  const [bundleAddUpsellcalculatedPrice, setBundleAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [bundleAddupselldefaultBasePrice, setBundleAddupselldefaultBasePrice] = useState<Record<number, string>>({});

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
  // color style and text style
  const [cornerRadius, setCornerRadius] = useState(8);
  const [spacing, setSpacing] = useState(20);
  const [cardsBgColor, setCardsBgColor] = useState(hsbToHex({ hue: 0, saturation: 0.07, brightness: 1 }));
  const [blockTitleColor, setBlockTitleColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0 }));
  const [barTitleColor, setBarTitleColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0 }));
  const [barSubTitleColor, setBarSubTitleColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0.33 }));
  const [barPriceColor, setBarPriceColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0 }));
  const [barFullPriceColor, setBarFullPriceColor] = useState(hsbToHex({ hue: 0, saturation: 0.04, brightness: 0.53 }));
  const [barLabelBack, setBarLabelBack] = useState(hsbToHex({ hue: 36, saturation: 0.15, brightness: 1 }));
  const [barLabelTextColor, setBarLabelTextColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0 }));
  const [barBadgebackColor, setBarBadgebackColor] = useState(hsbToHex({ hue: 36, saturation: 1, brightness: 1 }));
  const [barBadgeTextColor, setBarBadgeTextColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 1 }));
  const [barUpsellBackColor, setBarUpsellBackColor] = useState(hsbToHex({ hue: 0, saturation: 0.2, brightness: 1 }));
  const [barUpsellTextColor, setBarUpsellTextColor] = useState(hsbToHex({ hue: 0, saturation: 0, brightness: 0 }));
  const [barBlocktitle, setBarBlocktitle] = useState('12');
  const [barBlocktitleFontStyle, setBarBlocktitleFontStyle] = useState('styleRegular');
  const [bartitleSize, setBartitleSize] = useState('19');
  const [bartitleFontStyle, setBartitleFontStyle] = useState('stylebold');  //subtitle size
  const [subTitleSize, setSubTitleSize] = useState('13');
  const [subTitleStyle, setSubTitleStyle] = useState('styleRegular');
  const [labelSize, setLabelSize] = useState('13');
  const [labelStyle, setLabelStyle] = useState('styleRegular');  //

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
    //text
    upBlockTitleChange: setBarBlocktitle,
    upBlockTitleFontStyleChange: setBarBlocktitleFontStyle,
    upTitleChange: setBartitleSize,
    upTitleFontStyleChange: setBartitleFontStyle,
    upSubTitleChange: setSubTitleSize,
    upSubTitleStyleChange: setSubTitleStyle,
    upLabelChange: setLabelSize,
    upLabelStyleChange: setLabelStyle,
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
                <GeneralSettingsPanel loaderData={loaderData} />
                <GeneralStylePanel styleHandlers={styleHandlers} />
                <GeneralVolumePanel />
                <CountDownPanel conf={loaderData.countdownTimerConf} onChange={handleCountdownTimerChange} />
                <GeneralCheckboxUpsell />
                <GeneralStickyAddToCart />
                {quantityBreaks.map((item) => (
                  <GeneralQuentityBreack
                    id={item.id}
                    key={item.id}
                    bundleId={item.id}
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
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange} />
                ))}

                {buyXGetYs.map((buyitem) => (
                  <GeneralBuyXgetYfree
                    id={buyitem.id}
                    key={buyitem.id}
                    bundleId={buyitem.id}
                    deleteSection={deleteBuyXGetY}
                    heading=" Buy 3, get 1 free!"
                    upBundlesChooseTitleChange={handlexyBarTitleChange}
                    upBundlesChooseSubTitleChange={handlexyBarSubTitleChange}
                    upBundlesBadgeTextChange={handlexyBagdeTextChange}
                    upBunlesBarLabelTextChange={handlexyBarLabelTextChange}
                    upBundlesBarUpsellTextChange={handlexyBundlesChooseBarUpsellTextChanges}
                    upPriceChange={handlexyPriceChange}
                    upBadgeSelectedChange={handlexyBadgeSelectedChange}
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
                    deleteSection={deleteBundleUpsell}
                    heading='Complete the bundle'
                    upBundlesChooseTitleChange={handleBundleUpsellTitleChange}
                    upBundlesChooseSubTitleChange={handleBundleUpsellSubTitleChange}
                    upBundlesBadgeTextChange={handleBundleUpsellTextChange}
                    upBunlesBarLabelTextChange={handleBundleUpsellLabelTextChange}
                    upBundlesBarUpsellTextChange={handlexyBundleBaraddUpsellTextChanges}
                    upBadgeSelectedChange={handleBundleUpsellSelectedChange}
                    upAddUpsellPriceChange={handleBundleAddUpsellPriceChange}
                    onAddUpsell={handelonAddUpsellChange}
                    onAddProduct={hanldeonAddProductChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
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
                        <BlockStack gap="200">
                          {quantityBreaks.map((item) => (
                            <div key={item.id} className="main-quantity-break">
                              <Box position="relative">
                                {/* {bundle most popular} */}
                                {badgeSelected[item.id] === "simple" && bagdeText[item.id] && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
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
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected[item.id] ? `${spacing * 0.5 + 10}px` : badgeSelected[item.id] === "simple" && bagdeText[item.id] ? `${spacing * 0.5}px` : `${spacing * 0.5}px`, backgroundColor: cardsBgColor }}>
                                <div style={{ padding: `${spacing * 0.5}px ${spacing}px`, backgroundColor: cardsBgColor, display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                  <InlineStack gap="200" blockAlign="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid #ddd",
                                      }}
                                    />
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
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
                                          ) : (
                                            `$${defaultBasePrice[item.id]}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState[item.id]?.map(upsell => (
                                    <div key={upsell.id} className="upsell-box" style={{ background: barUpsellBackColor }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">

                                          <Checkbox
                                            label=""
                                            checked={upsellChecked[item.id]?.[upsell.id] || false}
                                            onChange={(value) => handleUpsellValueChange(item.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span tyle={{ color: barUpsellTextColor }}>
                                            {barUpsellTexts[item.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${addUpsellcalculatedPrice[item.id]?.[upsell.id] || "20"}</div>
                                          {addupselldefaultBasePrice[item.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(addupselldefaultBasePrice[item.id]?.[upsell.id]) !==
                                                parseFloat(addUpsellcalculatedPrice[item.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${addupselldefaultBasePrice[item.id]?.[upsell.id]}</s>
                                                ) : (
                                                  `$${addupselldefaultBasePrice[item.id]?.[upsell.id]}`
                                                )
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
                            <div key={buyitem.id} className="main-buyX-getY">
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
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected ? `${spacing * 0.5 + 10}px` : badgeSelected === "simple" && bagdeText ? `${spacing * 0.5}px` : `${spacing * 0.5}px`, backgroundColor: cardsBgColor }}>
                                <div style={{ padding: `${spacing * 0.5}px ${spacing}px`, backgroundColor: cardsBgColor, display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                  <InlineStack gap="200" blockAlign="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid #ddd",
                                      }}
                                    />
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
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
                                          ) : (
                                            `$${xydefaultBasePrice[buyitem.id]}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState[buyitem.id]?.map(upsell => (
                                    <div key={upsell.id} className="upsell-box" style={{ background: barUpsellBackColor }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={xyupsellChecked[buyitem.id]?.[upsell.id] || false}
                                            onChange={(value) => handleXyUpsellValueChange(buyitem.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span style={{ color: barUpsellTextColor }}>
                                            {xybarUpsellTexts[buyitem.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${xyaddUpsellcalculatedPrice[buyitem.id]?.[upsell.id] || "20"}</div>
                                          {addupselldefaultBasePrice[buyitem.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id]) !==
                                                parseFloat(xyaddUpsellcalculatedPrice[buyitem.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id]}</s>
                                                ) : (
                                                  `$${xyaddupselldefaultBasePrice[buyitem.id]?.[upsell.id]}`
                                                )
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
                          {bundleUpsells.map((bundleItem) => (
                            <div key={bundleItem.id} className="main-bundle-upsell">
                              <Box position="relative">
                                {/* {bundle most popular} */}
                                {bundleUpsellbadgeSelected[bundleItem.id] === "simple" && bundleUpsellBagdeText[bundleItem.id] && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {bundleUpsellBagdeText[bundleItem.id]}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {bundleUpsellbadgeSelected[bundleItem.id] === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected[bundleItem.id] ? `${spacing * 0.5 + 10}px` : badgeSelected[bundleItem.id] === "simple" && bagdeText[bundleItem.id] ? `${spacing * 0.5}px` : `${spacing * 0.5}px`, backgroundColor: cardsBgColor }}>
                                <div style={{ padding: `${spacing * 0.5}px ${spacing}px`, backgroundColor: cardsBgColor, display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                  <InlineStack gap="200" blockAlign="center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        border: "2px solid #ddd",
                                      }}
                                    />
                                    <BlockStack gap="050">
                                      <InlineStack gap="100">
                                        <p className="barTitle" style={{
                                          color: barTitleColor,
                                          fontSize: `${bartitleSize}px`,
                                          fontWeight: fontWeightMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[bartitleFontStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {bundleUpsellBarTitle[bundleItem.id] || 'Complete the bundle'}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {bunldeUpsellLabelText[bundleItem.id]}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {bundleUpsellSubTitle[bundleItem.id] || 'Save $180.49!'}
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
                                        ${xycalculatedPrice[bundleItem.id]}
                                      </div>
                                      {defaultBasePrice && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(defaultBasePrice[bundleItem.id]) !== parseFloat(xycalculatedPrice[bundleItem.id] || "0") ? (
                                            <s>${defaultBasePrice[bundleItem.id]}</s>
                                          ) : (
                                            `$${defaultBasePrice[bundleItem.id]}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* {layout} */}
                                <div className="main_bundles-products--container" style={{ flexDirection: 'row' }}>
                                  {productsState[bundleItem.id]?.map((product) => (
                                    <div key={product.id} className="bundles-products">
                                      <div className="bundles-products__product">
                                        <div className="bundles-products__product--image">image</div>
                                        <div className="bundles-products__product--title">product title</div>
                                        <div className="bundles-products__product--price">
                                          <div className="bundles-produts_product--price-fullprice">30</div>
                                          <div className="bundles-produts_product--price-compareprice">50</div>
                                        </div>
                                      </div>
                                      <div className="bundles-products__divider">
                                        <div className="products__divider-inline" style={{ backgroundColor: 'red' }}></div>
                                        <div className="products__divider-icon">
                                          <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"></circle><path fill="#fff" d="M5 9h10v2H5z"></path><path fill="#fff" d="M11 5v10H9V5z"></path></svg>
                                        </div>
                                        <div className="products__divider-inline" style={{ backgroundColor: 'red' }}></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState[bundleItem.id]?.map(upsell => (
                                    <div key={upsell.id} className="upsell-box" style={{ background: barUpsellBackColor }}>
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={bundleupsellChecked[bundleItem.id]?.[upsell.id] || false}
                                            onChange={(value) => handleBundleUpsellValueChange(bundleItem.id, upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span style={{ color: barUpsellTextColor }}>
                                            {bundleBarUpsellTexts[bundleItem.id]?.[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${bundleAddUpsellcalculatedPrice[bundleItem.id]?.[upsell.id] || "20"}</div>
                                          {bundleAddupselldefaultBasePrice[bundleItem.id]?.[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(bundleAddupselldefaultBasePrice[bundleItem.id]?.[upsell.id]) !==
                                                parseFloat(bundleAddUpsellcalculatedPrice[bundleItem.id]?.[upsell.id] || "20")
                                                ? (
                                                  <s>${bundleAddupselldefaultBasePrice[bundleItem.id]?.[upsell.id]}</s>
                                                ) : (
                                                  `$${bundleAddupselldefaultBasePrice[bundleItem.id]?.[upsell.id]}`
                                                )
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
                        </BlockStack>
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
                          {/* <Box
                      padding="300"
                      background="bg-surface"
                      borderRadius="100"
                    >
                      <BlockStack gap="200">
                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                          You may also like
                        </Text>
                        <InlineStack gap="200">
                          {upsellProducts.slice(0, 3).map((product) => (
                            <Box
                              key={product.id}
                              padding="200"
                              borderWidth="025"
                              borderColor="border"
                              borderRadius="100"
                              minWidth="30%"
                            >
                              <BlockStack gap="100">
                                <div
                                  style={{
                                    width: "100%",
                                    height: "80px",
                                    background: "#f5f5f5",
                                    borderRadius: "8px",
                                  }}
                                />
                                <Text as="p" variant="bodySm" truncate>
                                  {product.title}
                                </Text>
                                <Text
                                  as="p"
                                  variant="bodySm"
                                  fontWeight="semibold"
                                >
                                  {product.price}
                                </Text>
                              </BlockStack>
                            </Box>
                          ))}
                        </InlineStack>
                      </BlockStack>
                    </Box> */}
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </div>
            </Layout.Section>
          </InlineGrid>
        </Box>
        {toastActive && (
          <Frame>
            <Toast
              content={toastContent}
              onDismiss={handleToastDismiss}
              error={toastError} // Optional: style as error
            />
          </Frame>
        )}
      </Layout>
    </Page>
  );
}