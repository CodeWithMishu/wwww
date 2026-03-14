import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Role } from "../types";
import { theme } from "../theme";

const roleTone: Record<Role, string> = {
  SUPER_ADMIN: "#1E6AF2",
  ADMIN: "#0F8B8D",
  MANAGER: "#1D8A6A",
  PLANNER: "#D88900",
  OPERATOR: "#4B5563",
  VIEWER: "#6B7280"
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
    borderRadius: 999
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF"
  }
});
