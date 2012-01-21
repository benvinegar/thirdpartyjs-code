import time
import flask
import json
from flask import Flask, make_response, request

app = Flask(__name__, static_url_path='/examples', static_folder='build')


@app.route('/slow')
def slow():
    """
    Wait 3 seconds before redirecting to the requested resource
    """
    time.sleep(3)
    return flask.redirect(request.args.get('url'))


@app.route('/echo.jsonp')
def jsonp():
    """
    Returns the passed query string args via JSONP.
    """
    return "%s(%s)" % (request.args.get('callback'), json.dumps(request.args))


@app.route('/cors')
def cors():
    r = make_response(json.dumps(request.args))

    # Must match requesting Origin or *
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r


@app.route('/login',  methods=['POST'])
def login():
    """
    Sets a cookie
    """
    # return flask.redirect('/examples/06/auth-new-window/success.html')
    r = make_response(flask.redirect('/examples/06/auth-new-window/success.html'))
    r.set_cookie('session_id', 'abcdef123456')
    return r

if __name__ == '__main__':
    app.run()
