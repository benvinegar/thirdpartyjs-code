# Third-party JavaScript - the code #

This repository contains companion source code to [Third-party JavaScript](http://thirdpartyjs.com), written by Ben Vinegar and Anton Kovalyov and available via [Manning Publishing](http://manning.com/vinegar).

The examples correspond to material from the book, and mostly illustrate third-party scripting concepts.

Feedback and comments are welcome.

![Third-party JavaScript](http://github.com/thirdpartyjs/thirdpartyjs-code/raw/master/book.png)

## Install instructions

You'll need both Python and its packaging library, setuptools, in order to build and serve the example code. On OS X, these come pre-installed. On Windows? See <a href="#windows">Windows Instructions</a> first.

1) Install the Frozen-Flask Python package.

```$ easy_install Frozen-Flask```

2) Build the source code examples:

```$ python freeze.py```

3) Add the following entries to your <a href="http://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system">hosts</a> file:

```
127.0.0.1 publisher.dev
127.0.0.1 proxy.publisher.dev
127.0.0.1 widget.dev
```

4) Run the embedded server:

```$ python server.py```

Once the server is running, access the examples through http://publisher.dev:5000/examples/index.html.

<a name="windows"/>

## Installing Python on Windows

Download and install Python 2.7.x from the <a href="http://python.org/getit/">Python download page</a>.

Next, setuptools. Download and run the 2.7.x installer from: http://pypi.python.org/pypi/setuptools#downloads

Afterwards, you'll need to add both the Python directory (C:\Python27) and the scripts directory (C:\Python27\Scripts) to your PATH. To do this, go to My Computer ‣ Properties ‣ Advanced ‣ Environment Variables.

You should now be able to run the 'python' and 'easy_install' executables from the Windows shell. Success!

## Need help?

Visit Manning's Author Online forums for this book: http://www.manning-sandbox.com/forum.jspa?forumID=791
