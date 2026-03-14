import { create } from "zustand";
import {
  Alert,
  AuditEvent,
  Bin,
  BOMLine,
  Company,
  CompanyLimit,
  InventoryBalance,
  Item,
  KPI,
  Location,
  PurchaseOrder,
  Permission,
  Role,
  RoleOverrides,
  SalesOrder,
  User,
  Warehouse,
  WorkOrder
} from "../types";
import {
  alerts,
  auditEvents,
  bins,
  bomLines,
  companies,
  inventory,
  items,
  kpis,
  locations,
  purchaseOrders,
  salesOrders,
  users,
  warehouses,
  workOrders
} from "./initialData";
import { getISTNow } from "../lib/time";

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export type AppState = {
  currentUserId: string | null;
  users: User[];
  roleOverrides: RoleOverrides;
  companies: Company[];
  companyOverrides: Record<string, CompanyLimit>;
  warehouses: Warehouse[];
  locations: Location[];
  bins: Bin[];
  items: Item[];
  bomLines: BOMLine[];
  inventory: InventoryBalance[];
  workOrders: WorkOrder[];
  purchaseOrders: PurchaseOrder[];
  salesOrders: SalesOrder[];
  alerts: Alert[];
  kpis: KPI[];
  audit: AuditEvent[];
  loginAs: (userId: string) => void;
  logout: () => void;
  createUser: (payload: Omit<User, "id">) => void;
  updateUser: (userId: string, patch: Partial<User>) => void;
  setRoleOverride: (role: Role, permission: Permission, enabled: boolean) => void;
  createCompany: (payload: Omit<Company, "id">) => void;
  updateCompany: (companyId: string, patch: Partial<Company>) => void;
  setCompanyOverride: (
    companyId: string,
    permission: Permission,
    enabled: boolean
  ) => void;
  updateItem: (itemId: string, patch: Partial<Item>) => void;
  setBomLines: (lines: BOMLine[]) => void;
  setKpis: (kpis: KPI[]) => void;
  createAuditEvent: (
    event: Omit<AuditEvent, "id" | "actor" | "createdAt"> &
      Partial<Pick<AuditEvent, "actor" | "createdAt">>
  ) => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentUserId: null,
  users: [...users],
  roleOverrides: {},
  companies: [...companies],
  companyOverrides: {},
  warehouses: [...warehouses],
  locations: [...locations],
  bins: [...bins],
  items: [...items],
  bomLines: [...bomLines],
  inventory: [...inventory],
  workOrders: [...workOrders],
  purchaseOrders: [...purchaseOrders],
  salesOrders: [...salesOrders],
  alerts: [...alerts],
  kpis: [...kpis],
  audit: [...auditEvents],
  loginAs: (userId) =>
    set((state) => {
      const actor = state.users.find((user) => user.id === userId)?.name ?? "User";
      return {
        currentUserId: userId,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Logged in",
            entity: userId,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  logout: () =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ?? "User";
      return {
        currentUserId: null,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Logged out",
            entity: state.currentUserId ?? "unknown",
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  createUser: (payload) =>
    set((state) => {
      const id = createId("user");
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      const nextUsers = [...state.users, { ...payload, id }];
      return {
        users: nextUsers,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Created user",
            entity: payload.email,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  updateUser: (userId, patch) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      const updated = state.users.map((user) =>
        user.id === userId ? { ...user, ...patch } : user
      );
      return {
        users: updated,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Updated user",
            entity: userId,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  setRoleOverride: (role, permission, enabled) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        roleOverrides: {
          ...state.roleOverrides,
          [role]: {
            ...state.roleOverrides[role],
            [permission]: enabled
          }
        },
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Override role permission",
            entity: `${role}.${permission}=${enabled}`,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  createCompany: (payload) =>
    set((state) => {
      const id = createId("company");
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        companies: [...state.companies, { ...payload, id }],
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Created company",
            entity: payload.name,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  updateCompany: (companyId, patch) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        companies: state.companies.map((company) =>
          company.id === companyId ? { ...company, ...patch } : company
        ),
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Updated company",
            entity: companyId,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  setCompanyOverride: (companyId, permission, enabled) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        companyOverrides: {
          ...state.companyOverrides,
          [companyId]: {
            ...state.companyOverrides[companyId],
            [permission]: enabled
          }
        },
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Set company limit",
            entity: `${companyId}.${permission}=${enabled}`,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  updateItem: (itemId, patch) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...patch } : item
        ),
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Updated item",
            entity: itemId,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  setBomLines: (lines) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        bomLines: lines,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Imported BOM",
            entity: `lines:${lines.length}`,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  setKpis: (nextKpis) =>
    set((state) => {
      const actor =
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        kpis: nextKpis,
        audit: [
          {
            id: createId("audit"),
            actor,
            action: "Imported KPI set",
            entity: `kpis:${nextKpis.length}`,
            createdAt: getISTNow()
          },
          ...state.audit
        ]
      };
    }),
  createAuditEvent: (event) =>
    set((state) => {
      const actor =
        event.actor ??
        state.users.find((user) => user.id === state.currentUserId)?.name ??
        "System";
      return {
        audit: [
          {
            ...event,
            id: createId("audit"),
            actor,
            createdAt: event.createdAt ?? getISTNow()
          },
          ...state.audit
        ]
      };
    })
}));
