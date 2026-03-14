import React from "react";
import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Tab = {
  label: string;
  href: string;
};

const TABS: Tab[] = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Roles", href: "/admin/roles" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Products", href: "/admin/products" },
  { label: "Audit", href: "/admin/audit" }
];

export const AdminTabs = () => {
  const pathname = usePathname();

  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link key={tab.href} href={tab.href} asChild>
            <Pressable style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface
  },
  tabActive: {
    borderColor: theme.colors.accentDark,
    backgroundColor: theme.colors.accentSoft
  },
  tabText: {
    fontSize: 12,
    fontFamily: theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textSecondary
  },
  tabTextActive: {
    color: theme.colors.accentDark,
    fontWeight: "700"
  }
});
