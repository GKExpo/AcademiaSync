import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsConditions() {
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
                    <ChevronLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="text-xl font-bold text-gray-900">Terms & Conditions</h2>
            </div>
            
            <div className="text-sm text-gray-600 space-y-4">
                <p><strong>Effective Date:</strong> August 2026</p>

                <p className="italic text-xs bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100">
                    Disclaimer: This document is a general software-use policy and should be reviewed and customized by the institution for its specific legal and administrative requirements.
                </p>
                
                <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Acceptance of Terms</h3>
                <p>By accessing or using the AcademiaSync application ("Service"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the application.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">2. Use of AcademiaSync</h3>
                <p>AcademiaSync is an attendance and leave management software platform developed by SKC. It is provided for authorized staff, faculty, and administration of the subscribing institution.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">3. User Accounts</h3>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>Accounts are provisioned by your institution administrators.</li>
                    <li>You must notify your administration immediately of any unauthorized use of your account.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">4. Data Accuracy</h3>
                <p>You agree to provide accurate information when manually checking in, checking out, or submitting leave applications. Falsification of attendance records is a violation of institutional policy.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">5. Administrative Responsibilities</h3>
                <p>Institutional administrators (HODs, Principals) are responsible for managing organizational policies, reviewing leave applications promptly, and maintaining accurate staff hierarchies within the system.</p>
                
                <h3 className="font-bold text-gray-900 mt-6 mb-2">6. Limitation of Liability</h3>
                <p>SKC provides the AcademiaSync platform "as is". SKC is not responsible for disciplinary actions, payroll deductions, or other institutional decisions made based on the data processed by the platform. Institutional administrators hold sole responsibility for enforcing organizational rules.</p>
                
                <h3 className="font-bold text-gray-900 mt-6 mb-2">7. Changes to Service</h3>
                <p>SKC reserves the right to modify or discontinue features of the Service. Significant changes, such as the upcoming biometric hardware integration (v2.0.0), will be communicated through your institutional administrators.</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-2">8. Contact</h3>
                <p>For technical support or inquiries regarding these Terms, please contact SKC support or your institutional IT administration.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                © 2026 SKC. All rights reserved.
            </div>
        </div>
    );
}
