from flask import Flask, render_template, make_response

app = Flask(__name__)

@app.route("/<chapter>/<name>/<file>.<ext>")
def example(chapter=None, name=None, file=None, ext=None):
    template = "%s/%s/%s.%s" % (chapter, name, file, ext)
    response = make_response(render_template(template))

    if ext == 'js':
        response.headers['Content-type'] = 'application/javascript'
    elif ext == 'css':
        response.headers['Content-type'] = 'text/css'

    return response

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.debug = True
    app.run()