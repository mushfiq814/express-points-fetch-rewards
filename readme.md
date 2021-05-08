# Fetch Rewards Backend Software Engineering Coding Assesment
This project implements an ExpressJS web server to manage user points balances for a programming assesment for Fetch Rewards.


The project is built with NodeJS, TypeScript and Express. All source is located in `src` and the compiled files can be found at `dist`.

## Requirements
* [NodeJS](https://nodejs.org/en/)
* [Node Package Manager (npm)](https://www.npmjs.com/get-npm)
* Node Packages (via npm)
	* Run `npm install` to install all dependencies according to `package.json`
	* Important: Install all dependencies before starting the project.

## Building the project
Use the following command to compile all typescript files into javascript.
```shell
$ npm run compile
```
Output will be in `dist/`

## Running the project
Use the following command to start the express server.
```shell
$ npm run start
```
The server will start on `http://localhost:3000`. All routes can be accessed using `http://localhost:3000/endpoint` such as `http://localhost:3000/transactions`
> Note: when starting up the project initially, the required files need to be built first as described above.

## Accessing the API
From any curl tool such as Postman or a basic shell curl command, make requests to `http://localhost:3000/ENDPOINT` where `ENDPOINT` is one of the routes described below. For POST methods, such as adding a transaction or spending points, please use the JSON schema defined in the relevant sections.

## Routes
Currently only the following routes are implemented:
1. `transactions`: for creating and viewing transactions
2. `spend`: for spending available points from existing transactions
3. `balance`: check current points balance

### Transactions: `/transactions`
Transactions are how reward points are added or reduced. They include the payer of the transaction, the amount of points added/removed and an optional timestamp of the transaction. If no timestamp is provided, the transaction defaults to the creation timestamp of the transaction. This allows retroactive addition of transactions.

#### Get All Transactions
##### Request
To retrieve all transactions made so far, make a get request to `/transactions` as follows. No body data is required.

`GET http://localhost:3000/transactions`

##### Response

The response will contain a list of transactions (or an empty list if no transactions are present). For instance,

```json
[
	{
		"payer": "DANNON",
		"points": 1000,
		"timestamp": "2020-11-02T14:00:00Z"
	},
	{
		"payer": "UNILEVER",
		"points": 200,
		"timestamp": "2020-10-31T11:00:00Z"
	},
	{
		"payer": "DANNON",
		"points": -200,
		"timestamp": "2020-10-31T15:00:00Z"
	}
]
```

#### Add a Transaction
##### Request
To add a new transaction, make a post request instead to `/transactions` as follows.

`POST http://localhost:3000/transactions`

The information associated with the new transaction must be provided in the body of the request in JSON format according to the following schema.

```json
{
	"payer": "DANNON",
	"points": 1000,
	"timestamp": "2020-10-31T15:00:00Z"
}
```

| Attributes  | Type     | Required? | Description                                                             |
|-------------|----------|-----------|-------------------------------------------------------------------------|
| `payer`     | `string` | REQUIRED  | the name of the payer                                                   |
| `points`    | `number` | REQUIRED  | the amount of points associated with this transaction                   |
| `timestamp` | `string` | OPTIONAL  | the timstamp of the transaction. If not provided, the current timestamp |


##### Response

The transaction will be added to the list of transactions and the newly created transaction will be returned as a response.

### Spend: `/spend`
This endpoint provieds a way to spend existing points and returns an overview of how much can be spent from each payer according to the current user balance. The oldest transactions (as per the timestamp) are always favored to be spent first so the more recent points earned should be at the lowest priority.

#### Spend Points
##### Request
To spend points, make a post request to `/spend` as follows.

`POST http://localhost:3000/spend`

The amount of points to spend should be specified in the body of the request in JSON format according to the following schema.

```json
{ "points": 5000 }
```

| Attributes | Type     | Required? | Description                   |
|------------|----------|-----------|-------------------------------|
| `points`   | `number` | REQUIRED  | the amount of points to spend |


### Check Balance: `/balance`
This endpoint provides a way to check the current balance of points per payer according to all transactions created so far and all spending of points made so far.

#### Check Balance
##### Request
To check balance, make a get request to `/balance` as follows. No body data is required.

`GET http://localhost:3000/balance`

##### Response
The response will contain the current total balance grouped by the existing payers. For instance

```json
{
	"DANNON": 1000,
	"UNILEVER": 0,
	"MILLER COORS": 5300
}
```
