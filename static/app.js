const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

axios({
    url: "data/last_incident.json",
    responseType: "json"
}).then(response => {
    const latestData = response.data;
    const countDown = new Date(latestData.date).getTime();
    setInterval(function () {
        let now = new Date().getTime();
        let distance = now - countDown;
    
        document.getElementById('days').innerText = Math.floor(distance / (day));
        document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour));
        document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute));
        document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);
        document.getElementById('latest_incident').innerText = latestData.incident;
    }, second);
})
.catch(error => {
    alert('Can not get latest data.');
});
