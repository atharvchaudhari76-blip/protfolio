from flask_frozen import Freezer
from main import app

# Ensure links are relative for GitHub Pages subpaths
app.config['FREEZER_RELATIVE_URLS'] = True
freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()
