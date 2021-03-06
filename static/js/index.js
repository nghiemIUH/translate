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

    $("#anh").on("keyup keypress", function () {
        let en = $(this).val();
        $(".char").text(`${anh.length}/1000`);
        if (en.trim() != "") {
            $.ajax({
                type: "POST",
                url: "",
                data: {
                    text: en,
                    csrfmiddlewaretoken: getCookie("csrftoken"),
                },
                success: function (res) {
                    $("#viet").val(res.response);
                },
            });
        } else {
            $("#viet").val("");
        }
    });

    $("#volume").click(function () {
        let value = $("#anh").val();
        var msg = new SpeechSynthesisUtterance();
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 0;
        msg.lang = "en";
        msg.text = value;
        speechSynthesis.speak(msg);
    });
});
