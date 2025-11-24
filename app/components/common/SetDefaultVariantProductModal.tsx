import { useState, useCallback } from "react";
import {
  Box,
  Button,
  InlineStack,
  Modal,
  Text,
} from "@shopify/polaris";
import { EditIcon } from '@shopify/polaris-icons';
import { IndexDataTable } from "./IndexDataTable";

export function SetDefaultVariantProductModal({ productArray, onSelect }: {productArray: any[], onSelect: (product: any) => void}) {
  const [active, setActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✔ Open modal
  const handleOpen = useCallback(() => {
    setActive(true);
  }, []);

  // ✔ Close modal (do NOT send data)
  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  // ✔ Select a product row
  const handleSelectProduct = (product: React.SetStateAction<null>) => {
    setSelectedProduct(product);
  };

  // ✔ Save selected product & close modal
  const handleSave = () => {
    if (selectedProduct) {
      onSelect(selectedProduct);   // <-- send to parent
    }
    setActive(false);
  };

  const activator = (
    <Button icon={EditIcon} onClick={handleOpen}>
      Select product
    </Button>
  );

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleClose}
      title="Select product"      
      primaryAction={{
        content: "Select",
        onAction: handleSave,
        disabled: !selectedProduct,   // ✔ Disable when nothing selected
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleClose,
        },
      ]}
      footer={
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="bodySm" tone="subdued" as={"dd"}>
            {selectedProduct?.length ? selectedProduct?.length : 0}/{productArray?.length} products selected
          </Text>
        </InlineStack>
      }
    >
      <Modal.Section>
        <Box minHeight="500px">
          <IndexDataTable productArray={productArray} onSelect={handleSelectProduct} selectionMode="single" />
        </Box>
      </Modal.Section>
    </Modal>
  );
}
