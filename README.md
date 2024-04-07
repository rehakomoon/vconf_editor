# VCONF_EDITOR

## How to run(WIP)

1. Execute the following commands

```sh
$ docker compose build
$ docekr compose up
```

2. Access to `http://localhost:8000/testform`

## パッケージ更新時の運用

pipenv 環境で新しいパッケージのインストールや、パッケージバーションの更新を行った際は、以下のコマンドを実行して本番環境が参照するパッケージの更新も行うようにしてください。

```sh
pipenv run pip freeze > requirements.txt
```
