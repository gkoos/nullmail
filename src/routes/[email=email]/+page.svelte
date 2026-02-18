<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { withFromExtension, getExtensionLinkType } from '$lib/fromExtension';
	import { isBlockedAddress } from '$lib/blockedAddresses';
	import ExtensionLink from '$lib/components/extensionLink.svelte';

	let email = '';
	let expiry = '';
	let expiryCountdown = '';
	let emails = [];
	let selectedEmail = null;
	let emailBodies = {}; // cache: { id: body }
	let loadingBody = false;
	let error = '';
	let refreshCountdown = 15;
	let extendValue = '5m';
	let extending = false;
	async function handleExtend() {
		if (!extendValue || !email) return;
		extending = true;
		try {
			const res = await fetch(`/api/emails/${email}/extend/${extendValue}`, { method: 'PUT' });
			if (res.status === 200) {
				await fetchData();
			}
			// Optionally, handle errors or show feedback here
		} catch (e) {
			// Optionally, handle network errors
		}
		extending = false;
	}

	let showQr = false;
	let qrDataUrl = '';
	let interval;

	let expiryPercent = 100;
	let initialExpiryMs = 0;
	let isExpiringSoon = false;

	function formatExpiry(expiry) {
		if (!expiry) return '';
		const ms = new Date(expiry) - Date.now();
		if (ms <= 0) return 'Expired';
		const min = Math.floor(ms / 60000);
		const sec = Math.floor((ms % 60000) / 1000);
		return `${min}m ${sec}s`;
	}
	function formatDate(date) {
		if (!date) return '';
		return new Date(date).toLocaleString();
	}

	async function fetchData() {
		const res = await fetch(`/api/emails/${email}`);
		const data = await res.json();
		if (res.status === 404 && data?.error === 'Address not found') {
			window.location.href = withFromExtension('/notfound');
			return;
		}
		expiry = data.expiry;
		emails = data.emails;
		// Set initial expiry ms for progress bar
		if (expiry && !initialExpiryMs) {
			initialExpiryMs = new Date(expiry) - Date.now();
		}
	}

	function startRefreshTimer() {
		interval = setInterval(() => {
			refreshCountdown--;
			if (refreshCountdown <= 0) {
				fetchData();
				refreshCountdown = 15;
			}
		}, 1000);
	}

	function manualRefresh() {
		fetchData();
		refreshCountdown = 15;
	}

	onMount(() => {
		email = get(page).params.email;
		if (isBlockedAddress(email)) {
			window.location.href = withFromExtension('/notfound');
			return;
		}
		fetchData();
		startRefreshTimer();
		// Expiry countdown updater
		const expiryInterval = setInterval(() => {
			expiryCountdown = formatExpiry(expiry);
			// Progress bar calculation
			let msLeft = 0;
			if (expiry && initialExpiryMs) {
				msLeft = new Date(expiry) - Date.now();
				expiryPercent = Math.max(0, Math.min(100, Math.round((msLeft / initialExpiryMs) * 100)));
			} else {
				expiryPercent = 0;
			}
			isExpiringSoon = msLeft > 0 && msLeft < 30000;
			if (expiryCountdown === 'Expired') {
				window.location.href = withFromExtension('/expired');
			}
		}, 1000);
		expiryCountdown = formatExpiry(expiry);
		return () => {
			clearInterval(interval);
			clearInterval(expiryInterval);
		};
	});

	async function handleShowQr() {
		let url = window.location.href;
		// Force https for QR code
		url = url.replace(/^http:/, 'https:');
		qrDataUrl = await QRCode.toDataURL(url, { width: 320, margin: 2 });
		showQr = true;
	}

	async function handleSelectEmail(emailItem) {
		selectedEmail = emailItem;
		if (!emailItem.id) return;
		if (emailBodies[emailItem.id]) {
			loadingBody = false;
			return;
		}
		loadingBody = true;
		try {
			const res = await fetch(`/api/emails/${email}/body/${emailItem.id}`);
			if (res.ok) {
				const data = await res.json();
				emailBodies[emailItem.id] =
					data.body ?? '<div class="text-red-600 p-4">No body found.</div>';
			} else {
				emailBodies[emailItem.id] =
					'<div class="text-red-600 p-4">Failed to load email body.</div>';
			}
		} catch (e) {
			emailBodies[emailItem.id] = '<div class="text-red-600 p-4">Error loading email body.</div>';
		}
		loadingBody = false;
	}
</script>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-400 px-2 sm:px-4"
>
	<div
		class="mx-auto my-10 min-h-screen w-full max-w-[1600px] overflow-hidden rounded-3xl border border-blue-100 bg-white/60 p-0 shadow-2xl backdrop-blur-lg sm:my-16"
	>
		<div class="w-full pt-2 pb-4 sm:px-12 sm:pt-4 sm:pb-6">
			<!-- Header -->
			<div class="flex w-full flex-col items-center gap-2">
				<span
					class="mb-2 text-5xl font-extrabold tracking-tight text-blue-700 drop-shadow-lg sm:text-6xl"
					>Nullmail</span
				>
				<ExtensionLink browser={getExtensionLinkType()} />
				<span
					class="text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg sm:text-3xl"
					>Your Temporary Email Address:</span
				>
				<div class="mt-2 flex items-center gap-2 text-lg font-bold sm:text-2xl">
					<span class="rounded bg-blue-50 px-2 py-1 font-mono text-blue-700">{email}</span>
					<button
						aria-label="Copy inbox URL"
						title="Copy"
						class="rounded p-1 transition-colors duration-150 hover:scale-105 hover:bg-blue-100 hover:shadow active:bg-blue-200"
						on:click={() => navigator.clipboard.writeText(email)}
					>
						<Icon
							icon="mdi:content-copy"
							class="h-6 w-6 text-blue-700 transition-transform duration-150 group-hover:scale-110"
						/>
					</button>
					<button
						aria-label="Show QR code"
						title="QR code"
						class="rounded p-1 transition-colors duration-150 hover:scale-105 hover:bg-blue-100 hover:shadow active:bg-blue-200"
						on:click={handleShowQr}
					>
						<Icon
							icon="mdi:qrcode-scan"
							class="h-6 w-6 text-blue-700 transition-transform duration-150 group-hover:scale-110"
						/>
					</button>
				</div>
			</div>
			<!-- Progress Bar for Expiry -->
			{#if expiry}
				<div class="mt-4 flex w-full flex-col items-center gap-2">
					<div class="relative h-3 w-full overflow-hidden rounded-full bg-blue-100">
						<div
							class={`absolute top-0 left-0 h-3 ${isExpiringSoon ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500'} animate-pulse`}
							style={`width: ${expiryPercent}%`}
						></div>
					</div>
					<div class="mt-1 flex items-center gap-2 text-base">
						<span class="text-gray-600">Expires in:</span>
						<span class={`font-mono ${isExpiringSoon ? 'text-red-600' : 'text-blue-700'}`}
							>{expiryCountdown}</span
						>
						<button
							class="rounded bg-blue-600 px-2 py-1 font-bold text-white shadow transition-colors duration-150 hover:bg-blue-700 disabled:bg-blue-200 disabled:text-blue-700 disabled:opacity-50"
							on:click={handleExtend}
							disabled={extending}>{extending ? 'Extending...' : 'Extend'}</button
						>
						<select
							class="rounded-lg border border-blue-300 bg-blue-50 px-6 py-1 font-semibold text-blue-700 shadow-sm transition-all duration-150 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-blue-100 disabled:text-blue-400"
							bind:value={extendValue}
							disabled={extending}
						>
							<option value="5m">5mins</option>
							<option value="10m">10mins</option>
							<option value="15m">15mins</option>
							<option value="30m">30mins</option>
							<option value="1h">1h</option>
							<option value="2h">2h</option>
						</select>
					</div>
				</div>
			{/if}
			<!-- Refresh -->
			<div class="mt-4 flex w-full items-center gap-2">
				<button
					aria-label="Refresh inbox"
					title="Refresh"
					class="flex items-center justify-center rounded bg-blue-200 px-2 py-1 text-blue-700 shadow hover:bg-blue-300"
					on:click={manualRefresh}
				>
					<Icon icon="mdi:refresh" class="h-5 w-5" />
				</button>
				<span class="text-gray-500">refreshes in {refreshCountdown}s</span>
			</div>
		</div>
		<!-- Emails Table: never scrollable -->
		<div
			class="mt-0 flex min-h-[200px] w-full flex-grow flex-col justify-start px-2 pb-6 sm:px-8 sm:pb-8"
		>
			{#if emails.length > 0}
				<div class="flex w-full justify-center">
					<div class="w-full max-w-full overflow-x-auto">
						<table
							class="mx-auto w-full min-w-[600px] border-separate overflow-hidden rounded-lg border shadow"
						>
							<thead class="sticky top-0 z-10 bg-blue-100">
								<tr>
									<th class="w-32 px-2 py-2 text-left text-gray-700">Date</th>
									<th class="w-48 px-2 py-2 text-left text-gray-700">Sender</th>
									<th class="w-[500px] px-2 py-2 text-left text-gray-700">Subject</th>
								</tr>
							</thead>
							<tbody>
								{#each emails as emailItem}
									<tr
										class="cursor-pointer border-t hover:bg-blue-50"
										on:click={() => handleSelectEmail(emailItem)}
									>
										<td class="px-2 py-2 text-gray-600">{formatDate(emailItem.delivered)}</td>
										<td class="px-2 py-2 font-mono text-gray-900">{emailItem.sender}</td>
										<td class="px-2 py-2 break-words whitespace-normal text-gray-800"
											>{emailItem.subject ?? ''}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center text-lg text-gray-400">
					No emails yet.
				</div>
			{/if}
			<section class="mt-6 flex w-full flex-col items-center">
				<div class="w-full max-w-2xl rounded-xl bg-blue-50 p-6 text-blue-900 shadow">
					<div class="mt-6 flex flex-col items-center">
						<p class="mb-3 text-sm text-gray-600">
							If Nullmail helps protect your privacy, consider supporting its development:
						</p>
						<a
							href="https://www.buymeacoffee.com/gkoos"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-yellow-900 shadow-md transition-colors duration-150 hover:bg-yellow-500"
						>
							<span>☕</span>
							<span>Buy me a coffee</span>
						</a>
					</div>
					<h2 class="mb-2 text-xl font-bold text-blue-700">What Is Nullmail?</h2>
					<p class="mb-2 text-base">
						Nullmail is a privacy-focused, no-fuss, free disposable email service designed for
						quick, anonymous use. No sign-up, no tracking, and no personal data required. Your
						temporary inbox is created instantly and expires automatically, ensuring your
						information is never stored longer than needed.
					</p>
					<ul class="mb-2 list-disc pl-5 text-base">
						<li>Protect your real email from spam and leaks</li>
						<li>Sign up for websites or services without sharing personal info</li>
						<li>Receive verification codes or links securely and privately</li>
						<li>All mailboxes are ephemeral and deleted after expiry</li>
					</ul>
					<p class="text-sm text-gray-600">
						Nullmail is ideal for anyone who values privacy, security, and convenience online.
					</p>
					<p class="mt-4 text-sm text-gray-600">
						<a href="{withFromExtension('/faq')}" class="text-blue-600 hover:underline">Learn more in our FAQ</a>
					</p>
				</div>
			</section>
			{#if showQr}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div
						class="relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white py-8 shadow-2xl"
					>
						<button
							aria-label="Close"
							title="Close"
							class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-blue-100"
							on:click={() => (showQr = false)}
						>
							<Icon icon="mdi:close" class="h-6 w-6 text-blue-700" />
						</button>
						<div class="mb-4 text-lg font-bold text-blue-700">Scan to open this inbox</div>
						{#if qrDataUrl}
							<img src={qrDataUrl} alt="QR Code" class="mx-auto h-64 w-64" />
						{:else}
							<div class="flex h-64 w-64 items-center justify-center text-blue-600">
								Generating QR code...
							</div>
						{/if}
						<div class="mt-4 text-center text-xs break-all text-gray-600">
							{window.location.href.replace(/^http:/, 'https:')}
						</div>
					</div>
				</div>
			{/if}
			{#if selectedEmail && (loadingBody || emailBodies[selectedEmail.id])}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div
						class="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl"
					>
						<button
							aria-label="Close"
							title="Close"
							class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-blue-100"
							on:click={() => (selectedEmail = null)}
						>
							<Icon icon="mdi:close" class="h-6 w-6 text-blue-700" />
						</button>
						<div class="border-b bg-blue-50 px-8 pt-8 pb-4">
							<div class="mb-1 text-gray-700">
								<span class="font-semibold">Subject:</span>
								{selectedEmail.subject ?? ''}
							</div>
							<div class="mb-1 text-gray-700">
								<span class="font-semibold">From:</span>
								{selectedEmail.sender}
							</div>
							<div class="mb-1 text-gray-700">
								<span class="font-semibold">Date:</span>
								{formatDate(selectedEmail.delivered)}
							</div>
						</div>
						{#if loadingBody}
							<div class="flex h-[400px] items-center justify-center text-lg text-blue-600">
								Loading email body...
							</div>
						{:else}
							<iframe
								class="h-[70vh] min-h-[400px] w-full bg-white"
								srcdoc={emailBodies[selectedEmail.id]}
								sandbox="allow-same-origin allow-popups allow-forms"
								title="Email Body"
							></iframe>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
