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
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                    break;
                }
            }
        }
        return cookieValue;
    }
    $("#english").on("input propertychange paste", function () {
        let value = $(this).val();
        $("#vietnam").val("...");
        if (value.trim() != "") {
            $.ajax({
                type: "POST",
                url: "",
                data: {
                    value: value,
                    csrfmiddlewaretoken: getCookie("csrftoken"),
                },
                success: function (response) {
                    $("#vietnam").val(response["data"]);
                },
            });
        } else {
            $("#vietnam").val("Bản dịch");
        }
    });
    $("#volume").click(function () {
        let val = $("#english").val();
        var msg = new SpeechSynthesisUtterance();
        msg.text = val;
        window.speechSynthesis.speak(msg);
    });
});
