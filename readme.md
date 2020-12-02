# Playcourt Tricks [Live Page](https://fahminlb33.github.io/playcourt-tricks/)

![Node.js CI](https://github.com/fahminlb33/playcourt-tricks/workflows/Node.js%20CI/badge.svg)

  This workflow is now disabled as it piles up in my Timeline.
  You can still clone this repo and it will run fine in your own repo.

Playcourt Tricks is a day counter for latest incident from Playcourt services. Playcourt is a
private clouod service used in my workplace, LogeeTrans. This code will execute every 5 minutes
and checks for any downtime.

This project is also my submission for [Dev.to Actions Hackathon](https://dev.to/fahminlb33/service-uptime-monitor-using-github-actions-2egp)!

## 🧐 What you'll find in this repo

A single page counter which showcases latest incident on Playcourt.

- Time counter.
- Latest incident info.
- JS app to check for downtime.
- Workflow file to execute JS app and commit new changes.
- Vuejs SPA.

## 🏗 The architecture

For the frontend, I use vanilla JS. To update the service status, I use JS app
to check for downtime and writing the output to a JSON file, then
commiting the newly updated file to git.

## 👻 What I've used in this repo

- Axios
- VueJS
- Bulma CSS
- NodeJS 12
- Github Actions

## ➕ Adding service to monitor

1. Fork this repo.
2. Add your service to `monitored.json`.
3. Create pull request.

I'll review as soon as I can, you can PM me if you want it to be reviewed quickly!

## 🏃‍ Running locally

Clone this repo, and run:

``` bash
npm install && npm start
```

You'll need to rerun above command to update the timer, in case of downtime or uptime.
To view the timer, you'll need a HTTP web server, you can use any web server, for
example:

```bash
npm install -g http-server && http-server .
```
