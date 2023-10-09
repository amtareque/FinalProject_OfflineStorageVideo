$(document).ready(function () {
    $('#media').on('play', function () {
        $('#message').html($('#media')[0].currentSrc);
    });
    $('#media').on('pause', function () {
        $('#message').html("The video has been paused");
    });

    $("#btnSnapshot").click(function () {
        var canvas = document.getElementById('myCanvas');
        var video = document.getElementById('media');
        canvas.getContext('2d').drawImage(video, 0, 0, 360, 240);
    });
});
