$(function () {
  $('#navigation .back').on('click', function (e) {
    e.preventDefault();
    history.back(1);
  });
});
