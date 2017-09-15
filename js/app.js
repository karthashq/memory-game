let openCards = [];
let moves, match, victory,firstcard;
let totalSeconds, seconds, minutes, startTimer;
const $minutes = $(".minutes");
const $seconds = $(".seconds");
const $deck = $(".deck");
const $moves = $(".moves");
const $modal = $("#myModal");
const $close = $(".close");
const $stars = $(".stars");
/*
 * Create a list that holds all of your cards
 */
let cardsymbols = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
   "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf",
   "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf",
   "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"
];
/*
  This function is run when game starts and
  every time the game is reset.
*/
function init() {
   cardsymbols = shuffle(cardsymbols); //shuffles the symbols
   openCards = [];
   moves = 0;
   match = 0;
   victory = false;
   firstcard=true;
   $seconds.html("00");
   $minutes.html("00");
   $modal.css("display", "none");
   $moves.html(moves);
   /*
     Clears the deck and rebuilds it with
     shuffles cardsymbols
   */
   $deck.empty();
   for (let i = 0; i < cardsymbols.length; i++) {
      $deck.append('<li id="' + i + '" class="card"><i class="' + cardsymbols[i] + '"></i></li>');
   }
   /*
     adds event listener to each card
   */
   for (let i = 0; i < cardsymbols.length; i++) {
      let selector = $("li#" + i);
      let classcheck = cardsymbols[i];
      addListener(selector, classcheck);
   }
   /*
     resets the number of stars and starts timer.
   */
   changeStars();
}
/*
  starts the game when the DOM has loaded
*/
$(document).ready(function() {
   init();
});
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
   var currentIndex = array.length,
      temporaryValue, randomIndex;
   while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }
   return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
/*
adds listener to each card .
*/
function addListener(selector, classcheck) {
   selector.click(function() {
     //to check if the player clicks on the
     // same card again instead of another card.
     condition=selector.hasClass("match")||selector.hasClass("show open");
     if(!condition){
      showSymbol(selector);
      addOpenCard(selector, classcheck);
    }
   });
}
/*
  Shows the symbol of the card that is clicked
*/
function showSymbol(selector) {
   selector.addClass("show open");
   //to make sure the timer starts when the player starts the game
   if(firstcard==true){
   timer();
 }
 firstcard=false;
}
/*
  This function stops the timer and
  restarts the game on clicking the restart icon
*/
$(".restart").click(function() {
   clearInterval(startTimer);
   init();
});
/*
Compares the cards in the openCards list
and checks for matches.If they match calls CardsMatch function
else calls CardsDontMatch func.
*/
function addOpenCard(selector, classcheck) {
   openCards.push([classcheck, selector]);
   /*
   The setTimeout function is used to specify how
   long to show the selected cards for each move.
   */
   setTimeout(function() {
      if (openCards.length > 1) {
         var x = openCards.length;
         if (openCards[x - 2][0] === openCards[x - 1][0]) {
            cardsMatch(x);
         } else {
            cardsDontMatch(x);
         }
         countMoves();
         checkWin();
      }
   }, 200);
}
/*
  This function is called when the cards match
  and adds the match class to them.It also increments the
  match variable.It also clears the openCards list.
*/
function cardsMatch(x) {
  openCards[x - 2][1].removeClass("show open");
  openCards[x - 1][1].removeClass("show open");
   openCards[x - 2][1].addClass("match");
   openCards[x - 1][1].addClass("match");
   openCards = [];
   match += 2;
}
/*
  This function is called when the cards do not match
  and removes the show and open classes.It also
  clears the openCards list.
*/
function cardsDontMatch(x) {
   openCards[x - 2][1].removeClass("show open");
   openCards[x - 1][1].removeClass("show open");
   openCards = [];
}
/*
  This function counts the no of moves made
*/
function countMoves() {
   moves += 1;
   $moves.html(moves);
   changeStars();
}
/*
  This checks the no of moves made and
  show the no.of stars accordingly.
*/
function changeStars() {
   if (moves > 17) {
      $stars.empty();
      $stars.append("<li><i class='fa fa-star'></i></li>");
   } else if (moves > 10) {
      $stars.empty();
      $stars.append("<li><i class='fa fa-star'></i></li>");
      $stars.append("<li><i class='fa fa-star'></i></li>");
   } else {
      $stars.empty();
      $stars.append("<li><i class='fa fa-star'></i></li>" +
         "<li><i class='fa fa-star'></i></li>" +
         "<li><i class='fa fa-star'></i></li>");
   }
}
/*
This function is called to intiate the
timer when the game starts.If the player won then
it promts the modal to display.
*/
function timer() {
   totalSeconds = 0;
   startTimer = setInterval(function() {
      ++totalSeconds;
      seconds = totalSeconds % 60;
      minutes = parseInt(totalSeconds / 60);
      $seconds.html(pad(totalSeconds % 60));
      $minutes.html(pad(parseInt(totalSeconds / 60)));
      if (victory) {
         clearInterval(startTimer);
         displayModal();
      }
   }, 1000);

   function pad(val) {
      return val > 9 ? val : "0" + val;
   }
}
/*
This checks if the player has won if
the variable match is equal to 16 which implies
16 matched cards.
*/
function checkWin() {
   if (match === 16) {
      console.log("Won");
      victory = true;
   }
}
/*
  This function displays the modal once
   the player has won the game
*/
function displayModal() {
   // When the user clicks the button, open the modal
   $modal.css("display", "block");
   // When the user clicks on <span> (x), close the modal
   $close.click(function() {
      $modal.css("display", "none");
   });
   // When the user clicks anywhere outside of the modal, close it
   $(window).click(function(event) {
      if (event.target.id == "myModal") {
         $modal.css("display", "none");
      }
   });
}
