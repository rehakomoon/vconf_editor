import re


def escape_special_characters(text: str) -> str:
    escape_map = {
        '#': r'\#',
        '$': r'\$',
        '%': r'\%',
        '&': r'\&',
        '~': r'\textasciitilde ',
        '_': r'\_',
        '^': r'\textasciicircum ',
        '\\': r'\textbackslash ',
        '{': r'\{',
        '}': r'\}',
    }

    # 特殊文字にマッチする正規表現パターン
    pattern = r'([#$%&~_^\\{}])'

    # マッチした文字を対応するエスケープシーケンスに置換
    return re.sub(pattern, lambda match: escape_map[match.group()], text)
