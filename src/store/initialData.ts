import {
  Alert,
  AuditEvent,
  Bin,
  BOMLine,
  Company,
  InventoryBalance,
  Item,
  KPI,
  Location,
  PurchaseOrder,
  SalesOrder,
  User,
  Warehouse,
  WorkOrder
} from "../types";

export const companies: Company[] = [
  { id: "company-platform", name: "Skillnet WMS Platform", active: true, plan: "Enterprise" },
  { id: "company-skillnet", name: "Skillnet Learning", active: true, plan: "Enterprise" },
  { id: "company-nova", name: "Nova Logistics", active: true, plan: "Growth" }
];

export const users: User[] = [
  {
    id: "user-super",
    name: "Super Admin",
    email: "super@wms.com",
    password: "superadmin",
    companyId: "company-platform",
    role: "SUPER_ADMIN",
    active: true
  },
  {
    id: "user-admin",
    name: "Tushar Saini",
    email: "tushar1@skillnetlearning.com",
    password: "skillnet",
    companyId: "company-skillnet",
    role: "ADMIN",
    active: true
  },
  {
    id: "user-manager",
    name: "Priya Rao",
    email: "manager@wms.com",
    password: "manager123",
    companyId: "company-nova",
    role: "MANAGER",
    active: true
  },
  {
    id: "user-planner",
    name: "Liam Chen",
    email: "planner@wms.com",
    password: "planner123",
    companyId: "company-nova",
    role: "PLANNER",
    active: true
  },
  {
    id: "user-operator",
    name: "Maya Rodriguez",
    email: "operator@wms.com",
    password: "operator123",
    companyId: "company-skillnet",
    role: "OPERATOR",
    active: true
  },
  {
    id: "user-viewer",
    name: "Ethan Park",
    email: "viewer@wms.com",
    password: "viewer123",
    companyId: "company-skillnet",
    role: "VIEWER",
    active: true
  }
];

export const warehouses: Warehouse[] = [
  { id: "wh-1", name: "North Hub" },
  { id: "wh-2", name: "South Hub" }
];

export const locations: Location[] = [
  { id: "loc-a", warehouseId: "wh-1", zone: "A" },
  { id: "loc-b", warehouseId: "wh-1", zone: "B" },
  { id: "loc-c", warehouseId: "wh-2", zone: "C" }
];

export const bins: Bin[] = [
  { id: "bin-a1", locationId: "loc-a", code: "A-01", capacity: 500 },
  { id: "bin-a2", locationId: "loc-a", code: "A-02", capacity: 420 },
  { id: "bin-b1", locationId: "loc-b", code: "B-01", capacity: 600 },
  { id: "bin-c1", locationId: "loc-c", code: "C-01", capacity: 380 }
];

export const items: Item[] = [
  {
    id: "mat-steel",
    sku: "RM-STEEL-01",
    name: "Steel Coil",
    type: "material",
    uom: "kg",
    reorderPoint: 900,
    safetyStock: 600,
    leadTimeDays: 12,
    yieldPercent: 96,
    scrapPercent: 3
  },
  {
    id: "mat-resin",
    sku: "RM-RESIN-04",
    name: "Poly Resin",
    type: "material",
    uom: "kg",
    reorderPoint: 500,
    safetyStock: 340,
    leadTimeDays: 9,
    yieldPercent: 94,
    scrapPercent: 4
  },
  {
    id: "mat-copper",
    sku: "RM-CU-09",
    name: "Copper Wire",
    type: "material",
    uom: "m",
    reorderPoint: 2000,
    safetyStock: 1200,
    leadTimeDays: 7,
    yieldPercent: 97,
    scrapPercent: 2
  },
  {
    id: "fg-shelf",
    sku: "FG-SHELF-10",
    name: "Smart Shelf",
    type: "finished",
    uom: "unit",
    reorderPoint: 120,
    safetyStock: 80,
    leadTimeDays: 3,
    yieldPercent: 100,
    scrapPercent: 1
  },
  {
    id: "fg-sensor",
    sku: "FG-SENSOR-02",
    name: "Sensor Unit",
    type: "finished",
    uom: "unit",
    reorderPoint: 200,
    safetyStock: 120,
    leadTimeDays: 2,
    yieldPercent: 100,
    scrapPercent: 1
  },
  {
    id: "fg-pack",
    sku: "FG-PACK-07",
    name: "Packaging Kit",
    type: "finished",
    uom: "unit",
    reorderPoint: 300,
    safetyStock: 180,
    leadTimeDays: 1,
    yieldPercent: 100,
    scrapPercent: 1
  }
];

export const bomLines: BOMLine[] = [
  { id: "bom-1", finishedProductId: "fg-shelf", materialId: "mat-steel", qtyPerUnit: 12 },
  { id: "bom-2", finishedProductId: "fg-shelf", materialId: "mat-resin", qtyPerUnit: 6 },
  { id: "bom-3", finishedProductId: "fg-shelf", materialId: "mat-copper", qtyPerUnit: 18 },
  { id: "bom-4", finishedProductId: "fg-sensor", materialId: "mat-resin", qtyPerUnit: 3 },
  { id: "bom-5", finishedProductId: "fg-sensor", materialId: "mat-copper", qtyPerUnit: 8 },
  { id: "bom-6", finishedProductId: "fg-pack", materialId: "mat-resin", qtyPerUnit: 1.5 }
];

export const inventory: InventoryBalance[] = [
  { id: "inv-1", itemId: "mat-steel", binId: "bin-a1", onHand: 1200, reserved: 240, lotCode: "ST-24A" },
  { id: "inv-2", itemId: "mat-resin", binId: "bin-a2", onHand: 780, reserved: 120, lotCode: "RS-11C" },
  { id: "inv-3", itemId: "mat-copper", binId: "bin-b1", onHand: 2600, reserved: 400, lotCode: "CU-88B" },
  { id: "inv-4", itemId: "fg-shelf", binId: "bin-c1", onHand: 90, reserved: 35 },
  { id: "inv-5", itemId: "fg-sensor", binId: "bin-c1", onHand: 180, reserved: 40 },
  { id: "inv-6", itemId: "fg-pack", binId: "bin-b1", onHand: 240, reserved: 60 }
];

export const workOrders: WorkOrder[] = [
  { id: "wo-1001", productId: "fg-shelf", targetQty: 180, status: "planned", dueDate: "2026-03-18" },
  { id: "wo-1002", productId: "fg-sensor", targetQty: 260, status: "in_progress", dueDate: "2026-03-16" },
  { id: "wo-1003", productId: "fg-pack", targetQty: 320, status: "planned", dueDate: "2026-03-20" }
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: "po-5401", supplier: "Nova Metals", itemId: "mat-steel", qty: 2000, eta: "2026-03-22", status: "sent" },
  { id: "po-5402", supplier: "PolyCore", itemId: "mat-resin", qty: 1000, eta: "2026-03-19", status: "draft" }
];

export const salesOrders: SalesOrder[] = [
  { id: "so-9001", customer: "RetailWest", itemId: "fg-shelf", qty: 60, dueDate: "2026-03-17", status: "allocated" },
  { id: "so-9002", customer: "QuickShop", itemId: "fg-sensor", qty: 140, dueDate: "2026-03-18", status: "open" },
  { id: "so-9003", customer: "LogiCity", itemId: "fg-pack", qty: 200, dueDate: "2026-03-20", status: "open" }
];

export const alerts: Alert[] = [
  {
    id: "alert-1",
    title: "Resin below reorder point",
    description: "Poly Resin stock is below reorder point. Suggested PO 220 kg.",
    severity: "high"
  },
  {
    id: "alert-2",
    title: "Cycle count variance",
    description: "Bin B-01 variance exceeds 2%. Requires manager approval.",
    severity: "medium"
  },
  {
    id: "alert-3",
    title: "Inbound ASN delayed",
    description: "Supplier Nova Metals delay estimated 2 days.",
    severity: "low"
  }
];

export const kpis: KPI[] = [
  { id: "kpi-1", label: "Inventory Turns", value: 8.2, unit: "x", delta: 0.4 },
  { id: "kpi-2", label: "Fill Rate", value: 96.4, unit: "%", delta: 1.2 },
  { id: "kpi-3", label: "Order Cycle Time", value: 1.6, unit: "days", delta: -0.3 },
  { id: "kpi-4", label: "Shrinkage", value: 0.9, unit: "%", delta: -0.1 }
];

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    actor: "Ava Singh",
    action: "Override role permission",
    entity: "ADMIN.analytics.view",
    createdAt: "14 Mar 2026, 08:32 IST"
  },
  {
    id: "audit-2",
    actor: "Tushar Saini",
    action: "Created user",
    entity: "user-operator",
    createdAt: "13 Mar 2026, 16:11 IST"
  },
  {
    id: "audit-3",
    actor: "Priya Rao",
    action: "Approved cycle count",
    entity: "bin-b1",
    createdAt: "13 Mar 2026, 12:44 IST"
  }
];
