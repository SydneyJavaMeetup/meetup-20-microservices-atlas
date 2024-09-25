The sample data here includes links to images of dogs, their breeds colours and sizes as created by an LLM. 

You can start a docker container for Atlas with:
```
docker run -d -p 27017:27017 mongodb/mongodb-atlas-local
```

Then run the code to import the data with:
```
./setup-local.sh
```

Due to the imperfect nature of LLMs there are a few incorrect records that can be cleaned up with:
```
db.photo.remove({colours: {$nin: ['Black', 'Brown', 'Golden', 'Grey', 'White']}});
db.photo.remove({colours: 'Afghan Hound'});
```

You can perform searches over the data like this:
```
db.photo.aggregate(
  [
    {
      "$search": {
        "index": "default",
        "facet": {
          "operator": {
            "text": {
              "query": "frisbee",
              "path": "summary"
            },
          },
          "facets": {
            "breeds": {
              "type": "string",
              "path": "breeds",
              "numBuckets": 1000
            },
            "coloursFacet": {
              "type": "string",
              "path": "colours",
              "numBuckets": 10
            },
            "sizesFacet": {
              "type": "string",
              "path": "sizes",
              "numBuckets": 10
            }
          }
        }
      }
    },
    {$limit: 10},
    {
      "$facet": {
        docs: [],
        meta: [
          {"$replaceWith": "$$SEARCH_META"},
          {"$limit": 1}
        ]
      }
    }
  ]
)
```
