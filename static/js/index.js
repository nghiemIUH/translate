$(document).ready(function () {
    let height = $("textarea").height();
    $("textarea").on("keyup keypress", function () {
        $("textarea").height(height);
        $("textarea").height(this.scrollHeight);
    });

    $(".item button").click(function () {
        $(".item button").removeClass("activate");
        $(this).addClass("activate");
        let index = $(this).index();
        $(".trans").removeClass("activate");
        $($(".trans")[index]).addClass("activate");
    });

});
