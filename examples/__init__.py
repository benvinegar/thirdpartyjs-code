import string
from flask import Flask, render_template, make_response, url_for
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_url_path='/common')

app.config.update(
    FREEZER_DEFAULT_MIMETYPE='text/html',
    FREEZER_DESTINATION='../build',
    FREEZER_BASE_URL='/examples',
    FREEZER_IGNORE_MIMETYPE_WARNINGS=True
)

PUBLISHER_DOMAIN = 'publisher.dev'

PUBLISHER_URL = 'http://publisher.dev:5000'
PUBLISHER_PROXY_URL = 'http://proxy.publisher.dev:5000'
SERVICE_URL = 'http://widget.dev:5000'


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
            response.headers['Content-type'] = 'application/x-javascript'
        if ext == 'json':
            response.headers['Content-type'] = 'application/x-json'
        elif ext == 'css':
            response.headers['Content-type'] = 'text/css'
    except Exception:
        pass

    return response


@app.route("/index.html")
def index():
    return render_template('index.html')


#================================================
# URL Helpers
#================================================

def publisher_url_for(*args, **kwargs):
    return PUBLISHER_URL + url_for(*args, **kwargs)


def publisher_proxy_url_for(*args, **kwargs):
    return PUBLISHER_PROXY_URL + url_for(*args, **kwargs)


def service_url_for(*args, **kwargs):
    return SERVICE_URL + url_for(*args, **kwargs)


@app.context_processor
def inject_url_helpers():
    return {
        'publisher_url_for': publisher_url_for,
        'publisher_proxy_url_for': publisher_proxy_url_for,
        'service_url_for': service_url_for,

        'publisher_url': PUBLISHER_URL,
        'publisher_proxy_url': PUBLISHER_PROXY_URL,
        'service_url': SERVICE_URL,

        'publisher_domain': PUBLISHER_DOMAIN
    }


# You can run this application as a server for debugging purposes.

if __name__ == '__main__':
    app.debug = True
    app.run()
