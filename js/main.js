var jsonURL, jsonContent;
var characters = [];
var comics = [];
var offset = 0;
var actualPage = 0;

$(document).ready(function(){
  /*mediaEnd("marvel-intro", function(){
    hideElement("#marvel-intro");
    showElement(".main");
  })*/
  ajaxRequests();
  pagination();
  //tableContent(15, "list-of-characters")
});

function pagination() {
  $(".pagination li a").click(function(){
    templatePagination($(this));
    actualPage = parseInt($(this).html()) - 1;
  });

  $(".back-to-list").click(function(){
    toggleScreens("#character-description", "#characters-table")
  })
}

function pagesControl(){

}



function displayCharacterInfo(){
  $("#list-of-characters td").click(function(){
    $(this).parent().siblings().removeClass("success");
    $(this).parent().addClass("success");
    var identifier = $(this).attr("data-identifier");
    var index = $(this).parent().index();
    console.log(index)

    getXHR("https://gateway.marvel.com:443/v1/public/characters/"+identifier+"/comics?limit=10&offset=", function(){
      if(jsonContent["data"]["results"].length > 0){
        comics[index] = {
          "characterName": characters[actualPage]["data"]["results"][index]["name"],
          "listOfComics": jsonContent["data"]["results"]
        };

        if(jsonContent["data"]["results"][index]["images"].length > 0){
          $(".character-hq-list .image-holder img").show();
          $(".character-hq-list .image-holder img").attr("src", jsonContent["data"]["results"][index]["images"][0]["path"]+"."+jsonContent["data"]["results"][index]["images"][0]["extension"]);
        }else{
          $(".character-hq-list .image-holder").addClass("text-center");
          $(".character-hq-list .image-holder img").hide();
        }
        toggleScreens("#characters-table", "#character-description");
      }else{
        console.log("Sem informações disponíveis");
      }
    })
  })
}

function numberOfPages(){
  var result = Math.ceil(jsonContent["data"]["total"] / 10);
  return result;
}

function templatePagination(element){
  $(element).parent().siblings().removeClass("active disabled");
  $(element).parent().addClass("active disabled");
  var limit = parseInt($(element).html());
  offset = (limit * 10) - 10;
  //Se o json não foi baixado
  if(characters[limit-1] === undefined){
    console.log("Using server data");
    getXHR("https://gateway.marvel.com:443/v1/public/characters?limit=10&offset=", function(){
      characters[limit-1] = jsonContent;
      updateCellsContent(10, "list-of-characters", jsonContent);
      offset += 10;
    });
  }else{
    //Se o json já foi baixado
    console.log("Using local data");
    updateCellsContent(10, "list-of-characters", characters[limit-1]);
  }
}

function updateCellsContent(numberOfRows, id, json){
  for(var i = 0; i < numberOfRows; i++){
    var cellNumber = 0;
    while(cellNumber < 3){
      var cell = document.getElementById(id).tBodies[0].childNodes[i+3].children[cellNumber];
      cell.setAttribute("data-identifier", json["data"]["results"][i]["id"]);
      var numberOfCell = parseInt($(cell).attr("data-number-list")) + 10;
      cell.setAttribute("data-number-list", numberOfCell);
      cellsContent(json, cell, cellNumber, i);
      cellNumber++;
    }
  }
}

function ajaxRequests(){
  $(".marvel-btn").click(function(e){
    e.preventDefault();
    getXHR("https://gateway.marvel.com:443/v1/public/characters?limit=10&offset=", function(){
      tableContent(10, "list-of-characters");
      offset += 10;
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
          cell.setAttribute("data-identifier", jsonContent["data"]["results"][i]["id"]);
          cell.setAttribute("data-number-list", i);
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
