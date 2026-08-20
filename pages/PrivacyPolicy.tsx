import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
                    <ChevronLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
            </div>
            
            <div className="text-sm text-gray-600 space-y-4">
                <p><strong>Effective Date:</strong> August 2026</p>

                <p>This Privacy Policy explains how AcademiaSync by SKC collects, uses, and protects your information when you use our mobile application and related institutional services.</p>
                
                <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Information We Collect</h3>
                <p>We collect information necessary for institutional attendance and leave management:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li><strong>Account Information:</strong> Name, email address, department, designation, and staff identification numbers.</li>
                    <li><strong>Attendance Records:</strong> Daily check-in and check-out timestamps, total hours, and attendance status.</li>
                    <li><strong>Leave Applications:</strong> Dates, reasons for leave, and approval statuses.</li>
                    <li><strong>System Notifications:</strong> System-generated alerts and read statuses.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">2. Biometric Information (Future Integration)</h3>
                <p><strong>Note:</strong> AcademiaSync v1.2.0 does not collect or process biometric data.</p>
                <p>In future releases (v2.0.0 and above), AcademiaSync will integrate with physical institutional biometric machines. When this occurs, biometric identifiers (such as fingerprint templates) will be stored securely on the hardware devices and mapped via a unique 'biometric ID' to record physical attendance events. Actual biometric templates will not be stored in our cloud databases.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">3. How Information Is Used</h3>
                <p>We use your information exclusively to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Maintain accurate institutional attendance logs.</li>
                    <li>Facilitate the leave application and approval workflow.</li>
                    <li>Provide reporting and analytics to your Head of Department and Principal.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">4. Data Storage & Security</h3>
                <p>All data is encrypted in transit and stored securely using Cloudflare D1 distributed databases. We implement strict role-based access control (RBAC) ensuring that only authorized superiors (HODs and Principals) can view your attendance and leave records.</p>
                
                <h3 className="font-bold text-gray-900 mt-6 mb-2">5. Data Retention</h3>
                <p>Information is retained for as long as required by your institution's administrative policies. Upon termination of your employment or instruction by the institution administrators, your account access will be disabled.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">6. Contact</h3>
                <p>For any privacy-related concerns or corrections to your data, please contact your institution's administrative IT department or reach out to SKC directly.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                © 2026 SKC. All rights reserved.
            </div>
        </div>
    );
}
