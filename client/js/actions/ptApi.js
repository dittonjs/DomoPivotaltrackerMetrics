"use strict";

import Request       from "superagent";
import Constants     from "../constants";
import Dispatcher    from "../dispatcher";
import SettingsStore from '../stores/settings';
import _             from "lodash";

const TIMEOUT = 10000;
const GET = 'get';
const POST = 'post';
const PUT = 'put';
const DEL = 'del';

export default (url, method, token)=>{
  var token = SettingsStore.current().apiToken || token; 
  if(!token) return;
  return Request[method]("https://www.pivotaltracker.com/services/v5/" + url)
    .timeout(TIMEOUT)
    .set('Accept', 'application/json')
    .set('X-TrackerToken', token);
}