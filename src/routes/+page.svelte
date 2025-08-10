<script>
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

onMount(async () => {
    const res = await fetch('/api/emails', { method: 'POST' });
    const data = await res.json();
    if (data.address) {
        goto(`/${data.address}`);
    } else {
        alert('Failed to create email address');
    }
});
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-400 px-2 sm:px-4">
  <div class="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 2xl:w-1/4 rounded-3xl shadow-2xl p-0 flex flex-col items-center justify-center backdrop-blur-lg bg-white/60 border border-blue-100">
    <div class="w-full p-8 sm:p-12 flex flex-col items-center gap-6">
      <div class="flex flex-col items-center gap-2 w-full">
        <svg class="w-14 h-14 text-blue-500 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-lg">Nullmail</span>
        <span class="text-lg text-blue-600 font-medium">Setting up your temporary inbox...</span>
      </div>
      <div class="w-full border-t border-blue-200"></div>
      <div class="flex flex-col items-center gap-1 w-full">
        <span class="text-gray-600 text-base text-center">Your privacy-focused, disposable email address is being generated.</span>
        <span class="text-gray-400 text-xs text-center">No sign up. No tracking. No hassle.</span>
      </div>
      <div class="w-full flex justify-center mt-6">
        <div class="w-full bg-blue-100 rounded-full h-3 overflow-hidden relative">
          <div class="absolute left-0 top-0 h-3 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-pulse" style="width: 60%"></div>
        </div>
      </div>
      <div class="w-full flex justify-center mt-2">
        <div class="bg-blue-50 rounded-lg px-4 py-2 text-blue-700 font-mono text-lg shadow-sm animate-pulse w-full text-center">
          Generating address...
        </div>
      </div>
    </div>
  </div>
</main>
