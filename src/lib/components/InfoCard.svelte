<script>
  export let title;
  export let message;
  export let red = false;
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-400 px-2 sm:px-4">
  <div class="w-full max-w-[1600px] rounded-3xl shadow-2xl p-0 backdrop-blur-lg bg-white/60 border border-blue-100 max-h-[96vh] h-[96vh] overflow-hidden">
    <div class="w-full sm:pt-4 sm:pb-6 sm:px-12 pt-2 pb-4">
      <div class="flex flex-col items-center gap-2 w-full">
        <span class="text-5xl sm:text-6xl font-extrabold text-blue-700 tracking-tight drop-shadow-lg mb-2">Nullmail</span>
        <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-lg">{title}</span>
      </div>
      <div class="w-full border-t border-blue-200 mt-4"></div>
      <div class="flex flex-col items-center w-full mt-4">
        <span class="{red ? 'text-red-600' : 'text-gray-600'} text-base text-center">{message}</span>
      </div>
      <div class="w-full flex justify-center mt-6">
        <a href="/" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-150">Create New Inbox</a>
      </div>
    </div>
  </div>
</main>
