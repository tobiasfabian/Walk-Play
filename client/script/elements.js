/* SVG */
var svgElement = document.getElementById('svg');
var svgns = "http://www.w3.org/2000/svg";

/* OVERLAY */
var info_screenElement = document.getElementById('info_screen');
var notificationElement = info_screenElement.querySelector('.notification');
var status_circle = document.getElementById('status_circle');
var exclamation_markElement = status_circle.querySelector('.exclamation_mark');
var status_circle_outerElement = status_circle.querySelector('.status_circle_outer');
var status_circle_innerElement = status_circle.querySelector('.status_circle_inner');

/* PLAYERS */
var playersElement = document.getElementById('players')
var player_selfElement = playersElement.querySelectorAll('.player.self')[1];
var player_self_outer_circleElement = playersElement.querySelector('.player.self.outer_circle');

/* PLAYGROUND */
var playgroundElement = document.getElementById('playground');
var scoreElement = document.getElementById('score');
var scoreTeam1Element = scoreElement.querySelector('.team1');
var scoreTeam2Element = scoreElement.querySelector('.team2');

/* WIN SCREEN */
var win_screenElement = document.getElementById('win_screen');
var win_screenTextElement = win_screenElement.querySelector('.text');
var win_screenSecondsElement = win_screenElement.querySelector('.seconds');
