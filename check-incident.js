const axios = require('axios').default;

exports.config = Object.freeze({
    defaultHeaders: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44'
    }
});

exports.checkService = (service) => {
    const opt = {
        url: service.healthCheck ?? service.uri,
        responseType: "text",
        headers: {
            ...exports.config.defaultHeaders
        }
    };

    return axios(opt).then(response => {
        const responseBody = response.data;
        try {
            const data = JSON.parse(responseBody);
            return data.components ? data : {
                name: service.name,
                uri: service.uri,
                status: 'Service is healthy',
                healthy: true,
                lastUpdate: new Date().toISOString(),
                components: [{
                    name: 'Incompatible response for Playpocalypse.',
                    healthy: true
                }]
            };
        } catch {
            return {
                name: service.name,
                uri: service.uri,
                status: 'Service is healthy',
                healthy: true,
                lastUpdate: new Date().toISOString(),
                components: [{
                    name: 'Incompatible response for Playpocalypse.',
                    healthy: true
                }]
            };
        }
    }).catch(error => {
        return {
            name: service.name,
            uri: service.uri,
            status: 'Service is unhealthy',
            healthy: false,
            lastUpdate: new Date().toISOString(),
            components: [{
                name: 'Service is returning non-success code.',
                healthy: false
            }]
        };
    });
};
