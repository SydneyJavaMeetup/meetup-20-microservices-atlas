db.photo.remove({colours: {$nin: ['Black', 'Brown', 'Golden', 'Grey', 'White']}});
db.getSiblingDB('AtlasSearch').getCollection('photo').createSearchIndex('default',
INDEX_GOES_HERE
);
