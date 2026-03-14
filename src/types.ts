export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "PLANNER"
  | "OPERATOR"
  | "VIEWER";

export type Permission =
  | "dashboard.view"
  | "inventory.view"
  | "inventory.edit"
  | "production.view"
  | "production.plan"
  | "analytics.view"
  | "data.exchange"
  | "users.manage"
  | "roles.manage"
  | "products.edit"
  | "procurement.view"
  | "warehouse.edit"
  | "audit.view";

export type PermissionOverride = Partial<Record<Permission, boolean>>;

export type RoleOverrides = Partial<Record<Role, PermissionOverride>>;

export type CompanyLimit = Partial<Record<Permission, boolean>>;

export type Company = {
  id: string;
  name: string;
  active: boolean;
  plan: "Starter" | "Growth" | "Enterprise";
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  companyId: string;
  role: Role;
  active: boolean;
};

export type Warehouse = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  warehouseId: string;
  zone: string;
};

export type Bin = {
  id: string;
  locationId: string;
  code: string;
  capacity: number;
};

export type ItemType = "material" | "finished";

export type Item = {
  id: string;
  sku: string;
  name: string;
  type: ItemType;
  uom: string;
  reorderPoint: number;
  safetyStock: number;
  leadTimeDays: number;
  yieldPercent: number;
  scrapPercent: number;
};

export type BOMLine = {
  id: string;
  finishedProductId: string;
  materialId: string;
  qtyPerUnit: number;
};

export type InventoryBalance = {
  id: string;
  itemId: string;
  binId: string;
  onHand: number;
  reserved: number;
  lotCode?: string;
  expiryDate?: string;
};

export type WorkOrderStatus = "planned" | "in_progress" | "completed" | "hold";

export type WorkOrder = {
  id: string;
  productId: string;
  targetQty: number;
  status: WorkOrderStatus;
  dueDate: string;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  itemId: string;
  qty: number;
  eta: string;
  status: "draft" | "sent" | "received";
};

export type SalesOrder = {
  id: string;
  customer: string;
  itemId: string;
  qty: number;
  dueDate: string;
  status: "open" | "allocated" | "shipped";
};

export type AlertSeverity = "low" | "medium" | "high";

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
};

export type KPI = {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  createdAt: string;
};
