import React, { useDeferredValue, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { Card } from "../../src/components/Card";
import { DataTable } from "../../src/components/DataTable";
import { Tag } from "../../src/components/Tag";
import { AccessDenied } from "../../src/components/AccessDenied";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { formatNumber } from "../../src/lib/format";
import { useCan } from "../../src/hooks/useCurrentUser";

type InventoryRow = {
  id: string;
  item: string;
  bin: string;
  onHand: string;
  reserved: string;
  available: string;
  lot: string;
};

export default function InventoryScreen() {
  const canView = useCan("inventory.view");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const items = useAppStore((state) => state.items);
  const bins = useAppStore((state) => state.bins);
  const inventory = useAppStore((state) => state.inventory);

  const rows = useMemo(() => {
    const itemMap = new Map(items.map((item) => [item.id, item]));
    const binMap = new Map(bins.map((bin) => [bin.id, bin]));
    return inventory.map<InventoryRow>((balance) => {
      const item = itemMap.get(balance.itemId);
      const bin = binMap.get(balance.binId);
      const available = Math.max(0, balance.onHand - balance.reserved);
      return {
        id: balance.id,
        item: item ? `${item.name} (${item.sku})` : balance.itemId,
        bin: bin ? bin.code : balance.binId,
        onHand: formatNumber(balance.onHand),
        reserved: formatNumber(balance.reserved),
        available: formatNumber(available),
        lot: balance.lotCode ?? "-"
      };
    });
  }, [bins, inventory, items]);

  const filteredRows = useMemo(() => {
    if (!deferredQuery.trim()) {
      return rows;
    }
    const needle = deferredQuery.toLowerCase();
    return rows.filter(
      (row) =>
        row.item.toLowerCase().includes(needle) ||
        row.bin.toLowerCase().includes(needle) ||
        row.lot.toLowerCase().includes(needle)
    );
  }, [deferredQuery, rows]);

  if (!canView) {
    return (
      <Screen>
        <SectionHeader title="Inventory Control" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Inventory Control"
        subtitle="Track stock by bin, lot, and availability."
      />

      <Card style={styles.searchCard}>
        <Text style={styles.searchLabel}>Search stock</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search item, bin, or lot"
          placeholderTextColor={theme.colors.inkSubtle}
          style={styles.input}
        />
        <View style={styles.searchTags}>
          <Tag label="On-hand" tone="info" />
          <Tag label="Reserved" tone="warning" />
          <Tag label="Available" tone="success" />
        </View>
      </Card>

      <SectionHeader
        title="Stock by Bin"
        subtitle="Live quantities with lot-level visibility."
      />
      <DataTable
        columns={[
          { key: "item", label: "Item", width: 260 },
          { key: "bin", label: "Bin", width: 110 },
          { key: "onHand", label: "On-Hand", width: 120 },
          { key: "reserved", label: "Reserved", width: 120 },
          { key: "available", label: "Available", width: 120 },
          { key: "lot", label: "Lot", width: 120 }
        ]}
        rows={filteredRows}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    marginBottom: theme.spacing.lg
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  input: {
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    backgroundColor: theme.colors.surface
  },
  searchTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  }
});
