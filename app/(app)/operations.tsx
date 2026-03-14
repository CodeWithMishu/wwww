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
import { formatNumber } from "../../src/lib/format";
import { useCan } from "../../src/hooks/useCurrentUser";

type TransferRow = {
  id: string;
  from: string;
  to: string;
  item: string;
  qty: string;
  status: string;
};

const transfers: TransferRow[] = [
  { id: "tr-100", from: "A-01", to: "B-01", item: "Steel Coil", qty: "120 kg", status: "approved" },
  { id: "tr-101", from: "A-02", to: "C-01", item: "Poly Resin", qty: "80 kg", status: "in_transit" },
  { id: "tr-102", from: "B-01", to: "C-01", item: "Sensor Unit", qty: "40 units", status: "requested" }
];

const cycleCounts = [
  { id: "cc-1", area: "Zone A", scheduled: "2026-03-16", status: "scheduled" },
  { id: "cc-2", area: "Zone B", scheduled: "2026-03-17", status: "in_progress" },
  { id: "cc-3", area: "Zone C", scheduled: "2026-03-20", status: "planned" }
];

const returns = [
  { id: "rma-1401", customer: "RetailWest", item: "Smart Shelf", qty: 4, status: "inspection" },
  { id: "rma-1402", customer: "QuickShop", item: "Sensor Unit", qty: 8, status: "restock" }
];

const qcInspections = [
  { id: "qc-3201", lot: "ST-24A", result: "pass", notes: "Dimensional check OK" },
  { id: "qc-3202", lot: "RS-11C", result: "hold", notes: "Moisture variance" }
];

export default function OperationsScreen() {
  const canView = useCan("inventory.view");
  const purchaseOrders = useAppStore((state) => state.purchaseOrders);
  const salesOrders = useAppStore((state) => state.salesOrders);
  const items = useAppStore((state) => state.items);
  const itemMap = new Map(items.map((item) => [item.id, item]));

  if (!canView) {
    return (
      <Screen>
        <SectionHeader title="Operations Hub" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Operations Hub"
        subtitle="Inbound, outbound, transfers, and cycle counting."
      />

      <SectionHeader
        title="Inbound ASN & Receiving"
        subtitle="Upcoming receipts and QC checkpoints."
      />
      <View style={styles.stack}>
        {purchaseOrders.map((po) => (
          <Card key={po.id}>
            <View style={styles.row}>
              <View>
                <Text style={styles.title}>{po.id}</Text>
                <Text style={styles.sub}>
                  {po.supplier} - {itemMap.get(po.itemId)?.name ?? po.itemId}
                </Text>
                <Text style={styles.sub}>ETA {po.eta}</Text>
              </View>
              <Tag label={po.status.toUpperCase()} tone="info" />
            </View>
            <Text style={styles.sub}>Qty {formatNumber(po.qty)}</Text>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="Outbound Orders"
        subtitle="Wave planning and pick/pack status."
      />
      <DataTable
        columns={[
          { key: "id", label: "SO", width: 120 },
          { key: "customer", label: "Customer", width: 200 },
          { key: "item", label: "Item", width: 200 },
          { key: "qty", label: "Qty", width: 120 },
          { key: "status", label: "Status", width: 130 }
        ]}
        rows={salesOrders.map((so) => ({
          id: so.id,
          customer: so.customer,
          item: itemMap.get(so.itemId)?.name ?? so.itemId,
          qty: formatNumber(so.qty),
          status: so.status
        }))}
      />

      <SectionHeader
        title="Transfers & Cross-Dock"
        subtitle="Move stock between zones or warehouses."
      />
      <DataTable
        columns={[
          { key: "id", label: "Transfer", width: 140 },
          { key: "from", label: "From", width: 120 },
          { key: "to", label: "To", width: 120 },
          { key: "item", label: "Item", width: 200 },
          { key: "qty", label: "Qty", width: 120 },
          { key: "status", label: "Status", width: 130 }
        ]}
        rows={transfers}
      />

      <SectionHeader
        title="Cycle Counts"
        subtitle="Scheduled and in-progress counts."
      />
      <View style={styles.stack}>
        {cycleCounts.map((count) => (
          <Card key={count.id}>
            <View style={styles.row}>
              <View>
                <Text style={styles.title}>{count.area}</Text>
                <Text style={styles.sub}>Scheduled {count.scheduled}</Text>
              </View>
              <Tag label={count.status.toUpperCase()} tone="warning" />
            </View>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="Returns & QC"
        subtitle="RMA intake, disposition, and quality checkpoints."
      />
      <View style={styles.stack}>
        {returns.map((rma) => (
          <Card key={rma.id}>
            <View style={styles.row}>
              <View>
                <Text style={styles.title}>{rma.id}</Text>
                <Text style={styles.sub}>
                  {rma.customer} - {rma.item} - {formatNumber(rma.qty)} units
                </Text>
              </View>
              <Tag label={rma.status.toUpperCase()} tone="info" />
            </View>
          </Card>
        ))}
        {qcInspections.map((qc) => (
          <Card key={qc.id}>
            <View style={styles.row}>
              <View>
                <Text style={styles.title}>{qc.id}</Text>
                <Text style={styles.sub}>Lot {qc.lot}</Text>
                <Text style={styles.sub}>{qc.notes}</Text>
              </View>
              <Tag
                label={qc.result.toUpperCase()}
                tone={qc.result === "pass" ? "success" : "warning"}
              />
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: theme.spacing.sm
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  }
});
