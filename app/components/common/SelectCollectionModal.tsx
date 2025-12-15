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

export function SelectCollectionModal({ collectionArray, onSelect, title, selectionMode }) {
  //inputArray: an array of product array to input
  //onSelect: an array of product array for parents
  //title: modal title
  //selectionMode: single or multiple
  const [active, setActive] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  // Open modal
  const handleOpen = useCallback(() => {
    setActive(true);
  }, []);
  // Close modal (do NOT send data)
  const handleClose = useCallback(() => {
    setActive(false);
  }, []);
  // Select a Collection row
  const handleSelectCollection = (collection) => {
    setSelectedCollection(collection);
  };
  // Save selected collection & close modal
  const handleSave = () => {
    if (selectedCollection) {
      onSelect(selectedCollection);   // <-- send to parent
    }
    setActive(false);
  };

  const activator = (
    <Button icon={EditIcon} onClick={handleOpen} fullWidth={true} variant="primary">
      Select collection
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
        disabled: !selectedCollection,   // Disable when nothing selected
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
            {selectedCollection?.length ? selectedCollection?.length : 0}/{collectionArray?.length} collections selected
          </Text>
        </InlineStack>
      }
    >
      <Modal.Section>
        <Box minHeight="500px">
          <IndexDataTable inputArray={collectionArray} selected={selectedCollection} onSelect={handleSelectCollection} selectionMode={selectionMode} />
        </Box>
      </Modal.Section>
    </Modal>
  );
}
