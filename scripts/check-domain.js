const domain = 'maildock.store';

if (!domain) {
  console.error("EMAIL_DOMAIN env var not set");
  process.exit(1);
}

async function checkStopForumSpam(domain) {
  const url = `https://api.stopforumspam.org/api?email=test@${domain}&json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.email?.appears === 1;
}

async function main() {
  console.log(`Checking domain: ${domain}`);

  let blacklisted = false;

  if (await checkStopForumSpam(domain)) {
    console.error("❌ Domain appears on StopForumSpam");
    blacklisted = true;
  }

  if (blacklisted) {
    process.exit(1); // fail the workflow
  } else {
    console.log("✅ Domain looks clean");
  }
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
