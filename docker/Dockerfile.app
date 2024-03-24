FROM paperist/texlive-ja:latest

ARG PYTHON_VERSION=3.11

ENV DEBIAN_FRONTEND="noninteractive"
ENV LC_ALL="C.UTF-8"
ENV LANG="C.UTF-8"

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    python${PYTHON_VERSION} \
    python3-pip \
    python-is-python3 \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python${PYTHON_VERSION} 1 && \
    update-alternatives --set python3 /usr/bin/python${PYTHON_VERSION}
RUN pip install --upgrade pip --break-system-packages
RUN pip install pyyaml --break-system-packages
RUN pip install fastapi --break-system-packages
RUN pip install "uvicorn[standard]" --break-system-packages
RUN pip install httpx --break-system-packages
RUN pip install pytest --break-system-packages
RUN pip install python-multipart --break-system-packages

WORKDIR /workdir
