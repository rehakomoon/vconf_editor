from typing import Optional

from pydantic import BaseModel


class Section(BaseModel):
    title: str
    text: str


class Teaser(BaseModel):
    caption: str


class Figure(BaseModel):
    section_index: int
    caption: str
    position: Optional[str] = None  # "top", "bottom", "here", None


# TODO: ドメインを整理して、値を受け取るようにする？
# - 著者名, タイトル, 出版社, ページ, 出版年
# - 著者名, ページタイトル, URL, 参照日
class Reference(BaseModel):
    value: str


class Paper(BaseModel):
    title: str
    author: str
    abstract: str
    body: list[Section]
    teaser: Optional[Teaser] = None
    figure: list[Figure]
    reference: list[Reference]
