# 歴史鉄道 ～日本をめぐって天下を取れ～

授業内約10分、教員1名＋生徒最大40名で同時参加する教育用リアルタイムすごろくです。

## 現在実装済み
- 参加コードは毎回 `186800` で固定（教員が授業開始前に同じ部屋をリセット）
- 生徒がスマホから参加
- Firebase Realtime Databaseで別端末同期
- 1〜6のサイコロ、5ターン
- 利益 / 損失 / クイズ / 決断 / 物件
- 目的地到着ボーナスと目的地更新
- 最下位への疫病神、クイズ正解時の解除
- 最終早押し、正解・速度ボーナス
- 総合優勝 / クイズ王 / 大地主 / 豪運王 / 波乱王

## 公開URL
https://nakamahadaiji.github.io/nakamahadaiji/history-railway/\n\n参加コード: `186800`

## AI生成
functions/index.js に OpenAI API を呼ぶ Firebase Callable Function を実装済みです。
APIキーはブラウザに置かず、Firebase Secret `OPENAI_API_KEY` として設定する設計です。

## 注意
現行のブラウザ版は授業試作版です。Firebase Realtime Database の本番ルール適用、教員権限保護、Cloud Functionsのデプロイは次工程です。
