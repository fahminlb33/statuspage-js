# Playcourt Tricks

![Node.js CI](https://github.com/fahminlb33/playcourt-tricks/workflows/Node.js%20CI/badge.svg)

Playcourt Tricks is a day counter for latest incident from Playcourt services. Playcourt is a
private clouod service used in my workplace, LogeeTrans. This code will execute every 5 minutes
and checks for any downtime.

This project is also my submission for [Dev.to Actions Hackathon](https://dev.to/fahminlb33/service-uptime-monitor-using-github-actions-2egp)!

## 🧐 What you'll find in this repo

A single page counter which showcases latest incident on Playcourt.

- Time counter.
- Latest incident info.
- JS app to checkk for downtime.
- Workflow file to execute JS app and commit new changes.

## 🏗 The architecture

For the frontend, I use vanilla JS. To update the service status, I use JS app
using to check for downtime and writing the output to a JSON file, then
commiting the newly updated file to git.

## 👻 What I've used in this repo

- Axios
- NodeJS
- Github Actions

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
