import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../../src/components/Screen";
import { SectionHeader } from "../../../src/components/SectionHeader";
import { Card } from "../../../src/components/Card";
import { AccessDenied } from "../../../src/components/AccessDenied";
import { AdminTabs } from "../../../src/components/AdminTabs";
import { Tag } from "../../../src/components/Tag";
import { theme } from "../../../src/theme";
import { useAppStore } from "../../../src/store/useAppStore";
import { Item } from "../../../src/types";
import { useCan } from "../../../src/hooks/useCurrentUser";

const numberOrZero = (value: string) => {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
};

const ItemEditor = ({
  item,
  onUpdate
}: {
  item: Item;
  onUpdate: (patch: Partial<Item>) => void;
}) => {
  const [reorderPoint, setReorderPoint] = useState(String(item.reorderPoint));
  const [safetyStock, setSafetyStock] = useState(String(item.safetyStock));
  const [leadTime, setLeadTime] = useState(String(item.leadTimeDays));
  const [yieldPercent, setYieldPercent] = useState(String(item.yieldPercent));
  const [scrapPercent, setScrapPercent] = useState(String(item.scrapPercent));

  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>{item.sku}</Text>
        </View>
        <Tag label={item.type.toUpperCase()} tone="info" />
      </View>
      <View style={styles.inputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reorder point</Text>
          <TextInput
            value={reorderPoint}
            onChangeText={setReorderPoint}
            onEndEditing={() =>
              onUpdate({ reorderPoint: numberOrZero(reorderPoint) })
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Safety stock</Text>
          <TextInput
            value={safetyStock}
            onChangeText={setSafetyStock}
            onEndEditing={() =>
              onUpdate({ safetyStock: numberOrZero(safetyStock) })
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lead time (days)</Text>
          <TextInput
            value={leadTime}
            onChangeText={setLeadTime}
            onEndEditing={() => onUpdate({ leadTimeDays: numberOrZero(leadTime) })}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        {item.type === "material" ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yield (%)</Text>
              <TextInput
                value={yieldPercent}
                onChangeText={setYieldPercent}
                onEndEditing={() =>
                  onUpdate({ yieldPercent: numberOrZero(yieldPercent) })
                }
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Scrap (%)</Text>
              <TextInput
                value={scrapPercent}
                onChangeText={setScrapPercent}
                onEndEditing={() =>
                  onUpdate({ scrapPercent: numberOrZero(scrapPercent) })
                }
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </>
        ) : null}
      </View>
    </Card>
  );
};

export default function ProductsScreen() {
  const canEdit = useCan("products.edit");
  const items = useAppStore((state) => state.items);
  const updateItem = useAppStore((state) => state.updateItem);

  if (!canEdit) {
    return (
      <Screen>
        <SectionHeader title="Product Master Data" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Product Master Data"
        subtitle="Adjust product thresholds and lead times."
      />
      <AdminTabs />
      <View style={styles.stack}>
        {items.map((item) => (
          <ItemEditor
            key={item.id}
            item={item}
            onUpdate={(patch) => updateItem(item.id, patch)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.md
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  itemInfo: {
    flex: 1,
    marginRight: theme.spacing.md
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink
  },
  itemSku: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  inputs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md
  },
  inputGroup: {
    flex: 1,
    minWidth: 140
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface
  }
});
