from flask_frozen import Freezer
from main import app
import os

# Configure Flask to work with Flask-Frozen
app.config['FREEZER_DESTINATION'] = 'build'
app.config['FREEZER_RELATIVE_URLS'] = True
app.config['FREEZER_BASE_URL'] = 'https://atharvchaudhari76-blip.github.io/portfolio/'

freezer = Freezer(app)

@freezer.register_generator
def generate_static_routes():
    """Generate all static routes"""
    yield 'home'

if __name__ == '__main__':
    freezer.freeze()
    print("✓ Portfolio build complete!")
    print("  Build directory: build/")
