# Acceptance testing for searching marketing campaign in campaign page
Feature: Search campaigns

  Background:
    Given user is logged in
    * all campaigns are removed
    * campaigns exists:
      | Title                 | Approved |
      | Presidential Campaign | true     |
      | Campaign 1            | true     |
      | Campaigns Summer      | false    |
      | President 1 ampaign   | false    |
      | Campaign one two      | true     |
      | campaign one...       | true     |

  Scenario: Search in approved campaigns
    Given I am on the "Approved Campaigns" page
    Then I should have this campaign search result:
      | Query        | Presidential Campaign | Campaign 1 | Campaigns Summer | President 1 ampaign | Campaign one two | campaign one... |
      | President    | no                    | no         | no               | no                  | no               | no              |
      | Campaign     | yes                   | yes        | no               | no                  | yes              | yes             |
      | Summer       | no                    | no         | no               | no                  | no               | no              |
      | Campaign on  | no                    | no         | no               | no                  | no               | no              |
      | Campaign One | no                    | no         | no               | no                  | yes              | yes             |
      | one          | no                    | no         | no               | no                  | yes              | yes             |
      | campaign two | no                    | no         | no               | no                  | no               | no              |
      | ...          | yes                   | yes        | no               | no                  | yes              | yes             |

  Scenario: Search in draft campaigns
    Given I am on the "Draft Campaigns" page
    Then I should have this campaign search result:
      | Query        | Presidential Campaign | Campaign 1 | Campaigns Summer | President 1 ampaign | Campaign one two | campaign one... |
      | President    | no                    | no         | no               | yes                 | no               | no              |
      | Campaign     | no                    | no         | no               | no                  | no               | no              |
      | Summer       | no                    | no         | yes              | no                  | no               | no              |
      | Campaign on  | no                    | no         | no               | no                  | no               | no              |
      | Campaign One | no                    | no         | no               | no                  | no               | no              |