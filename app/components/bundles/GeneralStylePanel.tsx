import { useState, useCallback } from "react";
import {
  Card,
  BlockStack,
  Button,
  Collapsible,
  InlineStack,
  RangeSlider,
  Box,
  Text,
  TextField,
  Divider,
  InlineGrid,
  Checkbox,
  Tabs,
} from "@shopify/polaris";

import { PaintBrushFlatIcon } from "@shopify/polaris-icons";
import { SelectableImageButton } from "../common/SelectableImageButton";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import { SelectFont } from "../common/SelectFont";



import Vertical from "app/asset/vertical.svg";
import Horizon from "app/asset/Horizon.svg";
import GridIcon from "app/asset/GridIcon.svg";
import Plain from "app/asset/Plain.svg";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";

interface GeneralStylePanelProps {
  styleHandlers: {
    upCornerRadiusChange: (...args: any[]) => void;
    upSpacingChange: (...args: any[]) => void;
    upCardsBgColorChange: (...args: any[]) => void;
    upSelectedBgColorChange: (...args: any[]) => void;
    upBorderColorChange: (...args: any[]) => void;
    upBlockTitleColorChange: (...args: any[]) => void;
    upBarTitleColorChange: (...args: any[]) => void;
    upBarSubTitleColorChange: (...args: any[]) => void;
    upBarPriceColorChange: (...args: any[]) => void;
    upBarFullPriceColorChange: (...args: any[]) => void;
    upBarlabelBackChange: (...args: any[]) => void;
    upBarlabelTextColorChange: (...args: any[]) => void;
    upBarBadgeBackColorChange: (...args: any[]) => void;
    upBarBadgeTextColorChange: (...args: any[]) => void;
    upBarUpsellBackColorChange: (...args: any[]) => void;
    upBarUpsellTextColorChange: (...args: any[]) => void;
    upSelectedBackColorChange: (...args: any[]) => void;
    upSelectedTextColorChange: (...args: any[]) => void;
    upBlockTitleChange: (...args: any[]) => void;
    upBlockTitleFontStyleChange: (...args: any[]) => void;
    upTitleChange: (...args: any[]) => void;
    upTitleFontStyleChange: (...args: any[]) => void;
    upSubTitleChange: (...args: any[]) => void;
    upSubTitleStyleChange: (...args: any[]) => void;
    upLabelChange: (...args: any[]) => void;
    upLabelStyleChange: (...args: any[]) => void;
    upUpsellSizeChange: (...args: any[]) => void;
    upUpsellStyleChange: (...args: any[]) => void;
    upUnitLabelSizeChange: (...args: any[]) => void;
    upUnitLabelStyleChange: (...args: any[]) => void;

    layoutSelectedStyle: any;
    layoutStyleOptions: any;
    onChangeLayoutStyle: any;
  };
}


export function GeneralStylePanel({
  styleHandlers,
  open,
  onToggle,
  onChangeLayoutStyle,
  layoutStyleOptions,
  layoutSelectedStyle
}) {
  const loaderData = useLoaderData<typeof loader>();
  const conf = loaderData.generalStyleConf;
  const {
    upCornerRadiusChange,
    upSpacingChange,
    upCardsBgColorChange,
    upSelectedBgColorChange,
    upBorderColorChange,
    upBlockTitleColorChange,
    upBarTitleColorChange,
    upBarSubTitleColorChange,
    upBarPriceColorChange,
    upBarFullPriceColorChange,
    upBarlabelBackChange,
    upBarlabelTextColorChange,
    upBarBadgeBackColorChange,
    upBarBadgeTextColorChange,
    upBarUpsellBackColorChange,
    upBarUpsellTextColorChange,
    upSelectedBackColorChange,
    upSelectedTextColorChange,
    upBlockTitleChange,
    upBlockTitleFontStyleChange,
    upTitleChange,
    upTitleFontStyleChange,
    upSubTitleChange,
    upSubTitleStyleChange,
    upLabelChange,
    upLabelStyleChange,
    upUpsellSizeChange,
    upUpsellStyleChange,
    upUnitLabelSizeChange,
    upUnitLabelStyleChange
  } = styleHandlers;


  const [selectedStyle, setSelectedStyle] = useState("layout1"); ///
  const [cornerRadius, setCornerRadius] = useState<any>(conf.cornerRadius);
  const [spacing, setSpacing] = useState<number>(conf.spacing);
  const [isShowCustomAlert, setIsShowCustomAlert] = useState(false);
  const [styleTabSelected, setStyleTabSelected] = useState(0);

  const headleStyleTabchange = useCallback(
    (value: number) => setStyleTabSelected(value), []
  )

  const tabs = [
    {
      id: 'all-deals',
      content: 'All deals',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'this-deal',
      content: 'This deal',
      panelID: 'accepts-marketing-content-1',
    },
  ];
  const cardsBgColor = conf.cardsBgColor;
  const selectedBgColor = conf.selectedBgColor;
  const borderColor = conf.borderColor;
  const blockTitle = conf.blockTitleColor;
  const barTitle = conf.barTitleColor;
  const barSubtitle = conf.barSubTitleColor;
  const barPrice = conf.barPriceColor;
  const barFullPrice = conf.barFullPriceColor;
  const labelBack = conf.barLabelBackColor;
  const labelText = conf.barLabelTextColor;
  const badgeBack = conf.barBadgebackColor;
  const badgeText = conf.barBadgeTextColor;
  const giftBack = "#00FF00";
  const giftText = "#00FF00";
  const giftSelectedBack = "#00FF00";
  const giftSelectedText = "#00FF00";
  const UpsellBack = conf.barUpsellBackColor;
  const UpsellText = conf.barUpsellTextColor;
  const UpsellSelectedBack = conf.barUpsellSelectedBackColor;
  const UpsellSelectedText = conf.barUpsellSelectedTextColor;
  const blockTitleSize = conf.barBlocktitle;
  const blockTitleStyle = conf.barBlocktitleFontStyle;
  const titleSize = conf.bartitleSize;
  const titleStyle = conf.bartitleFontStyle;
  const subTitleSize = conf.subTitleSize;
  const subTitleStyle = conf.subTitleStyle;
  const labelSize = conf.labelSize;
  const labelStyle = conf.labelStyle;
  const upsellSize = conf.upsellSize;
  const upsellStyle = conf.upsellStyle;
  const unitLabelSize = conf.unitLabelSize;
  const unitLabelStyle = conf.unitLabelStyle;

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="start">
          <Button
            onClick={onToggle}
            disclosure={open ? "up" : "down"}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={PaintBrushFlatIcon}
          >
            Style
          </Button>
        </InlineStack>

        <Collapsible open={open} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="400">
            <BlockStack gap="200">
              <InlineGrid columns={2}>
                {layoutStyleOptions.map((opt) => (
                  <SelectableImageButton
                    key={opt.id}
                    src={opt.src}
                    selected={layoutSelectedStyle === opt.id}
                    onClick={() => onChangeLayoutStyle(opt.id)}
                  />
                ))}
              </InlineGrid>

              <InlineStack align="space-between" gap="0">
                <Box width="48%">
                  <BlockStack gap="200" inlineAlign="stretch">
                    <Text as="p" variant="bodySm">Corner radius</Text>
                    <InlineStack gap="0" align="space-between" blockAlign="center">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "65%" }}>
                        <RangeSlider
                          value={Number(cornerRadius)} // Make sure 'cornerRadius' is already a number
                          onChange={(v: number) => {
                            setCornerRadius(v);
                            if (upCornerRadiusChange) {
                              upCornerRadiusChange(v);
                            }
                          }} // The 'onChange' should expect a number
                          min={0}
                          max={40}
                          label
                          output
                        />
                      </div>
                      <Box width="30%" minHeight="32px">
                        <TextField
                          autoComplete="off"
                          value={`${cornerRadius}`} // Convert the number to a string
                          onChange={(value) => {
                            const numValue = Number(value);
                            setCornerRadius(numValue);
                            if (upCornerRadiusChange) {
                              upCornerRadiusChange(numValue);
                            }
                          }} // Convert the string back to a number
                          min={0}
                          max={40}
                          suffix="px"
                          label
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                </Box>
                <Box width="48%">
                  <BlockStack gap="200" inlineAlign="stretch">
                    <Text as="p" variant="bodySm">Spacing</Text>

                    <InlineStack align="space-between" blockAlign="center" gap="0">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "32px", width: "100%" }}
                      >
                        <Box width="100%">
                          <RangeSlider
                            value={spacing}
                            onChange={(v: number) => {
                              setSpacing(v);
                              if (upSpacingChange) {
                                upSpacingChange(v);
                              }
                            }}
                            min={0}
                            max={100}
                            label
                            output
                          />
                        </Box>
                      </div>
                    </InlineStack>

                  </BlockStack>
                </Box>
              </InlineStack>
            </BlockStack>

            <Divider />



            <BlockStack gap="200">
              <Text variant="headingMd" as="h6">
                Colors
              </Text>
              <BlockStack gap="200">
                <Text variant="headingSm" as="h6">
                  Gerneral
                </Text>
                <BlockStack>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Cards bg" defaultColorSetting={cardsBgColor} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upCardsBgColorChange) {
                        upCardsBgColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Selected bg" defaultColorSetting={selectedBgColor} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upSelectedBgColorChange) {
                        upSelectedBgColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Border color" defaultColorSetting={borderColor} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBorderColorChange) {
                        upBorderColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Block title" defaultColorSetting={blockTitle} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBlockTitleColorChange) {
                        upBlockTitleColorChange(hex);
                      }
                    }} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Bar texts
                  </Text>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Title" defaultColorSetting={barTitle} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarTitleColorChange) {
                        upBarTitleColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Subtitle" defaultColorSetting={barSubtitle} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarSubTitleColorChange) {
                        upBarSubTitleColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Price" defaultColorSetting={barPrice} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarPriceColorChange) {
                        upBarPriceColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Full price" defaultColorSetting={barFullPrice} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarFullPriceColorChange) {
                        upBarFullPriceColorChange(hex);
                      }
                    }} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Label
                  </Text>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={labelBack} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarlabelBackChange) {
                        upBarlabelBackChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={labelText} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarlabelTextColorChange) {
                        upBarlabelTextColorChange(hex);
                      }
                    }} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Badge
                  </Text>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={badgeBack} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarBadgeBackColorChange) {
                        upBarBadgeBackColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={badgeText} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarBadgeTextColorChange) {
                        upBarBadgeTextColorChange(hex);
                      }
                    }} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Free gift
                  </Text>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={giftBack} colorWidth="100%" onColorChange={undefined} />
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={giftText} colorWidth="100%" onColorChange={undefined} />
                    <ColorPickerPopoverItem subtitle="Selected bg" defaultColorSetting={giftSelectedBack} colorWidth="100%" onColorChange={undefined} />
                    <ColorPickerPopoverItem subtitle="Selected text" defaultColorSetting={giftSelectedText} colorWidth="100%" onColorChange={undefined} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Upsell
                  </Text>
                  <InlineGrid columns={4} gap="200">
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={UpsellBack} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarUpsellBackColorChange) {
                        upBarUpsellBackColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={UpsellText} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upBarUpsellTextColorChange) {
                        upBarUpsellTextColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Selected bg" defaultColorSetting={UpsellSelectedBack} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upSelectedBackColorChange) {
                        upSelectedBackColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Selected text" defaultColorSetting={UpsellSelectedText} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upSelectedTextColorChange) {
                        upSelectedTextColorChange(hex);
                      }
                    }} />
                  </InlineGrid>
                </BlockStack>

                <Divider />
              </BlockStack>
            </BlockStack>



            {/* Typography Part */}
            <BlockStack gap="200">
              <Text variant="headingMd" as="h6">
                Typography
              </Text>
              <BlockStack gap="200">
                <InlineGrid columns={2} gap="200">
                  <SelectFont subtitle="Block title" defaultFontSize={blockTitleSize} defaultFontLabel={blockTitleStyle} onSizeChange={upBlockTitleChange} onFontStytleChange={upBlockTitleFontStyleChange} />
                  <SelectFont subtitle="Title" defaultFontSize={titleSize} defaultFontLabel={titleStyle} onSizeChange={upTitleChange} onFontStytleChange={upTitleFontStyleChange} />
                </InlineGrid>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Subtitle" defaultFontSize={subTitleSize} defaultFontLabel={subTitleStyle} onSizeChange={upSubTitleChange} onFontStytleChange={upSubTitleStyleChange} />
                    <SelectFont subtitle="Label" defaultFontSize={labelSize} defaultFontLabel={labelStyle} onSizeChange={upLabelChange} onFontStytleChange={upLabelStyleChange} />
                  </InlineGrid>
                </BlockStack>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Free gift" defaultFontSize="13" defaultFontLabel="styleBold" onSizeChange={undefined} onFontStytleChange={undefined} />
                    <SelectFont subtitle="Upsell" defaultFontSize={upsellSize} defaultFontLabel={upsellStyle} onSizeChange={upUpsellSizeChange} onFontStytleChange={upUpsellStyleChange} />
                  </InlineGrid>
                </BlockStack>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Unit label" defaultFontSize={unitLabelSize} defaultFontLabel={unitLabelStyle} onSizeChange={upUnitLabelSizeChange} onFontStytleChange={upUnitLabelStyleChange} />
                  </InlineGrid>

                </BlockStack>
              </BlockStack>
            </BlockStack>

            <Divider />

            {/* {custom styles} */}
            {/* <BlockStack>
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h6">
                  Custom Styles
                </Text>
                <Checkbox
                  label=""
                  checked={isShowCustomAlert}
                  onChange={setIsShowCustomAlert}
                />
              </InlineStack>
              {isShowCustomAlert && (
                <BlockStack>
                  <Tabs tabs={tabs} onSelect={headleStyleTabchange} selected={styleTabSelected} fitted>
                    <Box>
                      <textarea style={{ width: "100%", borderRadius: "10px", borderColor: "darkgrey", color: "#800000", aspectRatio: "1" }}>

                      </textarea>
                    </Box>
                  </Tabs>
                </BlockStack>
              )}
            </BlockStack> */}

          </BlockStack>

        </Collapsible>
      </BlockStack >
    </Card >
  );
}
