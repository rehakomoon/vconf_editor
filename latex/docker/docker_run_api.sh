docker run --rm -it -v $PWD/app:/workdir -v $PWD/template:/template -v $PWD/output:/output -p 8000:8000 vconf_editor uvicorn main:app --reload --host=0.0.0.0 --port=8000
