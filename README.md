# Data normalization with *TypeScript*

With the introduction and recent popularity of *Node.js* and backend *JavaScript* applications, there’s more data represented as JS-objects than ever. The modifiable, not-predefined nature of JS-objects makes coding a breeze, but it can later lead to hardly understandable core pieces of logic and applications that are difficult to adjust to changes in data source / usage.

One way of preventing this from happening is to work with *TypeScript*, instead. In simple terms, *TS* is just *JS* with type definitions.

This is a web-application that fetches real-time data from a group of online broker APIs and normalizes the data into a single format. This data is then transformed again to a suitable format that can be used to display it with a third-party library. The goal of this example is to show that transforming data is not scary as long as there is type safety (*TypeScript*).

## The important parts

(go through core sections of code. Separate into files !)

## This looks way too complicated...

(explain the benefits - change in 3rd party lib, adding more brokers, etc...)

## The finished application

The application is hosted via *GitHub* at:

https://niiloArction.github.io/data-normalization-with-ts/

To run the application locally with hot reload:

1. Clone the project
1. Install Node.JS
2. Run `npm install`
3. Run `npm start`
4. Open browser and navigate to http://localhost:8080

Note, that you'll need to get API tokens for the used data-brokers from their websites and fill them in **api-tokens.json** file.
