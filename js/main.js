/*var public_key = "6ad52bf8fa6844cce1a7ddd7d7a1e045";
var private_key = "123613f675699c06d706aef3a2a2b3df9e58bcc0";*/
var jsonURL, jsonContent;
var characters = [];
var offset = 0;

$(document).ready(function(){
  /*mediaEnd("marvel-intro", function(){
    hideElement("#marvel-intro");
    showElement(".main");
  })*/
  ajaxRequests();
  pagination();
  //tableContent(15, "list-of-characters")
});

function apiData(privateKey, publicKey, offset){
  var d = new Date();
  var completeTime = [d.getDate(), d.getMonth() + 1, d.getFullYear(), d.getHours()];
  var timeStamp = completeTime.join("");
  var hashFormed = md5(timeStamp + privateKey + publicKey);

  var baseURL = "https://gateway.marvel.com:443/v1/public/characters?limit=10&offset="+offset+"&apikey=";
  var result = baseURL + publicKey + "&ts="+ timeStamp + "&hash="+ hashFormed;
  return result;
}

function getXHR(callback){
  var publicKey = $("#public_key").val();
  var privateKey = $("#private_key").val();
  jsonURL = apiData(privateKey, publicKey, offset);
  $.get(jsonURL, function(data, status){
      jsonContent = data;
      callback();
      //tableContent(10, "list-of-characters");
      offset += 10;
  }).fail(function() {
    console.log( "error" );
  });
}

function pagination() {
  $(".pagination li a").click(function(){
    $(this).parent().siblings().removeClass("active disabled");
    $(this).parent().addClass("active disabled");
    var limit = parseInt($(this).html());
    offset = (limit * 10) - 10;
    //Se o json não foi baixado
    if(characters[limit-1] === undefined){
      console.log("Using server data");
      getXHR(function(){
        characters[limit-1] = jsonContent;
        updateCellsContent(10, "list-of-characters", jsonContent);
      });
    }else{
      //Se o json já foi baixado
      console.log("Using local data");
      updateCellsContent(10, "list-of-characters", characters[limit-1]);
    }
  })
}

function updateCellsContent(numberOfRows, id, json){
  for(var i = 0; i < numberOfRows; i++){
    var cellNumber = 0;
    while(cellNumber < 3){
      var cell = document.getElementById(id).tBodies[0].childNodes[i+3].children[cellNumber];
      cellsContent(json, cell, cellNumber, i);
      cellNumber++;
    }
  }
}

function ajaxRequests(){
  $(".marvel-btn").click(function(e){
    e.preventDefault();
    getXHR(function(){
      tableContent(10, "list-of-characters");
    });
    afterLogin("#login", "#characters-table");
  });
}

function tableContent(numberOfRows, id){
  var listOfRows = [];
  var listOfCells = [];

  //Adiciona a primeira lista ao array de objetos local
  characters[0] = jsonContent;
  //Adiciona a primeira lista ao array de objetos local

  for(var i = 0; i < numberOfRows; i++){
    var listOfItens = jsonContent["data"]["results"][i];
    if(listOfItens !== undefined){
      var tableRow = document.createElement("TR");
      listOfRows.push(tableRow);

      var cellNumber = 0;
      while(cellNumber < 3){
          var cell = document.createElement("TD");
          cellsContent(jsonContent, cell, cellNumber, i);
          listOfRows[i].appendChild(cell);
          cellNumber++;
      }//WHILE
      //ANEXA AS LINhAS À TABELA
      document.getElementById(id).tBodies[0].appendChild(listOfRows[i]);
    }else{
        console.log("Já listamos todos os personagens");
        return;
    }
  }
}

function mediaEnd(element, callback){
  var media = document.getElementById(element);
  media.onended = function() {
      callback();
  };
}

function toggleScreens(elementA, elementB){
  hideElement(elementA);
  showElement(elementB);
}

function hideElement(element){
  $(element).fadeOut();
}

function showElement(element){
  $(element).delay(1000).fadeIn();
}

function afterLogin(actualScreen, toScreen){
  $(".loader-container").fadeOut();
  toggleScreens(actualScreen, toScreen);
}

//Adiciona os conteúdos nas células
function cellsContent(json, cell, cellNumber, index){
    switch (cellNumber) {
      case 0:
        //name
        cell.innerHTML = json["data"]["results"][index]["name"];
      break;

      case 1:
        //description
        var description = json["data"]["results"][index]["description"];
        if(description == ""){
          cell.innerHTML = "Sem descrição";
        }else{
          cell.innerHTML = description;
        }
      break;

      case 2:
        //last update
        var modifiedDate = json["data"]["results"][index]["modified"];

        if(modifiedDate == ""){
            cell.innerHTML = "-";
        }else{
          var date = json["data"]["results"][0]["modified"].split("T");
          var dateYMD = date[0].split("-");
          var updatedDate = [dateYMD[2], dateYMD[1], dateYMD[0]].join("/");
          cell.innerHTML = updatedDate;
        }
      break;

      default:
    }
}
