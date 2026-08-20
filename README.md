# AcademiaSync

AcademiaSync is a modern, mobile-first attendance and leave management platform designed specifically for educational institutions. It provides role-based tracking, seamless leave approval workflows, administrative oversight, and mobile accessibility for faculty and staff.

## Current Version

AcademiaSync v1.2.0

## Features

- **Authentication:** Persistent Login using secure native session persistence and JWTs.
- **Role-based access:** Distinct access levels for Staff, Head of Department (HOD), and Principal.
- **Admin Panel:** Departmental oversight for HODs and institutional oversight for Principals.
- **Faculty & Staff management:** Hierarchical view of staff assignments and reporting structures.
- **Attendance tracking:** Daily check-in/check-out functionality with total hours calculation.
- **Attendance history:** Responsive monthly calendar views with accurate IST timezone handling.
- **Leave requests:** Complete request workflow (Staff applies -> HOD/Principal reviews).
- **Leave approval/rejection:** Administrative interface to approve or reject pending leaves.
- **Staff attendance monitoring:** Admin views for reviewing staff check-in times and statuses.
- **HOD functionality:** Department-level administration.
- **Principal functionality:** Global administration.
- **Mobile Android application:** Android APK compiled via Capacitor.
- **Native Android 12+ splash screen:** Seamless, native launch experience using standard Android splash architecture.
- **Responsive mobile UI:** Edge-to-edge layouts tailored for touch targets without horizontal scroll or double-padding.
- **Backend/API:** Edge-optimized serverless logic via Hono router.
- **Cloudflare D1 database:** Fast, distributed serverless SQLite database.
- **Cloudflare Workers backend:** Low-latency serverless execution.
- **Capacitor Android application:** Native bridge for Android device integration.

## v1.2.0 Highlights

- Admin attendance UI redesign
- Header/status-bar spacing fix
- Attendance timezone correction (Strict UTC database storage with correct frontend IST conversion)
- Restored original splash artwork
- Improved Android 12+ splash behavior
- "by SKC" splash branding improvement
- Improved presentation/demo attendance data
- General UI/UX and stability improvements

## Demo / Testing Credentials

### Demo Credentials

> [!IMPORTANT]
> These are DEMO/TEST credentials intended only for testing the AcademiaSync application presentation.

**P.D. Londhe (Staff):**
- Email: pdlondhe@college.edu
- Password: Test1234

**HOD TE (Head of Department):**
- Email: hod.te@college.edu
- Password: Test1234
