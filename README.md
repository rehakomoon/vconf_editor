# VCONF_EDITOR

バーチャル学会の発表要旨を作成するためのオンラインエディターです

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

## 本番実行時のコマンド

```sh
docker compose -f ./docker-compose-prod.yaml build

export VITE_HOSTNAME=$(\
  TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
  && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-hostname); \
docker compose -f ./docker-compose-prod.yaml up -d
```
