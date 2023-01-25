(function () {

    let setAlarmHours1 = document.getElementById("set-alarm-hour-1");
    let setAlarmsHours2 = document.getElementById("set-alarm-hour-2");
    let setAlarmMinutes1 = document.getElementById("set-alarm-minutes-1");
    let setAlarmMinutes2 = document.getElementById("set-alarm-minutes-2");
    let setAlarmSeconds1 = document.getElementById("set-alarm-second-1");
    let setAlarmSeconds2 = document.getElementById("set-alarm-second-2");
    let setAlarmContainer = document.querySelector(".set-alarm-container");
    let AM_PM_Dropdown = document.getElementById("AM-PM-dropdown");
    let setAlarmBtn = document.getElementById("set-alarm-btn");
    let dropDown = document.getElementById("toggle-am-pm");
    let alarmsList = document.getElementById("alarms-list");


    //remove whites spaces and \n character from the AM-PM-dropdown
    document.querySelector("#AM-PM-dropdown button").textContent = document.querySelector("#AM-PM-dropdown button").textContent.replace(/\n/g, '').replace(/\s+/g, '');
    document.querySelector("#AM-PM-dropdown a").textContent = document.querySelector("#AM-PM-dropdown a").textContent.replace(/\n/g, '').replace(/\s+/g, '');


    let alarmsCollection = {};

    let generateId = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    




    dropDown.addEventListener('click', function (e) {
        //swap AM/PM values
        let val1 = document.querySelector("#AM-PM-dropdown button").textContent.replace(/\n/g, '').replace(/\s+/g, '');
        let val2 = document.querySelector("#AM-PM-dropdown a").textContent.replace(/\n/g, '').replace(/\s+/g, '');



        document.querySelector("#AM-PM-dropdown button").textContent = val2;
        document.querySelector("#AM-PM-dropdown a").textContent = val1;

    });


    setAlarmBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let currentHourValue = parseInt(setAlarmHours1.textContent + setAlarmsHours2.textContent);
        let currentMinutesValue = parseInt(setAlarmMinutes1.textContent + setAlarmMinutes2.textContent);
        let currentSecondsValue = parseInt(setAlarmSeconds1.textContent + setAlarmSeconds2.textContent);
        let currentAMPMValue = document.querySelector("#AM-PM-dropdown button").textContent;

        let time = convertTimeTo24(`${currentHourValue}:${currentMinutesValue}:${currentSecondsValue} ${currentAMPMValue}`).toLocaleTimeString('en-US');

        //add the alarm to the alarm collection array, only if the time string isn't already there
        if (!isAlarmPresent(time)) {

            //generate unique id to identify each alarm uniquely
            let uid = generateId();

            alarmsCollection[uid] = time;

            //append the new alarm to the DOM
            let newAlarmItemString = `<li class="list-group-item" id=${uid}><span>${time}</span>
                                        <button type="button" class="btn btn-danger">Delete</button>
                                      </li>`;



            let temp = document.createElement('div');
            temp.innerHTML = newAlarmItemString;
            let newAlarmItemHTML = temp.firstChild;
            alarmsList.appendChild(newAlarmItemHTML);


            //attach delete event listener to the new alarm
            newAlarmItemHTML.addEventListener('click', e => deleteAlarm(uid));

        }else{
            alert("Alarm already in the list, please create a different one");
        }

    });


    function deleteAlarm(uid) {

        //remove from RAM
        delete alarmsCollection[uid];

        //remove from DOM
        document.getElementById(uid).remove();
    }


    setAlarmContainer.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.className == "increment") {
            incrementCounter(e.target);
        } else if (e.target.className == "decrement") {
            decrementCounter(e.target);
        }
    });

    function convertTimeTo24(time) {
        const realTime = time.split(" ");

        let alarmDateTime;


        if (realTime[1].toLowerCase() === "am") {
            alarmDateTime = realTime[0];
        } else {
            const timeToReturn = realTime[0].split(":");
            const increaseHours = Number(timeToReturn[0]) + 12;
            alarmDateTime = `${increaseHours}:${timeToReturn[1]}:${timeToReturn[2]}`;
        }
        alarmDateTime = alarmDateTime.split(':');
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...alarmDateTime);

    }


    function isAlarmPresent(time){
        for (const id in alarmsCollection) {
            if (Object.hasOwnProperty.call(alarmsCollection, id)) {
                if(alarmsCollection[id] == time) return id;
            }
        }
        return null;
    }




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
            let hoursIST_12HoursFormat = ISTTime.toLocaleString('en-US', { hour: 'numeric', hour12: true }).split(" ")[0];



            let am_pm = (hoursIST >= 12) ? "PM" : "AM";

            let clockHours = document.getElementById("clock-hour-container");
            let clockMinutes = document.getElementById("clock-minute-container");
            let clockSeconds = document.getElementById("clock-second-container");
            let AM_PM_Container = document.getElementById("AM-PM-container");

            //set the value of current time in the DOM for the clock
            clockHours.textContent = hoursIST_12HoursFormat < 10 ? ("0" + hoursIST_12HoursFormat) : hoursIST_12HoursFormat;
            clockMinutes.textContent = minutesIST < 10 ? ("0" + minutesIST) : minutesIST;
            clockSeconds.textContent = secondsIST < 10 ? ("0" + secondsIST) : secondsIST;
            AM_PM_Container.querySelector("button").textContent = am_pm;

            let alarmUID = isAlarmPresent(ISTTime.toLocaleTimeString('en-US'));

            if(alarmUID != null){
                alert("Alarm goes off!!!!!");
                deleteAlarm(alarmUID);
            }

        }, 100);
    }

    kickOffClock();

    //function to handle counter increment on the alarm
    function incrementCounter(incrementBtn) {
        let incrementElement = incrementBtn.nextElementSibling;

        //increment hour part of the alarm
        if (incrementElement.id == "set-alarm-hour-1") {
            setTimeRange(incrementElement, true, 1);
        } else if (incrementElement.id == "set-alarm-hour-2") {
            setTimeRange(incrementElement, true, (setAlarmHours1.textContent == "1" ? 2 : 9));
        }

        //increment minutes part of the alarm
        else if (incrementElement.id == "set-alarm-minutes-1") {
            setTimeRange(incrementElement, true, 5);
        } else if (incrementElement.id == "set-alarm-minutes-2") {
            setTimeRange(incrementElement, true, 9);
        }

        //increment seconds part of the alarm
        else if (incrementElement.id == "set-alarm-second-1") {
            setTimeRange(incrementElement, true, 6);
        } else if (incrementElement.id == "set-alarm-second-2") {
            setTimeRange(incrementElement, true, (setAlarmSeconds1.textContent == "6" ? 0 : 9));
        }


    }

    //function to handle counter decrement on the alarm
    function decrementCounter(decrementBtn) {
        let decrementElement = decrementBtn.previousElementSibling;

        //decrement hour part of the alarm
        if (decrementElement.id == "set-alarm-hour-1") {
            setTimeRange(decrementElement, false, 1);
        } else if (decrementElement.id == "set-alarm-hour-2") {
            setTimeRange(decrementElement, false, (setAlarmHours1.textContent == "1" ? 2 : 9));
        }

        //decrement minutes part of the alarm
        else if (decrementElement.id == "set-alarm-minutes-1") {
            setTimeRange(decrementElement, false, 6);
        } else if (decrementElement.id == "set-alarm-minutes-2") {
            setTimeRange(decrementElement, false, (setAlarmMinutes1.textContent == "6" ? 0 : 9));
        }

        //decrement seconds part of the alarm
        else if (decrementElement.id == "set-alarm-second-1") {
            setTimeRange(decrementElement, false, 6);
        } else if (decrementElement.id == "set-alarm-second-2") {
            setTimeRange(decrementElement, false, (setAlarmSeconds1.textContent == "6" ? 0 : 9));
        }
    }

    //function to handle setting values for the alarm while setting it
    function setTimeRange(element, inc, rangeMax) {

        let currVal = parseInt(element.textContent);

        if (currVal <= rangeMax) {
            //increment counter till max value, after that, reset it to 0
            if (inc) {
                if (currVal == rangeMax) {
                    element.textContent = 0;
                } else {
                    element.textContent = ++currVal;
                }

            }
            //decrement counter till min value, after that, reset it to max value
            else {
                if (currVal <= 0) {
                    element.textContent = rangeMax;
                } else {
                    element.textContent = --currVal;
                }

            }

        }
    }


})();