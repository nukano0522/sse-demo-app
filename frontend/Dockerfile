# Node.jsの公式イメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピーしてインストール
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# フロントエンドのビルドを実行
RUN npm run build

# フロントエンドのアプリケーションを実行
CMD ["npm", "start"]

# コンテナがポート3000をリッスンするように設定
EXPOSE 3000
