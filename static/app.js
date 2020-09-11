const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

var app = new Vue({
    el: '#app',
    data: {
        clock: null,
        date: null,
        incident: null,
        services: null,
        updateTimer: null
    },
    methods: {
        updateData() {
            axios({
                url: "data/last_incident.json",
                responseType: "json"
            }).then(response => {
                const latestData = response.data;
                this.date = new Date(latestData.date);
                this.incident = latestData.incident;
                this.services = latestData.services;

                this.updateTimer = setInterval(() => {
                    let now = new Date().getTime();
                    let distance = now - this.date;
                    this.clock = prettyClock(distance);
                }, 1000);
            });
        },

        statusToMessage(status) {
            return status === "ok" ? "Service is up" : "Service is down";
        },

        prettyDate(date) {
            return new Date(date).toLocaleString();
        }
    },
    created () {
        this.updateData();
    },
    beforeDestroy () {
        clearInterval(this.updateTimer)
    },
});

function prettyClock(distance) {
    return {
        days:  Math.floor(distance / (day)),
        hours: Math.floor((distance % (day)) / (hour)),
        minutes: Math.floor((distance % (hour)) / (minute)),
        seconds: Math.floor((distance % (minute)) / second)
    };
}
