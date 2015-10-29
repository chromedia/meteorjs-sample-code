/***
 * Step definitions for the campaign related acceptance tests.
 * server.call() simulates a remote method invocation, part of Meteor platform.
 */
(function () {
    module.exports = function () {

        var campaignId;

        this.Given(/^all campaigns are unapproved$/, function() {
           server.call('fixture/unapproveAllCampaigns');
        });

        this.Given(/^approved campaign exists with details:$/, function (table) {
            var hash = table.rowsHash();
            var campaign = {title: hash['Title'], startDate: hash['Start Date'], endDate: hash['End Date'], approved: true};
            campaignId = server.call('fixture/createCampaign', campaign);
        });

        this.Given(/^has category values:$/, function (table) {
            server.call('fixture/addCategoryValues', campaignId, table.hashes());
        });

        this.Given(/^campaigns exists:$/, function (table) {
            table.hashes().forEach(function (row) {
                var startDate = new Date();
                var endDate = new Date();
                var approved = row['Approved'] === 'true';
                var campaign = {title: row['Title'], startDate: startDate, endDate: endDate, approved: approved};
                server.call('fixture/createCampaign', campaign);
            });
        });

        this.Given(/^all campaigns are removed$/, function() {
            server.call('fixture/removeAllCampaigns');
        });

        this.Then(/I should have this campaign search result:/, function (table) {
            var header = table.raw()[0];
            client.waitForVisible('.search-campaigns');
            table.rows().forEach(function (row) {
                var input = client.visibleElement('.search-campaigns');
                client.elementIdClear(input.value.ELEMENT);
                client.elementIdValue(input.value.ELEMENT, row[0]);
                client.keys('Enter');
                client.waitForVisible('.campaigns tbody');
                var text = client.getText('.campaigns tbody').join(' ');
                for (var i = 1; i < row.length; i++) {
                    if (row[i] === 'yes')
                        expect(text).toContain(header[i]);
                    else
                        expect(text).not.toContain(header[i]);
                }
            });
        });
    }
})();
