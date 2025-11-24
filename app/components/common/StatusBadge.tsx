// app/components/common/StatusBadge.tsx
import { Badge } from "@shopify/polaris";
import type { BundleStatus } from "../../models/types";

interface StatusBadgeProps {
  status: BundleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const toneMap: Record<BundleStatus, "success" | "info" | "warning"> = {
    active: "success",
    draft: "info",
    inactive: "warning",
  };

  return <Badge tone={toneMap[status]}>{status}</Badge>;
}