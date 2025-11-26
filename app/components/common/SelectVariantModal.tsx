import { useState, useCallback, useContext } from "react";
import {
  Box,
  Button,
  InlineStack,
  Modal,
  Text,
} from "@shopify/polaris";
import { EditIcon } from '@shopify/polaris-icons';
import { IndexDataTable } from "./IndexDataTable";

export function SelectVariantModal({ variantArray, onSelect, title, selectionMode }) {
  //inputArray: an array of product array to input
  //onSelect: an array of product array for parents
  //title: modal title
  //selectionMode: single or multiple
  const [active, setActive] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // Open modal
  const handleOpen = useCallback(() => {
    setActive(true);
  }, []);
  // Close modal (do NOT send data)
  const handleClose = useCallback(() => {
    setActive(false);
  }, []);
  // Select a Variant row
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };
  // Save selected variant & close modal
  const handleSave = () => {
    if (selectedVariant) {
      onSelect(selectedVariant);   // <-- send to parent
    }
    setActive(false);
  };

  const activator = (
    <Button icon={EditIcon} onClick={handleOpen} fullWidth={true} variant="primary">
      Select variant
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
        disabled: !selectedVariant,   // Disable when nothing selected
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleClose,
        },
      ]}
      footer={
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="bodySm" tone="subdued">
            {/* {selectedVariant?.length ? selectedVariant?.length : 0}/1 variants selected */}
          </Text>
        </InlineStack>
      }
    >
      <Modal.Section>
        <Box minHeight="500px">
          <IndexDataTable inputArray={variantArray} onSelect={handleSelectVariant} selectionMode={selectionMode} />
        </Box>
      </Modal.Section>
    </Modal>
  );
}
