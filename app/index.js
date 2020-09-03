const fs = require('fs');
const { exit } = require('process');
const axios = require('axios').default;

const monitoredUrls = [{
        uri: "https://gitlab.playcourt.id",
        desc: "Gitlab"
    },
    {
        uri: "https://dev-minio.logeetrans.com",
        desc: "logee-minio"
    },
    {
        uri: "https://dev-api.logeetrans.com/user",
        desc: "logee-user"
    },
    {
        uri: "https://dev-api.logeetrans.com/order",
        desc: "logee-order"
    },
    {
        uri: "https://dev-api.logeetrans.com/truck",
        desc: "logee-truck"
    },
    {
        uri: "https://dev-api.logeetrans.com/cargo",
        desc: "logee-cargo"
    },
    {
        uri: "https://dev-api.logeetrans.com/billing",
        desc: "logee-billing"
    }
];

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const main = async () => {
    const checkResult = [];
    await asyncForEach(monitoredUrls, async (item) => {
        try {
            const opt = {
                url: item.uri, 
                responseType: 'text',
                transformResponse: [],
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44'
                }
            };

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
    });

    const lastIncidentLine = fs.readFileSync('data/last_incident.json', 'utf-8');
    const lastIncident =
        lastIncidentLine ?
        JSON.parse(lastIncidentLine) : {
            date: new Date().toISOString(),
            incident: "All monitored service is up.",
            status: "ok"
        };

    const allOk = checkResult.every(x => x.status === "ok");
    if (!allOk) {
        if (lastIncident.status == "ok") {
            const repos = checkResult.filter(x => x.status === "error").map(y => y.desc);
            const data = {
                date: new Date().toISOString(),
                incident: `${repos.join(',')} is down.`,
                "status": "error"
            }
            fs.writeFileSync('data/last_incident.json', JSON.stringify(data))
        }
    } else {
        if (lastIncident.status == "error") {
            const data = {
                date: new Date().toISOString(),
                incident: `All monitored service is up.`,
                "status": "ok"
            }
            fs.writeFileSync('data/last_incident.json', JSON.stringify(data))
        }
    }
}

main();