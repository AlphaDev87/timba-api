**Timba Api** is a `Typescript` + `Express` + `Node` starter kit to develop `REST API` server apps.
Nothing new under the sun, just a straight forward combo to make server development a little bit faster. And of course, this make my freelancing days more enjoyable 😎
Comes with:

- Everything typed with [Typescript](https://www.typescriptlang.org/)
- [ES6](http://babeljs.io/learn-es2015/) features/modules
- ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) / [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- Run with [Nodemon](https://nodemon.io/) for automatic reload & watch
- [ESLint](http://eslint.org/) for code linting
- Code formatting using [Prettier](https://www.npmjs.com/package/prettier)
- Configuration management using [dotenv](https://www.npmjs.com/package/dotenv)
- Improved commits with [Husky](https://typicode.github.io/husky)
- Manage production app proccess with [PM2](https://pm2.keymetrics.io/)

  <br>
  <br>

---
# Docs

## Contenidos

### Jugadores
+ [Ver Jugador](#ver-jugador)
+ [Crear Jugador](#crear-jugador)
+ [Login de Jugador](#login-jugador)

#### Cuentas Bancarias
+ [Ver Cuentas Bancarias](#ver-cuentas-bancarias-🔒)
+ [Crear Cuenta Bancaria](#crear-cuenta-bancaria-🔒)
+ [Actualizar Cuenta Bancaria](#actualizar-cuenta-bancaria-🔒)
+ [Eliminar Cuenta Bancaria](#eliminar-cuenta-bancaria-🔒)

### Transferencias
+ [Cargar Fichas](#cargar-fichas-🔒)
+ [Retirar Premios](#retirar-premios-🔒)
+ [Ver Depósitos Pendientes](#ver-depósitos-pendientes-🔒)
+ [Confirmar Depósito Pendiente](#confirmar-depósito-pendiente-🔒)
+ [Eliminar Depósito Pendiente](#eliminar-depósito-pendiente-🔒)

### Agente
+ [Login de Agente](#login-agente)
+ [Ver Pagos](#ver-pagos-🔒)
+ [Marcar Pago Como Completado](#marcar-pago-como-completado-🔒)
+ [Ver Depósitos](#ver-depósitos-🔒)
+ [Ver QR](#ver-qr-🔒)
+ [Ver Cuenta Bancaria](#ver-cuenta-bancaria-🔒)
+ [Actualizar Cuenta Bancaria](#actualizar-cuenta-bancaria-🔒)
+ [Ver Balance](#ver-balance-🔒)
+ [Liberar Fichas Pendientes](#liberar-fichas-pendientes-🔒)

### Auth
+ [Refrescar Token](#refrescar-token)
+ [Logout](#logout-🔒)

### [Interfaces](#interfaces-1)

### [Despliegue](#despliegue-1)

Jugadores
---------

### Ver Jugador [🔒](#👉-🔒)

|Endpoint:| `/players/`|
---|---|
Método      | `GET`
Devuelve    | [`Player & { bank_accounts: BankAccount[] }`](#player)

### Crear Jugador

|Endpoint:| `/players`|
---|---|
Método      | `POST`
Body (json) | [`PlayerRequest`](#playerrequest)
Devuelve    | [`LoginResponse`](#loginresponse)

### Login Jugador

|Endpoint| `/players/login`|
---|---|
Método      |`POST`
Body (json) | [`Credenciales`](#credenciales)
Devuelve    | [`LoginResponse`](#loginresponse)

### Ver Cuentas Bancarias [🔒](#👉-🔒)

|Endpoint| `/bank-account/:id?`|
---|---|
Método      |`GET`
Devuelve    | [`BankAccount[]`](#bankaccount)

> **Nota:** Siempre devuleve un array

> **Nota:** Omitir el parámetro `id` para ver todas las cuentas bancarias del usuario

### Crear Cuenta Bancaria [🔒](#👉-🔒)

|Endpoint| `/bank-account`|
---|---|
Método      |`POST`
Body (json) | [`BankAccountRequest`](#bankaccountrequest)
Devuelve    | [`BankAccount`](#bankaccount)

### Actualizar Cuenta Bancaria [🔒](#👉-🔒)

|Endpoint| `/bank-account`|
---|---|
Método      |`PUT`
Body (json) | [`BankAccountRequest`](#bankaccountrequest)
Devuelve    | [`BankAccount`](#bankaccount)

> **Nota:** Los campos son opcionales. Incluir los que se quiera modificar

### Eliminar Cuenta Bancaria [🔒](#👉-🔒)

|Endpoint| `/bank-account`|
---|---|
Método      |`DELETE`
Devuelve    | 200 OK

### Cargar Fichas [🔒](#👉-🔒)
Incluir el id en la URL y omitir el body para confirmar un depósito pendiente
Omitir el id en la URL e incluir los datos en el body para crear un depósito nuevo

|Endpoint| `/transactions/deposit/:id?`|
---|---|
Método      |`POST`
Body (json) |[`DepositRequest`](#depositrequest)
Devuelve    |[`TransferResult & { deposit: Deposit }`](#transferresult)

### Retirar Premios [🔒](#👉-🔒)

|Endpoint| `/transactions/cashout`|
---|---|
Método      |`POST`
Body (json) |[`CashoutRequest`](#cashoutrequest)
Devuelve    |[`TransferResult`](#transferresult)

### Ver Depósitos Pendientes [🔒](#👉-🔒)

|Endpoint| `/transactions/deposit/pending`|
---|---|
Método      |`GET`
Devuelve    |[`Deposit[]`](#deposit)

> **Nota:** siempre devuelve un array

### Confirmar Depósito Pendiente [🔒](#👉-🔒)

|Endpoint| `/transactions/deposit/:id/confirm`|
---|---|
Método      |`PUT`
Devuelve    |[`TransferResult`](#transferresult)

### Eliminar Depósito Pendiente [🔒](#👉-🔒)

|Endpoint| `/transactions/deposit/:id`|
---|---|
Método      |`DELETE`
Devuelve    | 200 OK

Auth
----

### Refrescar Token

|Endpoint| `/auth/refresh`|
---|---|
Método      |`POST`
Body (json) |[`RefreshRequest`](#refreshrequest)
Devuelve    |[`Tokens`](#tokens)

### Logout [🔒](#👉-🔒)

|Endpoint| `/auth/logout`|
---|---|
Método      |`POST`
Body (json) |[`RefreshRequest`](#refreshrequest)
Devuelve    |200 OK si el token es invalidado
Error       |403 si el token no le pertenece al usuario, 404 si el token no se encuentra

**Nota** el token puede ser un access o refresh token. Al recibir uno, los dos serán invalidados.

Agente
------

### Login Agente

|Endpoint| `/agent/login`|
---|---|
Método      |`POST`
Body (json) |[`Credenciales`](#credenciales)
Devuelve    |[`Tokens`](#tokens)

### Ver Pagos [🔒](#👉-🔒)

|Endpoint| `/auth/refresh`|
---|---|
Método      |`GET`
Devuelve    |[`Payment[]`](#payment)

### Marcar Pago Como Completado [🔒](#👉-🔒)

|Endpoint| `/agent/payments/:id/paid`|
---|---|
Método      |`PUT`
Devuelve    |[`Payment`](#payment)

### Ver Depósitos [🔒](#👉-🔒)

|Endpoint| `/agent/deposits`|
---|---|
Método      |`GET`
Devuelve    |[`Deposit[]`](#deposit )

### Ver QR [🔒](#👉-🔒)

|Endpoint| `/agent/qr`|
---|---|
Método      |`GET`
Devuelve    |`Blob`

### Ver Cuenta Bancaria [🔒](#👉-🔒)

|Endpoint| `/agent/bank-account`|
---|---|
Método      |`GET`
Devuelve    |[`RootBankAccount`](#rootbankaccount)

### Actualizar Cuenta Bancaria [🔒](#👉-🔒)

|Endpoint| `/agent/bank-account`|
---|---|
Método      |`PUT`
Body (json) |[`RootBankAccount`](#rootbankaccount)
Devuelve    |[`RootBankAccount`](#rootbankaccount)

**Nota** Todos los parámetros son opcionales, incluir solo los que se quiera actualizar.

### Ver Balance [🔒](#👉-🔒)

|Endpoint| `/agent/balance`|
---|---|
Método      |`GET`
Devuelve    |[`Balance`](#balance)

### Liberar Fichas Pendientes [🔒](#👉-🔒)
Liberar transferencias que hayan quedado pendientes en el caso que un jugador quiera comprar mas fichas de las que tiene dispoibles el agente

|Endpoint| `/agent/deposits/complete`|
---|---|
Método      |`GET`
Devuelve    |[`Deposit[]`](#deposit) - los depositos afectados


### 👉 🔒 
Endpoints marcados con 🔒 requieren Bearer token

## Interfaces

### Player
```typescript
{
  id: string
  panel_id: number
  username: string
  email: string?
  first_name: string?
  last_name: string?
  date_of_birth: string?
  movile_number: string?
  country: string?
  balance_currency: string
  status: string
  created_at: string                  // 2024-01-29T18:14:41.534Z
}
```

### LoginResponse
```typescript
{
  access: string
  refresh: string
  player: Player
}
```


### PlayerRequest
```typescript
{
  username: string
  password: string
  email: string
  first_name: string?
  last_name: string?
  date_of_birth: DateTime?
  movile_number: string?
  country: string?
}
``` 

### BankAccountRequest
```typescript
{
  owner: string                       // Nombre del beneficiario
  owner_id: number                    // DNI
  bankName: string                    // Nombre del banco
  bankNumber: string                  // CBU
  bankAlias: string?   
}
```

### BankAccount
```typescript
{
  id: string        
  owner: string                       // Nombre del beneficiario
  owner_id: number                    // DNI
  player_id: string                   // ID de Player
  bankName: string                    // Nombre del banco
  bankNumber: string                  // CBU
  bankAlias: string?       
  created_at: datetime                // 2024-01-29T18:14:41.534Z
  updated_at: datetime                // 2024-01-29T18:14:41.534Z
}
```

### Credenciales
```typescript
{
  username: string
  password: string
}
```

### DepositRequest
```typescript
{
  currency: string;
  tracking_number: string;
  paid_at: string;                    // 2024-01-29T18:14:41.534Z fecha en que el jugador pagó
}
```

### CashoutRequest
```typescript
{
  amount: number
  currency: string
  bank_account: number                // ID de cuenta bancaria
}
```

### TransferResult
Estado de transferencia de fichas
```typescript
{
  status: "COMPLETED" | "INCOMPLETE"
  player_balance: number?             // undefined en caso de deposito INCOMPLETE
  error: string?                      // En caso de error, el motivo
  deposit: Deposit
}
```

### Deposit
```typescript
{
  id: string
  player_id: string
  currency: string
  dirty: boolean
  // Esperando confirmacion | no encontrado en alquimia | confirmado | cancelado por jugador | eliminado por agente
  status: "pending"|"rejected"|"confirmed"|"cancelled"|"deleted"
  tracking_number: string
  amount: number
  coins_transfered?: datetime         // 2024-02-23T12:35:51.017Z
  paid_at?: datetime                  // 2024-02-23T12:35:51.017Z
  created_at: datetime                // 2024-02-23T12:35:51.017Z
  updated_at: datetime                // 2024-02-23T12:35:51.017Z
}
```

### Payment
```typescript
{
  id: string
  player_id: string
  amount: number
  paid: datetime | null               // 2024-02-23T12:35:51.017Z
  bank_account: string
  currency: string
  created_at: datetime                // 2024-02-23T12:35:51.017Z                  
  updated_at: datetime                // 2024-02-23T12:35:51.017Z
}
```

### RootBankAccount
```typescript
{
  name: string
  dni: string
  bankName: string
  accountNumber: string
  clabe: string
  alias: string
}
```

### RefreshRequest
```typescript
{
  token: string
}
```

### Tokens
```typescript
{
  access: string
  refresh: string
}
```

### Balance
```typescript
{
  balance: number
  currency: string
}
```

## Despliegue

- `npx prisma migrate deploy` Para levantar la base de datos.
- `npm run seed` Para registrar al agente en nuestra base de datos. El comando pide el usuario y contraseña del casino y de nuestro panel propio. Las credenciales que se ingresen serán las que se usen para loguear al agente en el casino y en nuestro panel.

## TODO

- Instanciar servicios en lugar de usar metodos estaticos
- Cambiar contraseña (no funciona en el casino, vamos por este lado)
  - Endpoint https://agent.casinomex.vip/api/users/5941/change-password/
  - Body: `{ new_password:	string }`
- Handle sudden token revokation in frontend
- Log errors to file
- Usar endpoint /auth/logout en frontend

- [Bot Whatsapp](https://bot-whatsapp.netlify.app/) ✅
  + [Diagrama Flujo](https://www.figma.com/file/rtxhrNqQxdEdYzOfPl1mRc/Whatsapp-Bot?type=whiteboard&node-id=0%3A1&t=5ACojRhp99vrh24S-1)
- Cambiar IDs incrementales por UUIDs en producción
- Configurar bbdd distintas para dev y prod
- Chequear si agent existe en la bbdd en `seed.ts`
- Subir la duracion del refresh token a 24 horas
- Actualizar tabla depositos en panel agente
- Hacer endpoint de cancelar deposito para jugador
- Tener en cuenta que pasa si el casino devuelve 200 a una transfer de fichas pero la transferencia no pasa
- Balance Alquimia en panel agente

### Fichas insuficientes

- Revisar respuesta y avisarle al agente si quedaron transferencias sin liberar


## Optimizaciones

- Invalidar tokens en conjunto con una sola petición SQL


## Alquimia 

- ID Cuenta ahorro: 120902

Listar cuentas de ahorro 
```bash
curl -X GET \
-H "Authorization: Bearer $API_TOKEN" \
-H "AuthorizationAlquimia: Bearer $ALQ_TOKEN" \
${BASE_URL}1.0.0/v2/cuenta-ahorro-cliente \
-H 'Content-Type: x-www-form-urlencoded' \
-d 'id_cliente=2733226' 
```

Listar TX pendientes
```bash
curl -X GET \
-H "Authorization: Bearer $API_TOKEN" \
-H "AuthorizationAlquimia: Bearer $ALQ_TOKEN" \
"${BASE_URL}1.0.0/v2/ordenes-importador?id_cuenta=120902"
```

Consultar status TX
```bash
curl -X GET\
-H "Authorization: Bearer $API_TOKEN" \
-H "AuthorizationAlquimia: Bearer $ALQ_TOKEN" \
"${BASE_URL}1.0.0/v2/consulta-status-tx" \
-d 'id_cuenta=120902&id_transaccion=18489885' \
-H 'Content-Type: x-www-form-urlencoded'
```
Devuelve 404 al intentar confirmar el ingreso de $10 con su id_transaccion

Consulta de movimientos
- Consulta movimientos `/1.0.0/v2/cuenta-ahorro-cliente`
  + Si el movimiento figura en la lista devuelta por "Consulta de Movimientos", esta confirmado? 
  + Cuales son los posibles valors del campo `estatus_transaccion` en el resultado de este endpoint?
- el endpoint "Consulta estatus TX `/1.0.0/v2/consulta-estatus-tx`" nos sirve para confirmar transferencias recibidas? o solo pagos salientes?


