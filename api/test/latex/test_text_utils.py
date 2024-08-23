from app.latex import text_utils

def test_escape_underscore():
    test_text = "Hello_world! This__is_a_sample_text."

    expect = "Hello\_world! This\_\_is\_a\_sample\_text."

    actual = text_utils.escape_underscore(test_text)
    assert actual == expect
