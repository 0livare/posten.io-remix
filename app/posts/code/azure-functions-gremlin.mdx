---
title: How to manipulate a Gremlin Cosmos DB from inside a Node.js Azure Function
description: The story that Microsoft docs, for some reason, refuse to tell you
author: Zach Posten
date: 2020-7-19
tags: azure, nodejs, gremlin, cosmosDB
slug: azure-functions-gremlin
imageFilename: gremlin.png
---

> This post assumes that you've already got an Azure Functions project set up and running locally on your computer. If not, please see to my [previous post](https://www.posten.io/blog/code/azure-functions-getting-started) about how to do exactly that.

So you've got a Functions project, and you've created a Cosmos DB in the azure portal, now how do you connect them?

### The way it's supposed to work (but doesn't)

The way that the interaction of writing to a database from within an Azure Function is supposed to work is [via a binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-output?tabs=javascript).

You create an entry in your `function.json` file for an output binding to Cosmos DB:

```json
{
  "name": "employeeDocument",
  "type": "cosmosDB",
  "databaseName": "my-database",
  "collectionName": "myCollection",
  "createIfNotExists": true,
  "connectionStringSetting": "MyAccount_COSMOSDB",
  "direction": "out"
}
```

And then you use the `context.bindings` object to write to the property you specified in the `name` field above:

```js
export default async function (context) {
  let document = {
    slug: 4,
    name: 'Zach',
    employeeslug: '004',
    address: '221b Baker St',
  }

  context.bindings.employeeDocument = document
}
```

But that DOES NOT WORK!

All that happens when this code runs is a vertex with no data is created in the Cosmos DB.

Why is that? Because [Microsoft does not currently support](https://github.com/Azure/azure-functions-python-worker/issues/413) binding to a Cosmos DB using the Gremlin API.

All [of](https://docs.microsoft.com/en-us/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript) [their](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-input?tabs=javascript) [examples](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-output?tabs=javascript) (those are three separate links) use the SQL API, without anywhere saying that these bindings are only supported in the SQL API, and not in the Gremlin API.

I'm guessing that the SQL API came out before the Gremlin API, and was at the time this documentation was written the only available API. So the Microsoft MVPs that wrote these "documentation" articles weren't aware that they should state that what they were doing was specific to SQL.

> It still confuses me how this binding that supposedly does not exist manages to write anything at all to the DB, even if that is only an empty vertex. Perhaps the SQL code is still running behind the scenes and by some coincidence still has some effect on the Gremlin graph?

### The way it actually works

Now that I've hopefully helped you avoid the pitfall that stole hours of my life, what we're actually going to do is make use of the [gremlin NPM package](https://www.npmjs.com/package/gremlin).

> Because of current limitations of Cosmos DB's Gremlin API, we'll see in this post that using the base gremlin NPM package is somewhat awkward and difficult. I've created a new library called [gremlin-cosmos](https://github.com/zposten/gremlin-cosmos) to make the interface between Gremlin and Cosmos more developer friendly.

Remember that because we're developing our functions locally, we can install NPM packages and then the `node_modules` directory automatically gets pushed into Azure with your function code so that everything continues to work in the cloud.

```bash
npm i gremlin
```

After installing the NPM package, first thing you need to do is define some configuration variables about your database. At the root of your project create a `SharedCode` directory and inside of that create a `gremlinConfig.ts` file.

> Note: My examples are going to assume you're using typescript. If you're not, you'll have to change the file names to `.js`, remove any typing information, and change the `import` / `export` syntax to use `require` / `module.exports`

```js
// SharedCode/gremlinConfig.ts

export default {
  endpoint: 'wss://my-cosmos-db.gremlin.cosmos.azure.com:443',
  primaryKey: 'superSuperSecretKey==',
  database: 'my-database',
  collection: 'myCollection',
}
```

You can find each of these data in your Cosmos DB on the Azure portal:

- `endpoint` can be found on the **Overview** tab
- `primaryKey` can be found on the **Keys** tab
- `database` can be found on the **Data Explorer** tab, it is the top level item in the DATA section
- `collection` can be found by expanding the (just described) database to show its collections

Once you have the configuration down, you can then use that information to create a Gremlin client that you'll use to communicate with the database:

```js
// MyFunction/index.ts

import config from '../SharedCode/gremlinConfig'

export default async function (context) {
  const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
    `/dbs/${config.database}/colls/${config.collection}`,
    config.primaryKey,
  )

  let client = new Gremlin.driver.Client(config.endpoint, {
    authenticator,
    traversalsource: 'g',
    rejectUnauthorized: true,
    mimeType: 'application/vnd.gremlin-v2.0+json',
  })
}
```

After the `Client` has been crated, you can finally create your first vertex!

```js
// MyFunction/index.ts

let query = `g.addV(label).property('pk', partitionKey).property('name', name)`

await client.submit(query, {
  label: 'person',
  name: 'Zach',
  partitionKey: 'pk',
})
```

> **Note:** If it is not passed explicitly, the `id` field will be auto assigned to a GUID that does not exist as a key in the database

As you can see, the syntax here is quite unfortunate. You have to craft this query as a string. Values with quotes around them get treated as strings, and values without quotes get interpreted as keys in the object that you pass as the second argument to `client.submit()`.

Gremlin is [not supposed to be written like that](http://tinkerpop.apache.org/docs/current/reference/#_submitting_scripts_4), but has to be when working with Cosmos DB's Gremlin API because [Cosmos does not support](https://docs.microsoft.com/en-us/azure/cosmos-db/gremlin-compatibility#unsupported-feature) Gremlin's nicer bytecode syntax.

### In Conclusion

In this post, we've seen that Microsoft doesn't exactly make it easy to work with Cosmos DB's Gremlin API inside of an Azure Function. It doesn't have any bindings, and doesn't support the backend features necessary to make it easy to work with the gremlin NPM package either.

As I hinted at earlier, I've created a wrapper around the gremlin NPM package to make it easier to work with Cosmos' Gremlin API; it's called [gremlin-cosmos](https://github.com/zposten/gremlin-cosmos).
