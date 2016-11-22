function apiData(baseURL, privateKey, publicKey, offset, hasLimit, limitSize){
  var d = new Date();
  var completeTime = [d.getDate(), d.getMonth() + 1, d.getFullYear(), d.getHours()];
  var timeStamp = completeTime.join("");
  var hashFormed = md5(timeStamp + privateKey + publicKey);

  //baseURL = "https://gateway.marvel.com:443/v1/public/characters?limit=10&offset="+offset+"&apikey=";
  //baseURL = baseURL + offset + "&apikey=";
  //var result = baseURL + publicKey + "&ts="+ timeStamp + "&hash="+ hashFormed;
  var paramsURL = [baseURL, timeStamp, hashFormed];
  var limit = hasLimit == true ? "&limit="+limitSize+"&offset="+ offset : "";
  var result = paramsURL[0] + "?apikey=" + publicKey + "&ts=" + paramsURL[1] + "&hash=" + paramsURL[2] + limit;
  return result;
}

function getXHR(baseURL, callback){
  $.get(baseURL, function(data, status){
      jsonContent = data;
      callback();
      $(".loader-container").fadeOut();
      //tableContent(10, "list-of-characters");
  }).fail(function() {
    console.log( "error" );
  });
}
