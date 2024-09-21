def escape_underscores(text):
    result = []
    i = 0
    while i < len(text):
        c = text[i]
        if c == '_':
            # アンダースコアの前に連続するバックスラッシュを数える
            num_backslashes = 0
            j = i - 1
            while j >= 0 and text[j] == '\\':
                num_backslashes += 1
                j -= 1
            if num_backslashes % 2 == 0:
                # 偶数のバックスラッシュは、アンダースコアがエスケープされていないことを意味する
                result.append('\\_')
            else:
                # 奇数の場合は、アンダースコアがエスケープ済みであることを意味する。
                result.append('_')
        else:
            result.append(c)
        i += 1
    return ''.join(result)
