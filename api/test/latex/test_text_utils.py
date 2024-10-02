import pytest

from app.latex import text_utils

def test_escape_underscore():
    test_text = "This is a _test_ text with some _underscores_ and some \\_already\_ escaped ones."

    expect = "This is a \_test\_ text with some \_underscores\_ and some \\_already\_ escaped ones."

    actual = text_utils.escape_underscores(text=test_text)
    assert actual == expect

    test_text = "Mixed scenarios: _single_ and __double__ and *___triple___* underscores."

    expect = "Mixed scenarios: \_single\_ and \_\_double\_\_ and *\_\_\_triple\_\_\_* underscores."

    actual = text_utils.escape_underscores(text=test_text)
    assert actual == expect

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
def test_escape_spacial_characters(text, expect):
    actual = text_utils.escape_underscores(text=text)
    assert actual == expect 
