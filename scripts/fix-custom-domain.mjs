#!/usr/bin/env node
/**
 * Attach Worker custom domains (no manual CNAME to workers.dev).
 * Usage: node --env-file=.env scripts/fix-custom-domain.mjs
 */
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env.cf_api_key;
const WORKER_NAME = "teleprompter";
const HOSTS = [
  { hostname: "teleprompter.sagardash.me", zone: "sagardash.me" },
  { hostname: "teleprompter.subarna.me", zone: "subarna.me" },
];

if (!TOKEN) {
  console.error("Missing CLOUDFLARE_API_TOKEN in env");
  process.exit(1);
}

async function cf(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.success) {
    console.error(path, JSON.stringify(data.errors || data, null, 2));
    throw new Error(`Cloudflare API failed: ${path}`);
  }
  return data.result;
}

function isConflictingDns(rec) {
  if (rec.type === "A" || rec.type === "AAAA") {
    // Workers custom domains use AAAA → 100:: (managed). Leave that alone.
    if (rec.type === "AAAA" && rec.content === "100::") return false;
    return true;
  }
  if (rec.type === "CNAME") {
    const target = String(rec.content || "").toLowerCase();
    // Manual CNAME to workers.dev breaks custom domains / causes 522.
    if (target.includes("workers.dev")) return true;
    // Non-managed CNAMEs also conflict with Workers custom domain attachment.
    return true;
  }
  return false;
}

const accounts = await cf("/accounts");
if (!accounts.length) {
  console.error("No Cloudflare accounts visible to this token.");
  process.exit(1);
}
console.log(
  "Accounts:",
  accounts.map((a) => `${a.name} (${a.id})`).join(", ")
);

for (const { hostname, zone: zoneName } of HOSTS) {
  console.log(`\n=== ${hostname} ===`);
  const zones = await cf(`/zones?name=${encodeURIComponent(zoneName)}`);
  if (!zones.length) {
    console.error(`Zone ${zoneName} not found — skip`);
    continue;
  }
  const zone = zones[0];
  const accountId = zone.account?.id || accounts[0].id;
  const accountName = zone.account?.name || accounts[0].name;
  console.log(
    `Zone status=${zone.status} id=${zone.id} account=${accountName} (${accountId})`
  );

  // Worker must live on the same account as the zone.
  const scripts = await cf(`/accounts/${accountId}/workers/scripts`);
  const hasWorker = (scripts || []).some((s) => s.id === WORKER_NAME);
  if (!hasWorker) {
    console.error(
      `Worker "${WORKER_NAME}" not found on zone account ${accountName}. ` +
        `Custom domains cannot cross accounts — move the zone or recreate the worker on this account.`
    );
    continue;
  }

  const records = await cf(
    `/zones/${zone.id}/dns_records?name=${encodeURIComponent(hostname)}`
  );
  for (const rec of records) {
    console.log(
      `DNS: ${rec.type} → ${rec.content} proxied=${rec.proxied} id=${rec.id}`
    );
  }

  const existing = await cf(
    `/accounts/${accountId}/workers/domains?hostname=${encodeURIComponent(hostname)}`
  );
  const already = (existing || []).find(
    (d) => d.hostname === hostname && d.service === WORKER_NAME
  );
  if (already) {
    console.log(`Already attached as Workers custom domain (${already.id})`);
    continue;
  }

  for (const d of existing || []) {
    console.log(`Removing old attachment ${d.id} service=${d.service}`);
    await cf(`/accounts/${accountId}/workers/domains/${d.id}`, {
      method: "DELETE",
    });
  }

  // Delete conflicting regular A/AAAA (non-100::) and bad CNAME-to-workers.dev
  // so the Custom Domain API can create the managed record.
  for (const rec of records) {
    if (!isConflictingDns(rec)) continue;
    console.log(`Deleting conflicting ${rec.type} record ${rec.id} → ${rec.content}`);
    await cf(`/zones/${zone.id}/dns_records/${rec.id}`, { method: "DELETE" });
  }

  console.log(`Attaching Workers custom domain…`);
  const attached = await cf(`/accounts/${accountId}/workers/domains`, {
    method: "PUT",
    body: JSON.stringify({
      hostname,
      service: WORKER_NAME,
      environment: "production",
      zone_id: zone.id,
    }),
  });
  console.log("OK:", attached.id || attached.hostname || attached);
}

console.log(`
Done. Test:
  https://teleprompter.sagardash.me/
  https://teleprompter.subarna.me/
`);
