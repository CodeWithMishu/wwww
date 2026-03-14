import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { StatCard } from "../../src/components/StatCard";
import { Card } from "../../src/components/Card";
import { Tag } from "../../src/components/Tag";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { useCan, useCurrentUser } from "../../src/hooks/useCurrentUser";
import { AccessDenied } from "../../src/components/AccessDenied";
import { formatDelta, formatNumber } from "../../src/lib/format";

export default function DashboardScreen() {
  const currentUser = useCurrentUser();
  const canView = useCan("dashboard.view");
  const kpis = useAppStore((state) => state.kpis);
  const alerts = useAppStore((state) => state.alerts);
  const workOrders = useAppStore((state) => state.workOrders);
  const audit = useAppStore((state) => state.audit);
  const latestEvent = audit[0];
  const companies = useAppStore((state) => state.companies);
  const users = useAppStore((state) => state.users);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  if (!canView) {
    return (
      <Screen>
        <SectionHeader title="Dashboard" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  if (isSuperAdmin) {
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter((company) => company.active).length;
    const suspendedCompanies = totalCompanies - activeCompanies;
    const adminCount = users.filter((user) => user.role === "ADMIN").length;
    const totalUsers = users.length;
    return (
      <Screen>
        <SectionHeader
          title="Super Admin Console"
          subtitle="Platform governance, company access, and role controls."
        />
        <View style={styles.grid}>
          <StatCard label="Companies" value={String(totalCompanies)} />
          <StatCard label="Active" value={String(activeCompanies)} />
          <StatCard label="Suspended" value={String(suspendedCompanies)} />
          <StatCard label="Admins" value={String(adminCount)} />
          <StatCard label="Users" value={String(totalUsers)} />
        </View>

        <SectionHeader
          title="Admin Controls"
          subtitle="Manage access, roles, and platform governance."
        />
        <View style={styles.stack}>
          <Link href="/admin/companies" asChild>
            <Pressable style={styles.link}>
              <Card>
                <Text style={styles.linkTitle}>Company Access</Text>
                <Text style={styles.linkSub}>
                  Create companies, suspend access, and set limits.
                </Text>
              </Card>
            </Pressable>
          </Link>
          <Link href="/admin/users" asChild>
            <Pressable style={styles.link}>
              <Card>
                <Text style={styles.linkTitle}>User Management</Text>
                <Text style={styles.linkSub}>
                  Create admins and control user access.
                </Text>
              </Card>
            </Pressable>
          </Link>
          <Link href="/admin/roles" asChild>
            <Pressable style={styles.link}>
              <Card>
                <Text style={styles.linkTitle}>Role & Permissions</Text>
                <Text style={styles.linkSub}>
                  Override role permissions and analytics access.
                </Text>
              </Card>
            </Pressable>
          </Link>
          <Link href="/admin/products" asChild>
            <Pressable style={styles.link}>
              <Card>
                <Text style={styles.linkTitle}>Product Master Data</Text>
                <Text style={styles.linkSub}>
                  Maintain core master data and thresholds.
                </Text>
              </Card>
            </Pressable>
          </Link>
          <Link href="/admin/audit" asChild>
            <Pressable style={styles.link}>
              <Card>
                <Text style={styles.linkTitle}>Audit Log</Text>
                <Text style={styles.linkSub}>
                  Review platform actions and compliance trails.
                </Text>
              </Card>
            </Pressable>
          </Link>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={`Welcome back, ${currentUser?.name ?? "Operator"}`}
        subtitle="Live operational snapshot for the last 24 hours."
      />
      {latestEvent ? (
        <Card style={styles.auditCard}>
          <Text style={styles.auditTitle}>Latest Action</Text>
          <Text style={styles.auditBody}>
            {latestEvent.action} - {latestEvent.entity}
          </Text>
          <Text style={styles.auditTime}>{latestEvent.createdAt}</Text>
        </Card>
      ) : null}
      <View style={styles.grid}>
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={`${formatNumber(kpi.value)}${kpi.unit}`}
            delta={formatDelta(kpi.delta, kpi.unit)}
          />
        ))}
      </View>

      <SectionHeader
        title="Critical Alerts"
        subtitle="Prioritized issues requiring attention."
      />
      <View style={styles.stack}>
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <View style={styles.alertRow}>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.description}</Text>
              </View>
              <Tag
                label={alert.severity.toUpperCase()}
                tone={
                  alert.severity === "high"
                    ? "danger"
                    : alert.severity === "medium"
                    ? "warning"
                    : "info"
                }
              />
            </View>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="Production Pulse"
        subtitle="Active and upcoming work orders."
      />
      <View style={styles.stack}>
        {workOrders.map((order) => (
          <Card key={order.id}>
            <View style={styles.orderRow}>
              <View>
                <Text style={styles.orderTitle}>{order.id}</Text>
                <Text style={styles.orderSub}>
                  Target {formatNumber(order.targetQty)} units - Due {order.dueDate}
                </Text>
              </View>
              <Tag
                label={order.status.replace("_", " ").toUpperCase()}
                tone={order.status === "completed" ? "success" : "info"}
              />
            </View>
          </Card>
        ))}
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
  auditCard: {
    marginBottom: theme.spacing.lg
  },
  auditTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  auditBody: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.ink
  },
  auditTime: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  stack: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: theme.spacing.sm
  },
  alertText: {
    flex: 1,
    minWidth: 200,
    marginRight: theme.spacing.md
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink
  },
  alertDesc: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: theme.spacing.sm
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink
  },
  orderSub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  link: {
    borderRadius: theme.radius.md
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink
  },
  linkSub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.inkSubtle
  }
});
