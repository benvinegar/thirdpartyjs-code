import time
import flask
import json
from flask import Flask, render_template, make_response, request

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

if __name__ == '__main__':
    app.run()