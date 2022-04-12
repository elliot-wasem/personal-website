class Directory {
    /**
     * Represents a "directory" as it were.
     * 
     * @param {Directory} parent Parent Directory of this Directory
     * @param {String} name Name of the directory in question
     */

    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.children = [];
    }
    /**
     * Set `name` property of this `Directory`
     * 
     * @param {String} name New name
     */
    setName(name) {
        this.name = name;
    }
    /**
     * Set `parent` property of this `Directory`.
     * 
     * @param {Directory} parent New parent
     */
    setParent(parent) {
        this.parent = parent;
    }
    /**
     * Adds a child `Directory` to the list of children of this `Directory`.
     * 
     * @param {Directory} child New child Directory of this Directory
     */
    addChild(child) {
        this.children.push(child);
        child.setParent(this);
    }
    /**
     * Adds a child `File` to the list of children of this `Directory`
     * 
     * @param {File} file New child `File` of this `Directory`
     */
    addFile(file) {
        this.children.push(file);
    }
    /**
     * Returns a `String` representing the full filepath from root (`/`) to the current `Directory`.
     */
    getParentsString() {
        if (this.parent == null) {
            return ""
        }
        return this.parent.getParentsString() + "/" + this.name;
    }
    /**
     * Returns a `String` representing the children of the current `Directory`.
     */
    getChildrenString() {
        var children_str = "";
        this.children.forEach(item => children_str += "<br/>" + (item instanceof Directory ? item.name + "/" : item.name));
        return children_str;
    }
    /**
     * Debug function that just logs the `name` properties of all child
     * `File`s and `Directory`s to the console.
     */
    printChildrenDebug() {
        this.children.forEach(item => console.log(item.name));
    }
    /**
     * Function that returns `true` if parameter `name` is equal to the `name`
     * property of any `Directory` that is a child of current `Directory`.
     * 
     * @param {String} name alleged name of `Directory`
     */
    isChildDirectory(name) {
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name === name) {
                return (this.children[i] instanceof Directory);
            }
        }
        return false;
    }
    /**
     * Returns a `Directory` object with `this.name` === parameter `name`.
     * 
     * THIS FUNCTION ASSUMES THE DIRECTORY EXISTS, i.e. caller has already
     * checked with `isChildDirectory()`
     * 
     * @param {String} name Name of `Directory` to return.
     */
    getDir(name) {
        // assumes that directory is child of currentDir
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name === name) {
                return this.children[i];
            }
        }
    }
    /**
     * Function that returns `true` if parameter `name` is equal to the `name`
     * property of any `File` that is a child of current `Directory`.
     * 
     * @param {String} name alleged name of `File`
     */
    isChildFile(filename) {
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name === filename) {
                return (this.children[i] instanceof File);
            }
        }
        return false;
    }
    /**
     * Returns a `String` of the `contents` of `File` with
     * `this.name` === parameter `name`.
     * 
     * THIS FUNCTION ASSUMES THE FILE EXISTS, i.e. caller has already
     * checked with `isChildFile()`
     * 
     * @param {String} name Name of `File` to return.
     */
    getFileContents(filename) {
        // assumes that file is child of currentDir
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name === filename) {
                return this.children[i].contents;
            }
        }
    }
    /**
     * Counts the number of children of the current `Directory` whose `name`
     * property starts with `currInput`, ignoring case.
     * 
     * @param {String} currInput `String` against which to match
     */
    countMatches(currInput) {
        var count = 0;
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name.toUpperCase().startsWith(currInput.toUpperCase())) {
                count++;
            }
        }
        return count;
    }
    /**
     * Returns a string representing the children of the current `Directory`
     * whose `name` property starts with `currInput`, ignoring case.
     * 
     * @param {String} currInput `String` against which to match
     */
    listMatching(currInput) {
        var ret_str = "";
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name.toUpperCase().startsWith(currInput.toUpperCase())) {
                ret_str += (ret_str.length == 0 ? this.children[i].name : "<br/>" + this.children[i].name);
                if (this.children[i] instanceof Directory) {
                    ret_str += "/";
                }
            }
        }
        return ret_str;
    }
    /**
     * Returns the `name` of the first child `File` or `Directory` of
     * the current `Directory` whose `name` property begins with the
     * parameter `currInput`.
     * 
     * Best to use this function only if you know there is exactly one
     * match. Use `countMatches()` to determine this.
     * 
     * @param {String} currInput `String` against which to match
     */
    findTabMatch(currInput) {
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            if (this.children[i].name.toUpperCase().startsWith(currInput.toUpperCase())) {
                return this.children[i].name;
            }
        }
        return currInput;
    }
}

/**
 * Represents a "File", just holds a `String` `name` and the `contents` of the file
 * which is an `HTML` `String`.
 */
class File {
    /**
     * Create a new `File`, with name `name`.
     * 
     * @param {String} name Name of the File (File.txt, Foo.bar, what have you.)
     */
    constructor(name) {
        this.name = name;
        this.contents = "";
    }
}

/**
 * gets the contents of the input, along with the prompt, and appends it to the history.
 */
function get_entry() {
    // grabs main-entry element
    var entry_elem = document.getElementById("main-entry");
    // grabs prompt element
    var prompt_elem = document.getElementById("prompt");
    // updates prompt
    if (currentDir.name == "root") {
        prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~/</span>]<br/>$  ";
    } else {
        prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~" + currentDir.getParentsString() + "</span>]<br/>$  ";
    }
    // gets the contents of the text entry. The part in replace just removes html tags
    var entry_content = entry_elem.value.replace(/(<([^>]+)>)/ig,"");

    // this is annoyingly needed to make 'help' line up properly in the history
    var breaks = "<br/><br/>";
    console.log(last_cmd);
    if (last_cmd === "help") {
        console.log("good");
        breaks = "<br/>";
    }

    // appends the prompt and input entry to the history
    document.getElementById("hist").innerHTML += breaks + prompt_elem.innerHTML
        + entry_content
        + handle_input(entry_content);
    last_cmd = entry_content;
    entry_elem.value = "";
    if (entry_content === "clear") {
        document.getElementById("hist").innerHTML = "Start typing...";
    }
    // scroll back to bottom
    self.scrollTo(0, document.body.scrollHeight);
    return;
}

function handle_input(input) {
    var input_toks = input.split(/[ ]+/);
    if (input_toks[input_toks.length - 1] === "") {
        input_toks.pop();
    }
    var output = "";
    var cmd = input_toks[0];
    switch (cmd) {
        case "":
            output = "";
            break;
        case "help":
            output = helpcontents;
            break;
        case "ls":
            output = currentDir.getChildrenString();
            break;
        case "cd":
            output = handle_cd(input_toks.slice(1));
            break;
        case "cat":
            output = handle_cat(input_toks.slice(1));
            break;
        case "clear":
            break;
        default:
            if (cmd != undefined){
                output = "<br/>command '" + cmd + "' not found!";
            }
            break;
    }
    // update sidebar
    collapseAll();
    switch(currentDir.name) {
    case "Employment":
        var showelems = document.querySelectorAll('.employment-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        break;
    case "CourseAssistantships":
        var showelems = document.querySelectorAll('.employment-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        showelems = document.querySelectorAll('.courseassistant-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        break;
    case "Education":
        showelems = document.querySelectorAll('.education-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        break;
    case "Skills":
        showelems = document.querySelectorAll('.skills-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        break;
    case "Contact":
        showelems = document.querySelectorAll('.contact-children');
        for (var i = 0; i < showelems.length; i++) {
            showelems[i].style.display = "block";
        }
        break;
    default:
        break;

    }
    return output;
}

function handle_cd(args) {
    var ret_val = "";
    //currentDir.printChildrenDebug();
    if (args.length != 1) {
        ret_val = "<br/>cd: Bad argument number.";
    } else if (args[0] === "..") {
        if (currentDir.parent != null) {
            currentDir = currentDir.parent;
        }
    } else if (args[0] === "~") {
        while (currentDir.parent != null) {
            currentDir = currentDir.parent;
        }
    } else if (currentDir.isChildDirectory(args[0])) {
        currentDir = currentDir.getDir(args[0]);
    } else {
        ret_val = "<br/>cd: directory '" + args[0] + "' not found!";
    }
    document.getElementById("prompt").innerHTML = "[" + user_host + " <span class='path'>~" + (currentDir.name === "root" ? "/" : currentDir.getParentsString()) + "</span>]<br/>$  ";
    return ret_val;
}
function handle_cat(args) {
    if (args.length != 1) {
        return "<br/>cat: Bad argument number.";
    }
    filename = args[0];
    if (currentDir.isChildFile(filename)) {
        return "<br/>" + currentDir.getFileContents(filename);
    } else {
        return "<br/>file '" + filename + "' not found!";
    }
}

var user_host = "<span class='path'>guest@elliot-wasem</span>";
document.getElementById("prompt").innerHTML = "[" + user_host + " <span class='path'>~/</span>]<br/>$  ";
var currentDir = new Directory(null, "root");

var last_cmd = "";

var employment = new Directory(currentDir, "Employment");

var dexterity = new File("DexterityDB.txt");
dexterity.contents = dexteritycontents;

var researchassistant = new File("ResearchAssistant.txt");
researchassistant.contents = researchassistantcontents;

var courseassistant = new Directory(employment, "CourseAssistantships");

var introToWebProgramming = new File("IntroToWeb.txt");
introToWebProgramming.contents = introToWebProgrammingContents;

var databaseManagementSystems = new File("DatabaseManagement.txt");
databaseManagementSystems.contents = databaseManagementSystemsContents;

var concurrent = new File("ConcurrentProgramming.txt");
concurrent.contents = concurrentcontents;

var algorithms = new File("Algorithms.txt");
algorithms.contents = algorithmscontents;

var systems = new File("Systems.txt");
systems.contents = systemscontents;

courseassistant.addFile(algorithms);
courseassistant.addFile(concurrent);
courseassistant.addFile(databaseManagementSystems);
courseassistant.addFile(introToWebProgramming);
courseassistant.addFile(systems);

var marketsource = new File("MarketSource.txt");
marketsource.contents = marketsourcecontents;

var dexgroup = new File("DexGroup.txt");
dexgroup.contents = dexgroupcontents;

var wisEngineering = new File("WisEngineering.txt");
wisEngineering.contents = wisengineeringcontents;

var l3harris = new File("L3Harris.txt");
l3harris.contents = l3harriscontents;

var tutoring = new File("TutoringServices.txt");
tutoring.contents = tutoringcontents;

employment.addFile(l3harris);
employment.addFile(tutoring);
employment.addFile(wisEngineering);
employment.addFile(dexgroup);
employment.addFile(dexterity);
employment.addFile(researchassistant);
employment.addFile(courseassistant);
employment.addFile(marketsource);

var education = new Directory(currentDir, "Education");

var stevens = new File("StevensInstitute.txt");
stevens.contents = stevenscontents;

var mercer = new File("MercerCounty.txt");
mercer.contents = mercercontents;

education.addFile(stevens);
education.addFile(mercer);

var skills = new Directory(currentDir, "Skills");

var proglangs = new File("ProgrammingLanguages.txt");
proglangs.contents = proglangscontents;

var software = new File("Software.txt");
software.contents = softwarecontents;

var other = new File("OtherSkills.txt");
other.contents = othercontents;

skills.addFile(proglangs);
skills.addFile(software);
skills.addFile(other);

var contact = new Directory(currentDir, "Contact");

var email = new File("Email.txt");
email.contents = "<br /><a href='elliotbielwasem@gmail.com'>elliotbielwasem@gmail.com</a>";
var github = new File("GitHub.txt");
github.contents = "<br/><a href='https://github.com/elliot-wasem'>https://github.com/elliot-wasem</a>";
var linkedin = new File("LinkedIn.txt");
linkedin.contents = "<br/><a href='https://www.linkedin.com/in/elliot-wasem/'>https://www.linkedin.com/in/elliot-wasem/</a>";

contact.addFile(email);
contact.addFile(github);
contact.addFile(linkedin);

var about = new File("About.txt");
about.contents = aboutcontents;

currentDir.addFile(about);
currentDir.addChild(employment);
currentDir.addChild(education);
currentDir.addChild(skills);
currentDir.addChild(contact);

document.getElementById("main-entry").focus();

var main_input = document.getElementById("main-entry");
if (main_input.addEventListener) {
    main_input.addEventListener('keydown', this.keyHandler, false);
} else if (myInput.attachEvent) {
    myInput.attachEvent('onkeydown', this.keyHandler); /* damn IE hack */
}

function matchCommand(cmd) {
    var cmdlist = [ "cat ", "cd ", "clear ", "help ", "ls " ];
    var len = cmdlist.length;
    var count_match = 0;
    var match = "";
    for (var i = 0; i < len; i++) {
        if (cmdlist[i].startsWith(cmd)) {
            count_match++;
            match = cmdlist[i];
        }
    }
    var entry_elem = document.getElementById("main-entry");
    var prompt_elem = document.getElementById("prompt");
    if (currentDir.name == "root") {
        prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~/</span>]<br/>$  ";
    } else {
        prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~" + currentDir.getParentsString() + "</span>]<br/>$  ";
    }
    if (count_match == 1) {
        return match;
    } else if (count_match > 1){
        document.getElementById("hist").innerHTML += "<br/><br/>"+prompt_elem.innerHTML + cmd;
        for (var i = 0; i < len; i++) {
            if (cmdlist[i].startsWith(cmd)) {
                document.getElementById("hist").innerHTML += "<br/>" + cmdlist[i];
            }
        }
        return cmd;
    } else {
        document.getElementById("hist").innerHTML += "<br/><br/>"+prompt_elem.innerHTML + cmd;
        for (var i = 0; i < len; i++) {
            document.getElementById("hist").innerHTML += "<br/>" + cmdlist[i];
        }
        return cmd;
    }
}

function keyHandler(e) {
    var TABKEY = 9;
    if (e.keyCode == TABKEY) {
        // handle tab here
        if (e.preventDefault) {
            val_toks = this.value.split(/[ ]+/);
            if (val_toks.length == 1) {
                this.value = matchCommand(val_toks[0]);
            } else if (currentDir.countMatches(val_toks[val_toks.length - 1]) > 1) {
                var entry_elem = document.getElementById("main-entry");
                var prompt_elem = document.getElementById("prompt");
                if (currentDir.name == "root") {
                    prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~/</span>]<br/>$  ";
                } else {
                    prompt_elem.innerHTML = "[" + user_host + " <span class='path'>~" + currentDir.getParentsString() + "</span>]<br/>$  ";
                }
                var entry_content = entry_elem.value;
                document.getElementById("hist").innerHTML += "<br/><br/>" + prompt_elem.innerHTML
                    + entry_content
                    + "<br/>"
                    + currentDir.listMatching(val_toks[val_toks.length - 1]);
            } else if (currentDir.countMatches(val_toks[val_toks.length - 1]) == 1) {
                val_toks[val_toks.length - 1] = currentDir.findTabMatch(val_toks[val_toks.length - 1]);
                this.value = val_toks.join(" ") + " ";
            }
            e.preventDefault();
            self.scrollTo(0, document.body.scrollHeight);
        }
        return false;
    }
}

function collapseAll() {
    var showelems = document.querySelectorAll('.employment-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "none";
    }
    showelems = document.querySelectorAll('.courseassistant-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "none";
    }
    showelems = document.querySelectorAll('.education-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "none";
    }
    showelems = document.querySelectorAll('.skills-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "none";
    }
    showelems = document.querySelectorAll('.contact-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "none";
    }
}
function clickAbout() {
    collapseAll();
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name !== "root") {
        main_entry.value = "cd ~";
        get_entry();
    }
    main_entry.value = "cat About.txt";
    get_entry();
}
function clickEmployment() {
    collapseAll();
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name !== "Employment"){
        main_entry.value = "cd ~";
        get_entry();
        main_entry.value = "cd Employment";
        get_entry();
    }
    var showelems = document.querySelectorAll('.employment-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "block";
    }
    //main_entry.focus();
}
function clickCourseAssistant() {
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name !== "CourseAssistantships") {
        main_entry.value = "cd CourseAssistantships";
        get_entry();
    }
    var showelems = document.querySelectorAll('.courseassistant-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "block";
    }
    //main_entry.focus();
}
function clickAssistantJob(job) {
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name !== "CourseAssistantships") {
        main_entry.value = "cd CourseAssistantships";
        get_entry();
    }
    main_entry.value = "cat " + job;
    get_entry();
    //main_entry.focus();
}
function clickJob(job) {
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name === "CourseAssistantships") {
        main_entry.value = "cd ..";
        get_entry();
    }
    main_entry.value = "cat " + job;
    get_entry();
    //main_entry.focus();
}
function clickEducation() {
    collapseAll();
    var main_entry = document.getElementById("main-entry");
    main_entry.value = "cd ~";
    get_entry();
    main_entry.value = "cd Education";
    get_entry();
    var showelems = document.querySelectorAll('.education-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "block";
    }
    //main_entry.focus();
}
function clickSkills() {
    collapseAll();
    var main_entry = document.getElementById("main-entry");
    main_entry.value = "cd ~";
    get_entry();
    main_entry.value = "cd Skills";
    get_entry();
    var showelems = document.querySelectorAll('.skills-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "block";
    }
    //main_entry.focus();
}
function clickFile(file) {
    var main_entry = document.getElementById("main-entry");
    main_entry.value = "cat " + file;
    get_entry();
    //main_entry.focus();
}
function clickContact() {
    collapseAll();
    var main_entry = document.getElementById("main-entry");
    main_entry.value = "cd ~";
    get_entry();
    main_entry.value = "cd Contact";
    get_entry();
    var showelems = document.querySelectorAll('.contact-children');
    for (var i = 0; i < showelems.length; i++) {
        showelems[i].style.display = "block";
    }
    //main_entry.focus();
}
