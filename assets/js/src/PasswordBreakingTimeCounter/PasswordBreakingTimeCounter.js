export default class PasswordBreakingTimeCounter {
    static getTime(str) {

        var chars = 0;
        var rate = 2800000000;
        if ((/[a-z]/).test(str))
            chars += 26;
        if ((/[A-Z]/).test(str))
            chars += 26;
        if ((/[0-9]/).test(str))
            chars += 10;
        if ((/[^a-zA-Z0-9]/).test(str))
            chars += 32;
        var pos = Math.pow(chars, str.length);
        var s = pos / rate;
        var decimalYears = s / (3600 * 24 * 365);
        var years = Math.floor(decimalYears);
        var decimalMonths = (decimalYears - years) * 12;
        var months = Math.floor(decimalMonths);
        var decimalDays = (decimalMonths - months) * 30;
        var days = Math.floor(decimalDays);
        var decimalHours = (decimalDays - days) * 24;
        var hours = Math.floor(decimalHours);
        var decimalMinutes = (decimalHours - hours) * 60;
        var minutes = Math.floor(decimalMinutes);
        var decimalSeconds = (decimalMinutes - minutes) * 60;
        var seconds = Math.floor(decimalSeconds);
        var time = [];
        if (years > 0) {
            if (years == 1)
                time.push("1 год, ");
            else
            {
                if (years > 1000000000)
                {
                    time.push( (years/1000000000).toFixed(2) + " млрд. г., ");
                } else if (years > 1000000)
                {
                    time.push( (years/1000000).toFixed(2) + " млн. г., ");
                } else
                {
                    time.push(years + " г., ");
                }
            }
        }
        if (months > 0) {
            if (months == 1)
                time.push("1 месяц, ");
            else
                time.push(months + " мес., ");
        }
        if (days > 0) {
            if (days == 1)
                time.push("1 день, ");
            else
                time.push(days + " дн., ");
        }
        if (hours > 0) {
            if (hours == 1)
                time.push("1 час, ");
            else
                time.push(hours + " час., ");
        }
        if (minutes > 0) {
            if (minutes == 1)
                time.push("1 минуту, ");
            else
                time.push(minutes + " мин., ");
        }
        if (seconds > 0) {
            if (seconds == 1)
                time.push("1 секунду, ");
            else
                time.push(seconds + " сек., ");
        }

        if (time.length <= 0)
            time = "менее чем за 1 секунду, ";
        else if (time.length == 1)
            time = time[0];
        else
            time = time[0] + time[1];

        let res = time.substring(0, time.length - 2);
        return res === 'Infinity млрд. г.' || res === 'Infinity г.' ? 'бесконечность' : res;
    }
}