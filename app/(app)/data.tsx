import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { Card } from "../../src/components/Card";
import { AccessDenied } from "../../src/components/AccessDenied";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { Item, KPI } from "../../src/types";
import { toCsv, parseCsv } from "../../src/lib/csv";
import { useCan } from "../../src/hooks/useCurrentUser";

const copyToClipboard = async (text: string) => {
  try {
    const nav =
      typeof globalThis !== "undefined" &&
      typeof (globalThis as { navigator?: { clipboard?: { writeText?: (t: string) => Promise<void> } } }).navigator !==
        "undefined"
        ? (globalThis as {
            navigator?: { clipboard?: { writeText?: (t: string) => Promise<void> } };
          }).navigator
        : undefined;
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(text);
      Alert.alert("Copied", "CSV data copied to clipboard.");
      return;
    }
  } catch {
    // fallback below
  }
  Alert.alert("Copy failed", "Clipboard access not available on this device.");
};

const parseBomCsv = (raw: string, items: Item[]) => {
  const rows = parseCsv(raw);
  if (rows.length === 0) {
    return { lines: [], errors: ["CSV is empty."] };
  }
  const header = rows[0] ?? [];
  const dataRows = header.some((cell) => cell.toLowerCase().includes("sku"))
    ? rows.slice(1)
    : rows;

  const itemBySku = new Map(
    items.map((item) => [item.sku.toLowerCase(), item])
  );
  const errors: string[] = [];
  const lines = dataRows.map((row, index) => {
    const finishedSku = (row[0] ?? "").trim().toLowerCase();
    const materialSku = (row[1] ?? "").trim().toLowerCase();
    const qtyRaw = row[2] ?? "0";
    const qty = Number(qtyRaw);
    const finished = itemBySku.get(finishedSku);
    const material = itemBySku.get(materialSku);
    if (!finished || !material) {
      errors.push(`Row ${index + 1}: Unknown SKU.`);
    }
    return {
      id: `bom-import-${index + 1}`,
      finishedProductId: finished?.id ?? "",
      materialId: material?.id ?? "",
      qtyPerUnit: Number.isNaN(qty) ? 0 : qty
    };
  });

  const validLines = lines.filter(
    (line) => line.finishedProductId && line.materialId && line.qtyPerUnit > 0
  );
  return { lines: validLines, errors };
};

const parseKpiCsv = (raw: string): KPI[] => {
  const rows = parseCsv(raw);
  if (rows.length === 0) {
    return [];
  }
  const header = rows[0] ?? [];
  const dataRows = header.some((cell) => cell.toLowerCase().includes("label"))
    ? rows.slice(1)
    : rows;
  return dataRows
    .filter((row) => row.length >= 3)
    .map((row, index) => ({
      id: `kpi-${index + 1}`,
      label: row[0] ?? "KPI",
      value: Number.isNaN(Number(row[1])) ? 0 : Number(row[1]),
      unit: row[2] ?? "",
      delta: Number.isNaN(Number(row[3])) ? 0 : Number(row[3])
    }));
};

export default function DataHubScreen() {
  const canExchange = useCan("data.exchange");
  const items = useAppStore((state) => state.items);
  const bomLines = useAppStore((state) => state.bomLines);
  const kpis = useAppStore((state) => state.kpis);
  const setBomLines = useAppStore((state) => state.setBomLines);
  const setKpis = useAppStore((state) => state.setKpis);
  const createAuditEvent = useAppStore((state) => state.createAuditEvent);

  const [exportCsv, setExportCsv] = useState("");
  const [bomImport, setBomImport] = useState("");
  const [kpiImport, setKpiImport] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const bomExport = useMemo(() => {
    const itemById = new Map(items.map((item) => [item.id, item]));
    const rows = bomLines.map((line) => [
      itemById.get(line.finishedProductId)?.sku ?? line.finishedProductId,
      itemById.get(line.materialId)?.sku ?? line.materialId,
      line.qtyPerUnit
    ]);
    return toCsv(["finished_sku", "material_sku", "qty_per_unit"], rows);
  }, [bomLines, items]);

  const kpiExport = useMemo(() => {
    const rows = kpis.map((kpi) => [kpi.label, kpi.value, kpi.unit, kpi.delta]);
    return toCsv(["label", "value", "unit", "delta"], rows);
  }, [kpis]);

  if (!canExchange) {
    return (
      <Screen>
        <SectionHeader title="Data Hub" subtitle="Role-based access enforced." />
        <AccessDenied />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Data Hub"
        subtitle="Excel-compatible import/export for BOM and Analytics."
      />

      <Card style={styles.card}>
        <Text style={styles.label}>Export datasets</Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              setExportCsv(bomExport);
              setStatus("BOM export ready.");
              createAuditEvent({ action: "Exported BOM CSV", entity: "bom" });
            }}
          >
            <Text style={styles.primaryText}>Export BOM CSV</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setExportCsv(kpiExport);
              setStatus("Analytics export ready.");
              createAuditEvent({ action: "Exported KPI CSV", entity: "analytics" });
            }}
          >
            <Text style={styles.secondaryText}>Export Analytics CSV</Text>
          </Pressable>
        </View>
        <TextInput
          value={exportCsv}
          editable={false}
          multiline
          placeholder="Exported CSV will appear here."
          placeholderTextColor={theme.colors.inkSubtle}
          style={styles.textArea}
        />
        <Pressable
          onPress={() => copyToClipboard(exportCsv)}
          disabled={!exportCsv}
          style={[styles.ghostButton, !exportCsv && styles.ghostButtonDisabled]}
        >
          <Text style={styles.ghostText}>Copy CSV</Text>
        </Pressable>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Import BOM (CSV)</Text>
        <Text style={styles.help}>
          Format: finished_sku, material_sku, qty_per_unit
        </Text>
        <TextInput
          value={bomImport}
          onChangeText={setBomImport}
          multiline
          placeholder="Paste BOM CSV here"
          placeholderTextColor={theme.colors.inkSubtle}
          style={styles.textArea}
        />
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            const result = parseBomCsv(bomImport, items);
            if (result.lines.length === 0) {
              setStatus("No valid BOM lines found.");
              return;
            }
            setBomLines(result.lines);
            setStatus(
              `Imported ${result.lines.length} BOM lines. ${result.errors.length} issues.`
            );
          }}
        >
          <Text style={styles.primaryText}>Import BOM</Text>
        </Pressable>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Import Analytics KPIs (CSV)</Text>
        <Text style={styles.help}>
          Format: label, value, unit, delta
        </Text>
        <TextInput
          value={kpiImport}
          onChangeText={setKpiImport}
          multiline
          placeholder="Paste KPI CSV here"
          placeholderTextColor={theme.colors.inkSubtle}
          style={styles.textArea}
        />
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            const nextKpis = parseKpiCsv(kpiImport);
            if (nextKpis.length === 0) {
              setStatus("No KPI rows parsed.");
              return;
            }
            setKpis(nextKpis);
            setStatus(`Imported ${nextKpis.length} KPI rows.`);
          }}
        >
          <Text style={styles.secondaryText}>Import KPIs</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.inkSubtle,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: theme.spacing.sm
  },
  help: {
    fontSize: 12,
    color: theme.colors.inkSubtle,
    marginBottom: theme.spacing.sm
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  primaryButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm
  },
  secondaryText: {
    color: theme.colors.ink,
    fontWeight: "600"
  },
  ghostButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.sm
  },
  ghostButtonDisabled: {
    opacity: 0.5
  },
  ghostText: {
    color: theme.colors.accentDark,
    fontWeight: "700"
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    fontSize: 12,
    textAlignVertical: "top"
  },
  status: {
    marginTop: theme.spacing.sm,
    fontSize: 12,
    color: theme.colors.inkSubtle
  }
});
