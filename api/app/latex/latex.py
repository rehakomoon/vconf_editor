import shutil
import subprocess
import tempfile
from logging import getLogger
from pathlib import Path

from fastapi import UploadFile
from starlette.background import BackgroundTasks

from app.schemas.paper import Paper

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

    # replace teaser
    if teaser is None or teaser.size == 0:
        teaser_text = ""
    else:
        teaser_file_name = "teaser.png"
        save_file(teaser, working_dir / teaser_file_name)

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
        ).format(teaser_file_name, teaser_caption)

    text = text.replace("<<<teaser>>>", teaser_text)

    body_text = ""
    for section_idx, section in enumerate(paper.body):
        body_text += r"\section{" + section.title + "}\n"
        body_text += figure_head_texts[section_idx] + "\n"
        body_text += section.text + "\n"
        body_text += figure_tail_texts[section_idx] + "\n\n"
    text = text.replace("<<<body>>>", body_text)

    reference_text = (
        r"""
\bibitem{rafferty1994} W. Rafferty, "Ground antennas in NASA’s deep space telecommunications," Proc. IEEE vol. 82, pp. 636-640, May 1994.
\bibitem{vconf2023} バーチャル学会実行委員会, "バーチャル学会2023 Webサイト." \url{https://vconf.org/2023/} (参照 2023-06-30).
\bibitem{okatani2015} 岡谷貴之, "深層学習," 2015.
\bibitem{kataoka2016} Yun He, et al. "Human Action Recognition without Human," In proceedings of the ECCV Workshop, 2016.
""")
    text = text.replace("<<<reference>>>", reference_text)

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
    # TODO: 今の作りだと、かならず図が5枚必要になっているのでいずれ修正する
    for i in range(5):
        if len(files) <= i or (len(files) > i and files[i].size == 0):
            shutil.copy(
                Path("/template") / f"figure{i + 1}_dummy.png",
                working_dir / f"fig{i}.png",
            )
        else:
            save_file_path = f"{working_dir}/fig{i}.png"
            save_file(files[i], save_file_path)
