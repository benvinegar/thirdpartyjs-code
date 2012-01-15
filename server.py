from flask import Flask, render_template, make_response

app = Flask(__name__, static_url_path='/examples', static_folder='build')

if __name__ == '__main__':
    app.run()