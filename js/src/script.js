/*jshint esversion: 6 */
$(document).ready(() => {

   // Menu
   $(".header .bar").click(() => {
      if ($(".main-menu").hasClass("open")) {
         close();
      } else {
         open();
      }
   });

   $(".main-menu li").click(() => {
      close();
   });

   function open() {
      $(".header .bar .text").hide();
      $(".header .bar .icon.menu").hide();
      $(".header .bar .icon.cancel").show();
      $(".main-menu").addClass("open");
   }

   function close() {
      $(".header .bar .text").show();
      $(".header .bar .icon.cancel").hide();
      $(".header .bar .icon.menu").show();
      $(".main-menu").removeClass("open");
   }

   // Smoot init
   var scroll = new SmoothScroll('a[href*="#"]');

   var topButton = function(e) {
      var o = $(this).scrollTop();
      var h = $("#top").height();
      var b = $(".up-button");
      if (o > h) {
         b.addClass("show");
      } else {
         b.removeClass("show");
      }
      //var offset = $(window).offset();
   };
   topButton();
   //scroll top-button
   $(window).scroll(topButton);
});