# Warehouse WMS Prompt (Super Admin + RBAC + Multi-Tenant)

ROLE
You are a senior React Native (Expo) engineer and product designer. Build a production-ready Warehouse Management System (WMS) with raw-material management and production forecasting. The app must run on mobile and web and must be deployable on Vercel via Expo Web. Use TypeScript, avoid build errors, and ensure strict type safety.

PRIMARY GOAL
Create a modern WMS that covers end-to-end operations: inbound, storage, inventory, production planning, outbound, returns, analytics, and auditability. Include a raw-material forecasting engine that calculates "maximum producible units" by available materials and BOM constraints.

HARD REQUIREMENTS
- React Native + Expo (TypeScript) with Expo Router and web support.
- Clean, error-free build. No unused imports, no TypeScript errors.
- All features below must exist as screens, flows, and data models.
- Include mock data and deterministic calculations.
- Provide accessible and responsive layouts for web and mobile.
- Every change and action must log a timestamp in Indian time (Asia/Kolkata).
- Logins must be recorded in the audit trail with IST.

SUPER ADMIN + RBAC + MULTI-TENANT (MUST IMPLEMENT)
- Roles: SUPER_ADMIN, ADMIN, MANAGER, PLANNER, OPERATOR, VIEWER.
- Super Admin is the platform owner. They can create companies, create Admin accounts for those companies, and revoke access.
- Admin belongs to a single company and can only manage users within that company.
- Admin can create users within the same company (MANAGER, PLANNER, OPERATOR, VIEWER).
- Super Admin can limit Admin analytics and other feature access via role overrides and company-level limits.
- Company-level limits can only restrict access (no company can gain features above its role permissions).
- Users only see features they are permitted to access.

NAVIGATION & UI (MUST IMPLEMENT)
- Use a sidebar or slide-out navigation for feature access. Avoid a flat "everything on one page" UX.
- Make the UI visually premium with attractive colors, spacing, and motion.
- Include a top bar with the current Indian date/time for operational traceability.

CORE FEATURES
- Authentication and RBAC: email + password login, access gating.
- Master data: items, UOM, locations, bins, warehouses, suppliers, customers.
- Raw materials: receipts, lot/serial, expiry, QC, quarantine, release.
- Inventory control: stock by location, batch tracking, reserved/available/on-hand.
- Inbound: ASN, receiving, putaway, discrepancy handling.
- Storage: zone/bin management, capacity, replenishment thresholds.
- Cycle counting: scheduled counts, variance handling, approval workflow.
- Transfers: inter-bin, inter-warehouse, consolidation, cross-dock.
- Outbound: sales orders, wave planning, pick/pack/ship, packing lists, labels.
- Returns: RMA intake, disposition, re-stock or scrap.
- Production: BOM, recipe versions, yields, scrap %, work orders, WIP, material issue.
- Forecasting: based on available raw materials, calculate max producible units per SKU.
- Procurement: reorder point, safety stock, PO suggestions, supplier lead times.
- Alerts: low stock, expiry risk, QC failures, delayed inbound, oversubscription.
- Analytics: KPI dashboard, throughput, fill rate, inventory turns, aging, shrinkage.
- Audit logs: immutable event trail for all stock movements and approvals.
- Integrations: barcode/QR scanning UI, import/export (CSV), API placeholders.
- Data Exchange: Excel-compatible import/export for Analytics and BOM data.
- Enterprise Value: Screens and copy that justify premium pricing (compliance, auditability, SLA, multi-warehouse, RBAC, forecasting, integrations, ROI).

PRODUCTION FORECASTING LOGIC (MUST IMPLEMENT)
- Given BOM for each finished product and current available raw materials:
  max_producible_units = min over required materials (available_qty / per_unit_qty * yield_adjustment)
- Include yield %, scrap %, and reserved stock. Show bottleneck material.
- If material is below reorder point, show warning and suggested PO qty.

DATA MODEL (DEFINE TYPES)
- Item, Material, FinishedProduct, BOMLine, Warehouse, Location, Bin, StockLot,
  InventoryBalance, WorkOrder, ProductionRun, PurchaseOrder, SalesOrder, Transfer,
  CycleCount, QCInspection, AuditEvent, User, Role, Alert, KPI, Company, CompanyLimit.

SCREENS (MUST IMPLEMENT)
- Dashboard: KPIs, alerts, quick actions, stock heatmap.
- Inventory: search, filters, lot details, stock by bin.
- Inbound: ASN list, receive flow, QC step, putaway.
- Production: BOM list, work orders, forecast panel with max producible units.
- Outbound: orders, wave planning, pick/pack steps.
- Transfers: move stock between locations/warehouses.
- Cycle Counts: scheduled and ad-hoc counts.
- Suppliers/Customers: master data.
- Analytics: charts for aging, turns, fill rate.
- Admin: users, roles, permissions, company access, product management.
- Data Hub: import/export Excel-compatible CSV for BOM + Analytics.
- Enterprise Value: premium feature justification and ROI.

UI/UX
- Bold, modern design. Clear typography, strong contrast, fast navigation.
- Consistent spacing, reusable components, and validated forms.
- Table views and card views for mobile.
- Smooth transitions for navigation and panels.
- Premium look and clear text rendering on web and mobile.

TECH STACK
- React Native + Expo + TypeScript.
- Expo Router for navigation.
- State management with Zustand.

DELIVERABLES
- Complete project structure.
- All screens and navigation wired.
- Mock data seed and a simple in-memory data layer.
- Production forecasting calculation with sample BOMs and materials.
- Clear instructions to build and run on web for Vercel.

DEPLOYMENT NOTE
- Provide commands for `expo export --platform web --output-dir dist`
- Provide a Vercel config that serves the static web build.

QUALITY BAR
- No TypeScript errors.
- No runtime crashes.
- Deterministic calculations.
- Explicit IST timestamps in audit logs and action records.

BEST PRACTICES (ALWAYS APPLY)
- Validate user inputs (email format, required fields, numeric ranges).
- Normalize emails to lowercase and trim whitespace before comparing.
- Enforce minimum password length (>= 6) for created accounts.
- Prevent duplicate emails and duplicate company names.
- Ensure role and company limits can only restrict, never escalate permissions.
- Block access for suspended companies and inactive accounts.
- Use responsive layout rules (wrap rows, avoid clipped text, horizontal table scroll).
- Keep admin and super admin flows separated and minimal.
- Run typecheck and web export before handing off.
