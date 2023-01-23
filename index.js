(function () {

    function kickOffClock() {
        setInterval(() => {

            let currentTime = new Date();

            let currentOffset = currentTime.getTimezoneOffset();

            let ISTOffset = 330;   // IST offset UTC +5:30 

            let ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);



            // ISTTime now represents the time in IST coordinates
            let hoursIST = ISTTime.getHours()
            let minutesIST = ISTTime.getMinutes()
            let secondsIST = ISTTime.getSeconds()

            let am_pm = (hoursIST >= 12) ? "PM" : "AM";

            let clockHours = document.getElementById("clock-hour-container");
            let clockMinutes = document.getElementById("clock-minute-container");
            let clockSeconds = document.getElementById("clock-second-container");
            let AM_PM_Container = document.getElementById("AM-PM-container");

            clockHours.textContent = hoursIST;
            clockMinutes.textContent = minutesIST;
            clockSeconds.textContent = secondsIST;
            AM_PM_Container.querySelector("button").textContent = am_pm;

        }, 100);
    }

    kickOffClock();



})();