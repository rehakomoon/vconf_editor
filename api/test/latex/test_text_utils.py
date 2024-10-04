import pytest

from app.latex import text_utils


@pytest.mark.parametrize("text,expect", [
    (r"a#b", r"a\#b"),
    (r"a$b", r"a\$b"),
    (r"a%b", r"a\%b"),
    (r"a&b", r"a\&b"),
    (r"a~b", r"a\textasciitilde b"),
    (r"a_b", r"a\_b"),
    (r"a^b", r"a\textasciicircum b"),
    (r"a\b", r"a\textbackslash b"),
    (r"a{b", r"a\{b"),
    (r"a}b", r"a\}b"),
])


def test_escape_special_characters(text, expect):
    actual = text_utils.escape_special_characters(text=text)
    assert actual == expect
