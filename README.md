# AcademiaSync

AcademiaSync is a modern, mobile-first attendance and leave management platform designed specifically for educational institutions. It provides role-based tracking, seamless leave approval workflows, administrative oversight, and mobile accessibility for faculty and staff.

## Features

**Currently Implemented:**
* **Role-Based Authentication:** Distinct access levels for Staff, Head of Department (HOD), and Principal.
* **Persistent Login:** Secure native session persistence across application restarts using device-level sandboxing.
* **Attendance Tracking:** Daily check-in/check-out functionality with total hours calculation.
* **Attendance History:** Responsive monthly calendar views displaying semantic statuses (Present, Absent, Leave, etc.).
* **Leave Management:** Complete request workflow (Staff applies -> HOD reviews -> Approved/Rejected).
* **Administrative Oversight:** HODs view their specific departmental subordinates; Principals view global institutional hierarchies.
* **Notifications Foundation:** In-app alert feeds for updates on attendance and leave status changes.
* **Mobile-First Android UI:** Fully responsive layouts tailored for mobile touch targets, avoiding horizontal scroll.
* **Cloudflare Backend:** Fast, globally distributed serverless architecture.
* **Biometric Architecture Readiness:** Backend data schemas securely isolate and support deduplicated remote biometric hardware events.

**Planned / Future Enhancements:**
* Firebase Cloud Messaging (FCM) Push Notifications
* Physical TCP/IP Biometric Machine Integration
* Advanced Institutional Analytics and Reporting

## Architecture

```text
Web / Android App
      |
      v
AcademiaSync Frontend
(React + Vite + Capacitor + TailwindCSS)
      |
      v
Cloudflare Workers
(Global Serverless Execution)
      |
      v
Hono API
(Lightweight Edge Router)
      |
      v
Cloudflare D1
(Serverless SQLite Database)
```

**Frontend:** Delivers a highly responsive UI/UX. Uses Capacitor to compile natively for Android devices, utilizing native SharedPreferences for secure persistence.
**Cloudflare Workers & Hono:** Provides edge-optimized API handling with extremely low latency, effectively replacing legacy monolithic Express servers.
**Cloudflare D1:** A robust, SQLite-compatible edge database preventing traditional regional database bottlenecks.

## User Roles

### Principal
**Dr. S.H. Dabhole**
The highest administrative tier. Principals have global visibility over all departments, HODs, and faculty. They can review institutional attendance, leave metrics, and approve elevated requests.

### HOD (Head of Department)
**Prof. D.P. Jagtap**
The departmental administrator. HODs manage the Faculty & Staff assigned to their specific department, reviewing leave requests and monitoring daily check-ins for their subordinates.

### Staff
**Miss. R.S. Pande**, **Mr. U.B. Salokhe**, **Mr. P.D. Londhe**
The standard faculty member. Staff members can log daily attendance, request leave, view their monthly calendar history, and receive notifications. They have no access to administrative panels.

## Attendance
Staff can log **check-in** and **check-out** times, which are timestamped safely enforcing the correct IST timezone. The system calculates the total hours and logs history in a responsive calendar view. Currently, the source architecture logs these as manual entries. Future biometric integration is supported architecturally but not yet connected to a physical machine.

## Leave Management
The leave workflow is straightforward:
1. Staff submits a leave request with dates and reasons.
2. The direct approver (HOD) reviews the pending request.
3. Upon Approval or Rejection, the applicant immediately sees the updated status natively in their portal.

## Notifications
The system employs a foundational notification database and API polling system to alert users to real-time changes in their attendance or leave status via an in-app feed. 

*Future Note: Native Android Push Notifications via Firebase Cloud Messaging (FCM) are planned but not yet implemented.*

## Authentication
Authentication is managed via JSON Web Tokens (JWT). For mobile devices, sessions are stored using robust secure native persistence logic that automatically restores user sessions across app restarts and safely destroys them entirely on logout or expiration.

## Technology Stack

**Frontend:**
* React
* Vite
* Tailwind CSS
* React Router DOM
* Capacitor

**Backend:**
* Cloudflare Workers
* Hono
* Cloudflare D1

**Authentication:**
* JWT
* Edge-compatible Password Hashing

## Local Development

To run the frontend locally:

```bash
git clone https://github.com/GKExpo/AcademiaSync.git
cd AcademiaSync
npm install
npm run dev
```

## Android Development

The application compiles to Android using Capacitor. To build and deploy to a connected physical device via USB debugging:

```bash
npm run build
npx cap sync android
npx cap run android
```

## Production Backend

The current production edge-worker is hosted dynamically via Cloudflare Workers backed by Cloudflare D1 at:
`https://academiasync-backend.shardulk091.workers.dev`

## Environment Configuration

The frontend requires an `.env` file at the root directory:

```env
VITE_API_URL=
```

## Testing & Verification
The current release has undergone manual verification and testing, including:
* Frontend Vite build verification
* Backend typechecking
* Authentication & Role authorization verification
* Attendance & Leave workflow testing
* Android physical-device testing

## Release
**Current release: v1.1.0**
Includes the migration to Cloudflare Workers, major UI/UX polish, persistent native authentication, attendance/leave stability updates, and Android presentation readiness.
