import fs from 'fs';

async function login(email) {
  const res = await fetch("https://academiasync-backend.shardulk091.workers.dev/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Test1234" })
  });
  if (!res.ok) throw new Error(`Login failed for ${email}`);
  const data = await res.json();
  return data.token;
}

async function getAdminData(token, endpoint) {
  const res = await fetch(`https://academiasync-backend.shardulk091.workers.dev${endpoint}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return { status: res.status, ok: res.ok, data: await res.json().catch(() => null) };
}

async function run() {
  const users = [
    { role: 'Staff 1', email: 'rspande@college.edu' },
    { role: 'HOD', email: 'hod.te@college.edu' },
    { role: 'Principal', email: 'principal@college.edu' },
  ];

  for (const u of users) {
    console.log(`\nTesting ${u.role} (${u.email})...`);
    try {
      const token = await login(u.email);
      console.log(`  Login successful.`);
      
      const subs = await getAdminData(token, '/api/admin/subordinates');
      console.log(`  /api/admin/subordinates -> Status: ${subs.status}`);
      if (subs.ok && Array.isArray(subs.data)) {
        console.log(`  -> Can see ${subs.data.length} subordinates.`);
      }

    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }
}

run();
