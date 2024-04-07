import yaml


def main():
    with open("input_data.yaml", "r") as f:
        data = yaml.safe_load(f)

    with open("template.tpl", "r") as f:
        text = f.read()

    assert "title" in data
    assert "author" in data
    assert "abstract" in data
    assert "body" in data
    assert isinstance(data["body"], list)

    text = text.replace("<<<title>>>", data["title"])
    text = text.replace("<<<author>>>", data["author"])
    text = text.replace("<<<abstract>>>", data["abstract"])

    body_text = ""
    for section in data["body"]:
        body_text += r"\section{" + section["title"] + "}\n"
        body_text += section["content"] + "\n"
    text = text.replace("<<<body>>>", body_text)

    with open("main.tex", "w") as f:
        f.write(text)


if __name__ == "__main__":
    main()
