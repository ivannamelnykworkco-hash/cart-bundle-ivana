// app/components/bundles/BundleTypeCard.tsx
import { Card, Text, Badge, Button, BlockStack } from "@shopify/polaris";
import type { BundleTypeOption } from "../../models/types";

interface BundleTypeCardProps {
  bundleType: BundleTypeOption;
  onSelect: () => void;
}

export function BundleTypeCard({ bundleType, onSelect }: BundleTypeCardProps) {
  return (
    <Card>
      <div
        style={{
          padding: "16px",
          cursor: "pointer",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={onSelect}
      >
        {bundleType.popular && (
          <div style={{ marginBottom: "8px" }}>
            <Badge tone="info">MOST POPULAR</Badge>
          </div>
        )}
        <BlockStack gap="200">
          <Text as="h3" variant="headingMd">
            {bundleType.title}
          </Text>
          <Text as="p" variant="bodySm" tone="subdued">
            {bundleType.description}
          </Text>
        </BlockStack>
        <div style={{ marginTop: "auto", paddingTop: "16px" }}>
          <Button fullWidth onClick={onSelect}>
            Choose
          </Button>
        </div>
      </div>
    </Card>
  );
}