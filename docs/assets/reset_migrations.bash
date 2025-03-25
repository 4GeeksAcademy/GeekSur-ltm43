rm -R -f ./migrations &&
pipenv run init &&
dropdb -h localhost -U gitpod example || true &&
createdb -h localhost -U gitpod example || true &&
psql -h localhost example -U gitpod -c 'CREATE EXTENSION unaccent;' || true &&
pipenv run migrate &&
pipenv run upgrade && 
flask insert-test-data &&
flask insert-test-medical-centers &&
flask insert-test-doctors &&
flask insert-test-specialties-and-appointments &&
flask insert-test-reviews

