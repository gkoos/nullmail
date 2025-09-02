import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseServer';
import { generateAddress } from '$lib/generateAddress';
import { EMAIL_DOMAIN } from '$env/static/private';

/**
 * POST /api/emails
 * Generates a random email address with 10 min expiry and stores it in addresses table
 */
export async function POST() {
    const localPart = generateAddress();
    const domain = EMAIL_DOMAIN;
    const address = `${localPart}@${domain}`;
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Insert into addresses table
    const { error } = await supabase
        .from('addresses')
        .insert([
            { address, expiry }
        ]);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json({ address, expiry });
}
