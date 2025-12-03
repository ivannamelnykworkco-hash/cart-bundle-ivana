import {
  BlockStack,
  Button,
  Card,
  Collapsible,
  Divider,
  InlineGrid,
  InlineStack,
  Tabs,
  Text,
  TextField,
} from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { SettingsIcon } from '@shopify/polaris-icons';
import { ColorPickerPopoverItem } from '../common/ColorPickerPopoverItem';
import { SelectFont } from '../common/SelectFont';
import { RadioWithInput } from '../common/RadioWithInput';
import { PopUpover } from '../common/PopUpover';
import { SwitchIcon } from '../common/SwitchIcon';
import { useLoaderData } from '@remix-run/react';
import type { loader } from '../product/ProductList';

export function GeneralStickyAddToCart({ open, onToggle, onDataChange }) {
  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData.products;
  const conf = loaderData.generalStickyAddConf;
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [selected, setSelected] = useState<number>(0);
  const [contentButtonText, setContentButtonText] = useState(conf.contentButtonText);
  const [contentTitleText, setContentTitleText] = useState(conf.contentTitleText);
  const [styleBgColor, setStyleBgColor] = useState(conf.styleBgColor);
  const [styleTitleColor, setStyleTitleColor] = useState(conf.styleTitleColor);
  const [styleButtonColor, setStyleButtonColor] = useState(conf.styleButtonColor);
  const [styleButtonTextColor, setStyleButtonTextColor] = useState(conf.styleButtonTextColor);
  const [styleTitleFontSize, setStyleTitleFontSize] = useState(conf.styleTitleFontSize);
  const [styleTitleFontStyle, setStyleTitleFontStyle] = useState(conf.styleTitleFontStyle);
  const [styleButtonFontSize, setStyleButtonFontSize] = useState(conf.styleButtonFontSize);
  const [styleButtonFontStyle, setStyleButtonFontStyle] = useState(conf.styleButtonFontStyle);
  const [stylePhotoSize, setStylePhotoSize] = useState(conf.stylePhotoSize);
  const [stylePhotoCornerRadius, setStyleButtonPadding] = useState(conf.stylePhotoCornerRadius);
  const [styleButtonPadding, setStylePhotoCornerRadius] = useState(conf.styleButtonPadding);
  const [styleButtonCornerRadius, setStyleButtonCornerRadius] = useState(conf.styleButtonCornerRadius);
  const tabs = [
    { id: 'content', content: 'Content', panelID: 'content-1' },
    { id: 'style', content: 'Style', panelID: 'style-1' },
  ];
  const handleTabChange = useCallback((selectedTabIndex: number) => setSelected(selectedTabIndex), []);
  const handleSettingsToggle = useCallback(() => setOpen((prev) => !prev), []);
  const handleStyleBgColorChange = (data) => {
    setStyleBgColor(data);
  };
  const handleStyleTitleColorChange = (data) => {
    setStyleTitleColor(data);
  };
  const handleStyleButtonColorChange = (data) => {
    setStyleButtonColor(data);
  };
  const handleStyleButtonTextColorChange = (data) => {
    setStyleButtonTextColor(data);
  };
  const handleStyleTitleFontSizeChange = (data) => {
    setStyleTitleFontSize(data);
  };
  const handleStyleTitleFontStyleChange = (data) => {
    setStyleTitleFontStyle(data);
  };
  const handleStyleButtonFontSizeChange = (data) => {
    setStyleButtonFontSize(data);
  };
  const handleStyleButtonFontStyleChange = (data) => {
    setStyleButtonFontStyle(data);
  };
  const handleStylePhotoSizeChange = (data) => {
    setStylePhotoSize(data);
  };
  const handleStyleButtonPaddingChange = (data) => {
    setStyleButtonPadding(data);
  };
  const handleStylePhotoCornerRadiusChange = (data) => {
    setStylePhotoCornerRadius(data);
  };
  const handleStyleButtonCornerRadiusChange = (data) => {
    setStyleButtonCornerRadius(data);
  };


  const id = conf.id;
  const bundleId = conf.bundleId;
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        id,
        bundleId,
        contentTitleText,
        contentButtonText,
        styleBgColor,
        styleTitleColor,
        styleButtonColor,
        styleButtonTextColor,
        styleTitleFontSize,
        styleTitleFontStyle,
        styleButtonFontSize,
        styleButtonFontStyle,
        stylePhotoSize,
        stylePhotoCornerRadius,
        styleButtonPadding,
        styleButtonCornerRadius,
      });
    }
  }, [
    contentTitleText,
    contentButtonText,
    styleBgColor,
    styleTitleColor,
    styleButtonColor,
    styleButtonTextColor,
    styleTitleFontSize,
    styleTitleFontStyle,
    styleButtonFontSize,
    styleButtonFontStyle,
    stylePhotoSize,
    stylePhotoCornerRadius,
    styleButtonPadding,
    styleButtonCornerRadius,
    onDataChange
  ]);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={onToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={SettingsIcon}
          >
            Sticky add to cart
          </Button>
          <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
        </InlineStack>
        <Collapsible open={open} id="collapsible-settings" expandOnPrint>
          <BlockStack>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
              {tabs[selected].content === 'Content' && (
                <InlineGrid columns={2} gap="200">
                  <BlockStack>
                    <PopUpover title='Title' defaultPopText={contentTitleText} dataArray={productArray} />
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="p">Button</Text>
                    <TextField
                      label=""
                      value={contentButtonText}
                      onChange={setContentButtonText}
                      autoComplete="off"
                      aria-label="Button content"
                    />
                  </BlockStack>
                </InlineGrid>
              )}
              {/* Style Tab */}
              {tabs[selected].content === 'Style' && (
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h6">
                    Colors
                  </Text>
                  <InlineGrid columns={2} gap="100">
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={styleBgColor} colorWidth="100%" onColorChange={handleStyleBgColorChange} />
                    <ColorPickerPopoverItem subtitle="Title" defaultColorSetting={styleTitleColor} colorWidth="100%" onColorChange={handleStyleTitleColorChange} />
                  </InlineGrid>
                  <InlineGrid columns={2} gap="100">
                    <ColorPickerPopoverItem subtitle="Button" defaultColorSetting={styleButtonColor} colorWidth="100%" onColorChange={handleStyleButtonColorChange} />
                    <ColorPickerPopoverItem subtitle="Button text" defaultColorSetting={styleButtonTextColor} colorWidth="100%" onColorChange={handleStyleButtonTextColorChange} />
                  </InlineGrid>
                  <Divider />
                  <Text variant="headingMd" as="h6">
                    Typography
                  </Text>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Title" defaultFontSize={styleTitleFontSize} defaultFontLabel={styleTitleFontStyle} onSizeChange={handleStyleTitleFontSizeChange} onFontStytleChange={handleStyleTitleFontStyleChange} />
                    <SelectFont subtitle="Button" defaultFontSize={styleButtonFontSize} defaultFontLabel={styleButtonFontStyle} onSizeChange={handleStyleButtonFontSizeChange} onFontStytleChange={handleStyleButtonFontStyleChange} />
                  </InlineGrid>

                  <Divider />

                  <Text variant="headingMd" as="h6">
                    Other
                  </Text>
                  <InlineGrid columns={2} gap="200">
                    <RadioWithInput title="Product photo size" defaultValue={stylePhotoSize} onChange={handleStylePhotoSizeChange} />
                    <RadioWithInput title="Button padding" defaultValue={styleButtonPadding} onChange={handleStyleButtonPaddingChange} />
                  </InlineGrid>
                  <InlineGrid columns={2} gap="200">
                    <RadioWithInput title="Product photo corner radius" defaultValue={stylePhotoCornerRadius} onChange={handleStylePhotoCornerRadiusChange} />
                    <RadioWithInput title="Button corner radius" defaultValue={styleButtonCornerRadius} onChange={handleStyleButtonCornerRadiusChange} />
                  </InlineGrid>
                </BlockStack>
              )}
            </Tabs>
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}
