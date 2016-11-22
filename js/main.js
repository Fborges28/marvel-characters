var jsonURL, jsonContent, publicKey, privateKey;
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
});

function pagination() {
  $(".pagination li a").click(function(){
    $(".loader-container").fadeIn();
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
  /* CONTAINER TO APPEND THE INFO FROM THE JSON COMICS */
  var $itemContainer = $(".character-hq-list > ul > li");

  $("#list-of-characters td").click(function(){
    //FEEDBACK TO THE CLICKED ROW
    $(this).parent().siblings().removeClass("success");
    $(this).parent().addClass("success");

    //CLEAR THE LIST OF COMICS
    $(".character-hq-list ul").html("");

    //GET THE UNIQUE ID TO PASS TO THE URL FOR THE FUNCTION getXHR
    var identifier = $(this).attr("data-identifier");
    var index = $(this).parent().index();
    console.log(index);
    jsonURL = apiData("https://gateway.marvel.com:443/v1/public/characters/"+identifier+"/comics", privateKey, publicKey, 0, true, 100);
    getXHR(jsonURL, function(){
      if(jsonContent["data"]["results"].length > 0){
        comics[index] = {
          /* LIST OF JSONS (COMICS) TO LOCAL USAGE*/
          "characterName": characters[actualPage]["data"]["results"][index]["name"],
          "characterThumb": characters[actualPage]["data"]["results"][index]["thumbnail"],
          "listOfComics": jsonContent["data"]["results"]
        };
        /* LIST OF JSONS (COMICS) TO LOCAL USAGE*/
        $(".character-name").html(comics[index]["characterName"]);
        $(".character-info .image-holder img").attr("src", comics[index]["characterThumb"]["path"] + "." + comics[index]["characterThumb"]["extension"]);

        for(var i = 0; i < jsonContent["data"]["results"].length; i++){
          if(jsonContent["data"]["results"][index] === null){
            break;
          }else{
            var containerTemp = $itemContainer.clone();
            $(".character-hq-list ul").append(containerTemp);

            /*TO IMAGES*/
            if(jsonContent["data"]["results"][index]["thumbnail"] !== undefined){
              $(".character-hq-list > ul > li:eq("+i+") > .image-holder img").show();
              $(".character-hq-list  > ul > li:eq("+i+") > .image-holder img").attr("src", jsonContent["data"]["results"][i]["thumbnail"]["path"]+"."+jsonContent["data"]["results"][i]["thumbnail"]["extension"]);
            }else{
              $(".character-hq-list  > ul > li:eq("+i+") > .image-holder").addClass("text-center");
              //$(".character-hq-list li:eq("+i+") .image-holder img").hide();
            }
            /*TO IMAGES*/

            /*TO TITLES*/
            if(jsonContent["data"]["results"][index]["title"] !== undefined || jsonContent["data"]["results"][index]["title"] != "" || jsonContent["data"]["results"][index]["title"] !== null){
              $(".character-hq-list > ul > li:eq("+i+") > .hq-title").html(jsonContent["data"]["results"][i]["title"]);
            }
            /*TO TITLES*/

            /*TO DESCRIPTION*/
            if(jsonContent["data"]["results"][index]["description"] !== null){
              var content = jsonContent["data"]["results"][i]["description"];
              console.log(content)
              $(".character-hq-list > ul > li:eq("+i+") .description").html(i);
            }else{
              $(".character-hq-list > ul > li:eq("+i+") .description").html("Sem descrição");
            }
            /*TO DESCRIPTION*/
          }

        }
        /*CHANGE SCREEN*/
        toggleScreens("#characters-table", "#character-description");
      }else{
        /*NO INFO IN THE JSON*/
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
    jsonURL = apiData("https://gateway.marvel.com:443/v1/public/characters", privateKey, publicKey, offset, true, 10);
    getXHR(jsonURL, function(){
      characters[limit-1] = jsonContent;
      updateCellsContent(10, "list-of-characters", jsonContent);
      offset += 10;
    });
  }else{
    //Se o json já foi baixado
    console.log("Using local data");
    $(".loader-container").hide();
    updateCellsContent(10, "list-of-characters", characters[limit-1]);
  }
}

function updateCellsContent(numberOfRows, id, json){
  for(var i = 0; i < numberOfRows; i++){
    var cellNumber = 0;
    while(cellNumber < 3){
      var cell = document.getElementById(id).tBodies[0].childNodes[i+3].children[cellNumber];
      cell.setAttribute("data-identifier", json["data"]["results"][i]["id"]);
      cellsContent(json, cell, cellNumber, i);
      cellNumber++;
    }
  }
}

function ajaxRequests(){
  $(".marvel-btn").click(function(e){
    e.preventDefault();
    publicKey = $("#public_key").val();
    privateKey = $("#private_key").val();

    jsonURL = apiData("https://gateway.marvel.com:443/v1/public/characters", privateKey, publicKey, offset, true, 10);
    getXHR(jsonURL, function(){
      tableContent(10, "list-of-characters");
      displayCharacterInfo();
      offset += 10;
      setTimeout(function(){
        $(".pagination li:eq(0) a").trigger("click");
        $(".loader-container").fadeOut();
      }, 1000)
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
