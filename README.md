# Personal Website

This is my take on a personal website. It's command-line driven with graphical elements for those who feel uncomfortable with the command line.

While it looks a bit like bash initially, it is all written by hand using only javascript and DOM manipulation (with of course HTML and CSS for styling). All commands are custom implemented.

It supports the following:

* `help` to display help message.
* `cd` to change directory.
* `cat` to display contents of file.
* `ls` to list contents of file.
* `clear` to clear the terminal.
* case-insensitive tab autocomplete (works for common use cases, is by no means bulletproof).
* sidebar changes with context i.e. if you `cd` into a directory, you will see the corresponding tabs open in the sidebar.
* terminal context changes with sidebar.
* when clicking through sidebar, will show corresponding terminal commands. Maybe give them a shot!

This may have new features beyond this list, as I may have forgotten to update the README after rewriting.

This site has not been optimized for mobile, so please check it out via a computer! It was designed with the desktop experience in mind. I'll get to mobile optimizations shortly.