import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseServer';
import { devLog } from '$lib/devLog';
import { isBlockedAddress } from '$lib/blockedAddresses';

const allowedAdditions = {
  '5m': 5 * 60,
  '10m': 10 * 60,
  '15m': 15 * 60,
  '30m': 30 * 60,
  '1h': 60 * 60,
  '2h': 2 * 60 * 60
};

/**
 * PUT /api/emails/[email]/extend/[addition]
 * Extends expiry for a given email address
 */
export async function PUT({ params }) {
  const email = params.email;
  const addition = params.addition;
  if (isBlockedAddress(email)) {
    return json({ error: 'Address not found or expired' }, { status: 404 });
  }

  // Validate addition
  if (!allowedAdditions[addition]) {
    return json({ error: 'Invalid addition value' }, { status: 400 });
  }

  // Check if address exists and not expired
  const { data: address, error: addressError } = await supabase
    .from('addresses')
    .select('address,expiry')
    .eq('address', email)
    .gt('expiry', new Date().toISOString())
    .single();

  if (addressError || !address) {
    devLog('Address not found or expired:', email);
    return json({ error: 'Address not found or expired' }, { status: 404 });
  }

  // Calculate new expiry
  const currentExpiry = new Date(address.expiry);
  const newExpiry = new Date(currentExpiry.getTime() + allowedAdditions[addition] * 1000);

  // Update expiry in DB
  const { error: updateError } = await supabase
    .from('addresses')
    .update({ expiry: newExpiry.toISOString() })
    .eq('address', email);

  if (updateError) {
    devLog('Error updating expiry:', updateError);
    return json({ error: updateError.message }, { status: 500 });
  }

  return json({ success: true, newExpiry: newExpiry.toISOString() }, { status: 200 });
}
