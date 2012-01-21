# Third-party JavaScript - the code #

This repository contains companion source code to [Third-party JavaScript](http://thirdpartyjs.com), written by Ben Vinegar and Anton Kovalyov and available via [Manning Publishing](http://manning.com/vinegar).

The examples correspond to material from the book, and mostly illustrate third-party scripting concepts.

Feedback and comments are welcome.

![Third-party JavaScript](http://github.com/thirdpartyjs/thirdpartyjs-code/raw/master/book.png)

## Install instructions

Install Python (already pre-installed on OS X).

Install the Frozen-Flask Python package.

```$ easy_install Frozen-Flask```

Build the source code examples:

```$ python freeze.py```

Add the following entries to your hosts file (```/etc/hosts``` on OS X, Linux):

```sh
publisher.dev 127.0.0.1
proxy.publisher.dev 127.0.0.1
widget.dev 127.0.0.1
```

Run the embedded server:

```$ python server.py```

Once the server is running, access the examples through http://publisher.dev/examples/index.html.

## Need help?

Visit Manning's Author Online forums for this book: http://www.manning-sandbox.com/forum.jspa?forumID=791