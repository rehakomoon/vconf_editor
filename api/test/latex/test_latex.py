from app.latex import latex
from app.schemas.paper import Paper, Reference


def test_create_latex_text_titleが置き換えられる():
    template = "title:<<<title>>>\nother:<<<other>>>"

    paper = Paper(
        title="タイトル",
        author="著者",
        abstract="アブストの文章",
        body=[],
        teaser=None,
        figure=[],
        reference=[],
    )

    expect = "title:タイトル\nother:<<<other>>>"

    actual = latex.create_latex_text(template, paper, False)
    assert actual == expect


def test_create_latex_text_authorが置き換えられる():
    template = "author:<<<author>>>\nother:<<<other>>>"

    paper = Paper(
        title="タイトル",
        author="著者",
        abstract="アブストの文章",
        body=[],
        teaser=None,
        figure=[],
        reference=[],
    )

    expect = "author:著者\nother:<<<other>>>"

    actual = latex.create_latex_text(template, paper, False)
    assert actual == expect


def test_create_latex_text_abstractが置き換えられる():
    template = "abstract:<<<abstract>>>\nother:<<<other>>>"

    paper = Paper(
        title="タイトル",
        author="著者",
        abstract="アブストの文章",
        body=[],
        teaser=None,
        figure=[],
        reference=[],
    )

    expect = "abstract:アブストの文章\nother:<<<other>>>"

    actual = latex.create_latex_text(template, paper, False)
    assert actual == expect


def test_create_latex_text_referenceが置き換えられる():
    template = "reference:<<<reference>>>\nother:<<<other>>>"

    paper = Paper(
        title="タイトル",
        author="著者",
        abstract="アブストの文章",
        body=[],
        teaser=None,
        figure=[],
        reference=[Reference(value="value1"), Reference(value="value2")],
    )

    expect = "reference:\\bibitem{ref0} value1\n\\bibitem{ref1} value2\n\nother:<<<other>>>"

    actual = latex.create_latex_text(template, paper, False)
    assert actual == expect
