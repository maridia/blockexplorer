export default function shortConvertTimestamp(timestamp) {
    const nowMilli = Date.now();
    const nowSec = nowMilli / 1000;
    const difference = Math.floor(nowSec - timestamp);
    const timeElapsed = Math.floor(difference);
    if(timeElapsed < 60) {
        return timeElapsed + ' secs ago'
    } else if (timeElapsed >= 60 && timeElapsed < 120) {
        const min = Math.floor(timeElapsed / 60);
        return min + ' min ago';
    } else if (timeElapsed >= 120 && timeElapsed < 3600){
        const mins = Math.floor(timeElapsed / 60);
        return mins + ' mins ago';
    } else if (timeElapsed >= 3600 && timeElapsed < 86400) {
        const hour = Math.floor(timeElapsed/3600);
        const min = Math.floor((timeElapsed % 3600) / 60);
        if(hour > 1 && min > 1) {
            return hour + ' hours ' + min + ' mins ago';
        } else if (hour > 1 && min === 1) {
            return hour + ' hours ' + min + ' min ago';
        } else if (hour > 1 && min < 1) {
            return hour + ' hours ' + ' 0 mins ago';
        } else if (hour === 1 && min < 1) {
            return hour + ' hour ' + ' 0 mins ago';
        } else if (hour === 1 && min > 1) {
            return hour + ' hour ' + min + ' mins ago';
        }
    } else if (timeElapsed >= 86400) {
        const day = Math.floor(timeElapsed / 86400);
        const hour = Math.floor((timeElapsed % 86400) / 3600);
        if(day > 1) {
            if(hour > 1) {
                return day + ' days ' + hour + ' hours ago';
            } else if (hour === 1) {
                return day + ' days ' + hour + ' hour ago';
            } else {
                return 'Cannot calculate';
            }
        };
        if(day === 1) {
            if(hour > 1) {
                return day + ' day ' + hour + ' hours ago';
            } else if (hour === 1) {
                return day + ' day ' + hour + ' hour ago';
            } else {
                return 'Cannot calculate';
            }
        }
    } else {
        return 'Cannot calculate';
    }
  }