/**
 * Creates Campaigns collection object for connecting to MongoDB collection
 * @type {Meteor.Collection}
 */
Campaigns = new Meteor.Collection('campaigns');

/**
 * Defines the schema of the campaign collection.
 * @type {SimpleSchema}
 */
CampaignSchema = new SimpleSchema({
    company_id: {
        type: String,
        index: true
    },
    title: {
        type: String,
        label: "Campaign",
        index: true,
        custom: function () {
         
            if (this.isSet) {
                if (Meteor.isServer && this.userId) {
                    if (!Meteor.call('isCampaignNameAvailable', this.docId, this.value)) {
                        return 'notUnique';
                    }
                }
                if (Meteor.isClient) {
                    Meteor.call('isCampaignNameAvailable', this.field('_id').value, this.value, function (event, result) {
                        if (!result) {
                            Campaigns.simpleSchema().namedContext().addInvalidKeys([{name: "title", type: "notUnique"}]);
                        }
                    });
                }
            }
        }
    },
    overview: {
        type: String,
        label: "Overview",
        optional: true
    },
    approved: {
        type: Boolean,
        defaultValue: false
    },
    startDate: {
        type: Date,
        label: "Start Date"
    },
    endDate: {
        type: Date,
        label: "End Date"
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
        }
    }
});

Campaigns.attachSchema(CampaignSchema);

