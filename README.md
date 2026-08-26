# IDOL MAP Ver.3

日本の女性アイドルを一気に俯瞰し、タップで詳細を開き、公式サイトへ移動できるデータベース型プロトタイプです。

## 収録
- 全体一覧: 176組
- 詳細スコア: 63組
- 事務所 / プロジェクト / レーベル / 親会社 / ライブ規模 / Power / Growth
- 主要グループの公式サイトリンク

## 構造
- `index.html`: UI
- `data.json`: データ

データをHTMLから分離しているため、今後300組・500組に増やしてもUIを作り直さず拡張できます。

## 次の本番化
1. Supabase/PostgreSQLへ移行
2. members / songs / live_events / sources / monthly_scores テーブルを追加
3. 個別URL `/groups/{slug}`
4. 管理画面
5. Vercelへデプロイ
