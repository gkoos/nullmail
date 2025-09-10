<script>
	export let browser;

	const extensionData = {
		chrome: {
			title: 'Get Chrome Extension',
			url: ' https://chromewebstore.google.com/detail/nullmail-extension/ogbnjlpdlihcbfmdffhkklhikjlmkfnm',
			icon: 'chrome.png'
		},
		firefox: {
			title: 'Get Firefox Add-on',
			url: 'https://addons.mozilla.org/en-GB/firefox/addon/nullmail-extension/',
			icon: 'firefox.png'
		}
	};
</script>

{#if browser in extensionData}
	<a
		href={extensionData[browser].url}
		class="flex items-center gap-2 rounded-lg px-4 py-2 font-bold shadow"
		target="_blank"
	>
		<img src={extensionData[browser].icon} alt={extensionData[browser].title} class="h-6 w-6" />
		{extensionData[browser].title}
	</a>
{/if}
