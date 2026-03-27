import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find tenant ID
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id, unit_id, organization_id')
    .eq('user_id', user.id)
    .single();

  if (tenantError || !tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const { category, description, priority } = await request.json();

  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert({
      organization_id: tenant.organization_id,
      tenant_id: tenant.id,
      unit_id: tenant.unit_id,
      category,
      description,
      priority,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating maintenance request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

