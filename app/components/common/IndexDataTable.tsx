import { useState, useMemo, useEffect } from "react";
import {
  Text,
  Box,
  Filters,
  TextField,
  Select,
  IndexTable,
  Thumbnail,
  Checkbox,
  Icon,
  InlineStack,
} from "@shopify/polaris";
import { SearchIcon, ImageIcon } from "@shopify/polaris-icons";

//Filtered indextable of products
export function IndexDataTable({ inputArray, onSelect, selectionMode, selected }) {
  ////
  const normalizedSelected = useMemo(() => {
    if (!selected) return [];
    return Array.isArray(selected) ? selected : [selected]; // ✅ ensures it's always an array
  }, [selected]);

  const [queryValue, setQueryValue] = useState("");
  const [searchMode, setSearchMode] = useState("all");
  const [typeFilter, setTypeFilter] = useState(null);
  const [vendorFilter, setVendorFilter] = useState(null);
  //  const [selectedRows, setSelectedRows] = useState([]);
  // ----------------- UPDATED: internal state initialized from selected prop -----------------
  const [selectedRows, setSelectedRows] = useState(selected || []); // UPDATED

  // ----------------- UPDATED: sync internal state if prop changes -----------------
  useEffect(() => { // UPDATED
    if (selected) {
      setSelectedRows(selected);
    }
  }, [selected]); // UPDATED



  const typeOptions = [
    { label: "Type A", value: "typeA" },
    { label: "Type B", value: "typeB" },
    { label: "Type C", value: "typeC" },
    { label: "Type D", value: "typeD" },
  ];

  const vendorOptions = [
    { label: "Vendor 1", value: "vendor1" },
    { label: "Vendor 2", value: "vendor2" },
    { label: "Vendor 3", value: "vendor3" },
  ];

  const searchModeOptions = [
    { label: "All", value: "all" },
    { label: "Title", value: "title" },
    { label: "Product ID", value: "id" },
    { label: "Barcode", value: "barcode" },
    { label: "SKU", value: "sku" },
  ];

  /* ---------------------------------------------------------
      UPDATED — nestedTable selection logic
  ----------------------------------------------------------- */
  const nestedTableSelect = (clicked, parentProduct) => {
    const clickedId = clicked.id;
    const parentId = parentProduct.id;

    const variants = (parentProduct.variants ?? []).map(v => v.node);
    const parentAndVariants = [parentProduct, ...variants];

    const isParentSelected = selectedRows.some(r => r.id === parentId);
    const isClickedSelected = selectedRows.some(r => r.id === clickedId);

    /* ---------------------------------------------------------
       Detect which product is currently selected
    ----------------------------------------------------------- */
    const selectedParent = selectedRows.find(r =>
      inputArray.some(prod => prod.id === r.id)
    );

    const currentParentId = selectedParent?.id;

    /* ---------------------------------------------------------
       CASE 1 — clicking on product row
    ----------------------------------------------------------- */
    if (clickedId === parentId) {
      if (isParentSelected) {
        // deselect whole product
        setSelectedRows([]);
        onSelect([]);
        return;
      }

      // select product + all variants
      setSelectedRows(parentAndVariants);
      onSelect(parentAndVariants);
      return;
    }

    /* ---------------------------------------------------------
       CASE 2 — clicking on a VARIANT of another product
    ----------------------------------------------------------- */
    if (currentParentId && currentParentId !== parentId) {
      const newSelection = [parentProduct, clicked];
      setSelectedRows(newSelection);
      onSelect(newSelection);
      return;
    }

    /* ---------------------------------------------------------
       CASE 3 — clicking on a variant in SAME product
    ----------------------------------------------------------- */

    // If variant is already selected → remove it
    if (isClickedSelected) {
      const updated = selectedRows.filter(r => r.id !== clickedId);

      // If no variants are left → remove parent too
      const hasVariantsLeft = updated.some(r => r.id !== parentId);

      if (!hasVariantsLeft) {
        setSelectedRows([]);
        onSelect([]);
        return;
      }

      setSelectedRows(updated);
      onSelect(updated);
      return;
    }

    // Add variant (and parent if not selected)
    const updated = [...selectedRows];

    if (!isParentSelected) updated.push(parentProduct);
    updated.push(clicked);

    setSelectedRows(updated);
    onSelect(updated);
  };

  /* ---------------------------------------------------------
     UPDATED — main click handler
  ----------------------------------------------------------- */
  const handleRowClick = (row, parentProduct = null) => {
    if (selectionMode.includes("nested")) {
      nestedTableSelect(row, parentProduct);
      return;
    }

    // original single & multiple logic
    if (selectionMode.includes("single")) {
      const newSelection = [row];
      setSelectedRows(newSelection);
      onSelect(newSelection);
      return;
    }

    if (selectionMode.includes("multiple")) {
      setSelectedRows((prev) => {
        const exists = prev.some((r) => r.id === row.id);
        const updated = exists ? prev.filter((r) => r.id !== row.id) : [...prev, row];

        onSelect(updated);
        return updated;
      });
    }
  };

  const isSelected = (id) => selectedRows.some((r) => r.id === id);
  /* ---------------------------------------------------------
     FILTERING (unchanged)
  ----------------------------------------------------------- */
  const filteredProducts = useMemo(() => {
    const q = queryValue.toLowerCase();

    return inputArray.filter((p) => {
      const title = p.title?.toLowerCase() ?? "";
      const id = p.id?.toLowerCase() ?? "";
      const barcode = (p.barcode ?? "").toLowerCase();
      const sku = (p.sku ?? "").toLowerCase();
      const type = (p.type ?? "").toLowerCase();
      const vendor = (p.vendor ?? "").toLowerCase();

      if (typeFilter && type !== typeFilter) return false;
      if (vendorFilter && vendor !== vendorFilter) return false;

      if (q) {
        if (searchMode === "title" && !title.includes(q)) return false;
        if (searchMode === "id" && !id.includes(q)) return false;
        if (searchMode === "barcode" && !barcode.includes(q)) return false;
        if (searchMode === "sku" && !sku.includes(q)) return false;

        if (
          searchMode === "all" &&
          !(title.includes(q) || id.includes(q) || barcode.includes(q) || sku.includes(q))
        )
          return false;
      }

      return true;
    });
  }, [queryValue, searchMode, typeFilter, vendorFilter, inputArray]);

  /* ---------------------------------------------------------
     RENDER PRODUCT + VARIANT ROWS (UPDATED for nestedProduct Table)
  ----------------------------------------------------------- */
  const rows = filteredProducts.flatMap((product, index) => {
    const productSelected = isSelected(product.id);
    if (selectionMode.includes("Variant") && product.variants)
      return [];
    const parentRow = (
      <IndexTable.Row
        id={product.id}
        key={product.id}
        position={index}
        selected={productSelected}
        onClick={() => handleRowClick(product, product)}   //  UPDATED
      >
        <InlineStack gap="300" blockAlign="center" align="start">
          <Box width="10%">
            <div
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={productSelected}
                onChange={(checked, e) => {
                  //e.stopPropagation();                 // IMPORTANT
                  handleRowClick(product, product);    // same as row click
                }}
              />
            </div>
          </Box>
          <Box width="10%">
            <Thumbnail size="Small" source={product.imageUrl || ImageIcon} alt="" />
          </Box>
          <Text as="span">{product.title}</Text>
        </InlineStack>
      </IndexTable.Row>
    );

    //Childre variants row
    const variantRows = (product.variants ?? []).map((variant, vIndex) => {
      const v = variant.node;
      const variantSelected = isSelected(v.id);

      return (
        <IndexTable.Row
          id={v.id}
          key={v.id}
          position={`${index}-${vIndex}`}
          selected={variantSelected}
          onClick={() => handleRowClick(v, product)}   //  UPDATED
        >
          <InlineStack blockAlign="center" align="space-between">
            <Box width="10%" paddingBlock="100" paddingInlineStart={selectionMode.includes("variants") ? 0 : 600}
            >
              <div
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={variantSelected}
                  //onChange={() => handleRowClick(v, product)
                  onChange={(checked, e) => {
                    // e.stopPropagation();             //  IMPORTANT
                    handleRowClick(v, product);      // same as row click
                  }}
                />
              </div>
            </Box>
            <Box width="50%" paddingInlineStart="400">
              <Text as="span"> {v.title}</Text>
            </Box>
            <Box width="20%">
              <Text as="span"> {v.inventoryQuantity} /available</Text>
            </Box>
            <Box width="20%" >
              <Text as="span">
                {v.price != null ? `$${v.price}` : ""}
              </Text>
            </Box>
          </InlineStack>
        </IndexTable.Row >
      );
    });
    return selectionMode.includes("nested") ? [parentRow, ...variantRows] : parentRow;
  });

  return (
    <Box padding="0">
      {/* Search Option */}
      {selectionMode.includes("Product") && (
        <InlineStack gap="300" align="center" blockAlign="center">
          <Box width="60%">
            <TextField
              prefix={<Icon source={SearchIcon} />}
              placeholder={"Search products"}
              value={queryValue}
              onChange={setQueryValue}
            />
          </Box>
          <Box width="35%">
            <Select options={searchModeOptions} value={searchMode} onChange={setSearchMode} />
          </Box>
        </InlineStack>
      )}
      {selectionMode.includes("Collection") && (
        <InlineStack gap="0" align="center" blockAlign="center">
          <Box width="100%">
            <TextField
              prefix={<Icon source={SearchIcon} />}
              placeholder={"Search collections"}
              value={queryValue}
              onChange={setQueryValue}
            />
          </Box>
        </InlineStack >
      )}
      {selectionMode.includes("Variant") && (
        <InlineStack gap="0" align="center" blockAlign="center">
          <Box width="100%">
            <TextField
              prefix={<Icon source={SearchIcon} />}
              placeholder={"Search Variants"}
              value={queryValue}
              onChange={setQueryValue}
            />
          </Box>
        </InlineStack >
      )}
      {selectionMode.includes("Product") && (
        <Box>
          <Filters
            filters={[
              {
                key: "type",
                label: "Type",
                filter: (
                  <Select
                    label="Type"
                    options={typeOptions}
                    value={typeFilter}
                    onChange={setTypeFilter}
                  />
                ),
              },
              {
                key: "vendor",
                label: "Vendor",
                filter: (
                  <Select
                    label="Vendor"
                    options={vendorOptions}
                    value={vendorFilter}
                    onChange={setVendorFilter}
                  />
                ),
              },
            ]}
            appliedFilters={[]}
            queryValue={queryValue}
            onQueryChange={setQueryValue}
            onQueryClear={() => setQueryValue("")}
            onClearAll={() => {
              setQueryValue("");
              setTypeFilter(null);
              setVendorFilter(null);
              setSearchMode("all");
            }}
            hideQueryField
          />
        </Box>
      )}
      <IndexTable itemCount={rows.length} headings={[]} selectable={false}>
        {rows}
      </IndexTable>
    </Box>
  );
}