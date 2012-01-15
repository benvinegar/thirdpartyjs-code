import string
from flask import Flask, render_template, make_response
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_url_path='/common')

app.config.update(
    FREEZER_DEFAULT_MIMETYPE='text/html',
    FREEZER_DESTINATION='../build',
    FREEZER_BASE_URL='/examples'
)

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


app.url_map.converters['regex'] = RegexConverter

@app.route('/<regex("[0-9]{2}"):chapter>/<name>/<file>')
def example(chapter=None, name=None, file=None):
    template = "%s/%s/%s" % (chapter, name, file)

    response = make_response(render_template(template))

    try:
        ext = string.split(file, '.')[-1]
        if ext == 'js' or ext == 'jsonp':
            response.headers['Content-type'] = 'application/javascript'
        elif ext == 'css':
            response.headers['Content-type'] = 'text/css'
    except Exception:
        pass

    return response

@app.route("/")
def index():
    return render_template('index.html')
