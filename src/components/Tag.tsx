import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type TagProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

const toneStyles = {
  default: "#EAF0F8",
  success: "#E5F5EA",
  warning: "#FFF4DA",
  danger: "#FDE9EA",
  info: "#E2F1FF"
};

export const Tag = ({ label, tone = "default" }: TagProps) => {
  return (
    <View style={[styles.tag, { backgroundColor: toneStyles[tone] }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(17, 38, 56, 0.08)"
  },
  text: {
    fontSize: 11,
    fontFamily: theme.typography.body,
    fontWeight: "600",
    color: theme.colors.ink,
    letterSpacing: 0.2
  }
});
