import { Plus } from 'lucide-react';

export default function LeaveCard({ onApply }: { onApply: () => void }) {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold">Need Leave?</h3>
            <button
                onClick={onApply}
                className="mt-4 bg-white text-blue-600 px-5 py-2 rounded-full flex items-center gap-2"
            >
                <Plus size={18} /> Apply Leave
            </button>
        </div>
    );
}
