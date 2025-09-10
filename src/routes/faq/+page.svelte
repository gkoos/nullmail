<script>
	import { withFromExtension, getExtensionLinkType } from '$lib/fromExtension';
	import ExtensionLink from '$lib/components/extensionLink.svelte';

	let questions = [
		{
			question: 'What is Nullmail?',
			answer:
				'Nullmail is a privacy-focused, no-fuss, free disposable email service designed for quick, anonymous use. No sign-up, no tracking, and no personal data required. Your temporary inbox is created instantly and expires automatically, ensuring your information is never stored longer than needed.'
		},
		{
			question: 'How long do emails stay in my inbox?',
			answer:
				"Email addresses get deleted after 10 minutes by default. You can extend the lifetime of your inbox by clicking the 'Extend' button, which allows you to keep your inbox active for longer."
		},
		{
			question: 'Can I use Nullmail for receiving verification emails?',
			answer:
				"Yes, you can use Nullmail to receive verification emails from various services. Just copy your Nullmail address and paste it into the service's sign-up form."
		},
		{
			question: 'Is Nullmail secure?',
			answer:
				'Nullmail is designed with privacy in mind. We do not track users or store personal data. However, as with any online service, we recommend not using it for sensitive information.'
		},
		{
			question: 'Can I send emails from my Nullmail address?',
			answer:
				"No, you can't. Nullmail is strictly for receiving emails. It does not support sending emails to ensure privacy and prevent abuse."
		},
		{
			question: 'What happens when my inbox expires?',
			answer:
				'When your inbox expires, all emails and the email address itself are deleted permanently.'
		},
		{
			question: 'Can I open attachments from received emails?',
			answer: 'No, Nullmail discards attachments attachments for security and privacy reasons.'
		},
		{
			question: "So I can't send emails, can't open attachments, what is it good for?",
			answer:
				'Nullmail is designed for receiving emails quickly and anonymously without the need for a permanent inbox. It is ideal for situations where you need a temporary email address for verification or sign-up purposes.'
		},
		{
			question: 'Can I create multiple Nullmail addresses?',
			answer:
				'Yes, you can create as many Nullmail addresses as you need. Each address is temporary and will expire after its set duration.'
		},
		{
			question: 'Can I check my Nullmail inbox from multiple devices?',
			answer:
				"Yes, you can access your Nullmail inbox from any device as long as it's active. Copy the Nullmail address and paste it in another browser, or scan the QR code on another device."
		}
	];
</script>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-400 px-2 sm:px-4"
>
	<div
		class="mx-auto my-10 min-h-screen w-full max-w-[1600px] rounded-3xl border border-blue-100 bg-white/60 p-0 shadow-2xl backdrop-blur-lg sm:my-16"
	>
		<div class="w-full pt-2 pb-4 sm:px-12 sm:pt-4 sm:pb-6">
			<div class="flex w-full flex-col items-center gap-2">
				<span
					class="mb-2 text-5xl font-extrabold tracking-tight text-blue-700 drop-shadow-lg sm:text-6xl"
					>Nullmail</span
				>
				<ExtensionLink browser={getExtensionLinkType()} />
				<span
					class="text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg sm:text-3xl"
					>Frequently Asked Questions</span
				>
			</div>
			<div class="mt-4 w-full border-t border-blue-200"></div>
			<div class="mt-6 flex w-full justify-center pb-6">
				<a
					href="{withFromExtension('/')} "
					class="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow transition-colors duration-150 hover:bg-blue-700"
					>Create New Inbox</a
				>
			</div>
			<div class="mt-8 space-y-6">
				{#each questions as { question, answer }}
					<div class="rounded-lg bg-white p-6 shadow">
						<h3 class="mb-2 text-xl font-semibold text-gray-800">{question}</h3>
						<p class="text-gray-600">{answer}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>
