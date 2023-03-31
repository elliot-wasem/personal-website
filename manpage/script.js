document.onkeydown = checkKeypress;

function checkKeypress(e) {
    var event = window.event ? window.event : e;
    console.log(event);
    e = e || window.event;
    if (e.code == "KeyJ") {
        window.scrollBy(0, 50);
    }
    if (e.code == "KeyK") {
        window.scrollBy(0, -50);
    }
    if (e.key == "g") {
        window.scrollTo(0, 0);
    }
    if (e.key == "G") {
        window.scrollTo(0, document.body.scrollHeight);
    }
}