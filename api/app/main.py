from fastapi import FastAPI
from fastapi import Form, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile
import shutil
from pathlib import Path
import subprocess
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTasks
import json
from typing import Optional

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/testform")
async def testform():
    return FileResponse("testform.html")


class Section(BaseModel):
    title: str
    text: str

class Figure(BaseModel):
    section_index: int
    caption: str
    position: Optional[str] = None # "top", "bottom", "here", None

class Data(BaseModel):
    title: str
    author: str
    abstract: str
    body: list[Section]
    figure: list[Figure]

@app.post("/typeset", response_class=FileResponse)
#@app.get("/typeset")
async def typeset(
    data: str = Form(),
    files: list[UploadFile] = Form(),
    background_tasks: BackgroundTasks = None):

    data = Data.parse_raw(data)
    #print(data)

    def save_file(file, filename):
        with open(filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

    num_sections = len(data.body)
    for fig in data.figure:
        # check if the section index is valid, note that the section index is 1-indexed
        assert fig.section_index <= num_sections
        if fig.position is None:
            fig.position = "h"
        elif fig.position == "top":
            fig.position = "t"
        elif fig.position == "bottom":
            fig.position = "b"
        elif fig.position == "here":
            fig.position = "h"
        assert fig.position in {"t", "b", "h"}

    # generate temporary working directory

    # give a unique name to the working directory
    working_dir = Path(tempfile.mkdtemp())
    print("working_dir:", working_dir)

    # copy files from template to working directory
    for filepath in Path("/template").glob("*"):
        shutil.copy(filepath, working_dir)

    for i in range(5):
        shutil.copy(Path("/template") / f"figure{i + 1}_dummy.png", working_dir / f"fig{i}.png")

    for i, file in enumerate(files):
        if file.size == 0:
            continue
        save_file(file, working_dir / f"fig{i}.png")

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

    figure_head_texts = ["" for _ in range(num_sections)]
    figure_tail_texts = ["" for _ in range(num_sections)]
    for fig_idx, fig in enumerate(data.figure):
        section_idx = fig.section_index - 1 # 1-indexed -> 0-indexed
        fig_filename = f"fig{fig_idx}.png"
        #figure_text = r"\begin{figure}[" + fig.position + "]\n"
        figure_text = r"\begin{figurehere}]" + "\n"
        figure_text += r"\centering" + "\n"
        figure_text += r"\includegraphics[width=0.8\linewidth]{" + fig_filename + "}\n"
        figure_text += r"\caption{" + fig.caption + "}\n"
        #figure_text += r"\end{figure}" + "\n"
        figure_text += r"\end{figurehere}" + "\n"
        if fig.position == "t":
            figure_head_texts[section_idx] += figure_text
        else:
            figure_tail_texts[section_idx] += figure_text

        # save the figure file
        #shutil.copy(f"/template/figure{fig_idx+1}_dummy.png", working_dir / fig_filename)

    body_text = ""
    for section_idx, section in enumerate(data.body):
        body_text += r"\section{" + section.title + "}\n"
        body_text += figure_head_texts[section_idx] + "\n"
        body_text += section.text + "\n"
        body_text += figure_tail_texts[section_idx] + "\n\n"
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
    #return FileResponse(working_dir / "main.tex")

    #return {"title": data.title, "author": data.author, "abstract": data.abstract, "body": data.body}

    return "None"
