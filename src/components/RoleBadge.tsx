import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Role } from "../types";
import { theme } from "../theme";

const roleTone: Record<Role, string> = {
  SUPER_ADMIN: "#1E6AF2",
  ADMIN: "#0070D2",
  MANAGER: "#2E844A",
  PLANNER: "#B78103",
  OPERATOR: "#516B86",
  VIEWER: "#7A8CA0"
};

export const RoleBadge = ({ role }: { role: Role }) => {
  return (
    <View style={[styles.badge, { backgroundColor: roleTone[role] }]}>
      <Text style={styles.text}>{role.replace("_", " ")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)"
  },
  text: {
    fontSize: 11,
    fontFamily: theme.typography.body,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3
  }
});
