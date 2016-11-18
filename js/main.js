/*var public_key = "6ad52bf8fa6844cce1a7ddd7d7a1e045";
var private_key = "123613f675699c06d706aef3a2a2b3df9e58bcc0";*/
var jsonURL, jsonContent;

$(document).ready(function(){
  mediaEnd("marvel-intro", function(){
    hideElement("#marvel-intro");
    showElement(".main");
  })
  ajaxRequests();
});

function apiData(privateKey, publicKey){
  var d = new Date();
  var completeTime = [d.getDate(), d.getMonth() + 1, d.getFullYear(), d.getHours()];
  var timeStamp = completeTime.join("");
  var hashFormed = md5(timeStamp + privateKey + publicKey);

  var baseURL = "https://gateway.marvel.com:443/v1/public/characters?limit=10&offset=100&apikey=";
  var result = baseURL + publicKey + "&ts="+ timeStamp + "&hash="+ hashFormed;
  return result;
}

function ajaxRequests(){
  $(".marvel-btn").click(function(e){
    e.preventDefault();
    $(".loader-container").fadeIn();
    getXHRData();
  });
}

function getXHRData(){
  var publicKey = $("#public_key").val();
  var privateKey = $("#private_key").val();
  jsonURL = apiData(privateKey, publicKey);
  $.get(jsonURL, function(data, status){
      jsonContent = data;
      console.log("Data: " + data + "\nStatus: " + status);
  }).fail(function() {
    console.log( "error" );
  });
}

function mediaEnd(element, callback){
  var media = document.getElementById(element);
  media.onended = function() {
      callback();
  };
}

function hideElement(element){
  $(element).fadeOut();
}

function showElement(element){
  $(element).fadeIn();
}
