# Node.jsの公式イメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install
# RUN npm install --production=false

# ソースコードをコピー
COPY . .

# nodemonを使ってホットリロードを実行
CMD ["npm", "start"]

# コンテナがポート5000をリッスンするように設定
EXPOSE 5000
