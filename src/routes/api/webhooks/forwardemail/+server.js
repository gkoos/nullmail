import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseServer';
import { devLog } from '$lib/devLog';
import crypto from 'crypto';
import { FORWARDEMAIL_WEBHOOK_SECRET } from '$env/static/private';

/**
 * POST /api/webhooks/forwardemail
 * Receives ForwardEmail webhook payload, parses key fields, and logs them
 */
export async function POST({ request }) {
	// Get raw body for signature verification
	const rawBody = await request.text();
	let payload;
	try {
		payload = JSON.parse(rawBody);
	} catch (e) {
		devLog('Invalid JSON payload', e);
		return json({ status: 'error', error: 'invalid json' });
	}

	// Verify webhook signature
	const signature = request.headers.get('x-webhook-signature');
	const secret = FORWARDEMAIL_WEBHOOK_SECRET;
	if (!signature || !secret) {
		devLog('Missing signature or secret');
		return json({ status: 'unauthorized', reason: 'missing signature or secret' });
	}
	const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
	if (signature !== computed) {
		devLog('Invalid webhook signature');
		return json({ status: 'unauthorized', reason: 'invalid signature' });
	}

	// Parse fields
	let recipient = null;
	if (payload.to?.text) {
		recipient = payload.to.text;
	} else if (Array.isArray(payload.recipients) && payload.recipients.length > 0) {
		recipient = payload.recipients[0];
	}

	const sender = payload.from?.text || null;
	const subject = payload.subject || '';
	const body = payload.html || payload.text || '';
	const delivered = payload.date || null;

	if (!recipient) {
		devLog('No recipient found, ignoring email');
		return json({ status: 'ignored', reason: 'no recipient' });
	}

	// Check if recipient exists in addresses table
	const { data: address, error: addressError } = await supabase
		.from('addresses')
		.select('address')
		.eq('address', recipient)
		.single();

	if (addressError || !address) {
		devLog('Recipient not found in DB, ignoring email:', recipient);
		return json({ status: 'ignored', reason: 'recipient not found' });
	}

	// Insert email into emails table
	const { error: insertError } = await supabase
		.from('emails')
		.insert([
			{
				recipient,
				sender,
				subject,
				body,
				delivered
			}
		]);

	if (insertError) {
		devLog('Error inserting email:', insertError);
		return json({ status: 'error', error: insertError.message });
	}

	devLog('Email stored for recipient:', recipient);
	return json({ status: 'ok' });
}
