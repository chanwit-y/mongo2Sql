import { expect, test } from "bun:test";
import { MongoToSQLConverter } from ".";

test("Service Master - Dropdown Loss By Group", () => {
  const mainTable = "loss";
  const pipeline = [
    {
      $match: {
        groupID: "6720a4f7515e14856a512321",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT * FROM loss  WHERE loss.groupID = '6720a4f7515e14856a512321'"
  );
});

test("Dropdown Loss By Category", () => {
  const mainTable = "loss";
  const pipeline = [
    {
      $addFields: {
        groupObjectID: {
          $toObjectId: "$groupID",
        },
      },
    },
    {
      $lookup: {
        from: "group_loss",
        localField: "groupObjectID",
        foreignField: "_id",
        as: "groupDetails",
      },
    },
    {
      $unwind: "$groupDetails",
    },
    {
      $match: {
        "groupDetails.categoryID": "6720a369515e14856a512308", // if found . take this
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT groupDetails.* FROM loss LEFT JOIN group_loss AS groupDetails ON loss.groupObjectID = groupDetails._id WHERE groupDetails.categoryID = '6720a369515e14856a512308'"
  );
});

test("Dropdown Loss Detail By Category", () => {
  const mainTable = "loss_detail";
  const pipeline = [
    {
      $addFields: {
        lostDetailObjectID: {
          $toObjectId: "$lossID",
        },
      },
    },
    {
      $lookup: {
        from: "loss",
        localField: "lostDetailObjectID",
        foreignField: "_id",
        as: "loss",
      },
    },
    {
      $unwind: "$loss",
    },
    {
      $addFields: {
        groupObjectID: {
          $toObjectId: "$loss.groupID",
        },
      }, // not need $toObjectId
    },
    {
      $lookup: {
        from: "group_loss",
        localField: "groupObjectID",
        foreignField: "_id",
        as: "groupDetails",
      },
    },
    {
      $unwind: "$groupDetails",
    },
    {
      $match: {
        "groupDetails.categoryID": "6720a369515e14856a512308",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT loss.*, groupDetails.* FROM loss_detail LEFT JOIN loss AS loss ON loss_detail.lostDetailObjectID = loss._id LEFT JOIN group_loss AS groupDetails ON loss_detail.groupObjectID = groupDetails._id WHERE groupDetails.categoryID = '6720a369515e14856a512308'"
  );
});

test("Dropdown Contractor By PitID", () => {
  const mainTable = "pit_contractor";
  const pipeline = [
    {
      $match: {
        pitID: "6704ddae510acfd8aa56118e",
      },
    },
    {
      $addFields: {
        contractorObjectID: {
          $toObjectId: "$contractorID",
        },
      },
    },
    {
      $lookup: {
        from: "contractor",
        localField: "contractorObjectID",
        foreignField: "_id",
        as: "contractorDetails",
      },
    },
    {
      $unwind: "$contractorDetails",
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT contractorDetails.* FROM pit_contractor LEFT JOIN contractor AS contractorDetails ON pit_contractor.contractorObjectID = contractorDetails._id WHERE pit_contractor.pitID = '6704ddae510acfd8aa56118e'"
  );
});

test("Dropdown Contractor By SiteID", () => {
  const mainTable = "contractor";
  const pipeline = [
    {
      $addFields: {
        contractorStrID: {
          $toString: "$_id",
        },
      },
    },
    {
      $lookup: {
        from: "pit_contractor",
        localField: "contractorStrID",
        foreignField: "contractorID",
        as: "pitContractor",
      },
    },
    {
      $unwind: "$pitContractor",
    },
    {
      $lookup: {
        from: "site_pit",
        localField: "pitContractor.pitID",
        foreignField: "pitID",
        as: "sitePit",
      },
    },
    {
      $unwind: "$sitePit",
    },
    {
      $match: {
        "sitePit.siteID": "6704e8c0510acfd8aa5611a4",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT pitContractor.*, sitePit.* FROM contractor LEFT JOIN pit_contractor AS pitContractor ON contractor.contractorStrID = pitContractor.contractorID LEFT JOIN site_pit AS sitePit ON pitContractor.pitID = sitePit.pitID WHERE sitePit.siteID = '6704e8c0510acfd8aa5611a4'"
  );
});

test("Dropdown PIT By SiteID", () => {
  const mainTable = "pit";
  const pipeline = [
    {
      $addFields: {
        pitStrID: {
          $toString: "$_id",
        },
      },
    },
    {
      $lookup: {
        from: "site_pit",
        localField: "pitStrID",
        foreignField: "pitID",
        as: "sitePit",
      },
    },
    {
      $unwind: "$sitePit",
    },
    {
      $match: {
        "sitePit.siteID": "6703a7f700b67b673aa43e4c",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT sitePit.* FROM pit LEFT JOIN site_pit AS sitePit ON pit.pitStrID = sitePit.pitID WHERE sitePit.siteID = '6703a7f700b67b673aa43e4c'"
  );
});

test("Dropdown Master Studio", () => {
  const mainTable = "master_studio";
  const pipeline = [
    {
      $addFields: {
        typeObjectID: {
          $toObjectId: "$typeID",
        },
      },
    },
    {
      $lookup: {
        from: "master_studio_type",
        localField: "typeObjectID",
        foreignField: "_id",
        as: "typeDetail",
      },
    },
    {
      $unwind: "$typeDetail",
    },
    {
      $match: {
        "typeDetail.name": "dataType",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT typeDetail.* FROM master_studio LEFT JOIN master_studio_type AS typeDetail ON master_studio.typeObjectID = typeDetail._id WHERE typeDetail.name = 'dataType'"
  );
});

test("Dropdown Seam By PitID", () => {
  const mainTable = "seam";
  const pipeline = [
    {
      $addFields: {
        seamStrID: {
          $toString: "$_id",
        },
      },
    },
    {
      $lookup: {
        from: "pit_seam",
        localField: "seamStrID",
        foreignField: "seamID",
        as: "pitseam",
      },
    },
    {
      $match: {
        "pitseam.pitID": "6704ddae510acfd8aa56118e",
      },
    },
  ];
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT pitseam.* FROM seam LEFT JOIN pit_seam AS pitseam ON seam.seamStrID = pitseam.seamID WHERE pitseam.pitID = '6704ddae510acfd8aa56118e'"
  );
});

test("Dropdown Seam By SiteID", () => {
  const mainTable = "seam";
  const pipeline = [
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
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT pitseam.*, sitepit.* FROM seam LEFT JOIN pit_seam AS pitseam ON seam.seamStrID = pitseam.seamID LEFT JOIN site_pit AS sitepit ON pitseam.pitID = sitepit.pitID WHERE sitepit.siteID = '6704e8c0510acfd8aa5611a4'"
  );
});

  
test("Dropdown Shift By SiteID", () => {
  const mainTable = "shift";
  const pipeline = [
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
  const converter = new MongoToSQLConverter(mainTable, pipeline);
  const sql = converter.convert();
  expect(sql).toBe(
    "SELECT siteshift.* FROM shift LEFT JOIN site_shift AS siteshift ON shift.shiftStrID = siteshift.shiftID WHERE siteshift.siteID = '6703a7f700b67b673aa43e4c'"
  );
});

  