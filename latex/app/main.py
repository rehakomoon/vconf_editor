from fastapi import FastAPI
from pydantic import BaseModel
import tempfile
import shutil
from pathlib import Path
import subprocess
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

class Section(BaseModel):
    title: str
    content: str

class Data(BaseModel):
    title: str
    author: str
    abstract: str
    body: list[Section]

@app.post("/typeset/", response_class=FileResponse)
async def typeset(data: Data, background_tasks: BackgroundTasks):
    # generate temporary working directory

    # give a unique name to the working directory
    working_dir = Path(tempfile.mkdtemp())
    print("working_dir:", working_dir)

    # copy files from template to working directory
    for filepath in Path("/template").glob("*"):
        shutil.copy(filepath, working_dir)

    with open("/template/template.tpl", "r") as f:
        text = f.read()
    #assert "title" in data
    #assert "author" in data
    #assert "abstract" in data
    #assert "body" in data
    #assert isinstance(data["body"], list)

    text = text.replace("<<<title>>>", data.title)
    text = text.replace("<<<author>>>", data.author)
    text = text.replace("<<<abstract>>>", data.abstract)

    body_text = ""
    for section in data.body:
        body_text += r"\section{" + section.title + "}\n"
        body_text += section.content + "\n"
    text = text.replace("<<<body>>>", body_text)

    with open(working_dir / "main.tex", "w") as f:
        f.write(text)

    # run latexmk
    subprocess.run(["latexmk", "-C", "main.tex"], cwd=working_dir)
    subprocess.run(["latexmk", "main.tex"], cwd=working_dir)
    subprocess.run(["latexmk", "-c", "main.tex"], cwd=working_dir)

    # remove the working directory after the response is sent
    background_tasks.add_task(shutil.rmtree, working_dir)

    # return the pdf file
    return FileResponse(working_dir / "main.pdf")

    #return {"title": data.title, "author": data.author, "abstract": data.abstract, "body": data.body}
