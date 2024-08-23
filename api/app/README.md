## 開発時の設定

適宜 pyenv や pipenv を実行できるようにしたうえで、以下のコマンドを実行してください。

```sh
pipenv sync --dev
```

### testの実行方法

```sh
pipenv run test
```

### linter, formatter のかけ方

```sh
pipenv run format
pipenv run lint
```
