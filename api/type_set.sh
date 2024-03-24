#!/bin/sh
set -eu

cp -r /template/* /workdir
cd /workdir
python insert_texts.py
latexmk -C main.tex
latexmk main.tex
latexmk -c main.tex
cp main.pdf /output
