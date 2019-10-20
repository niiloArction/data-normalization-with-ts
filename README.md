# Web-service typing and normalization with *TypeScript*

With the introduction and recent popularity of *Node.js* and backend *JavaScript* applications, there’s more data represented as JS-objects than ever. The modifiable, not-predefined nature of JS-objects makes coding a breeze, but it can later lead to hardly understandable core pieces of logic and applications that are difficult to adjust to changes in data source / usage.

One way of preventing this from happening is to work with *TypeScript*, instead. In simple terms, *TS* is just *JS* with type definitions.

This is a web-application that fetches real-time data from a group of online broker APIs and normalizes the data into a single format. This data is then transformed again to a suitable format that can be used to display it with a third-party library. The goal of this example is to show that transforming data is not scary as long as there is type safety (*TypeScript*).

## The important parts

The application is formed of three levels:
- Application logic (app.ts)
- Data brokers (brokers/)
- Data display (display/)

These levels abstract away all implementation specific complications, so for example, when looking at application code there is no need to think of any fetch / data transformation logic etc. It is all done under the hood in the data broker implementation.

### Data broker implementation

Let's look at the implementation of worldtradingdata.com data broker (brokers/wtc.ts). At the bottom of the file there is an interface that was written according to the data format that the specific API returns (*WorldTradingDataIntradayData*).
The implementation of *getTradingData()* then casts the return type to this interface, and afterwards moves on to normalizing it to the internal format, which is returned to the application code.

## This looks way too complicated...

There's a couple benefits to this approach, whose importance totally depends on the application, but here they are:
- **Clear folder structure, and progressive logic**.
  Normalized or not, separating the data broker from the application is very standard stuff, and really helps with organization and debugging.

- **Easy to manage different data sources and components**.
  The main magic that these data source interfaces enable is that we can handle them all the same way. Take a peek at app.ts - the spooky, scary **Application Logic** is like 10 lines of code. Ten more data sources? That's ten more lines of code (or 0 without *Lint* hehe).

- **Straightfoward adjustment to any 3rd party and internal changes**.
  Let's say your data broker publishes a new version to their API, which has really bad backwards compatibility. With this kind of approach we could, for example, split the existing data broker implementation to two classes to match the respective versions, keep the old logic as is and update the normalization code for the new version.

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
