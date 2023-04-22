#!/usr/bin/env node

import fetch from 'node-fetch';
import moment from 'moment-timezone';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit(0);
}

const latitude = args.n || -1*args.s;
const longitude = args.e || -1*args.w;
const timezone = args.z || moment.tz.guess(); 

try {
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours'+ '&timezone=' + timezone);
  const data = await response.json();
  const days = args.d;

  if (args.j){

      data.latitude = Math.round(data.latitude * 100) / 100;
      data.longitude = Math.round(data.longitude * 100) / 100;
      console.log(data);
      process.exit(0);

  }

  if(data.daily.precipitation_hours[days] > 0){

      process.stdout.write("You might need your galoshes ");

  } else {

      process.stdout.write("You will not need your galoshes ");

  }

  if (days == 0) {

    console.log("today.");

  } else if (days > 1) {

    console.log("in " + days + " days.");

  } else {

    console.log("tomorrow.");

  }

} catch (error) {
  console.error(error);
}

process.exit(0);
