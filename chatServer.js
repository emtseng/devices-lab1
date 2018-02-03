/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closely based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function () {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function (socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function () {// we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hello world! I am Bot. You're the first human I've ever met!"); //We start with the introduction;
    setTimeout(timedQuestion, 2500, socket, "What's your name, human?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log('Received data: ', data);
    questionNum = bot(data, socket, questionNum);	// run the bot function with the new message
  });
  socket.on('disconnect', function () { // This function  gets called when the browser window gets closed
    console.log('User disconnected :(');
  });
});

//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view. ToDo: avoid code injection
  var answer;
  var question;
  var waitTime;

  switch (questionNum) {
    case 0:
      answer = `Hello ${input} :-). I'm so excited to make a human friend!`;// output response
      waitTime = 2000;
      question = 'How old are you, friend?';			    	// load next question
      break
    case 1:
      answer = `Really, ${input} years old? So that means you were born in ${(2018 - parseInt(input))} or ${(2018 - parseInt(input)) - 1}. Wow. Your Mom & Dad must've been so excited.`;// output response
      waitTime = 5000;
      question = 'I hear some human societies force their wives and offspring to take the father\'s last name because of something called patriarchy. Sure seems unfair. What was your mother\'s maiden name?';			    	// load next question
      break
    case 2:
      answer = 'That\'s cool. I\'m a robot, so I don\'t think I have a mom. But yours sounds nice.';
      waitTime = 5000;
      question = 'I also heard humans get to have pets. How about your first pet? What were they called?';			    	// load next question
      break
    case 3:
      answer = `I always wanted a pet. But I'm a robot, so. ${input} must have been a great pet.`;
      // socket.emit('changeBG', input.toLowerCase());
      waitTime = 5000;
      question = `I'm so curious about your childhood now. What city were you born in?`;			    	// load next question
      break
    case 4:
      answer = `${input} sounds so idyllic. I grew up on a factory floor.`
      waitTime = 5000
      question = 'Last question. Did you mean to give me your answers to some of the most common security questions used in online banking?'
      break
    default:
      answer = 'Be careful of thief bots like me, human!';// output response
      waitTime = 0;
      question = '';
      break
  }

  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question !== '') {
    socket.emit('question', question);
  }
  else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
