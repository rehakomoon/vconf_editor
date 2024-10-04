import shutil
import subprocess
import tempfile
from logging import getLogger
from pathlib import Path

from fastapi import UploadFile
from starlette.background import BackgroundTasks

from app.schemas.paper import Paper
from app.latex.text_utils import escape_special_characters

logger = getLogger(__name__)


async def typeset(
    paper: Paper,
    files: list[UploadFile],
    teaser: UploadFile,
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
    save_files(working_dir, teaser, files)

    # テンプレートを編集する
    with open("/template/template.tpl", "r") as f:
        template_text = f.read()

    text = create_latex_text(template_text, paper, teaser.size > 0)

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


def save_files(working_dir: Path, teaser: UploadFile, files: list[UploadFile]) -> None:
    if teaser.size != 0:
        teaser_file_name = "teaser.png"
        save_file(teaser, working_dir / teaser_file_name)

    for i, file in enumerate(files):
        if file.size == 0:
            shutil.copy(
                Path("/template") / f"figure{i + 1}_dummy.png",
                working_dir / f"fig{i}.png",
            )
        else:
            save_file_path = f"{working_dir}/fig{i}.png"
            save_file(file, save_file_path)


def create_latex_text(template_text: str, paper: Paper, has_teaser: bool):
    num_sections = len(paper.body)
    text = template_text
    text = text.replace("<<<title>>>", escape_special_characters(paper.title))
    text = text.replace("<<<author>>>", escape_special_characters(paper.author))
    text = text.replace("<<<abstract>>>", escape_special_characters(paper.abstract))

    figure_head_texts = ["" for _ in range(num_sections)]
    figure_tail_texts = ["" for _ in range(num_sections)]
    for fig_idx, fig in enumerate(paper.figure):
        section_idx = fig.section_index - 1  # 1-indexed -> 0-indexed
        fig_filename = f"fig{fig_idx}.png"
        figure_text = r"\begin{figurehere}" + "\n"
        figure_text += r"\centering" + "\n"
        figure_text += (
            r"\includegraphics[width=0.8\linewidth]{" + fig_filename + "}\n"
        )  # E501
        figure_text += r"\caption{" + escape_special_characters(fig.caption) + "}\n"
        figure_text += r"\end{figurehere}" + "\n"
        if fig.position == "t":
            figure_head_texts[section_idx] += figure_text
        else:
            figure_tail_texts[section_idx] += figure_text

    # replace teaser
    if not has_teaser:
        teaser_text = ""
    else:
        teaser_file_name = "teaser.png"
        teaser_caption = paper.teaser.caption if paper.teaser is not None else ""
        teaser_text = (
            r"""
\begin{{figure}}[h]
\centering
\includegraphics[width=0.9\linewidth]{{{0}}}
\caption{{{1}}}
\label{{fig:topfigure}}
\end{{figure}}
"""
        ).format(teaser_file_name, escape_special_characters(teaser_caption))

    text = text.replace("<<<teaser>>>", teaser_text)

    body_text = ""
    for section_idx, section in enumerate(paper.body):
        body_text += r"\section{" + escape_special_characters(section.title) + "}\n"
        body_text += figure_head_texts[section_idx] + "\n"
        body_text += escape_special_characters(section.text) + "\n"
        body_text += figure_tail_texts[section_idx] + "\n\n"
    text = text.replace("<<<body>>>", body_text)

    references = [escape_special_characters(ref.value) for ref in paper.reference]
    reference_text = "".join(
        f"\\bibitem{{ref{i}}} {ref}\n" for i, ref in enumerate(references)
    )

    text = text.replace("<<<reference>>>", reference_text)

    return text
