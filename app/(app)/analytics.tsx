import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { Card } from "../../src/components/Card";
import { AccessDenied } from "../../src/components/AccessDenied";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { useCan } from "../../src/hooks/useCurrentUser";
import { formatNumber } from "../../src/lib/format";
import { Sparkline } from "../../src/components/Sparkline";

const mockAging = [
  { label: "0-30d", value: 42 },
  { label: "31-60d", value: 30 },
  { label: "61-90d", value: 18 },
  { label: "90d+", value: 10 }
];

const throughputTrend = [62, 68, 72, 66, 74, 80, 77];
const fillRateTrend = [92, 94, 95, 96, 97, 96, 98];
const cycleTimeTrend = [2.1, 2.0, 1.9, 1.8, 1.7, 1.65, 1.6];

export default function AnalyticsScreen() {
  const canView = useCan("analytics.view");
  const kpis = useAppStore((state) => state.kpis);

  if (!canView) {
    return (
      <Screen>
        <SectionHeader title="Analytics" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Analytics & Insights"
        subtitle="Operational performance at a glance."
      />
      <View style={styles.grid}>
        {kpis.map((kpi) => (
          <Card key={kpi.id} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={styles.kpiValue}>
              {formatNumber(kpi.value)}
              {kpi.unit}
            </Text>
            <Text style={styles.kpiDelta}>
              {kpi.delta > 0 ? "+" : ""}
              {formatNumber(kpi.delta)}
              {kpi.unit}
            </Text>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="Performance Trends"
        subtitle="7-day throughput, fill rate, and cycle time."
      />
      <View style={styles.trendGrid}>
        <Card style={styles.trendCard}>
          <Text style={styles.trendTitle}>Throughput</Text>
          <Sparkline data={throughputTrend} color={theme.colors.accent} />
          <Text style={styles.trendMeta}>Avg 71 orders/day</Text>
        </Card>
        <Card style={styles.trendCard}>
          <Text style={styles.trendTitle}>Fill Rate</Text>
          <Sparkline data={fillRateTrend} color={theme.colors.success} />
          <Text style={styles.trendMeta}>Avg 96.3%</Text>
        </Card>
        <Card style={styles.trendCard}>
          <Text style={styles.trendTitle}>Order Cycle Time</Text>
          <Sparkline data={cycleTimeTrend} color={theme.colors.warning} />
          <Text style={styles.trendMeta}>Avg 1.8 days</Text>
        </Card>
      </View>

      <SectionHeader
        title="Inventory Aging"
        subtitle="Distribution of stock by days on hand."
      />
      <Card>
        <View style={styles.chart}>
          {mockAging.map((item) => (
            <View key={item.label} style={styles.barItem}>
              <View
                style={[
                  styles.bar,
                  { height: (item.value / 100) * 160 }
                ]}
              />
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader
        title="Service Quality"
        subtitle="Operational SLAs and compliance targets."
      />
      <View style={styles.serviceGrid}>
        <Card style={styles.serviceCard}>
          <Text style={styles.serviceLabel}>On-Time Inbound</Text>
          <Text style={styles.serviceValue}>98.1%</Text>
          <Text style={styles.serviceSub}>Target 97%</Text>
        </Card>
        <Card style={styles.serviceCard}>
          <Text style={styles.serviceLabel}>Pick Accuracy</Text>
          <Text style={styles.serviceValue}>99.4%</Text>
          <Text style={styles.serviceSub}>Target 99%</Text>
        </Card>
        <Card style={styles.serviceCard}>
          <Text style={styles.serviceLabel}>Cycle Count SLA</Text>
          <Text style={styles.serviceValue}>96.7%</Text>
          <Text style={styles.serviceSub}>Target 95%</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  trendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  trendCard: {
    flex: 1,
    minWidth: 200
  },
  trendTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: theme.spacing.sm
  },
  trendMeta: {
    marginTop: theme.spacing.sm,
    fontSize: 11,
    color: theme.colors.inkSubtle
  },
  kpiCard: {
    flex: 1,
    minWidth: 160
  },
  kpiLabel: {
    fontSize: 12,
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  kpiValue: {
    marginTop: theme.spacing.sm,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.ink
  },
  kpiDelta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.accentDark
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
    gap: theme.spacing.md
  },
  barItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  bar: {
    width: "100%",
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accent
  },
  barLabel: {
    marginTop: 6,
    fontSize: 11,
    color: theme.colors.inkSubtle
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  serviceCard: {
    flex: 1,
    minWidth: 160
  },
  serviceLabel: {
    fontSize: 12,
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  serviceValue: {
    marginTop: theme.spacing.sm,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.ink
  },
  serviceSub: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.inkSubtle
  }
});
