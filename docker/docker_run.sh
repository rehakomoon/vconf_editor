docker run --rm -it -v $PWD/template:/template -v $PWD/output:/output vconf_editor sh -c ' \
cp -r /template/* /workdir && \
cd /workdir && \
latexmk -C main.tex && \
latexmk main.tex && \
latexmk -c main.tex && \
cp main.pdf /output \
'
