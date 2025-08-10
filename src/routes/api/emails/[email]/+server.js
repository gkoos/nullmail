import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseServer';
import { devLog } from '$lib/devLog';

/**
 * GET /api/emails/[email]
 * Returns emails for a given recipient if address exists
 */
export async function GET({ params }) {
    const email = params.email;
    // Check if address exists and get expiry, and ensure it hasn't expired
    const { data: address, error: addressError } = await supabase
        .from('addresses')
        .select('address,expiry')
        .eq('address', email)
        .gt('expiry', new Date().toISOString())
        .single();

    if (addressError || !address) {
        devLog('Address not found:', email);
        return json({ error: 'Address not found' }, { status: 404 });
    }

    // Get emails for recipient
    const { data: emails, error: emailsError } = await supabase
        .from('emails')
        .select('id,sender,subject,delivered')
        .eq('recipient', email)
        .order('delivered', { ascending: false });

    if (emailsError) {
        devLog('Error fetching emails:', emailsError);
        return json({ error: emailsError.message }, { status: 500 });
    }

    return json({
        expiry: address.expiry,
        emails
    });
}
