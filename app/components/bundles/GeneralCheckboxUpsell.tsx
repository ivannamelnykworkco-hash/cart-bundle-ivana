import { BlockStack, Button, Card, Collapsible, InlineStack } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { ProductIcon } from '@shopify/polaris-icons'
import { UpsellItem } from "../common/UpsellItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";

export function GeneralCheckboxUpsell({ open, onToggle }) {

  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));

  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [sections, setSections] = useState([{ id: Date.now() }]);

  const addSection = () => {
    setSections(prev => [...prev, { id: Date.now() }])
  }

  const deleteSection = (id: any) => {
    setSections(prev => prev.filter(item => item.id !== id))
  }

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
            {sections.map((section, index) => (
              <UpsellItem number={index + 1} key={section.id} deleteId={section.id} deleteSection={deleteSection} productArray={productArray} />
            ))}
            <Button fullWidth onClick={addSection}>Add upsell</Button>
          </BlockStack>

        </Collapsible>

      </BlockStack >
    </Card >
  )
}