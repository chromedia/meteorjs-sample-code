/**
 * Resides on the server side of the Meteor platform.
 * Calls several collection objects connected to the MongoDB database.
 */
(function () {
    'use strict';

    Meteor.methods({
        'reset': function () {
            CampaignCategoryValues.remove({});
            Campaigns.remove({});
            BenchmarkTags.remove({});
            Tags.remove({});
            Benchmarks.remove({});
            Categories.remove({});
            Drivers.remove({});
            CompanyUsers.remove({});
            Companies.remove({});
            Meteor.users.remove({});
        },

        addUser: function (opts) {
            Accounts.createUser({
                email: opts.email,
                password: opts.password
            });
        },

        'fixture/createCampaign': function (c) {
            c['company_id'] = CompanyUsers.findOne({user_id: Meteor.userId}).company_id;
            return Campaigns.insert(c);
        },

        'fixture/addCategoryValues': function (campaignId, hash) {
            var companyId = CompanyUsers.findOne({user_id: Meteor.userId}).company_id;
            hash.forEach(function (row) {
                var driver = Drivers.findOne({code: row['Driver'], company_id: companyId});
                if (driver) {
                    var category = Categories.findOne({code: row['Category'], driver_id: driver._id});
                    if (category) {
                        var tag = Tags.findOne({category_id: category._id, name: row['Tag']});
                        if (tag)
                            CampaignCategoryValues.insert({
                                company_id: companyId,
                                campaign_id: campaignId,
                                category_id: category._id,
                                tag_id: tag._id,
                                driver_id: driver._id,
                                categoryCode: category.code,
                                categoryType: category.type,
                                categoryName: category.name,
                                value: tag.name
                            });
                    }
                 }
            });
        },

        'fixture/unapproveAllCampaigns': function() {
            Campaigns.find().forEach(function(c){
                Campaigns.update(c._id, {$set: {approved: false, modifiedAt: new Date()}});
            });
        },

        'fixture/removeAllCampaigns': function() {
            CampaignCategoryValues.remove({});
            Campaigns.remove({});
        }
    });
})();