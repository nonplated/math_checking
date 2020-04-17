//In file js/answers.js will be created array: answers


function removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

function getYears() {
    let y = new Array();
    answers.forEach(element => {
        a = element.split("_");
        y.push(a[0]);
    });
    return removeDups(y);
}

function getClasses(year) {
    if (year === undefined) {
        alert("year undefinied in getClasses");
    }
    let c = new Array();
    answers.forEach(element => {
        a = element.split("_");
        if (a[0] === year) {
            c.push(a[1]);
        }
    });
    return c;
}

function createLinksForYears() {
    let y = getYears();
    let $links_years = document.getElementById("links_years");
    y.forEach(year => {
        a = document.createElement("a");
        a.title = year;
        a.href = "#";
        a.innerHTML = year;
        a.addEventListener("click", function() {
            document.getElementById("container_classes").style.display = "flex";
            document.getElementById("year").value = year;
            document.getElementById("class_nr").value = "";
            $links_years.childNodes.forEach(node => {
                node.className = "unselected";
            });
            this.className = "selected";
            createLinksForClasses(year);
        });
        $links_years.appendChild(a);
    });
}

function createLinksForClasses(year) {
    let y = getClasses(year);
    let $links_classes = document.getElementById("links_classes");
    $links_classes.innerHTML = "";
    y.forEach(class_nr => {
        a = document.createElement("a");
        a.title = class_nr;
        a.href = "#";
        a.innerHTML = class_nr;
        a.addEventListener("click", function() {
            document.getElementById("container_button").style.display = "flex";
            document.getElementById("container_answers").style.display = "flex";
            document.getElementById("class_nr").value = class_nr;
            $links_classes.childNodes.forEach(node => {
                node.className = "unselected";
            });
            this.className = "selected";
        });
        $links_classes.appendChild(a);
    });
}

function waitSeconds(sec = 0) {}

function getGoodAnswers(year, class_nr) {
    output = false;
    answers.forEach(element => {
        a = element.split("_");
        if (a[0] === year.toString() && a[1] === class_nr.toString()) {
            output = a[2];
        }
    });
    return output;
}

function createCodeToScan(text) {
	JsBarcode("#barcode", text, {
		format: "code128",
		lineColor: "#000",
		width: 1,
		height: 80,
		displayValue: false
	  });
}

function checkAnswers() {
    let year = document.getElementById("year").value;
    let class_nr = document.getElementById("class_nr").value;
    let your_answers = document.getElementById("answers").value;
    let $warnings = document.getElementById("warnings");
    let good_counter = 0;
    let bad_answers = [];
    let is_error = false;

    $warnings.innerHTML = "";
    if (!year) {
        $warnings.innerHTML += "<p>Select year</p>";
        is_error = true;
    }
    if (!class_nr) {
        $warnings.innerHTML += "<p>Select class</p>";
        is_error = true;
    }
    if (your_answers.length !== 30) {
        $warnings.innerHTML += "<p>Your answer string must have 30 chars.</p>";
        is_error = true;
    }
    if (is_error) {
        return false;
    }

    //in default, dont show results (maybe nothing to show)
    document.getElementById("results").style.display = "none";
    document.getElementById("form1").style.display = "flex";

    good_answers = getGoodAnswers(year, class_nr);
    if (good_answers) {
        for (ii = 0; ii < your_answers.length; ii++) {
            if (
                your_answers[ii].toLowerCase() ===
                    good_answers[ii].toLowerCase() ||
                good_answers[ii] === "*"
            ) {
                // "*" meaning that every answer is valid (question is invalid)
                good_counter++;
            } else if (your_answers[ii] !== " ") {
                bad_answers.push(
                    "<span>" +
                        (ii + 1) +
                        "<s>" +
                        your_answers[ii] +
                        "</s>" +
                        "</span>"
                );
            }
        }
        document.getElementById("good_answers").innerHTML =
            good_counter + " / " + good_answers.length;
            document.getElementById("bad_answers").innerHTML = bad_answers.join(" ") || "none";
        document.getElementById("results").style.display = "flex";
        document.getElementById("form1").style.display = "none";

        // code for print and scan
        if (good_counter === good_answers.length) {

            // create image in svg
            createCodeToScan(good_answers);

            let p = document.createElement("p");
            p.innerHTML = good_answers + "  (" + year + ", " + class_nr + ")";
            document.getElementById("printed").appendChild(p);

            document.getElementById("print_code").style.display = "block";
        } else {
            document.getElementById("print_code").style.display = "none";
        }
    } else {
        console.log("ERROR: Not found YEAR and CLASS_NR in answers.");
        return false;
    }
}

function countChars() {
    let $s = document.getElementById("answers");
    if ($s) {
        document.getElementById("chars_counter").innerHTML = $s.value.length.toString() + "/30";
    }
}
