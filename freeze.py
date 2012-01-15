import os
import string

from flask_frozen import Freezer
from examples import app

freezer = Freezer(app)

@freezer.register_generator
def example_url_generator():
	out = [];
	for dirname, dirnames, filenames in os.walk('examples/templates'):
		if dirnames == []:
			parts = string.split(dirname, '/')
			for f in filenames:
				out.append(('example', {'chapter':parts[2], 'name':parts[3], 'file':f}))
	return out

if __name__ == '__main__':
    freezer.freeze()