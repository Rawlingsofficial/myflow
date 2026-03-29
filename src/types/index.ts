// src/types/index.ts

// ─── Shared Enums / Literal Types ─────────────────────────────────────────────
export type OrgStatus = 'active' | 'inactive';
export type PlanType = 'free' | 'pro' | 'enterprise';
export type Role = 'owner' | 'admin' | 'manager' | 'viewer';
export type UnitStatus = 'vacant' | 'occupied' | 'maintenance';
export type LeaseStatus = 'active' | 'ended' | 'terminated';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type TenantStatus = 'active' | 'inactive';
export type UserStatus = 'active' | 'inactive';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
export type ListingStatus = 'draft' | 'published' | 'unavailable';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'other';
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved';
export type MaintenancePriority = 'low' | 'normal' | 'high' | 'emergency';

// ─── Database Row Types ───────────────────────────────────────────────────────
export interface Organization {
  id: string;
  name: string;
  country: string | null;
  plan_type: string;
  unit_limit: number;
  user_limit: number;
  status: OrgStatus;
  property_type: string | null;
}

export interface OrganizationMembership {
  id: string;
  user_id: string;
  organization_id: string;
  role: Role;
  status: OrgStatus;
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  username: string | null;
  status: UserStatus;
  app_role: 'landlord' | 'tenant';
}

export interface Building {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  photo_url: string | null;
  status: OrgStatus;
  building_type: string | null;
  region: string | null;
  division: string | null;
  city: string | null;
}

export interface Unit {
  id: string;
  building_id: string;
  unit_code: string;
  unit_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  default_rent: number | null;
  status: UnitStatus;
  unit_purpose: string | null;
  area_sqm: number | null;
  floor_number: number | null;
}

export interface Tenant {
  id: string;
  organization_id: string;
  first_name: string | null;
  last_name: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  country: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  occupation: string | null;
  employment_type: string | null;
  employer_name: string | null;
  work_address: string | null;
  notes: string | null;
  photo_url: string | null;
  status: TenantStatus;
  tenant_type: string | null;
  company_name: string | null;
  company_reg_number: string | null;
  vat_number: string | null;
  industry: string | null;
  company_size: string | null;
  contact_person: string | null;
  contact_role: string | null;
  user_id: string | null;
}

export interface Lease {
  id: string;
  organization_id: string;
  tenant_id: string;
  unit_id: string;
  rent_amount: number;
  lease_start: string;
  lease_end: string | null;
  renewal_date: string | null;
  status: LeaseStatus;
  service_charge: number | null;
  escalation_rate: number | null;
  break_clause_date: string | null;
  payment_terms: number | null;
}

export interface Invoice {
  id: string;
  organization_id: string;
  lease_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  rent_amount: number;
  service_charge: number;
  total_amount: number;
  status: InvoiceStatus;
  paid_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface RentPayment {
  id: string;
  lease_id: string;
  amount: number;
  payment_date: string;
  method: string | null;
  reference: string | null;
  status: PaymentStatus;
}

export interface TenantDocument {
  id: string;
  tenant_id: string;
  document_type: string | null;
  file_url: string | null;
}

export interface TenantEmergencyContact {
  id: string;
  tenant_id: string;
  full_name: string | null;
  phone: string | null;
  relationship: string | null;
}

export interface TenantIdentification {
  id: string;
  tenant_id: string;
  id_type: string | null;
  id_number: string | null;
  issuing_country: string | null;
  expiry_date: string | null;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string | null;
  type: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  tenant_id: string | null;
}

export interface MaintenanceRequest {
  id: string;
  organization_id: string;
  tenant_id: string;
  unit_id: string;
  category: MaintenanceCategory;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceUpdate {
  id: string;
  request_id: string;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  organization_id: string;
  unit_id: string;
  status: ListingStatus;
  title: string;
  description: string | null;
  price: number;
  city: string;
  area: string | null;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_footage: number | null;
  full_address: string | null;
  neighborhood: string | null;
  deposit_amount: number | null;
  features_amenities: { items: string[] } | any;
  pet_policy: string | null;
  lease_terms: string | null;
  available_date: string | null;
  region: string | null;
  division: string | null;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

// ─── Joined / Enriched Types (For UI) ─────────────────────────────────────────

export interface UnitWithBuilding extends Unit {
  buildings: Pick<Building, 'id' | 'name' | 'address' | 'region' | 'division' | 'city'>;
}

export interface LeaseWithDetails extends Lease {
  tenants: Pick<Tenant, 'id' | 'first_name' | 'last_name' | 'email' | 'primary_phone' | 'tenant_type' | 'company_name' | 'photo_url'>;
  units: UnitWithBuilding;
}

export interface TenantWithLease extends Tenant {
  leases: LeaseWithDetails[];
}

export interface ListingWithDetails extends Listing {
  unit: Unit & { buildings: Pick<Building, 'id' | 'name' | 'address' | 'region' | 'division' | 'city'> };
  images: ListingImage[];
}


// ─── Supabase Database Type Schema ────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id'> & { id?: string };
        Update: Partial<Omit<Organization, 'id'>>;
      };
      organization_memberships: {
        Row: OrganizationMembership;
        Insert: Omit<OrganizationMembership, 'id'> & { id?: string };
        Update: Partial<Omit<OrganizationMembership, 'id'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id'> & { id?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      buildings: {
        Row: Building;
        Insert: Omit<Building, 'id'> & { id?: string };
        Update: Partial<Omit<Building, 'id'>>;
      };
      units: {
        Row: Unit;
        Insert: Omit<Unit, 'id'> & { id?: string };
        Update: Partial<Omit<Unit, 'id'>>;
      };
      tenants: {
        Row: Tenant;
        Insert: Omit<Tenant, 'id'> & { id?: string };
        Update: Partial<Omit<Tenant, 'id'>>;
      };
      leases: {
        Row: Lease;
        Insert: Omit<Lease, 'id'> & { id?: string };
        Update: Partial<Omit<Lease, 'id'>>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<Invoice, 'id' | 'created_at'>>;
      };
      rent_payments: {
        Row: RentPayment;
        Insert: Omit<RentPayment, 'id'> & { id?: string };
        Update: Partial<Omit<RentPayment, 'id'>>;
      };
      tenant_documents: {
        Row: TenantDocument;
        Insert: Omit<TenantDocument, 'id'> & { id?: string };
        Update: Partial<Omit<TenantDocument, 'id'>>;
      };
      tenant_emergency_contacts: {
        Row: TenantEmergencyContact;
        Insert: Omit<TenantEmergencyContact, 'id'> & { id?: string };
        Update: Partial<Omit<TenantEmergencyContact, 'id'>>;
      };
      tenant_identifications: {
        Row: TenantIdentification;
        Insert: Omit<TenantIdentification, 'id'> & { id?: string };
        Update: Partial<Omit<TenantIdentification, 'id'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      maintenance_requests: {
        Row: MaintenanceRequest;
        Insert: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      maintenance_updates: {
        Row: MaintenanceUpdate;
        Insert: Omit<MaintenanceUpdate, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<MaintenanceUpdate, 'id' | 'created_at'>>;
      };
      listings: {
        Row: Listing;
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Omit<Listing, 'id' | 'created_at' | 'updated_at'>>;
      };
      listing_images: {
        Row: ListingImage;
        Insert: Omit<ListingImage, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<ListingImage, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
    };
  };
};

