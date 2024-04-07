import yaml
from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_typeset():
    with open("/template/input_data.yaml", "r") as f:
        data = yaml.safe_load(f)
    response = client.post("/typeset/", json=data)
    assert response.status_code == 200
