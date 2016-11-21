function apiData(baseURL, privateKey, publicKey, offset){
  var d = new Date();
  var completeTime = [d.getDate(), d.getMonth() + 1, d.getFullYear(), d.getHours()];
  var timeStamp = completeTime.join("");
  var hashFormed = md5(timeStamp + privateKey + publicKey);

  //baseURL = "https://gateway.marvel.com:443/v1/public/characters?limit=10&offset="+offset+"&apikey=";
  baseURL = baseURL + offset + "&apikey=";
  var result = baseURL + publicKey + "&ts="+ timeStamp + "&hash="+ hashFormed;
  return result;
}

function getXHR(baseURL, callback){
  var publicKey = $("#public_key").val();
  var privateKey = $("#private_key").val();
  jsonURL = apiData(baseURL, privateKey, publicKey, offset);
  $.get(jsonURL, function(data, status){
      jsonContent = data;
      callback();
      //tableContent(10, "list-of-characters");
  }).fail(function() {
    console.log( "error" );
  });
}
