import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { Card } from "../../src/components/Card";
import { DataTable } from "../../src/components/DataTable";
import { Tag } from "../../src/components/Tag";
import { AccessDenied } from "../../src/components/AccessDenied";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { calculateForecast } from "../../src/lib/forecast";
import { formatNumber } from "../../src/lib/format";
import { useCan } from "../../src/hooks/useCurrentUser";

type WorkOrderRow = {
  id: string;
  product: string;
  target: string;
  status: string;
  due: string;
};

export default function ProductionScreen() {
  const canView = useCan("production.view");
  const canPlan = useCan("production.plan");
  const items = useAppStore((state) => state.items);
  const bomLines = useAppStore((state) => state.bomLines);
  const inventory = useAppStore((state) => state.inventory);
  const workOrders = useAppStore((state) => state.workOrders);

  const forecast = calculateForecast(items, bomLines, inventory);
  const itemMap = new Map(items.map((item) => [item.id, item]));

  const workOrderRows: WorkOrderRow[] = workOrders.map((order) => ({
    id: order.id,
    product: itemMap.get(order.productId)?.name ?? order.productId,
    target: formatNumber(order.targetQty),
    status: order.status.replace("_", " "),
    due: order.dueDate
  }));

  const bomRows = bomLines.map((line) => ({
    id: line.id,
    finished: itemMap.get(line.finishedProductId)?.name ?? line.finishedProductId,
    material: itemMap.get(line.materialId)?.name ?? line.materialId,
    qty: formatNumber(line.qtyPerUnit)
  }));

  if (!canView) {
    return (
      <Screen>
        <SectionHeader title="Production" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Production Forecast"
        subtitle="Max producible units based on raw material constraints."
      />
      {canPlan ? (
        <View style={styles.stack}>
          {forecast.map((result) => (
            <Card key={result.productId}>
              <View style={styles.forecastHeader}>
                <View>
                  <Text style={styles.productName}>{result.productName}</Text>
                  <Text style={styles.productSub}>
                    Bottleneck: {result.bottleneckMaterialName ?? "None"}
                  </Text>
                </View>
                <View style={styles.rightAlign}>
                  <Text style={styles.forecastValue}>
                    {formatNumber(result.maxUnits)}
                  </Text>
                  <Text style={styles.forecastLabel}>units available</Text>
                </View>
              </View>
              {result.warnings.length > 0 ? (
                <View style={styles.warningBlock}>
                  {result.warnings.map((warning, index) => (
                    <Tag key={`${result.productId}-${index}`} label={warning} tone="warning" />
                  ))}
                </View>
              ) : (
                <Tag label="All materials within thresholds" tone="success" />
              )}
            </Card>
          ))}
        </View>
      ) : (
        <AccessDenied
          title="Forecast limited"
          message="Your role can view production status but cannot run forecasts."
        />
      )}

      <SectionHeader
        title="Active Work Orders"
        subtitle="Plan, execute, and track production runs."
      />
      <DataTable
        columns={[
          { key: "id", label: "WO", width: 120 },
          { key: "product", label: "Product", width: 240 },
          { key: "target", label: "Target", width: 120 },
          { key: "status", label: "Status", width: 140 },
          { key: "due", label: "Due", width: 120 }
        ]}
        rows={workOrderRows}
        summary={`${workOrderRows.length} active work orders`}
      />

      <SectionHeader
        title="Bill of Materials"
        subtitle="Critical material consumption per finished unit."
      />
      <DataTable
        columns={[
          { key: "finished", label: "Finished SKU", width: 240 },
          { key: "material", label: "Material", width: 240 },
          { key: "qty", label: "Qty/Unit", width: 120 }
        ]}
        rows={bomRows}
        summary={`${bomRows.length} BOM lines`}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: theme.spacing.sm
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink
  },
  productSub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  rightAlign: {
    alignItems: "flex-end"
  },
  forecastValue: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.accentDark
  },
  forecastLabel: {
    fontSize: 11,
    color: theme.colors.inkSubtle
  },
  warningBlock: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs
  }
});
