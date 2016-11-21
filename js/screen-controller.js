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
