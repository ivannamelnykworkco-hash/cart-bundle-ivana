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

interface GeneralStylePanelProps {
  styleHandlers: {
    upCornerRadiusChange: (...args: any[]) => void;
    upSpacingChange: (...args: any[]) => void;
    upCardsBgColorChange: (...args: any[]) => void;
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

    upBlockTitleChange: (...args: any[]) => void;
    upBlockTitleFontStyleChange: (...args: any[]) => void;
    upTitleChange: (...args: any[]) => void;
    upTitleFontStyleChange: (...args: any[]) => void;
    upSubTitleChange: (...args: any[]) => void;
    upSubTitleStyleChange: (...args: any[]) => void;
    upLabelChange: (...args: any[]) => void;
    upLabelStyleChange: (...args: any[]) => void;
  };
}

export function GeneralStylePanel({ styleHandlers }: GeneralStylePanelProps) {

  const {
    upCornerRadiusChange,
    upSpacingChange,
    upCardsBgColorChange,
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

    upBlockTitleChange,
    upBlockTitleFontStyleChange,
    upTitleChange,
    upTitleFontStyleChange,
    upSubTitleChange,
    upSubTitleStyleChange,
    upLabelChange,
    upLabelStyleChange,
  } = styleHandlers;

  const [openStyle, setOpenStyle] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("layout1");
  const [cornerRadius, setCornerRadius] = useState<any>(32);
  const [spacing, setSpacing] = useState<number>(20);
  const [isShowCustomAlert, setIsShowCustomAlert] = useState(false);
  const [styleTabSelected, setStyleTabSelected] = useState(0);

  const headleStyleTabchange = useCallback(
    (value: number) => setStyleTabSelected(value), []
  )


  const styleOptions = [
    { id: "layout1", src: Vertical },
    { id: "layout2", src: Horizon },
    { id: "layout3", src: GridIcon },
    { id: "layout4", src: Plain },
  ];

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

  const cardsBg = {
    hue: 0,
    saturation: 0.07,
    brightness: 1,
    alpha: 1,
  };
  const selectedBg = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };
  const borderColor = {
    hue: 0,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  };
  const blockTitle = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const barTitle = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const barSubtitle = {
    hue: 0,
    saturation: 0,
    brightness: 0.33,
    alpha: 1,
  };
  const barPrice = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const barFullPrice = {
    hue: 0,
    saturation: 0,
    brightness: 0.33,
    alpha: 1,
  };
  const labelBack = {
    hue: 36,
    saturation: 0.15,
    brightness: 1,
    alpha: 1,
  };
  const labelText = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const badgeBack = {
    hue: 36,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  };
  const badgeText = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };
  const giftBack = {
    hue: 36,
    saturation: 0.3,
    brightness: 1,
    alpha: 1,
  };
  const giftText = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const giftSelectedBack = {
    hue: 0,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  };
  const giftSelectedText = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };

  //upsell
  const UpsellBack = {
    hue: 36,
    saturation: 0.3,
    brightness: 1,
    alpha: 1,
  };
  const UpsellText = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const UpsellSelectedBack = {
    hue: 36,
    saturation: 0.2,
    brightness: 1,
    alpha: 1,
  };
  const UpsellSelectedText = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };

  const handleSettingsToggle = useCallback(
    () => setOpenStyle((open) => !open),
    []
  );


  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="start">
          <Button
            onClick={handleSettingsToggle}
            disclosure={openStyle ? "up" : "down"}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={PaintBrushFlatIcon}
          >
            Style
          </Button>
        </InlineStack>

        <Collapsible open={openStyle} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="400">
            <BlockStack gap="200">
              <InlineStack gap="0" wrap={true} align="space-between">
                {styleOptions.map((opt) => (
                  <SelectableImageButton
                    key={opt.id}
                    src={opt.src}
                    selected={selectedStyle === opt.id}
                    onClick={() => setSelectedStyle(opt.id)}
                  />
                ))}
              </InlineStack>

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
                    <ColorPickerPopoverItem subtitle="Cards bg" defaultColorSetting={cardsBg} colorWidth="100%" onColorChange={(hex: string) => {
                      if (upCardsBgColorChange) {
                        upCardsBgColorChange(hex);
                      }
                    }} />
                    <ColorPickerPopoverItem subtitle="Selected bg" defaultColorSetting={selectedBg} colorWidth="100%" onColorChange={undefined} />
                    <ColorPickerPopoverItem subtitle="Border color" defaultColorSetting={borderColor} colorWidth="100%" onColorChange={undefined} />
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
                    <ColorPickerPopoverItem subtitle="Selected bg" defaultColorSetting={UpsellSelectedBack} colorWidth="100%" onColorChange={undefined} />
                    <ColorPickerPopoverItem subtitle="Selected text" defaultColorSetting={UpsellSelectedText} colorWidth="100%" onColorChange={undefined} />
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
                  <SelectFont subtitle="Block title" defaultFontSize="12" defaultFontLabel="styleRegular" onSizeChange={upBlockTitleChange} onFontStytleChange={upBlockTitleFontStyleChange} />
                  <SelectFont subtitle="Title" defaultFontSize="19" defaultFontLabel="styleBold" onSizeChange={upTitleChange} onFontStytleChange={upTitleFontStyleChange} />
                </InlineGrid>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Subtitle" defaultFontSize="13" defaultFontLabel="styleLightItalic" onSizeChange={upSubTitleChange} onFontStytleChange={upSubTitleStyleChange} />
                    <SelectFont subtitle="Label" defaultFontSize="11" defaultFontLabel="styleLightItalic" onSizeChange={upLabelChange} onFontStytleChange={upLabelStyleChange} />
                  </InlineGrid>
                </BlockStack>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Free gift" defaultFontSize="13" defaultFontLabel="styleBold" onSizeChange={undefined} onFontStytleChange={undefined} />
                    <SelectFont subtitle="Upsell" defaultFontSize="13" defaultFontLabel="styleBold" onSizeChange={undefined} onFontStytleChange={undefined} />
                  </InlineGrid>
                </BlockStack>

                <Divider />

                <BlockStack>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Unit label" defaultFontSize="14" defaultFontLabel="styleRegular" onSizeChange={undefined} onFontStytleChange={undefined} />
                  </InlineGrid>

                </BlockStack>
              </BlockStack>
            </BlockStack>

            <Divider />

            {/* {custom styles} */}
            <BlockStack>
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
            </BlockStack>

          </BlockStack>

        </Collapsible>
      </BlockStack >
    </Card >
  );
}
