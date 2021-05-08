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
Use the following command to start the express server. The server will start on http://localhost:3000/.
```shell
$ npm run start
```
> Note: when starting up the project initially, the required files need to be built first as described above.
