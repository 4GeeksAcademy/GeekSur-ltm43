from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from api.models import db
from api.routes import api

app = Flask(__name__)
CORS(app)

# Configurar Base de Datos (Usa SQLite o PostgreSQL según `.env`)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medical.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
