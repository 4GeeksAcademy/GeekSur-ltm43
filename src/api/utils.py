from flask import jsonify, url_for
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Configurar Cloudinary con las credenciales del archivo .env
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

# Función para subir imágenes a Cloudinary
def upload_image(file):
    try:
        response = cloudinary.uploader.upload(file, folder="doctors_photos")
        return response["secure_url"]
    except Exception as e:
        raise Exception(f"Error uploading image to Cloudinary: {str(e)}")

# Función para eliminar imágenes de Cloudinary
def delete_image(image_url):
    try:
        if not image_url:
            return
        # Extraer el public_id de la URL de la imagen
        # Ejemplo de URL: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/doctors_photos/<public_id>.jpg
        public_id = image_url.split("/")[-1].split(".")[0]  # Obtener el nombre del archivo sin extensión
        public_id = f"doctors_photos/{public_id}"  # Agregar la carpeta
        cloudinary.uploader.destroy(public_id)
    except Exception as e:
        raise Exception(f"Error deleting image from Cloudinary: {str(e)}")