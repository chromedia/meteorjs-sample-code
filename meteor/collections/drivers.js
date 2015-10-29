/**
 * Creates Drivers collection object for connecting to MongoDB collection
 * @type {Meteor.Collection}
 */
Drivers = new Meteor.Collection('drivers');
Drivers['isEnabled'] = function(query) {
    if (!query)
        query = {};
    query['enabled'] = true;
    return Drivers.find(query).count()
};
Drivers['findEnabled'] = function(query) {
    if (!query)
        query = {};
    query['enabled'] = true;
    return Drivers.find(query);
};

/**
 * Defines the schema of the driver collection.
 * @type {SimpleSchema}
 */
DriverSchema = new SimpleSchema({
    code: {
        type: String,
        label: "Code",
        index: true,
        optional: true
    },
    name: {
        type: String,
        label: "Driver name",
        index: true,
        optional: false,
        custom: function () {
            if (HatchApp.CompanyUser.isLogin) {
                var companyId = this.field('company_id').value;
                var value = this.value, id = this.docId;

                var criteria = {company_id: companyId, name: { $regex : new RegExp('^' + value + '$', "i")}};
                if (id) criteria["_id"] = { $ne: id };

                if(Drivers.find(criteria).count() > 0) {
                    return "notUniqueDriver";
                }
            }
        }
    },
    company_id: {
        type: String,
        label: "Company ID",
        index: true,
        autoform: { type: 'hidden' }
    }
    ,
    enabled: {
        type: Boolean,
        defaultValue: true
    }
    ,
    required: {
        type: Boolean,
        defaultValue: false
    }
    ,
    hasBenchmark: {
        type: Boolean,
        defaultValue: false
    }
    ,
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }
    ,
    modifiedAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
    ,
    "helptextReference.staticDriverName": {
        type: String,
        defaultValue: "test" //Default value must be name field
    }
    ,
    "helptextReference.message": {
        type: String,
        defaultValue: "test" 
    },

    sort: {
        type: Number,
        optional: true
    },



});

Drivers.attachSchema(DriverSchema);