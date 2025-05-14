# MongoDB to SQL Conversion Examples 🔄

## Service Master

### Dropdown Loss By Group 📊
**Collection:** `loss`

```javascript
[
  {
    "$match": {
      "groupID": "6720a4f7515e14856a512321"
    }
  }
]
```

```sql
SELECT * 
FROM loss  
WHERE loss.groupID = '6720a4f7515e14856a512321'
```

### Dropdown Loss By Category 📑
**Collection:** `loss`

```javascript
[
  {
    "$addFields": {
      "groupObjectID": {
        "$toObjectId": "$groupID"
      }
    }
  },
  {
    "$lookup": {
      "from": "group_loss",
      "localField": "groupObjectID",
      "foreignField": "_id",
      "as": "groupDetails"
    }
  },
  {
    "$unwind": "$groupDetails"
  },
  {
    "$match": {
      "groupDetails.categoryID": "6720a369515e14856a512308"
    }
  }
]
```

```sql
SELECT groupDetails.* 
FROM loss 
LEFT JOIN group_loss AS groupDetails ON loss.groupObjectID = groupDetails._id 
WHERE groupDetails.categoryID = '6720a369515e14856a512308'
```

### Dropdown Loss Detail By Category 📝
**Collection:** `loss_detail`

```javascript
[
  {
    "$addFields": {
      "lostDetailObjectID": {
        "$toObjectId": "$lossID"
      }
    }
  },
  {
    "$lookup": {
      "from": "loss",
      "localField": "lostDetailObjectID",
      "foreignField": "_id",
      "as": "loss"
    }
  },
  {
    "$unwind": "$loss"
  },
  {
    "$addFields": {
      "groupObjectID": {
        "$toObjectId": "$loss.groupID"
      }
    }
  },
  {
    "$lookup": {
      "from": "group_loss",
      "localField": "groupObjectID",
      "foreignField": "_id",
      "as": "groupDetails"
    }
  },
  {
    "$unwind": "$groupDetails"
  },
  {
    "$match": {
      "groupDetails.categoryID": "6720a369515e14856a512308"
    }
  }
]
```

```sql
SELECT loss.*, groupDetails.* 
FROM loss_detail 
LEFT JOIN loss AS loss 
   ON loss_detail.lostDetailObjectID = loss._id 
LEFT JOIN group_loss AS groupDetails 
   ON loss_detail.groupObjectID = groupDetails._id 
WHERE groupDetails.categoryID = '6720a369515e14856a512308'
```

### Dropdown Contractor By PitID 👷
**Collection:** `pit_contractor`

```javascript
[
  {
    "$match": {
      "pitID": "6704ddae510acfd8aa56118e"
    }
  },
  {
    "$addFields": {
      "contractorObjectID": {
        "$toObjectId": "$contractorID"
      }
    }
  },
  {
    "$lookup": {
      "from": "contractor",
      "localField": "contractorObjectID",
      "foreignField": "_id",
      "as": "contractorDetails"
    }
  },
  {
    "$unwind": "$contractorDetails"
  }
]
```

```sql
SELECT contractorDetails.* 
FROM pit_contractor 
LEFT JOIN contractor AS contractorDetails 
    ON pit_contractor.contractorObjectID = contractorDetails._id 
WHERE pit_contractor.pitID = '6704ddae510acfd8aa56118e'
```

### Dropdown Contractor By SiteID 🏗️
**Collection:** `contractor`

```javascript
[
  {
    "$addFields": {
      "contractorStrID": {
        "$toString": "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "pit_contractor",
      "localField": "contractorStrID",
      "foreignField": "contractorID",
      "as": "pitContractor"
    }
  },
  {
    "$unwind": "$pitContractor"
  },
  {
    "$lookup": {
      "from": "site_pit",
      "localField": "pitContractor.pitID",
      "foreignField": "pitID",
      "as": "sitePit"
    }
  },
  {
    "$unwind": "$sitePit"
  },
  {
    "$match": {
      "sitePit.siteID": "6704e8c0510acfd8aa5611a4"
    }
  }
]
```

```sql
SELECT pitContractor.*, sitePit.* 
FROM contractor 
LEFT JOIN pit_contractor AS pitContractor 
   ON contractor.contractorStrID = pitContractor.contractorID 
LEFT JOIN site_pit AS sitePit 
   ON pitContractor.pitID = sitePit.pitID 
WHERE sitePit.siteID = '6704e8c0510acfd8aa5611a4'
```


### Dropdown PIT By SiteID 📍
**Collection:** `pit`

```javascript
[
  {
    "$addFields": {
      "pitStrID": {
        "$toString": "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "site_pit",
      "localField": "pitStrID",
      "foreignField": "pitID",
      "as": "sitePit"
    }
  },
  {
    "$unwind": "$sitePit"
  },
  {
    "$match": {
      "sitePit.siteID": "6703a7f700b67b673aa43e4c"
    }
  }
]
```

```sql
SELECT sitePit.* 
FROM pit 
LEFT JOIN site_pit AS sitePit 
   ON pit.pitStrID = sitePit.pitID 
WHERE sitePit.siteID = '6703a7f700b67b673aa43e4c'
```

### Dropdown Master Studio 🎨
**Collection:** `master_studio`

```javascript
[
  {
    "$addFields": {
      "typeObjectID": {
        "$toObjectId": "$typeID"
      }
    }
  },
  {
    "$lookup": {
      "from": "master_studio_type",
      "localField": "typeObjectID",
      "foreignField": "_id",
      "as": "typeDetail"
    }
  },
  {
    "$unwind": "$typeDetail"
  },
  {
    "$match": {
      "typeDetail.name": "dataType"
    }
  }
]
```

```sql
SELECT typeDetail.* 
FROM master_studio 
LEFT JOIN master_studio_type AS typeDetail 
   ON master_studio.typeObjectID = typeDetail._id 
WHERE typeDetail.name = 'dataType'
```

### Dropdown Seam By PitID ⛏️
**Collection:** `seam`

```javascript
[
  {
    "$addFields": {
      "seamStrID": {
        "$toString": "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "pit_seam",
      "localField": "seamStrID",
      "foreignField": "seamID",
      "as": "pitseam"
    }
  },
  {
    "$match": {
      "pitseam.pitID": "6704ddae510acfd8aa56118e"
    }
  }
]
```

```sql
SELECT pitseam.* 
FROM seam 
LEFT JOIN pit_seam AS pitseam 
   ON seam.seamStrID = pitseam.seamID 
WHERE pitseam.pitID = '6704ddae510acfd8aa56118e'
```

### Dropdown Seam By SiteID 🏞️
**Collection:** `seam`

```javascript
[
  {
    "$addFields": {
      "seamStrID": {
        "$toString": "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "pit_seam",
      "localField": "seamStrID",
      "foreignField": "seamID",
      "as": "pitseam"
    }
  },
  {
    "$unwind": "$pitseam"
  },
  {
    "$lookup": {
      "from": "site_pit",
      "localField": "pitseam.pitID",
      "foreignField": "pitID",
      "as": "sitepit"
    }
  },
  {
    "$unwind": "$sitepit"
  },
  {
    "$match": {
      "sitepit.siteID": "6704e8c0510acfd8aa5611a4"
    }
  }
]
```

```sql
SELECT pitseam.*, sitepit.* 
FROM seam 
LEFT JOIN pit_seam AS pitseam 
   ON seam.seamStrID = pitseam.seamID 
LEFT JOIN site_pit AS sitepit 
   ON seam.pitseam.pitID = sitepit.pitID 
WHERE sitepit.siteID = '6704e8c0510acfd8aa5611a4'
```

### Dropdown Shift By SiteID ⏱️
**Collection:** `shift`

```javascript
[
  {
    "$addFields": {
      "shiftStrID": {
        "$toString": "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "site_shift",
      "localField": "shiftStrID",
      "foreignField": "shiftID",
      "as": "siteshift"
    }
  },
  {
    "$match": {
      "siteshift.siteID": "6703a7f700b67b673aa43e4c"
    }
  }
]
```

```sql
SELECT siteshift.* 
FROM shift 
LEFT JOIN site_shift AS siteshift 
   ON shift.shiftStrID = siteshift.shiftID 
WHERE siteshift.siteID = '6703a7f700b67b673aa43e4c'
```