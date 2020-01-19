function get_url() {
  return 'http://111.230.242.203:8000'
}


function get_fly() {
  let Fly = require('lib/flyio.js')
  let fly = new Fly
  return fly 
}

function get_qs() {
  let qs = require('lib/qs.js')
  return qs 
}

function get_appid(){
  return "wx76fe502b7e06ab0e";
}
function get_appsecret(){
  return "6cf8816e1650122f370cc0892a934e7f";
}

export {
  get_url,
  get_fly,
  get_qs,
  get_appid,
  get_appsecret,
}
