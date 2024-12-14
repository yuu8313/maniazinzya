document.addEventListener('DOMContentLoaded', () => {
    const timeOffset = new Date().getTimezoneOffset() * 60000;

    function updateCountdowns() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        
        const nextYear = new Date(now.getFullYear() + 1, 0, 1);
        
        // 新年
        const newYearDiff = nextYear - now;
        document.getElementById('newyear-countdown').textContent = formatTime(newYearDiff);
        
        // 深夜
        const midnightDiff = midnight - now;
        document.getElementById('midnight-countdown').textContent = formatTime(midnightDiff);
        
        // 現在時刻
        document.getElementById('current-time').textContent = 
            now.toLocaleTimeString('ja-JP', { hour12: false });
        
        const fiveMinAlert = document.getElementById('five-min-alert');
        if (midnightDiff <= 300000 && midnightDiff > 0) {
            fiveMinAlert.classList.remove('hidden');
        } else {
            fiveMinAlert.classList.add('hidden');
        }
        
        if (midnightDiff <= 5000 && midnightDiff > 0) {
            startFinalCountdown();
        }
        
        if (midnightDiff <= 0 && midnightDiff > -1000) {
            celebrateMidnight();
        }
    }

    function formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    setInterval(updateCountdowns, 1);
});