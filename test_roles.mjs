import fs from 'fs';

async function login(email) {
  const res = await fetch("https://academiasync-backend.shardulk091.workers.dev/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Test1234" })
  });
  if (!res.ok) throw new Error(`Login failed for ${email}`);
  const data = await res.json();
  return { token: data.token, user: data.user };
}

async function getData(token, endpoint) {
  const res = await fetch(`https://academiasync-backend.shardulk091.workers.dev${endpoint}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return { status: res.status, ok: res.ok, data: await res.json().catch(() => null) };
}

async function run() {
  try {
    const auth = await login('pdlondhe@college.edu');
    console.log(`Login successful. User ID: ${auth.user.id}`);
    
    const summary = await getData(auth.token, `/api/attendance/summary/${auth.user.id}?month=2026-08`);
    console.log(`Summary:`, summary.data);

    const att = await getData(auth.token, `/api/attendance/me?month=2026-08`);
    console.log(`Attendance Records Count:`, att.data?.data?.length || att.data?.length);
    console.log(`First record:`, (att.data?.data || att.data)[0]);
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}

run();
