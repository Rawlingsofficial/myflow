// src/lib/services/service  (TENANT APP)
// All queries are constrained by RLS — no org filtering needed client-side.

import { createClient } from "@/lib/supabase/server";

/**
 * Resolve the current user's tenant record + link check.
 * Returns null if user is not yet linked to a tenant.
 */
export async function getCurrentTenant() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select(`
      id,
      first_name,
      last_name,
      email,
      primary_phone,
      photo_url,
      tenant_type,
      company_name,
      status
    `)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get tenant's active lease with unit + building info.
 */
export async function getActiveLease() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leases")
    .select(`
      id,
      rent_amount,
      service_charge,
      lease_start,
      lease_end,
      renewal_date,
      payment_terms,
      escalation_rate,
      break_clause_date,
      status,
      unit:units (
        id,
        unit_code,
        unit_type,
        bedrooms,
        bathrooms,
        area_sqm,
        floor_number,
        building:buildings (
          id,
          name,
          address,
          photo_url,
          building_type
        )
      )
    `)
    .eq("status", "active")
    .maybeSingle();

  if (error) return null;
  return data;
}

/**
 * Get tenant's payment history.
 */
export async function getPaymentHistory(leaseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rent_payments")
    .select("id, amount, payment_date, method, reference, status")
    .eq("lease_id", leaseId)
    .order("payment_date", { ascending: false });

  if (error) return [];
  return data;
}

/**
 * Get tenant's invoices.
 */
export async function getInvoices(leaseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, invoice_date, due_date, rent_amount, service_charge, total_amount, status, paid_date"
    )
    .eq("lease_id", leaseId)
    .order("invoice_date", { ascending: false });

  if (error) return [];
  return data;
}

/**
 * Get tenant notifications (unread first).
 */
export async function getTenantNotifications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];
  return data;
}

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead() {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
}

/**
 * Get tenant's maintenance requests with updates.
 */
export async function getMaintenanceRequests() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      id,
      category,
      description,
      status,
      priority,
      created_at,
      updated_at,
      maintenance_updates (
        id, status, notes, created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}
