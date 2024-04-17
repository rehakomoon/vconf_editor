import tempfile
import shutil
import subprocess
from pathlib import Path
from logging import getLogger

from fastapi import UploadFile
from starlette.background import BackgroundTasks

from app.schemas.paper import Paper

logger = getLogger(__name__)


async def typeset(
    paper: Paper,
    files: list[UploadFile],
    background_tasks: BackgroundTasks = None,
) -> str:

    num_sections = len(paper.body)
    for fig in paper.figure:
        # check if the section index is valid,
        # note that the section index is 1-indexed
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
    logger.info("working_dir:", working_dir)

    # copy files from template to working directory
    for filepath in Path("/template").glob("*"):
        shutil.copy(filepath, working_dir)

    # リクエストされたファイルを保存
    save_files(working_dir, files)

    with open("/template/template.tpl", "r") as f:
        text = f.read()
    # assert "title" in data
    # assert "author" in data
    # assert "abstract" in data
    # assert "body" in data
    # assert isinstance(data["body"], list)

    text = text.replace("<<<title>>>", paper.title)
    text = text.replace("<<<author>>>", paper.author)
    text = text.replace("<<<abstract>>>", paper.abstract)

    figure_head_texts = ["" for _ in range(num_sections)]
    figure_tail_texts = ["" for _ in range(num_sections)]
    for fig_idx, fig in enumerate(paper.figure):
        section_idx = fig.section_index - 1  # 1-indexed -> 0-indexed
        fig_filename = f"fig{fig_idx}.png"
        # figure_text = r"\begin{figure}[" + fig.position + "]\n"
        figure_text = r"\begin{figurehere}]" + "\n"
        figure_text += r"\centering" + "\n"
        figure_text += (
            r"\includegraphics[width=0.8\linewidth]{" + fig_filename + "}\n"
        )  # E501
        figure_text += r"\caption{" + fig.caption + "}\n"
        # figure_text += r"\end{figure}" + "\n"
        figure_text += r"\end{figurehere}" + "\n"
        if fig.position == "t":
            figure_head_texts[section_idx] += figure_text
        else:
            figure_tail_texts[section_idx] += figure_text

        # save the figure file
        # shutil.copy(f"/template/figure{fig_idx+1}_dummy.png", working_dir / fig_filename)

    body_text = ""
    for section_idx, section in enumerate(paper.body):
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

    # return the pdf file path
    return f"{working_dir}/main.pdf"


def save_file(file, filename):
        with open(filename, "wb") as f:
            shutil.copyfileobj(file.file, f)


def save_files(working_dir: Path, files: list[UploadFile]) -> None:
    for i, file in enumerate(files):
        if file.size == 0:
            shutil.copy(
                Path("/template") / f"figure{i + 1}_dummy.png",
                working_dir / f"fig{i}.png",
            )
        else:
            save_file_path = f"{working_dir}/fig{i}.png"
            save_file(file, save_file_path)