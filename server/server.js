const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// MySQL接続プールの作成
const pool = mysql.createPool({
  host: "mysql-container",  // MySQLコンテナの名前
  user: "root",         // MySQLユーザー名
  password: "password", // MySQLのパスワード
  database: "mydb", // 使用するデータベース名
  waitForConnections: true, // 接続が必要な時に待つ
  connectionLimit: 10,      // 同時に作成できる接続の数
  queueLimit: 0             // キューの制限なし
});

// プールでの接続エラーハンドリング
pool.on('error', (err) => {
  console.error('MySQLプール接続エラー:', err);
});

// ユーザーIDに基づいてユーザーデータを取得するエンドポイント
app.post("/sse", function (req, res) {
  const userId = req.body.user_id; // フロントエンドから送信されたuser_idを取得
  // console.log(`User ID: ${userId}`);

  // ヘッダーを設定してSSEのストリームを開始
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // プールを使ってデータベースから指定されたuser_idに基づいてデータを取得
  const query = `SELECT * FROM user WHERE id = ?`;  // userテーブルからidで検索
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('SQLエラー:', err);
      res.write(`data: {"error": "データ取得中にエラーが発生しました"}\n\n`);
    } else if (results.length > 0) {
      // console.log("ユーザーデータ:", results[0]);
      const userData = results[0];  // 取得されたユーザーデータ

      // SSEストリームを使ってクライアントにデータを送信
      setInterval(() => {
        const aTechPrice = userId === "12345" ? getStockPrice(2, 20) : getStockPrice(2, 18);
        const bTechPrice = userId === "12345" ? getStockPrice(4, 22) : getStockPrice(4, 24);

        // 取得したユーザーデータと生成した株価データを送信
        res.write(
          `data: {"time": "${getTime()}", "user_name": "${userData.name}", "aTechStockPrice": "${aTechPrice}", "bTechStockPrice": "${bTechPrice}"}\n\n`
        );
      }, 5000);
    } else {
      res.write(`data: {"error": "User not found"}\n\n`);
    }
  });

  // クライアントが切断された場合にストリームを終了
  // req.on("close", () => {
  //   console.log("クライアントとの接続が切断されました");
  //   res.end(); // 接続を終了
  // });
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で動作しています`);
});

// 株価の生成関数
const getStockPrice = (range, base) =>
  (Math.random() * range + base).toFixed(2);

// 現在時刻を取得する関数
const getTime = () => new Date().toLocaleTimeString();
