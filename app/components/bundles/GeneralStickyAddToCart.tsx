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
import { useCallback, useState } from 'react';
import { SettingsIcon } from '@shopify/polaris-icons';
import { ColorPickerPopoverItem } from '../common/ColorPickerPopoverItem';
import { SelectFont } from '../common/SelectFont';
import { RadioWithInput } from '../common/RadioWithInput';
import { PopUpover } from '../common/PopUpover';
import { SwitchIcon } from '../common/SwitchIcon';
import { useLoaderData } from '@remix-run/react';
import { loader } from '../product/ProductList';

export function GeneralStickyAddToCart() {
  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData.products;
  const [open, setOpen] = useState(false);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);

  const [selected, setSelected] = useState<number>(0);
  const [buttonContent, setButtonContent] = useState('Choose bundle');

  const handleTabChange = useCallback((selectedTabIndex: number) => setSelected(selectedTabIndex), []);



  const tabs = [
    { id: 'content', content: 'Content', panelID: 'content-1' },
    { id: 'style', content: 'Style', panelID: 'style-1' },
  ];

  const handleSettingsToggle = useCallback(() => setOpen((prev) => !prev), []);

  const stickyBack = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };
  const stickyText = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const stickyButton = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const stickyButtonText = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={handleSettingsToggle}
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
                    <PopUpover title='Title' defaultPopText="{{product}}" dataArray={productArray} />
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="p">Button</Text>
                    <TextField
                      label=""
                      value={buttonContent}
                      onChange={setButtonContent}
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
                    <ColorPickerPopoverItem subtitle="Background" defaultColorSetting={stickyBack} colorWidth="100%" />
                    <ColorPickerPopoverItem subtitle="Title" defaultColorSetting={stickyText} colorWidth="100%" />
                  </InlineGrid>
                  <InlineGrid columns={2} gap="100">
                    <ColorPickerPopoverItem subtitle="Button" defaultColorSetting={stickyButton} colorWidth="100%" />
                    <ColorPickerPopoverItem subtitle="Button text" defaultColorSetting={stickyButtonText} colorWidth="100%" />
                  </InlineGrid>

                  <Divider />

                  <Text variant="headingMd" as="h6">
                    Typography
                  </Text>
                  <InlineGrid columns={2} gap="200">
                    <SelectFont subtitle="Title" defaultFontSize="12" defaultFontLabel="styleRegular" />
                    <SelectFont subtitle="Button" defaultFontSize="19" defaultFontLabel="styleLight" />
                  </InlineGrid>

                  <Divider />

                  <Text variant="headingMd" as="h6">
                    Other
                  </Text>
                  <InlineGrid columns={2} gap="200">
                    <RadioWithInput title="Product photo size" defaultValue="16" />
                    <RadioWithInput title="Button padding" defaultValue="14" />
                  </InlineGrid>
                  <InlineGrid columns={2} gap="200">
                    <RadioWithInput title="Product photo corner radius" defaultValue="10" />
                    <RadioWithInput title="Button corner radius" defaultValue="15" />
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
