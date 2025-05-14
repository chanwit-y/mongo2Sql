interface MatchOperation {
  $match: Record<string, any>;
}

interface AddFieldsOperation {
  $addFields: Record<string, any>;
}

interface LookupOperation {
  $lookup: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
}

interface UnwindOperation {
  $unwind: string;
}

interface ProjectOperation {
  $project: Record<string, number>; // assuming 1 for inclusion, 0 for exclusion
}

type AggregationOperation =
  | MatchOperation
  | AddFieldsOperation
  | LookupOperation
  | UnwindOperation
  | ProjectOperation;

export class MongoToSQLConverter {
  private _selectFields: string[] = [];
  private _joins: string[] = [];
  private _whereClause: string = "";

  constructor(
    private _mainTable: string,
    private _aggregations: AggregationOperation[]
  ) {}

  convert(): string {
    for (const operation of this._aggregations) {
      if ((operation as LookupOperation).$lookup) {
        this._handleLookup((operation as LookupOperation).$lookup);
      }
    }

    for (const operation of this._aggregations) {
      if ((operation as MatchOperation).$match) {
        this._whereClause = this._handleMatch(
          (operation as MatchOperation).$match
        );
      } else if ((operation as AddFieldsOperation).$addFields) {
        this._handleAddFields((operation as AddFieldsOperation).$addFields);
      } else if ((operation as ProjectOperation).$project) {
        this._handleProject((operation as ProjectOperation).$project);
      }
    }

    const sqlQuery = `SELECT ${
      this._selectFields.length > 0 ? this._selectFields.join(", ") : "*"
    } FROM ${this._mainTable} ${this._joins.join(" ")}${this._whereClause}`;
    return sqlQuery;
  }

  private _handleMatch(match: Record<string, any>): string {
    const conditions = this._parseConditions(match);
    return ` WHERE ${conditions}`;
  }

  private _parseConditions(conditions: Record<string, any>): string {
    const parsedConditions = Object.entries(conditions).map(([key, value]) => {
      const fieldName = key.includes(".") ? key : `${this._mainTable}.${key}`;

      if (key === "$or") {
        const subConditions = value.map((subCondition: any) =>
          this._parseConditions(subCondition)
        );
        return `(${subConditions.join(" OR ")})`;
      }

      if (typeof value === "object") {
        if ("$and" in value) {
          const subConditions = value.$and.map((subCondition: any) =>
            this._parseConditions(subCondition)
          );
          return `(${subConditions.join(" AND ")})`;
        } else if ("$in" in value) {
          return `${fieldName} IN (${value.$in
            .map((v: any) => `'${v}'`)
            .join(", ")})`;
        } else if ("$eq" in value) {
          return `${fieldName} = '${value.$eq}'`;
        } else if ("$ne" in value) {
          return `${fieldName} <> '${value.$ne}'`;
        }
      }

      return `${fieldName} = '${value}'`;
    });

    return parsedConditions.join(" AND ");
  }

  private _handleAddFields(addFields: Record<string, any>): void {
    Object.entries(addFields).forEach(([newFieldName, expression]) => {
      if (
        typeof expression === "object" &&
        ("$toObjectId" in expression || "$toString" in expression)
      ) {
        // Skip adding the $toObjectId transformation to the SELECT fields
      } else {
        const fieldName = expression.replace(/^\$/, "");
        this._selectFields.push(
          `${this._mainTable}.${fieldName} AS ${newFieldName}`
        );
      }
    });
  }


  private _handleLookup(lookup: {
	from: string;
	localField: string;
	foreignField: string;
	as: string;
      }): void {
	const alias = lookup.as;
      
	const localField = lookup.localField.includes('.')
	  ? lookup.localField
	  : `${this._mainTable}.${lookup.localField}`;
      
	const foreignField = lookup.foreignField.includes('.')
	  ? lookup.foreignField
	  : `${alias}.${lookup.foreignField}`;
      
	const joinClause = `LEFT JOIN ${lookup.from} AS ${alias} ON ${localField} = ${foreignField}`;
	this._joins.push(joinClause);
	this._selectFields.push(`${alias}.*`);
      }


  private _handleProject(project: Record<string, number>): void {
    this._selectFields = [];
    Object.entries(project).forEach(([field, include]) => {
      if (include) {
        this._selectFields.push(`${this._mainTable}.${field}`);
      }
    });
  }
}

// Example usage:
const mainTable = "shift";
const aggregationPipeline: AggregationOperation[] =[
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

const converter = new MongoToSQLConverter(mainTable, aggregationPipeline);
console.log(converter.convert());
