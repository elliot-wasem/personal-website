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
        var ret_str = ""
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
            output = "<table>\
                        <tr>\
                           <td>cat [file]</td>\
                           <td>&nbsp→&nbsp</td>\
                           <td>display contents of file</td>\
                        </tr>\
                        <tr>\
                           <td>cd [target dir]</td>\
                           <td>&nbsp→&nbsp</td>\
                           <td>change directory to target dir</td>\
                        </tr>\
                        <tr>\
                           <td>clear</td>\
                           <td>&nbsp→&nbsp</td>\
                           <td>clear terminal</td>\
                        </tr>\
                        <tr>\
                           <td>help</td>\
                           <td>&nbsp→&nbsp</td>\
                           <td>display this dialog again</td>\
                        </tr>\
                        <tr>\
                           <td>ls</td>\
                           <td>&nbsp→&nbsp</td>\
                           <td>list current directory</td>\
                        </tr>\
                    </table>"
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
dexterity.contents = "<div class=\"textdoc\">\
<br/>\
<a href='mailto:elliot@dexteritydb.com'>elliot@dexteritydb.com</a>\
<br /><br />\
<strong>Software Developer at DexterityDB</strong>\
<br />\
Hoboken, NJ\
<br />\
April 2018 to present\
<br /><br />\
Software developer for a database engine startup.\
<ul>\
  <li>Create architectures, implement, test, and document new software</li>\
  <li>Consult on business planning and strategy</li>\
  <li>Assist in creating development tools such as build/test servers, website design, etc.</li>\
</ul></div>";

var researchassistant = new File("ResearchAssistant.txt");
researchassistant.contents = "<div class=\"textdoc\">\
</br>\
<strong>Researched eBPF in Linux Environment</strong>\
<br />\
Hoboken, NJ\
<br />\
January 2019 to April 2019\
<br />\
Research Assistant under Dr. Antonio Barbalace\
<ul>\
  <li>Worked on identifying possibilities of extending eBPF to other parts of the Linux kernel</li>\
  <li>Setup and managed in-house servers on which to run experiments</li>\
  <li>Created and maintained bash scripts to automate our experimentation process</li>\
  <li>Ran experiments involving his previous work</li>\
</ul></div>";

var courseassistant = new Directory(employment, "CourseAssistantships");

var introToWebProgramming = new File("IntroToWeb.txt");
introToWebProgramming.contents = "<div class=\"textdoc\">\
<br/>\
<strong>Course Assistant for Intro to Web Programming & Web Development</strong>\
<br />\
Hoboken, NJ<br />August 2018 to December 2018\
<br />\
<br />\
Course assistant under Dr. Iraklis Tsekourakis\
<ul>\
<li>Instruct students in the fundamentals of web programming and web development</li>\
<li>Grade students' assignments</li>\
<li>Help students more fully understand material they find difficult</li>\
</ul></div>";

var databaseManagementSystems = new File("DatabaseManagement.txt");
databaseManagementSystems.contents = "<div class=\"textdoc\">\
<br />\
<strong>Course Assistant for Database Management Systems</strong>\
<br />\
Hoboken, NJ\
<br />\
August 2018 to December 2018,</br>August 2019 to December 2019\
<br />\
<br />\
Course assistant under Dr. Hui Wang\
<ul>\
<li>Instruct students in the fundamentals of database design and implementation</li>\
<li>Grade students' assignments</li>\
<li>Led in-class lab sessions to help students understand the technical implementations of designing and querying a database</li>\
</ul></div>";

var concurrent = new File("ConcurrentProgramming.txt")
concurrent.contents = "<div class=\"textdoc\">\
<br />\
<strong>Course Assistant for Concurrent Programming</strong>\
<br />\
Hoboken, NJ\
<br />\
August 2019 to December 2019\
<br />\
<br />\
Course assistant under Dr. Eduardo Bonelli\
<ul>\
<li>Designed assignments for students to teach them the topics of message passing and concurrent programming</li>\
<li>Instruct students in fundamental topics surrounding concurrent programming, model checking, and message passing</li>\
<li>Grade students' assignments</li>\
<li>Held office hours for students who needed further clarification on the topics</li>\
</ul></div>";

var algorithms = new File("Algorithms.txt");
algorithms.contents = "<div class=\"textdoc\">\
<br />\
<strong>Course Assistant for Algorithms</strong>\
<br />\
Hoboken, NJ\
<br />\
January 2019 to May 2019\
<br />\
<br />\
Course Assistant under Dr. Iraklis Tsekourakis\
<ul>\
<li>Instruct students in algorithm design, complexity, and implementation in C++, with focus on optimizing time complexity and writing stable, safe code</li>\
<li>Grade students' assignments</li>\
<li>Held office hours, workshops, and seminars to expand the students' understanding of the material</li>\
</ul></div>";

courseassistant.addFile(algorithms);
courseassistant.addFile(concurrent);
courseassistant.addFile(databaseManagementSystems);
courseassistant.addFile(introToWebProgramming);

var marketsource = new File("MarketSource.txt");
marketsource.contents = "<div class=\"textdoc\">\
<br/><strong>Target Mobile Wireless Team Lead</strong><br />\
Princeton, NJ<br />\
October 2015 to November 2016<br /><br />\
Sales team lead for sales of cellphones, wireless plans, and home services.\
<ul>\
<li>Hired new team members and set up schedule for store</li>\
<li>Managed accounts for Verizon Wireless, AT&T, Sprint, and Comcast Xfinity</li>\
<li>Maintained relations with Target Management to ensure effective sales flow, fraud prevention, team participation, and attentiveness to detail</li>\
<li>Acted as Target’s tech expert</li>\
</ul></div>";

employment.addFile(dexterity);
employment.addFile(researchassistant);
employment.addFile(courseassistant);
employment.addFile(marketsource);

var education = new Directory(currentDir, "Education");

var stevens = new File("StevensInstitute.txt");
stevens.contents = "<div class=\"textdoc\">\
<br /><strong>Stevens Institute of Technology</strong><br />\
Bachelor of Science in Computer Science<br />\
Hoboken, NJ<br />\
Graduating May 2020<br />\
GPA: 3.51<br /><br />\
<strong>Major Subjects</strong>:<br />\
<ul>\
  <li>Discrete Structures</li>\
  <li>Automata and Computation</li>\
  <li>Algorithms</li>\
  <li>Systems Programming</li>\
  <li>Programming Languages</li>\
  <li>Intro to Web Programming and Development</li>\
  <li>Intro to IT Security</li>\
  <li>Software Development Process</li>\
  <li>Concurrent Programming</li>\
  <li>Agile Methods in Software Development</li>\
  <li>Operating Systems</li>\
  <li>Linear Algebra</li>\
  <li>Creative Problem Solving and Team Programming</li>\
</ul>\
</div>";

var mercer = new File("MercerCounty.txt");
mercer.contents = "<div class=\"textdoc\">\
<br /><strong>Mercer County Community College</strong><br />\
West Windsor, New Jersey<br /><br />\
<strong>Major Subjects</strong>:<br />\
<ul>\
  <li>Intro to Computer Science</li>\
  <li>Intro to Programming</li>\
  <li>Data Structures</li>\
  <li>Computer Architecture</li>\
</ul>\
</div>";

education.addFile(stevens);
education.addFile(mercer);

var skills = new Directory(currentDir, "Skills");

var proglangs = new File("ProgrammingLanguages.txt");
proglangs.contents = "<div class=\"textdoc\">\
<ul>\
  <li>Rust</li>\
  <li>C</li>\
  <li>C++</li>\
  <li>Python</li>\
  <li>Shell Script (BASH primarily)</li>\
  <li>Java</li>\
  <li>Erlang</li>\
  <li>HTML</li>\
  <li>CSS</li>\
  <li>JavaScript</li>\
  <li>OCaml</li>\
  <li>Scheme</li>\
  <li>AVR Assembly</li>\
  <li>Promela</li>\
</ul>\
</div>";

var software = new File("Software.txt");
software.contents = "<div class=\"textdoc\">\
<ul>\
  <li>Linux</li>\
  <li>Windows</li>\
  <li>Google Cloud Services</li>\
  <li>Microsoft Office</li>\
  <li>Google G Suite</li>\
  <li>Sublime Text 3</li>\
  <li>Eclipse IDE</li>\
  <li>GitHub/GitLab</li>\
  <li>GIMP</li>\
  <li>VSCode</li>\
  <li>Vim</li>\
  <li>Emacs</li>\
  <li>Spin</li>\
  <li>jSpin</li>\
</ul>\
</div>";

var other = new File("OtherSkills.txt");
other.contents = "<div class=\"textdoc\">\
<ul>\
  <li>Remote server management</li>\
  <li>Systems development</li>\
  <li>Linux system administration</li>\
  <li>Model checking</li>\
</ul>\
</div>";

skills.addFile(proglangs);
skills.addFile(software);
skills.addFile(other);

var contact = new Directory(currentDir, "Contact");

var email = new File("email.txt");
email.contents = "<br /><a href='ewasem@stevens.edu'>ewasem@stevens.edu</a>";
var github = new File("GitHub.txt");
github.contents = "<br/><a href='https://github.com/elliot-wasem'>https://github.com/elliot-wasem</a>";
var linkedin = new File("LinkedIn.txt");
linkedin.contents = "<br/><a href='https://www.linkedin.com/in/elliot-wasem/'>https://www.linkedin.com/in/elliot-wasem/</a>";

contact.addFile(email);
contact.addFile(github);
contact.addFile(linkedin);

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
    main_entry.focus();
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
    main_entry.focus();
}
function clickAssistantJob(job) {
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name !== "CourseAssistantships") {
        main_entry.value = "cd CourseAssistantships";
        get_entry();
    }
    main_entry.value = "cat " + job;
    get_entry();
    main_entry.focus();
}
function clickJob(job) {
    var main_entry = document.getElementById("main-entry");
    if (currentDir.name === "CourseAssistantships") {
        main_entry.value = "cd ..";
        get_entry();
    }
    main_entry.value = "cat " + job;
    get_entry();
    main_entry.focus();
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
    main_entry.focus();
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
    main_entry.focus();
}
function clickFile(file) {
    var main_entry = document.getElementById("main-entry");
    main_entry.value = "cat " + file;
    get_entry();
    main_entry.focus();
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
    main_entry.focus();
}
