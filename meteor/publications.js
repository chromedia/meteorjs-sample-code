/***
 * List of publications under the pub-sub model of Meteor platform.
 * Resides on the server side.
 */

/***
 Publish drivers and current size of a collection by user
 */
Meteor.publish('drivers', function() {

    var companyUser = CompanyUsers.findOne({user_id: this.userId});
    if(!companyUser)
        return [];

    var criteria = { company_id: companyUser.company_id };
    var drivers = Drivers.find(criteria, {sort:{modifiedAt: -1}});

    // Get Active Drivers
    criteria.enabled = true;
    Counts.publish(this, 'enabledDriverCount', Drivers.find(criteria), { noReady: true });

    // Get Inactive Drivers
    criteria.enabled = false;
    Counts.publish(this, 'disabledDriverCount', Drivers.find(criteria), { noReady: true });

    return drivers;
});

/**
 * Publish enabled categories visible to the logged-in user.
 */
Meteor.publish('enabledCategories', function() {
    var companyUser = CompanyUsers.findOne({user_id: this.userId});
    if (!companyUser)
        return [];

    var drivers = Drivers.findEnabled({ company_id: companyUser.company_id });

    var driverIds = [];
    drivers.forEach(function(each){ driverIds.push(each._id); });

    return Categories.findEnabled({driver_id: {$in: driverIds}});
});

/**
 * Publish category tags visible to the logged-in user.
 */
Meteor.publish('enabledCategoryTags', function() {
    var companyUser = CompanyUsers.findOne({user_id: this.userId});
    if (!companyUser)
        return [];

    var driverIds = [];
    var drivers = Drivers.findEnabled({ company_id: companyUser.company_id });
    drivers.forEach(function(each){ driverIds.push(each._id); });

    var categoryIds = [];
    var categories = Categories.findEnabled({driver_id: {$in: driverIds}});
    categories.forEach(function(each){ categoryIds.push(each._id); });

    return Tags.find({category_id: {$in: categoryIds}});
});

/**
 * Publish a specific driver
 */
Meteor.publish("driver", function(driverId) {
    var companyUser = CompanyUsers.findOne({user_id: this.userId});
    if (!companyUser)
        return [];

    return Drivers.find({_id: driverId, company_id: companyUser.company_id});
});


Meteor.publish("companyUser", function() {
    return CompanyUsers.find({user_id: this.userId});
});

/**
 * Publish the categories under a specific driver
 */
Meteor.publish('driverCategories', function(driverId) {
    return Categories.find({driver_id: driverId});
});

Meteor.publish('categoryTags', function(categoryId) {
    return Tags.find({category_id: categoryId});
});

/**
 * Publish all campaigns (approved and draft) of the current user's company
 */
Meteor.publish('campaigns', function() {
    var companyUser = CompanyUsers.findOne({user_id: this.userId});
    if (!companyUser)
        return [];

    Counts.publish(this, 'approvedCampaignCount', Campaigns.find({"approved": true, company_id: companyUser.company_id}));
    Counts.publish(this, 'draftCampaignCount', Campaigns.find({"approved": false, company_id: companyUser.company_id}));
    return Campaigns.find({company_id: companyUser.company_id});
});
