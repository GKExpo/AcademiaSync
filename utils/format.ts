export function formatTime(timeStr: string | null | undefined): string {
    if (!timeStr) return '--:--';
    
    try {
        // If it's a full ISO string (e.g. 2026-08-20T08:50:00.000Z)
        if (timeStr.includes('T')) {
            const date = new Date(timeStr);
            if (isNaN(date.getTime())) return timeStr;
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
        
        // If it's just HH:mm or HH:mm:ss from old format
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(parts[0], 10));
            date.setMinutes(parseInt(parts[1], 10));
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    } catch (e) {
        // Fallback
    }
    
    return timeStr;
}
