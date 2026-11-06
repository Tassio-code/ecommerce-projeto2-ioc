# E-commerce SOLID — Projeto 2 (IoC com InversifyJS)

API de pedidos (Express + Prisma + SQLite) refatorada no Projeto 1 com SRP, OCP e LSP.
Neste projeto a montagem das dependências, que era feita à mão com `new` no `app.ts`,
passou para um container de IoC (**InversifyJS 7**). Com isso a infraestrutura (e-mail e
banco de pedidos) pode ser trocada sem tocar na regra de negócio.

## Como rodar

```bash
npm install
cp .env.example .env        # no Windows (PowerShell/cmd): copy .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

A API sobe em `http://localhost:3000`. Se o arquivo `.env` não existir, a aplicação usa o modo `dev`.

## Os dois modos de execução

O modo é escolhido pela variável `APP_ENV`, no arquivo `.env`. Para trocar, edite o `.env`
e **reinicie** o servidor (`Ctrl + C` e `npm run dev`).

| | `APP_ENV=dev` | `APP_ENV=test` |
|---|---|---|
| E-mail | `EtherealMailProvider` (usa internet) | `ConsoleMailProvider` (imprime no console) |
| Pedidos | `PrismaOrderRepository` (SQLite) | `InMemoryOrderRepository` (array em memória) |
| Internet | necessária para o e-mail | não é necessária |

Os produtos continuam vindo do SQLite nos dois modos, então o `prisma:migrate` e o `prisma:seed` valem para ambos.

## Como testar

Produto 1 = livro físico (R$ 100 + R$ 10 de frete = **R$ 110**). Produto 2 = e-book (**R$ 50**, sem frete).
Formas de pagamento: `credit_card`, `debit_card` e `pix`.

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

- Modo `dev`: a resposta traz o link `emailPreview` do Ethereal, e o total aparece no e-mail.
- Modo `test`: o e-mail é impresso no console do servidor (com o total) e `emailPreview` vem `false`.

Troque `productId` para `2` e confira o total de R$ 50 nos dois modos. Um CVV `000` simula cartão recusado (erro 500).

## Estrutura

```text
src/
├── container/
│   ├── types.ts          # Symbols (rótulos) de cada dependência
│   └── container.ts      # único arquivo que importa classes concretas e decide o modo
├── controllers/          # OrderController: só HTTP
├── domain/               # produtos (físico e digital) e ProductFactory
├── payments/             # IPaymentMethod, uma classe por forma de pagamento e PaymentMethodRegistry
├── providers/            # IMailProvider, EtherealMailProvider, ConsoleMailProvider
├── repositories/         # contratos e implementações (Prisma e em memória)
├── services/             # OrderService e NotificationService
├── lib/                  # logger (Winston) e configuração do Nodemailer
├── app.ts                # pede o OrderController ao container e registra a rota
└── server.ts             # reflect-metadata, dotenv e inicialização
```

## Como o container funciona

- Cada dependência tem um `Symbol` em `types.ts` (ex.: `TYPES.MailProvider`).
- As classes recebem o que precisam pelo construtor, com `@inject(TYPES.X)`. Elas conhecem **contratos**, nunca implementações.
- `container.ts` liga cada rótulo a uma classe. E-mail e pedidos mudam conforme o `APP_ENV`.
- As formas de pagamento usam todas o rótulo `TYPES.PaymentMethod` e chegam ao `PaymentMethodRegistry` por `@multiInject`.
  Para aceitar uma nova forma de pagamento, basta criar a classe e acrescentar uma linha no container.
- Provider de e-mail e repositórios são singleton (`inSingletonScope()`).
