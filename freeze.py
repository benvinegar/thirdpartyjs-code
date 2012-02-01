import os
import string

from flask_frozen import Freezer
from examples import app

freezer = Freezer(app)


@freezer.register_generator
def example_url_generator():
    out = []
    for dirname, dirnames, filenames in os.walk(os.path.join('examples', 'templates')):
        if dirnames == []:
            parts = string.split(dirname, os.sep)
            for f in filenames:
                try:
                    out.append(('example', {'chapter': parts[2], 'name': parts[3], 'file': f}))
                except IndexError:
                    # Ignore
                    pass
    return out

if __name__ == '__main__':
    freezer.freeze()
