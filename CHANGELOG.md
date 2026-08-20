# AcademiaSync v1.2.0

## ✨ New Features / Improvements

1. Redesigned Admin Staff Attendance UI
   - Replaced the old raw attendance layout with a cleaner mobile-friendly card-based design.
   - Human-readable dates and times.
   - Clear Check In / Check Out presentation.
   - Attendance duration display.
   - Better spacing and responsive behavior on small Android screens.
   - Removed raw ISO timestamp clutter.

2. Improved Staff Attendance Presentation
   - Attendance records are now much easier for Admin/HOD users to read.
   - Present / Leave / Absent states are visually separated.
   - Attendance information is presented in a professional card layout.

3. Improved Splash Screen
   - Restored the original AcademiaSync splash artwork.
   - Preserved the original artwork without cropping or distortion.
   - Implemented Android 12+ compatible native splash handling.
   - Added "by SKC" branding beneath the existing artwork/tagline.
   - Increased the "by SKC" text prominence to approximately the requested 35% scale.
   - Kept the splash lifecycle to ONE native splash without introducing a duplicate/fake React splash.

4. Improved Android Launch Experience
   - Native Android 12+ splash architecture was aligned with Capacitor.
   - Splash hand-off to the application is seamless.
   - Background colors were aligned to avoid visible borders/flashes.

## 🐛 Bug Fixes

1. Fixed Admin Header / Status Bar Spacing
   - Investigated the Android status-bar/header collision.
   - Fixed the excessive white space at the top of the application.
   - Updated the WebView/status-bar architecture to use safe-area handling correctly.
   - Header now aligns properly with the Android status bar/notch.

2. Fixed Attendance Timezone Bug
   - Corrected the P.D. Londhe presentation attendance timestamps.
   - The database now stores timestamps correctly in UTC.
   - Frontend converts timestamps to the device's local timezone (IST).
   - Fixed the issue where intended ~8 AM attendance was displayed around 1:30–2 PM.
   - Verified examples such as:
     08:08 AM → 03:06 PM
     08:10 AM → 03:15 PM
     08:07 AM → 03:03 PM
     08:13 AM → 03:08 PM

3. Improved Presentation/Test Attendance Data
   - P.D. Londhe has realistic August 2026 attendance data.
   - HOD TE has realistic August 2026 attendance data.
   - Attendance includes realistic Present/Leave/Absent combinations.
   - Leave requests include Approved, Pending and Rejected examples where applicable.

4. Removed obsolete/generated splash assets and temporary scripts.
   - Ensure no old incorrect splash generation scripts or obsolete generated splash assets remain.

## 🔧 Technical Improvements

- Improved Android splash implementation for Android 12+.
- Improved safe-area/status-bar handling.
- Improved attendance timestamp handling and presentation.
- Preserved UTC database storage with local timezone conversion in the frontend.
- Verified TypeScript compilation.
- Verified production frontend build.
- Verified Capacitor synchronization.
- Verified Android Gradle release build.
- Verified APK installation through ADB.
