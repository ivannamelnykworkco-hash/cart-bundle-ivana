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

export function SelectProductModal({ productArray, onSelect, title, selectionMode }) {
  //inputArray: an array of product array to input
  //onSelect: an array of product array for parents
  //title: modal title
  //selectionMode: single or multiple
  const [active, setActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Open modal
  const handleOpen = useCallback(() => {
    setActive(true);
  }, []);

  // Close modal (do NOT send data)
  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  // Select a product row
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    console.log("setSelectedProduct", selectedProduct);
    // const count = selectedProduct?.filter(obj => obj.name === "variants");
  };

  // Save selected product & close modal
  const handleSave = () => {
    if (selectedProduct) {
      onSelect(selectedProduct);   // <-- send to parent
    }
    setActive(false);
  };

  const activator = (
    <Button icon={EditIcon} onClick={handleOpen} fullWidth={true} variant="primary">
      Select product
    </Button>
  );

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleClose}
      title={title}
      primaryAction={{
        content: "Select",
        onAction: handleSave,
        disabled: selectedProduct?.length === 0,   // Disable when nothing selected
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleClose,
        },
      ]}

      footer={
        <InlineStack InlineStack align="space-between" blockAlign="center" >
          <Text variant="bodySm" tone="subdued">
            {/* {selectedProduct?.length ? selectedProduct?.length : 0}/{productArray?.length} products selected */}
            {selectedProduct?.filter(obj => obj.variants).length}/{productArray?.length} products selected
          </Text>
        </InlineStack >
      }
    >
      <Modal.Section>
        <Box minHeight="500px">
          <IndexDataTable inputArray={productArray} onSelect={handleSelectProduct} selectionMode={selectionMode} />
        </Box>
      </Modal.Section>
    </Modal >
  );
}
