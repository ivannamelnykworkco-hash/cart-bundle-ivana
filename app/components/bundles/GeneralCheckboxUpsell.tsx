import { BlockStack, Button, Card, Collapsible, InlineStack } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { ProductIcon } from '@shopify/polaris-icons'
import { UpsellItem } from "../common/UpsellItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";

export function GeneralCheckboxUpsell({ open, onUpsellChange, onToggle, checkboxUpsellData, bundleId }) {

  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const initialUpsellData = (() => {
    try {
      return JSON.parse(checkboxUpsellData?.upsellData);
    } catch (e) {
      return [];
    }
  })();
  const [upsellData, setUpsellData] = useState(initialUpsellData);
  const sectionsId = upsellData.map(item => ({ id: item.deleteId }));
  const [sections, setSections] = useState(sectionsId);

  const addSection = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setSections(prev => ([...prev, { id: id }]));
    setUpsellData(prevData => ([...prevData, {
      deleteId: id,
      title: "",
      isShowLowAlert: 'false',
      selected: "discounted %",
      selectedProduct: '',
      upsellTitle: "{{product}}",
      upsellSubTitle: "Save",
      value: "20",
    }]));
    return;
  }

  const deleteSection = (id: string) => {
    //    setSections(prev => prev.filter(item => item.id !== id));
    setSections(prevSections => {
      const index = prevSections.findIndex(item => item.id === id);

      if (index === -1) {
        return prevSections;
      }
      // 1. Remove the section (UI component)
      const newSections = prevSections.filter(item => item.id !== id);
      // 2. Remove the corresponding upsellData entry
      setUpsellData(prevData => prevData.filter((_, i) => i !== index));
      return newSections;
    });
  }

  const handleOnChange = useCallback((index, data) => {
    setUpsellData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  }, []);

  useEffect(() => {
    onUpsellChange(upsellData, isShowLowAlert);
  }, [
    upsellData,
    isShowLowAlert,
    onUpsellChange
  ]);

  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={onToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={ProductIcon}
          >
            Checkbox upsells
          </Button>
          <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />

        </InlineStack>
        <Collapsible
          open={open}
          id="collapsible-settings"
          expandOnPrint
        >
          <BlockStack gap="200">
            {upsellData.map((upsellItem, index) => (
              <UpsellItem index={index} key={upsellItem.deleteId} upsellData={upsellData} deleteId={upsellItem.deleteId} deleteSection={deleteSection} productArray={productArray} onChange={handleOnChange} />
            ))}
            <Button fullWidth onClick={addSection}>Add upsell</Button>
          </BlockStack>

        </Collapsible>

      </BlockStack >
    </Card >
  )
}