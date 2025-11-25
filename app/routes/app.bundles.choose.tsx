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
      { success: false, error: data },
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
  const handleUpsellValueChange = useCallback((id: any, newChecked: any) => {
    setUpsellChecked(prev => ({ ...prev, [id]: newChecked }));
  }, []);


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

  const handleBundlesChooseBarUpsellTextChanges = (id: number, newText: string) => {
    setBarUpsellTexts(prev => ({
      ...prev,
      [id]: newText,
    }));
  };

  // right layout add upsell and delete upsell
  //left Layout add Quantity Breack
  const [quantityBreaks, setQuantityBreaks] = useState<BoxQuantity[]>([]);
  const addQuantityBreak = () => [
    setQuantityBreaks(prev => [...prev, { id: Date.now() }])
  ]
  const deleteQuantityBreak = (id: any) => {
    setQuantityBreaks(prev => prev.filter(item => item.id !== id))
  }
  // left layout add buy x get y 
  const [buyXGetYs, setBuyXGetYs] = useState<BoxQuantity[]>([]);
  const addBuyXGetY = () => [
    setBuyXGetYs(prev => [...prev, { id: Date.now() }])
  ]
  const deleteBuyXGetY = (id: any) => {
    setBuyXGetYs(prev => prev.filter(item => item.id !== id))
  }
  // left layout add bundleUpsell
  const [bundleUpsells, setBundleUpsells] = useState<BoxQuantity[]>([]);
  const addBundleUpsell = () => [
    setBundleUpsells(prev => [...prev, { id: Date.now() }])
  ]
  const deleteBundleUpsell = (id: any) => {
    setBundleUpsells(prev => prev.filter(item => item.id !== id))
  }
  // quantity break
  const [upsellsState, setUpsellsState] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(loaderData.selectedProduct);
  const [selectedCountry, setSelectedCountry] = useState(loaderData.selectedCountry);
  const [showOriginal, setShowOriginal] = useState(true)
  const [barTitle, setBarTitle] = useState(loaderData.barTitle);
  const [barSubTitle, setBarSubTitle] = useState(loaderData.barSubTitle);
  const [bagdeText, setBagdeText] = useState(loaderData.bagdeText);
  const [barLabelText, setBarLabelText] = useState(loaderData.barLabelText);
  const [badgeSelected, setBadgeSelected] = useState("simple");
  //buy x and get y free
  const [defaultBasePrice, setDefaultBasePrice] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState('');
  const [xybarTitle, setXyBarTitle] = useState(loaderData.xybarTitle);
  const [xybarSubTitle, setXyBarSubTitle] = useState(loaderData.xybarSubTitle);
  const [xybagdeText, setXysetBagdeText] = useState(loaderData.bagdeText);
  const [xybarLabelText, setXyBarLabelText] = useState(loaderData.barLabelText);
  const [xybadgeSelected, setXybadgeSelected] = useState("simple");
  const [xycalculatedPrice, setXyCalculatedPrice] = useState('');
  //Bundle Upsell
  const [bundleUpsellBarTitle, setBundleUpsellBarTitle] = useState(loaderData.bundleUpsellTitle);
  const [bundleUpsellSubTitle, setBundleUpsellSubTitle] = useState(loaderData.bundleUpsellSubtitle);
  const [bundleUpsellBagdeText, setBundleUpsellBagdeText] = useState(loaderData.bundleUpsellBagdeText);
  const [bunldeUpsellLabelText, setBunldeUpsellLabelText] = useState(loaderData.bunldeUpsellLabelText);
  const [bundleUpsellbadgeSelected, setBundleUpsellbadgeSelected] = useState("simple");

  // right layout add upsell and delete Upsell
  const handelonAddUpsellChange = (item: any) => {
    setUpsellsState((prev) => [...prev, item]);
  };

  const handleonDeleteUpsellChange = (id: any) => {
    setUpsellsState(prev => prev.filter((item: any) => item.id !== id));
  };

  const handlePriceChange = (price: string, defaultPrice?: string) => {
    setCalculatedPrice(price);
    if (defaultPrice) {
      setDefaultBasePrice(defaultPrice);
    }
  };
  const handleXyPriceChange = (price: string, defaultPrice?: string) => {
    setXyCalculatedPrice(price);
    if (defaultPrice) {
      setDefaultBasePrice(defaultPrice);
    }
  };

  const [addUpsellcalculatedPrice, setAddUpsellcalculatedPrice] = useState<Record<number, string>>({});
  const [addupselldefaultBasePrice, setAddupselldefaultBasePrice] = useState<Record<number, string>>({});

  const handleAddUpsellPriceChange = (
    id: number,
    price: string,
    defaultPrice?: string
  ) => {
    setAddUpsellcalculatedPrice(prev => ({
      ...prev,
      [id]: price,
    }));

    if (defaultPrice !== undefined) {
      setAddupselldefaultBasePrice(prev => ({
        ...prev,
        [id]: defaultPrice,
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
  const [barBlocktitle, setBarBlocktitle] = useState('12');
  const [barBlocktitleFontStyle, setBarBlocktitleFontStyle] = useState('styleRegular');
  const [bartitleSize, setBartitleSize] = useState('19');

  const handleTitleChange = (size: string) => {
    setBartitleSize(size);
  };
  //  title font style
  const [bartitleFontStyle, setBartitleFontStyle] = useState('styleLight');

  const handleTitleFontStyleChange = (style: string) => {
    setBartitleFontStyle(style);
  };
  //subtitle size
  const [subTitleSize, setSubTitleSize] = useState('13');
  const [subTitleStyle, setSubTitleStyle] = useState('styleRegular');

  const handleSubTitleStyleChange = (style: string) => {
    setSubTitleStyle(style);
  };
  //labelSize size
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
                    deleteId={item.id} deleteSection={deleteQuantityBreak}
                    heading="Bar #1 - Single"
                    upBundlesChooseTitleChange={setBarTitle}
                    upBundlesChooseSubTitleChange={setBarSubTitle}
                    upBundlesBadgeTextChange={setBagdeText}
                    upBunlesBarLabelTextChange={setBarLabelText}
                    upBundlesBarUpsellTextChange={handleBundlesChooseBarUpsellTextChanges}
                    upPriceChange={handlePriceChange}
                    upAddUpsellPriceChange={handleAddUpsellPriceChange}
                    upBadgeSelectedChange={setBadgeSelected}
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange} />
                ))}

                {buyXGetYs.map((buyitem) => (
                  <GeneralBuyXgetYfree
                    id={buyitem.id}
                    key={buyitem.id}
                    deleteId={buyitem.id}
                    deleteSection={deleteBuyXGetY}
                    heading=" Buy 3, get 1 free!"
                    upBundlesChooseTitleChange={setXyBarTitle}
                    upBundlesChooseSubTitleChange={setXyBarSubTitle}
                    upBundlesBadgeTextChange={setXysetBagdeText}
                    upBunlesBarLabelTextChange={setXyBarLabelText}
                    upBundlesBarUpsellTextChange={undefined}
                    upPriceChange={handleXyPriceChange}
                    upBadgeSelectedChange={setXybadgeSelected}
                    upAddUpsellPriceChange={handleAddUpsellPriceChange}
                    onAddUpsell={handelonAddUpsellChange}
                    onDeleteUpsell={handleonDeleteUpsellChange}
                  />
                ))}
                {bundleUpsells.map((bundleitem) => (
                  <GeneralBundleUpsell
                    id={bundleitem.id}
                    key={bundleitem.id}
                    deleteId={bundleitem.id}
                    deleteSection={deleteBundleUpsell}
                    heading='Complete the bundle'
                    upBundlesChooseTitleChange={setBundleUpsellBarTitle}
                    upBundlesChooseSubTitleChange={setBundleUpsellSubTitle}
                    upBundlesBadgeTextChange={setBundleUpsellBagdeText}
                    upBunlesBarLabelTextChange={setBunldeUpsellLabelText}
                    upBundlesBarUpsellTextChange={undefined}
                    upBadgeSelectedChange={setBundleUpsellbadgeSelected}
                    upAddUpsellPriceChange={handleAddUpsellPriceChange}
                    onAddUpsell={handelonAddUpsellChange}
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
                                {badgeSelected === "simple" && bagdeText && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {bagdeText}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {badgeSelected === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected ? `${spacing * 0.5 + 10}px` : badgeSelected === "simple" && bagdeText ? `${spacing * 0.5}px` : `${spacing * 0.5}px` }}>
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
                                          {barTitle}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {barLabelText}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {barSubTitle}
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
                                        ${calculatedPrice}
                                      </div>
                                      {defaultBasePrice && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(defaultBasePrice) !== parseFloat(calculatedPrice || "0") ? (
                                            <s>${defaultBasePrice}</s>
                                          ) : (
                                            `$${defaultBasePrice}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState.map(upsell => (
                                    <div key={upsell.id} className="upsell-box">
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={upsellChecked[upsell.id] || false}
                                            onChange={(value) => handleUpsellValueChange(upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span>
                                            {barUpsellTexts[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${addUpsellcalculatedPrice[upsell.id] || "20"}</div>
                                          {addupselldefaultBasePrice[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(addupselldefaultBasePrice[upsell.id]) !==
                                                parseFloat(addUpsellcalculatedPrice[upsell.id] || "20")
                                                ? (
                                                  <s>${addupselldefaultBasePrice[upsell.id]}</s>
                                                ) : (
                                                  `$${addupselldefaultBasePrice[upsell.id]}`
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
                                {xybadgeSelected === "simple" && xybagdeText && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {xybagdeText}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {xybadgeSelected === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected ? `${spacing * 0.5 + 10}px` : badgeSelected === "simple" && bagdeText ? `${spacing * 0.5}px` : `${spacing * 0.5}px` }}>
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
                                          {xybarTitle}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {xybarLabelText}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {xybarSubTitle}
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
                                        ${xycalculatedPrice}
                                      </div>
                                      {defaultBasePrice && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(defaultBasePrice) !== parseFloat(xycalculatedPrice || "0") ? (
                                            <s>${defaultBasePrice}</s>
                                          ) : (
                                            `$${defaultBasePrice}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState.map(upsell => (
                                    <div key={upsell.id} className="upsell-box">
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={upsellChecked[upsell.id] || false}
                                            onChange={(value) => handleUpsellValueChange(upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span>
                                            {barUpsellTexts[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${addUpsellcalculatedPrice[upsell.id] || "20"}</div>
                                          {addupselldefaultBasePrice[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(addupselldefaultBasePrice[upsell.id]) !==
                                                parseFloat(addUpsellcalculatedPrice[upsell.id] || "20")
                                                ? (
                                                  <s>${addupselldefaultBasePrice[upsell.id]}</s>
                                                ) : (
                                                  `$${addupselldefaultBasePrice[upsell.id]}`
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
                                {bundleUpsellbadgeSelected === "simple" && bundleUpsellBagdeText && (
                                  <div className="bundle_bar_most_popular">
                                    <div className="bundle_bar_most_popular_content" style={{
                                      background: barBadgebackColor,
                                      color: barBadgebackColor,
                                    }}>
                                      <span style={{ color: barBadgeTextColor, }}>
                                        {bundleUpsellBagdeText}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* {bundle most popular fancy} */}
                                {bundleUpsellbadgeSelected === "mostpopular" && (
                                  <div className="bundle_bar_most_popular_fancy">
                                    <MostPopularfancy barBadgeTextColor={barBadgeTextColor} barBadgebackColor={barBadgebackColor} />
                                  </div>
                                )}
                              </Box>
                              <div className="barMainContainer" style={{ borderRadius: `${cornerRadius}px`, border: '2px solid ', borderColor: 'rgb(235, 149, 149)', paddingTop: badgeSelected ? `${spacing * 0.5 + 10}px` : badgeSelected === "simple" && bagdeText ? `${spacing * 0.5}px` : `${spacing * 0.5}px` }}>
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
                                          {bundleUpsellBarTitle}
                                        </p>
                                        <div className="bar-label--text-container" style={{ background: barLabelBack, borderRadius: `${cornerRadius}px` }}>
                                          <p className="bar-label--text" style={{
                                            color: barLabelTextColor,
                                            fontSize: `${labelSize}px`,
                                            fontWeight: fontWeightMap[labelStyle as keyof typeof fontWeightMap],
                                            fontStyle: fontStyleMap[labelStyle as keyof typeof fontWeightMap],
                                          }}>
                                            {bunldeUpsellLabelText}
                                          </p>
                                        </div>
                                      </InlineStack>
                                      <span className="barSubTitle" style={{
                                        color: barSubTitleColor,
                                        fontSize: `${subTitleSize}px`,
                                        fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                        fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                      }}>
                                        {bundleUpsellSubTitle}
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
                                        ${xycalculatedPrice}
                                      </div>
                                      {defaultBasePrice && (
                                        <div className="bar-fullPrice" style={{
                                          color: barFullPriceColor,
                                          fontSize: `${subTitleSize}px`,
                                          fontWeight: fontWeightMap[subTitleStyle as keyof typeof fontWeightMap],
                                          fontStyle: fontStyleMap[subTitleStyle as keyof typeof fontWeightMap],
                                        }}>
                                          {parseFloat(defaultBasePrice) !== parseFloat(xycalculatedPrice || "0") ? (
                                            <s>${defaultBasePrice}</s>
                                          ) : (
                                            `$${defaultBasePrice}`
                                          )}
                                        </div>
                                      )}
                                    </BlockStack>
                                  </div>
                                </div>
                                {/* Add Upsell */}
                                <div className="bar-upsell-container-main">
                                  {upsellsState.map(upsell => (
                                    <div key={upsell.id} className="upsell-box">
                                      <div className="bar-upsell-container">
                                        <div className="bar-upsell-checkbox">
                                          <Checkbox
                                            label=""
                                            checked={upsellChecked[upsell.id] || false}
                                            onChange={(value) => handleUpsellValueChange(upsell.id, value)}
                                          />
                                        </div>
                                        <div className="bar-upsell-checkbox-content">
                                          <div className="bar-upsell-img"></div>
                                          <span>
                                            {barUpsellTexts[upsell.id] || "+ Add at 20% discounts"}
                                          </span>
                                        </div>
                                        <div className="bar-upsell-price">
                                          <div className="bar-upsell-discountprice"> ${addUpsellcalculatedPrice[upsell.id] || "20"}</div>
                                          {addupselldefaultBasePrice[upsell.id] && (
                                            <div className="bar-upsell-fullprice">
                                              {parseFloat(addupselldefaultBasePrice[upsell.id]) !==
                                                parseFloat(addUpsellcalculatedPrice[upsell.id] || "20")
                                                ? (
                                                  <s>${addupselldefaultBasePrice[upsell.id]}</s>
                                                ) : (
                                                  `$${addupselldefaultBasePrice[upsell.id]}`
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