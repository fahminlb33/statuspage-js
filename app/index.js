const fs = require('fs');
const axios = require('axios').default;

// configs
const config = Object.freeze({
    maxIncidents: 10,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44'
});

const main = async () => {
    const checkResult = [];
    const monitoredUrls = JSON.parse(fs.readFileSync('data/monitored.json', 'utf-8'));
   
    // run request
    for (let i = 0; i < monitoredUrls.length; i++)
    {
        const item = monitoredUrls[i];

        try {
            const opt = {
                url: item.uri, 
                responseType: 'text',
                transformResponse: [],
                headers: {
                    'User-Agent': config.userAgent
                }
            };

            console.debug(`Checking ${item.desc}, env: ${item.env}`);
            const response = await axios(opt);
            if (!response.data || response.data.includes("Application is not available")) {
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
        } catch (error) {
            checkResult.push({
                ...item,
                status: "error",
                date: new Date().toISOString()
            });
        }
    }

    // load latest data
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
    const allOk = checkResult.every(x => x.status === "ok");
    if (!allOk && lastIncident.status == "ok") {
        const repos = checkResult.filter(x => x.status === "error").map(y => `${y.desc}:${y.env}`);
        lastIncident.date = new Date().toISOString();
        lastIncident.incident = `${repos.join(', ')} is down.`;
        lastIncident.status = "error";
    } else if (allOk && lastIncident.status == "error") {
        lastIncident.date = new Date().toISOString();
        lastIncident.incident = `All monitored service is up.`;
        lastIncident.status = "ok";
    }

    // save services status
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
            const currentServiceLastIncident = currentService.incidents[currentService.incidents.length - 1];
            if (currentServiceLastIncident.status !== item.status)
            {
                if (lastIncident.services[currentServiceIndex].incidents.length >= config.maxIncidents) 
                {
                    lastIncident.services[currentServiceIndex].incidents.shift();
                }

                lastIncident.services[currentServiceIndex].incidents.push({
                    date: item.date,
                    status: item.status
                });
            };
        }
    });

    // save updated data
    fs.writeFileSync('data/last_incident.json', JSON.stringify(lastIncident, null, 2));
}

// bootstrap
main().catch(error => console.error(error));
