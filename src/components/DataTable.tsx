import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Column<T> = {
  key: keyof T;
  label: string;
  width?: number;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
};

export const DataTable = <T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "No records"
}: DataTableProps<T>) => {
  const defaultWidth = 140;
  const minTableWidth = columns.reduce(
    (total, col) => total + (col.width ?? defaultWidth),
    0
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.table, { minWidth: minTableWidth }]}>
        <View style={styles.headerRow}>
          {columns.map((col) => {
            const widthStyle = {
              minWidth: col.width ?? defaultWidth,
              flexGrow: 1,
              flexShrink: 0
            };
            return (
              <Text
                key={String(col.key)}
                style={[styles.headerCell, widthStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {col.label}
              </Text>
            );
          })}
        </View>
        {rows.length === 0 ? (
          <Text style={styles.empty}>{emptyMessage}</Text>
        ) : (
          rows.map((row) => (
            <View key={row.id} style={styles.row}>
              {columns.map((col) => {
                const widthStyle = {
                  minWidth: col.width ?? defaultWidth,
                  flexGrow: 1,
                  flexShrink: 0
                };
                return (
                  <View key={String(col.key)} style={[styles.cell, widthStyle]}>
                    {col.render ? (
                      col.render(row[col.key], row)
                    ) : (
                      <Text
                        style={styles.cellText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {String(row[col.key] ?? "")}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    backgroundColor: theme.colors.surface
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceMuted,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.ink
  },
  row: {
    flexDirection: "row",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  cell: {
    flex: 1,
    justifyContent: "center"
  },
  cellText: {
    fontSize: 13,
    color: theme.colors.ink
  },
  empty: {
    padding: theme.spacing.md,
    color: theme.colors.inkSubtle
  }
});
