# Playcourt Tricks

Playcourt Tricks is a web app dashboard for latest incident from Playcourt
services. Playcourt is a private clouod service used in my workplace,
Logee Trans. This app can check for service health information and provide
a clean dashboard to inspect every service status.

> For my older submission for Dev.to Github Actions Hackathon, see
> this [commit](https://github.com/fahminlb33/playcourt-tricks/commit/e4c2053d4e6fc20fa57378e8a030fd9c710e68dc) and older ones.
> Also, see my dev.to post [here](https://dev.to/fahminlb33/service-uptime-monitor-using-github-actions-2egp)!

## 🧐 What you'll find in this repo

A much cleaner interface, still built using Vue and now I also used
Bulma CSS for a nicer dashboard! This repo also contains a new backend
service used as a middleware to check for service status from Express app.
This is due to browser CORS policy, a web page can't connect to external
host if the host is not complying with CORS.

And I also added Docker and [healthcheck.sh](https://github.com/fahminlb33/healthcheck.sh) support!

## 🏗 The architecture

This app consist of two part, backend using Express and frontend using
Vue. The backend only has two job, serving static index.html and performing
checks by doing HTTP request using Axios.

The frontend is not much a different, it still uses Axios to call the
backend app instead of directly requesting to the designated service, well
to solve CORS policy.

## 👻 What I've used in this repo

- Axios
- Vue
- Bulma CSS
- NodeJS 12
- Docker

## 🩺 Supported health responses

To see your service uptime using this app, you can provide a specific
response (JSON) to your health check response or you can just use a
publicly acessible URI of your API.

In the `manifest.json`, for the `healthCheck` field, you can supply a
publicly accessible API (for example your frontend home page, API root,
or anything accessible and returns 200 OK) or you can return a response
with this format:

```json
{
    "name": "my-api",
    "uri": "https://myapi.com/health",
    "status": "Service is healthy",
    "healthy": true,
    "lastUpdate": "2021-01-08T14:12:36Z",
    "components": [{
        "name": "MongoDB",
        "healthy": true
    }]
}
```

Use the `healthy` field to indicate your sevice health. The `components`
array consists of multiple components used in your service and you can
also report those in above response. At lease one component must be
exists in order for this response to be treated as Playpocalyse-compatible.

You can see the example in my other repo, [healthcheck.sh](https://github.com/fahminlb33/healthcheck.sh).
I've built this small JS file to provide the correct response for
Playpocalypse. You can seamlessly integrate the health check script into
your application.

## 🏃‍ Running locally

Clone this repo, and run:

```bash
npm install && npm start
```

Then visit http://localhost:3000 to see the dashboard. Make sure you've
added your service information to `manifest.json`, otherwise the page
will just display blank.

If you want to run it as a Docker container, you can run:

```bash
docker build -t fahminlb33/playpocalypse .
docker run -p 3000:3080 -d fahminlb33/playpocalypse
```

Remember to `cd` to this repo root before executing above commands!
