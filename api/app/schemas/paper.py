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


class Paper(BaseModel):
    title: str
    author: str
    abstract: str
    body: list[Section]
    teaser: Optional[Teaser] = None
    figure: list[Figure]
