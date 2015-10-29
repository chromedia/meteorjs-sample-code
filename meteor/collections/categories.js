/**
 * Creates Categories collection object for connecting to MongoDB collection
 * @type {Meteor.Collection}
 */
Categories = new Meteor.Collection('categories');
Categories['isEnabled'] = function(query) {
    if (!query)
        query = {};
    query['enabled'] = true;
    return Categories.find(query).count()
};
Categories['findEnabled'] = function(query) {
    if (!query)
        query = {};
    query['enabled'] = true;
    return Categories.find(query);
};

/**
 * Defines the schema of the category collection.
 * @type {SimpleSchema}
 */
CategorySchema = new SimpleSchema({
    driver_id: {
        type: String,
        index: true,
        autoform: { type: 'hidden' }
    },
    code: {
        type: String,
        label: "Code",
        index: true,
        optional: true
    },
    name: {
        type: String,
        index: true,
        custom: function () {
            if (HatchApp.CompanyUser.isLogin) {
                var driverId = this.field('driver_id').value;
                var value = this.value, id = this.docId;

                var criteria = {driver_id: driverId, name: { $regex : new RegExp('^' + value + '$', "i")}};
                if (id) criteria["_id"] = { $ne: id };

                if(Categories.find(criteria).count() > 0) {
                    return "notUniqueCategory";
                }
            }
        }
    },
    type: {
        type: String,
        allowedValues: ["select", "input", "multiple"],
        autoform: {
            type: "select-radio",
            defaultValue: 'select',
            options: function () {
              return [
                {label: "Multiple Text \"single value\"", value: "select"},
                {label: "Multiple Text \"multiple values\"", value: "multiple"},
                {label: "Text Description", value: "input"}
              ];
            }
        }
    },
    enabled: {
        type: Boolean,
        defaultValue: true
    },
    additionalConfiguration: {
        type: Object,
        defaultValue: {},
        optional: true
    },
    textDescription: {
        type: String,
        optional: true
    },
    tags: {
        type: [String],
        optional: true,
        custom: function () {
            if (HatchApp.CompanyUser.isLogin) {
                console.log('HatchApp.CompanyUser.isLogin: ', HatchApp.CompanyUser.isLogin);
                var isNotInputType = this.field('type').value != 'input';

                if(isNotInputType && (typeof(this.value) == 'undefined' || !this.value)) {
                    return 'requiredTags';
                }
            }
        },
        autoform: {
            type: "select2",
            afFieldInput: {  multiple: true }
        }
    },
    benchmarkTags: {
        type: [String],
        optional: true,
        custom: function () {

            if (HatchApp.CompanyUser.isLogin) {
                var isNotInputType = this.field('type').value != 'input';
                var driver = Drivers.findOne({_id: this.field('driver_id').value});

                if(isNotInputType && driver.hasBenchmark && (typeof(this.value) == 'undefined' || !this.value)) {
                    return 'requiredBenchmarkTags';
                }
            }
        },
        autoform: { 
            type: "select2", 
            afFieldInput: { multiple: true } 
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    modifiedAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        },
    }
});

Categories.attachSchema(CategorySchema);

Categories.allow({
    'insert': function (userId,doc) {
      return true;
    },

    'update': function (userId,doc) {
      return true;
    }
});