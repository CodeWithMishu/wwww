import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Screen } from "../../../src/components/Screen";
import { SectionHeader } from "../../../src/components/SectionHeader";
import { Card } from "../../../src/components/Card";
import { AccessDenied } from "../../../src/components/AccessDenied";
import { AdminTabs } from "../../../src/components/AdminTabs";
import { theme } from "../../../src/theme";
import { useAppStore } from "../../../src/store/useAppStore";
import { PERMISSIONS, ROLE_BASE_PERMISSIONS } from "../../../src/lib/permissions";
import { Role } from "../../../src/types";
import { useCan } from "../../../src/hooks/useCurrentUser";

const roles: Role[] = ["ADMIN", "MANAGER", "PLANNER", "OPERATOR", "VIEWER"];

export default function RolesScreen() {
  const canManage = useCan("roles.manage");
  const roleOverrides = useAppStore((state) => state.roleOverrides);
  const setRoleOverride = useAppStore((state) => state.setRoleOverride);

  if (!canManage) {
    return (
      <Screen>
        <SectionHeader title="Role & Permissions" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <SectionHeader
        title="Role & Permissions"
        subtitle="Super Admin can lock or extend access per role. Company limits apply on top."
      />
      <AdminTabs />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.stack}>
          {roles.map((role) => (
            <Card key={role}>
              <Text style={styles.roleTitle}>{role.replace("_", " ")}</Text>
              <View style={styles.permissionList}>
                {PERMISSIONS.map((permission) => {
                  const baseEnabled = ROLE_BASE_PERMISSIONS[role].includes(permission);
                  const override = roleOverrides[role]?.[permission];
                  const enabled = override ?? baseEnabled;
                  return (
                    <View key={`${role}-${permission}`} style={styles.permissionRow}>
                      <View style={styles.permissionText}>
                        <Text style={styles.permissionLabel}>{permission}</Text>
                        <Text style={styles.permissionSub}>
                          Base: {baseEnabled ? "Enabled" : "Disabled"}
                        </Text>
                      </View>
                      <Switch
                        value={enabled}
                        onValueChange={(value) => {
                          setRoleOverride(role, permission, value);
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: theme.spacing.xl
  },
  stack: {
    gap: theme.spacing.md
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm
  },
  permissionList: {
    gap: theme.spacing.sm
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  permissionText: {
    flex: 1,
    marginRight: theme.spacing.md
  },
  permissionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.ink
  },
  permissionSub: {
    marginTop: 2,
    fontSize: 11,
    color: theme.colors.inkSubtle
  }
});
