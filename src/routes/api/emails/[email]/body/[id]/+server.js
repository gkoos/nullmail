import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseServer';
import { devLog } from '$lib/devLog';
import { isBlockedAddress } from '$lib/blockedAddresses';

/**
 * GET /api/emails/[email]/body/[id]
 * Returns the body of an email for a given recipient and id
 */
export async function GET({ params }) {
    const email = params.email;
    const id = params.id;
    if (isBlockedAddress(email)) {
        return json({ error: 'Email body not found' }, { status: 404 });
    }
    // Select body from emails where id and recipient match
    const { data, error } = await supabase
        .from('emails')
        .select('body')
        .eq('id', id)
        .eq('recipient', email)
        .single();

    if (error || !data) {
        devLog('Email body not found:', { email, id });
        return json({ error: 'Email body not found' }, { status: 404 });
    }

    return json({ body: data.body });
}
