const fs = require('fs');
const axios = require('axios').default;

// configs
const config = Object.freeze({
    maxIncidents: 6,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44'
});

const main = async () => {
   const monitoredUrls = JSON.parse(fs.readFileSync('data/monitored.json', 'utf-8'));
   const checkResult = [];
   const reqs = [];

    // run request
    console.log("Checking services...");
    for (let i = 0; i < monitoredUrls.length; i++)
    {
        const item = monitoredUrls[i];
        const opt = {
            url: item.uri, 
            responseType: 'text',
            transformResponse: [],
            timeout: 1000 * 5,
            headers: {
                'User-Agent': config.userAgent
            }
        };

        console.debug(`Checking ${item.desc}, env: ${item.env}`);
        const req = axios(opt).then(response => {
            if (response.status >= 400 || !response.data || response.data.includes("Application is not available")) {
                checkResult.push({
                    ...item,
                    status: "error",
                    date: new Date().toISOString()
                });
            } else {
                checkResult.push({
                    ...item,
                    status: "ok",
                    date: new Date().toISOString()
                });
            }
        }).catch(_ => {
            checkResult.push({
                ...item,
                status: "error",
                date: new Date().toISOString()
            });
        });
        reqs.push(req);
    }

    await Promise.all(reqs);

    // load latest data
    console.log("Fetching last data...");
    const lastIncidentData = fs.readFileSync('data/last_incident.json', 'utf-8');
    let lastIncident;
    if (lastIncidentData)
    {
        lastIncident = JSON.parse(lastIncidentData);
    }
    else
    {
        lastIncident = {
            date: new Date().toISOString(),
            incident: "All monitored service is up.",
            status: "ok",
            services: []
        };
    }

    // save global result
    console.log("Checking latest incident...");
    const checkedOk = checkResult.filter(x => x.status === "ok").length;
    const lastOk = lastIncident.services.filter(service => service.status === "ok").length;
    if (checkedOk != lastOk) {
        lastIncident.date = new Date().toISOString();
    }

    if (lastOk != checkResult.length) {
        const repos = checkResult.filter(x => x.status === "error").map(y => `${y.desc}:${y.env}`);
        lastIncident.incident = `${repos.join(', ')} is down.`;
        lastIncident.status = "error";
    } else {        
        lastIncident.incident = `All monitored service is up.`;
        lastIncident.status = "ok";
    }

    // save services status
    console.log("Saving incidents...");
    checkResult.forEach(item => {
        const currentServiceIndex = lastIncident.services.findIndex(x => x.desc == item.desc && x.env == item.env);
        const currentService = lastIncident.services[currentServiceIndex];
        if (!currentService) 
        {
            lastIncident.services.push({
                desc: item.desc,
                env: item.env,
                status: item.status,
                incidents: [
                    {
                        date: item.date,
                        status: item.status
                    }
                ]
            });
        }
        else
        {
            const currentServiceLastIncident = currentService.incidents[0];
            currentService.status = item.status;
            if (currentServiceLastIncident.status !== item.status)
            {
                if (lastIncident.services[currentServiceIndex].incidents.length >= config.maxIncidents) 
                {
                    lastIncident.services[currentServiceIndex].incidents.pop();
                }

                lastIncident.services[currentServiceIndex].incidents.unshift({
                    date: item.date,
                    status: item.status
                });
            };
        }
    });

    // save updated data
    console.log("Serializing...");
    fs.writeFileSync('data/last_incident.json', JSON.stringify(lastIncident, null, 2));
}

// bootstrap
main().catch(error => console.error(error));
