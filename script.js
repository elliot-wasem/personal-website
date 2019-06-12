function toggleSection(divname, arrowname) {
    var section = document.getElementById(divname);
    if (section.style.display != "block") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
    var arrow = document.getElementById(arrowname);
    if(arrow.className != "down-arrow") {
	arrow.className = "down-arrow";
    } else {
	arrow.className = "right-arrow";
    }
}
