import { ActionList, BlockStack, Button, Icon, InlineStack, Popover, Text, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { SettingsIcon, AlertCircleIcon } from '@shopify/polaris-icons';

export function PopUpover({
  title,
  upPopTextChange, // ensure onTitleChange is passed as a prop
  defaultPopText,
  badgeSelected
}: {
  title: string;
  upPopTextChange?: (value: string) => void; // onTitleChange should update the parent state
  defaultPopText: string;
  badgeSelected?: string;
}) {

  const [active, setActive] = useState<string | null>(null);
  const [textValue, setTextValue] = useState(defaultPopText);

  const toggleActive = useCallback((id: string) => {
    setActive((prev) => (prev !== id ? id : null));
  }, []);

  // Function to append variables to textValue
  const appendToTextValue = useCallback((variable: string) => {
    const updatedText = textValue + variable;
    setTextValue(updatedText);
    if (typeof upPopTextChange === 'function') upPopTextChange(updatedText);   // update parent component's state
    // Also update any DOM elements that should reflect this value (e.g., preview areas)
    if (typeof window !== 'undefined') {
      try {
        document.querySelectorAll('.bar-upsell-text').forEach((el) => {
          el.textContent = updatedText;
        });
      } catch (e) {
        // ignore DOM update errors
      }
    }
  }, [textValue, upPopTextChange]);

  const hanldeTextValueChange = useCallback((newValue: string) => {
    setTextValue(newValue);
    if (typeof upPopTextChange === 'function') upPopTextChange(newValue); // update parent component's state
    if (typeof window !== 'undefined') {
      try {
        document.querySelectorAll('.bar-upsell-text').forEach((el) => {
          el.textContent = newValue;
        });
      } catch (e) {
        // ignore DOM update errors
      }
    }
  }, [upPopTextChange]);

  return (
    <BlockStack gap="100">
      <InlineStack align="space-between">
        <Text as="p">{title}</Text>
        <Popover
          active={active === 'popover'}
          preferredAlignment="right"
          activator={
            <Button
              variant="tertiary"
              onClick={() => toggleActive('popover')}
              icon={SettingsIcon}
              accessibilityLabel="Other save actions"
            />
          }
          autofocusTarget="first-node"
          onClose={() => toggleActive('popover')}
        >
          <ActionList
            actionRole="menuitem"
            sections={[
              {
                items: [{ content: 'Add variable', suffix: <Icon source={AlertCircleIcon} /> }],
              },
              {
                title: 'Discount',
                items: [
                  { content: 'Saved percentage', onAction: () => appendToTextValue('{{saved_percentage}} ') },
                  { content: 'Saved $ total', onAction: () => appendToTextValue('{{saved_total}}') },
                  { content: 'Saved per item', onAction: () => appendToTextValue('{{saved_amount}}') },
                ],
              },
              {
                title: 'Product',
                items: [
                  { content: 'Product title', onAction: () => appendToTextValue('{{product}}') },
                  { content: 'New total price', onAction: () => appendToTextValue('{{new_total}}') },
                  { content: 'New price per item', onAction: () => appendToTextValue('{{new_price}}') },
                  { content: 'Original total price', onAction: () => appendToTextValue('{{original_total}}') },
                  { content: 'Original price per item', onAction: () => appendToTextValue('{{original_price}}') },
                ],
              },
              {
                title: 'Quantity',
                items: [
                  { content: 'Quantity', onAction: () => appendToTextValue('{{quantity}}') },
                  { content: 'Buy quantity', onAction: () => appendToTextValue('{{buy_quantity}}') },
                  { content: 'Get quantity', onAction: () => appendToTextValue('{{get_quantity}}') },
                ],
              },
              {
                title: 'Text',
                items: [
                  { content: 'Product metafield', onAction: () => appendToTextValue('{{metafield}}') },
                  { content: 'Product metafield2', onAction: () => appendToTextValue('{{metafield2}}') },
                  { content: 'Product metafield3', onAction: () => appendToTextValue('{{metafield3}}') },
                  { content: 'Product metafield4', onAction: () => appendToTextValue('{{metafield4}}') },
                ],
              },
            ]}
          />
        </Popover>
      </InlineStack>
      <TextField
        label="" // Provide a proper label for accessibility
        value={textValue}
        onChange={hanldeTextValueChange}
        autoComplete="off"
        aria-label="Add or edit variable"
        disabled={badgeSelected === "mostpopular"}
      />
    </BlockStack>
  );
}
