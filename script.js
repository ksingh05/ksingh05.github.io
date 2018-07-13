/* Copyright (C) 2016 Jeff Irion */
function getemail() {
  /* use the answer to "what is my degree in?" to 'decode' my email address */
  var answer = document.getElementById('email-answer').value.toLowerCase();
  var answerarray = [-23, -11, -10, -6, -29, -28, 14, 73, 2, 13, -52, -1, 12, -15, -7, 0, -59, -2, 11, 77]
  var decodedemail = ""
  var minlen = Math.min(12, answer.length)
  if (minlen > 0) {
    for (var i = 0; i < answerarray.length; i++) {
      decodedemail += String.fromCharCode(answer.charCodeAt(i % minlen) + answerarray[i]);
    }
  }
  document.getElementById('email-decoded').innerHTML = "<strong>" + decodedemail + "</strong>";
}
