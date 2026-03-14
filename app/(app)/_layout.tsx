import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions
} from "react-native";
import { Redirect, Slot, router, usePathname, Link } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { AccessDenied } from "../../src/components/AccessDenied";
import { theme } from "../../src/theme";
import { useCurrentUser } from "../../src/hooks/useCurrentUser";
import { useAppStore } from "../../src/store/useAppStore";
import { canAccess } from "../../src/lib/permissions";
import { Permission, Role } from "../../src/types";
import { getISTNow } from "../../src/lib/time";

type NavItem = {
  label: string;
  href: string;
  permission: Permission;
  anyPermissions?: Permission[];
  onlyRoles?: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard.view" },
  { label: "Inventory", href: "/inventory", permission: "inventory.view" },
  { label: "Operations", href: "/operations", permission: "inventory.view" },
  { label: "Production", href: "/production", permission: "production.view" },
  { label: "Analytics", href: "/analytics", permission: "analytics.view" },
  { label: "Data Hub", href: "/data", permission: "data.exchange" },
  {
    label: "Admin",
    href: "/admin",
    permission: "users.manage",
    anyPermissions: ["users.manage", "roles.manage", "products.edit", "audit.view"]
  },
  {
    label: "Enterprise",
    href: "/enterprise",
    permission: "dashboard.view",
    onlyRoles: ["ADMIN", "MANAGER", "PLANNER", "OPERATOR", "VIEWER"]
  }
];

const enableLayoutAnimation = () => {
  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

export default function AppLayout() {
  const user = useCurrentUser();
  const overrides = useAppStore((state) => state.roleOverrides);
  const companyOverrides = useAppStore((state) => state.companyOverrides);
  const companies = useAppStore((state) => state.companies);
  const logout = useAppStore((state) => state.logout);
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(width >= 980);
  const [now, setNow] = useState(getISTNow());

  useEffect(() => {
    enableLayoutAnimation();
  }, []);

  useEffect(() => {
    setSidebarOpen(width >= 980);
  }, [width]);

  useEffect(() => {
    const interval = setInterval(() => setNow(getISTNow()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  const company = useMemo(
    () => companies.find((item) => item.id === user?.companyId) ?? null,
    [companies, user?.companyId]
  );

  if (company && !company.active && user.role !== "SUPER_ADMIN") {
    return (
      <Screen>
        <SectionHeader title="Company Suspended" subtitle="Access restricted." />
        <AccessDenied
          title="Company access disabled"
          message="Your company has been suspended by the platform owner."
        />
        <Pressable onPress={handleLogout} style={styles.logoutInline}>
          <Text style={styles.logoutInlineText}>Logout</Text>
        </Pressable>
      </Screen>
    );
  }

  const visibleItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (item.onlyRoles && !item.onlyRoles.includes(user.role)) {
          return false;
        }
        if (item.anyPermissions) {
          return item.anyPermissions.some((perm) =>
            canAccess(user.role, overrides, perm, companyOverrides[user.companyId])
          );
        }
        return canAccess(
          user.role,
          overrides,
          item.permission,
          companyOverrides[user.companyId]
        );
      }),
    [companyOverrides, overrides, user.companyId, user.role]
  );

  const toggleSidebar = () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch {
      // ignore if not supported
    }
    setSidebarOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sidebar,
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed,
          width < 980 && styles.sidebarOverlay
        ]}
      >
        <View style={styles.brand}>
          <Text style={styles.brandTitle}>Warehouse WMS</Text>
          <Text style={styles.brandSub}>Enterprise Control Center</Text>
        </View>
        <View style={styles.nav}>
          {visibleItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} asChild>
                <Pressable style={styles.link}>
                  <View style={[styles.navItem, active && styles.navItemActive]}>
                    <Text style={[styles.navText, active && styles.navTextActive]}>
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </View>
        <Pressable onPress={handleLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {width < 980 && sidebarOpen ? (
        <Pressable style={styles.backdrop} onPress={toggleSidebar} />
      ) : null}

      <View style={styles.main}>
        <SafeAreaView style={styles.topbar}>
          <Pressable onPress={toggleSidebar} style={styles.menuButton}>
            <Text style={styles.menuText}>{sidebarOpen ? "Hide" : "Menu"}</Text>
          </Pressable>
          <View style={styles.topbarInfo}>
            <Text style={styles.time}>{now}</Text>
            <Text style={styles.user} numberOfLines={1} ellipsizeMode="tail">
              {user.name} - {user.role.replace("_", " ")}
            </Text>
            {company ? (
              <Text style={styles.company} numberOfLines={1} ellipsizeMode="tail">
                {company.name}
              </Text>
            ) : null}
          </View>
        </SafeAreaView>
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.background
  },
  sidebar: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.navBackground,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.08)"
  },
  sidebarOpen: {
    width: 260
  },
  sidebarClosed: {
    width: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    overflow: "hidden"
  },
  sidebarOverlay: {
    position: "absolute",
    zIndex: 30,
    height: "100%",
    left: 0,
    top: 0,
    bottom: 0
  },
  brand: {
    marginBottom: theme.spacing.lg
  },
  brandTitle: {
    color: theme.colors.navText,
    fontSize: 18,
    fontWeight: "700"
  },
  brandSub: {
    marginTop: 4,
    color: theme.colors.navMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  nav: {
    gap: theme.spacing.sm
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent"
  },
  navItemActive: {
    backgroundColor: theme.colors.navSurface,
    borderColor: "rgba(255,255,255,0.12)"
  },
  navText: {
    color: theme.colors.navText,
    fontSize: 14,
    fontWeight: "600"
  },
  navTextActive: {
    color: theme.colors.navActive
  },
  link: {
    paddingVertical: 2
  },
  logout: {
    marginTop: theme.spacing.lg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  logoutText: {
    color: theme.colors.navText,
    fontWeight: "600"
  },
  logoutInline: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted
  },
  logoutInlineText: {
    color: theme.colors.ink,
    fontWeight: "600"
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 20
  },
  main: {
    flex: 1
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted
  },
  menuText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.ink
  },
  topbarInfo: {
    flex: 1,
    alignItems: "flex-end",
    minWidth: 0
  },
  time: {
    fontSize: 12,
    color: theme.colors.inkSubtle
  },
  user: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ink,
    textAlign: "right",
    flexShrink: 1
  },
  company: {
    marginTop: 2,
    fontSize: 12,
    color: theme.colors.inkSubtle,
    textAlign: "right",
    flexShrink: 1
  },
  content: {
    flex: 1
  }
});
