import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type AccessDeniedProps = {
  title?: string;
  message?: string;
};

export const AccessDenied = ({
  title = "Access Limited",
  message = "Your role does not have permission to view this section."
}: AccessDeniedProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFF3E6",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#FFD6B5"
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink
  },
  message: {
    marginTop: 6,
    fontSize: 13,
    color: theme.colors.inkSubtle
  }
});
