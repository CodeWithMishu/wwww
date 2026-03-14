import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type TagProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

const toneStyles = {
  default: theme.colors.surfaceMuted,
  success: "#DFF3EE",
  warning: "#FFF1D4",
  danger: "#FCE1DD",
  info: "#DCEBFF"
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
    borderRadius: 999,
    alignSelf: "flex-start"
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.ink
  }
});
