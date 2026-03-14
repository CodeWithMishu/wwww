import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: theme.spacing.xs,
    marginBottom: theme.spacing.sm
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: theme.spacing.md
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.ink
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.inkSubtle
  }
});
