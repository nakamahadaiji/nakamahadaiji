# データベース設計

Cloud Firestoreを使用する。

## rooms/{roomId}
```ts
{
  code: string,
  hostUid: string,
  status: 'lobby'|'playing'|'finished',
  phase: 'lobby'|'preparing'|'turn_roll'|'turn_event'|'turn_result'|'final_quiz'|'result'|'ended',
  turn: number,
  maxTurns: 5,
  phaseEndsAt: Timestamp | null,
  createdAt: Timestamp,
  subject: string,
  grade: string,
  difficulty: string,
  theme: string,
  currentDestinationId: string,
  destinationClaimedBy: string | null,
  participantCount: number,
  contentSetId: string
}
```

## rooms/{roomId}/players/{playerId}
```ts
{
  uid: string,
  nickname: string,
  joinedAt: Timestamp,
  connected: boolean,
  position: number,
  money: number,
  propertyValue: number,
  bonus: number,
  totalAssets: number,
  properties: string[],
  quizCorrect: number,
  quizAnswered: number,
  diceTotal: number,
  diceCount: number,
  maxSingleLoss: number,
  plague: {
    active: boolean,
    type: 'money_loss'|'dice_minus_one'|null
  },
  pendingEvent: object|null,
  lastActionTurn: number,
  finishedTurn: boolean
}
```

## rooms/{roomId}/actions/{actionId}
サーバー処理用の一回限りアクション。

```ts
{
  playerId: string,
  turn: number,
  type: 'ROLL'|'QUIZ_ANSWER'|'DECISION'|'BUY_PROPERTY'|'FINAL_ANSWER',
  payload: object,
  createdAt: Timestamp,
  processedAt: Timestamp|null,
  result: object|null
}
```

`actionId = playerId_turn_type` を基本にして二重送信を防ぐ。

## rooms/{roomId}/feed/{feedId}
投影画面用の演出イベント。

```ts
{
  type: 'DESTINATION'|'GLOBAL_EVENT'|'RANK_CHANGE'|'SYSTEM',
  message: string,
  playerId: string|null,
  createdAt: Timestamp,
  expiresAt: Timestamp|null,
  payload: object
}
```

## contentSets/{contentSetId}
```ts
{
  title: string,
  subject: string,
  grade: string,
  difficulty: string,
  theme: string,
  generatedBy: 'ai'|'preset',
  createdAt: Timestamp,
  quizzes: Quiz[],
  finalQuiz: Quiz,
  events: Event[],
  properties: Property[],
  destinations: Destination[],
  spaces: Space[]
}
```

## Quiz
```ts
{
  id: string,
  question: string,
  choices: [string,string,string,string],
  correctIndex: 0|1|2|3,
  explanation: string,
  reward: number
}
```

## Event
```ts
{
  id: string,
  name: string,
  description: string,
  scope: 'player'|'all',
  effectType: 'money'|'property_modifier'|'dice_modifier',
  amount: number,
  durationTurns: number
}
```

## Property
```ts
{
  id: string,
  name: string,
  city: string,
  category: string,
  price: number,
  turnIncome: number,
  description: string
}
```

## Destination
```ts
{
  id: string,
  name: string,
  spaceId: string,
  bonus: number,
  historicalNote: string
}
```

## Space
```ts
{
  id: string,
  index: number,
  city: string,
  type: 'profit'|'loss'|'quiz'|'decision'|'property'|'incident',
  label: string
}
```

## 集計値について
ランキング表示を軽くするため、`totalAssets` は毎回計算せずプレイヤードキュメントにも保持する。ただし最終結果ではサーバー側で再計算して確定する。

`totalAssets = money + propertyValue + bonus`

## セキュリティ原則
- 生徒は自分のplayer/actionのみ作成可能
- money、position、totalAssets等を生徒が直接更新することは禁止
- host操作はhostUidのみ
- contentSet生成は認証済みホストのみ
- 正解番号は通常の生徒購読データに露出させない構成へ分離する

本実装では公開用クイズ文と正解情報を別ドキュメントに分ける。
