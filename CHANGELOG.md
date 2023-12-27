# Change history for ui-orders

## (5.1.0 IN PROGRESS)

* Allow Editing of "Renewal Date" and "Subscription to" on open purchase order line. Refs UIOR-1078.
* Disable donor field in POL. Refs UIOR-1149.
* Populate donor info from fund into POL. Refs UIOR-1148.
* Add donor info to Order facets. Refs UIOR-1150.
* Populate claiming interval in POL from Organization record. Refs UIOR-396.
* Add claiming checkbox to POL details. Refs UIOR-397.
* Optimize linked instances query to improve performance. Refs UIOR-1181.
* Add permission to fetch invoices-related fiscal years into the orders "view" permission set. UIOR-1185.
* Do not show special fields in "Version history" for PO and POL. Refs UIOR-1117.
* Add validation for the `claimingInterval` field. Refs UIOR-1192.

## [5.0.1](https://github.com/folio-org/ui-orders/tree/v5.0.1) (2023-11-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v5.0.0...v5.0.1)

* Add missed permission to fetch org types in view only mode. Refs UIOR-1168.
* Preview contains blank page when trying to print an order. Refs UIOR-1173.
* Do not disable account numbers having only one account available. Refs UIOR-1174.
* Populate values from a template after the fields are registered. Refs UIOR-1169.
* Add donor info to POL. Refs UIOR-1147.

## [5.0.0](https://github.com/folio-org/ui-orders/tree/v5.0.0) (2023-10-12)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v4.0.3...v5.0.0)

* Add action for duplicate order template. Refs UIOR-1056.
* Success toast message is not shown at the start of export. Refs UIOR-1089.
* Keyboard shortcuts issues. Refs UIOR-1086.
* A user can save duplicated order template name with only spaces before and after initial template name. Refs UIOR-1114.
* Support new error `multipleFiscalYears` code. Refs UIOR-1104.
* Some values are displayed by default in "View" mode for empty fields in the order template. Refs UIOR-1103.
* Automatically set to Independent order and receipt quantity if a user selects Receipt not required. Refs UIOR-1015.
* Ability to edit Ongoing order information of Open orders. Refs UIOR-1102.
* Add pagination to "Related invoices" accordion PO. Refs UIOR-1106.
* Add pagination to "Related invoices" accordion POL. Refs UIOR-1024.
* Removing a row in the locations fields array containing both location and holding causes problem with displaying first column name. Refs UIOR-1130.
* Update related invoice details to include additional fields. Refs UIOR-1131.
* Upgrade `Node.js` to `18` version in GitHub Actions. Refs UIOR-1135.
* *BREAKING*: Upgrade `React` to `18` version. Refs UIOR-1134.
* Provide a human-readable error message for `encumbrancesForReEncumberNotFound` code. Refs UIOR-1143.
* Show a message about the missing version in the history. Refs UIOR-1136.
* *BREAKING*: bump `react-intl` to `v6.4.4`. Refs UIOR-1146.
* When order line contains bad product IDs - the save & close does not work. Refs UIOR-1141.
* Upgrade `ui-plugin-find-po-line` and `ui-plugin-find-organization` plugins to `5` version. Refs UIOR-1154.
* POL - Display only active account numbers in dropdown list. Refs UIOR-1142.
* Use a provided `tenantId` when loading an instance in a PO line form. Refs UIOR-1159.

## [4.0.3](https://github.com/folio-org/ui-orders/tree/v4.0.3) (2023-04-06)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v4.0.2...v4.0.3)

* The `limit` query parameter is not explicitly set to some version history's requests. Refs UIOR-1101.

## [4.0.2](https://github.com/folio-org/ui-orders/tree/v4.0.2) (2023-03-17)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v4.0.1...v4.0.2)

* Permissions: Order settings perms do not allow create new reason for closure. Refs UIOR-1090.

## [4.0.1](https://github.com/folio-org/ui-orders/tree/v4.0.1) (2023-03-10)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v4.0.0...v4.0.1)

* Confirm if user would like to delete holdings record 'Unopen' order. Refs UIOR-1068.

## [4.0.0](https://github.com/folio-org/ui-orders/tree/v4.0.0) (2023-02-24)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.3.2...v4.0.0)

* Use Orders Export History API (mod-orders). Refs UIOR-1034.
* Provide local translations to `ControlledVocab`. Refs UIOR-1018.
* Show specified error message when changing of fund distribution for PO Line is blocked. Refs UIOR-1049.
* User can click Change log icon to view the Change log pane. Refs UIOR-857.
* Display all versions in change log in fourth pane. Refs UIOR-858.
* Results List | Hyperlink one column to improve accessibility. Refs UIOR-1021.
* Add confirmation modal - Break instance connection. Refs UIOR-1047.
* Include purchase orders without purchase order lines in CSV export report. Refs UIOR-1053.
* Cancel/dismiss version history and reload current version. Refs UIOR-1035.
* Display selected version in POL view. Refs UIOR-1036.
* Display selected version in PO view. Refs UIOR-1057.
* Show in version history record view, which fields have been edited. Refs UIOR-860.
* Removed unneeded `react-redux`. Refs UIOR-1064.
* Align the module with API breaking change. Refs UIOR-1058.
* Map missed error codes with new translations. Refs UIOR-1054.
* Align the `Created by` and `Created on` fields with BE changes. Refs UIOR-1065.
* *BREAKING*: Update `@folio/stripes` to `8.0.0`. Refs UIOR-1062.
* Display correct value for `Manual` checkbox on order version history view. Refs UIOR-1070.
* Use proper date formatting for "Approval date" value. Refs UIOR-1071.
* Display correct values for `Reason for closure` and `Notes on closure` fields on order version history view. Refs UIOR-1072.
* Unpin `@rehooks/local-storage` now that it's no longer broken. Refs UIOR-1066.

## [3.3.2](https://github.com/folio-org/ui-orders/tree/v3.3.2) (2022-11-30)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.3.1...v3.3.2)

* Loose plugin dependencies permit incompatible versions. Refs UIOR-1042.
* No results found shown after return to search page. Refs UIOR-1048.

## [3.3.1](https://github.com/folio-org/ui-orders/tree/v3.3.1) (2022-11-25)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.3.0...v3.3.1)

* Some shortcut keys do not work in the "Orders" application. Refs UIOR-1038.

## [3.3.0](https://github.com/folio-org/ui-orders/tree/v3.3.0) (2022-10-27)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.2.2...v3.3.0)

* Supports 'users' interface version 16.0. Refs UIOR-1030.
* Add `New invoice` action for PO actions menu. Refs UIOR-985.
* New invoice action (PO details). Refs UIOR-990.
* Add icon for Unopen/Reopen order and Update encumbrance. Refs UIOr-998.
* Do not unconditionally iterate over possibly null value. Refs UIOR-997.
* Support `holdings-storage` `6.0`. Refs UIOR-1017.
* Support `inventory` `12.0`. Refs UIOR-1020.
* Re-export order and order lines via `Re-export` action. Refs UIOR-884.
* Can not create PO line when title contains double quote. Refs UIOR-1028.
* Display export details accordion for exported order lines. Refs UIOR-882.
* Display export details on order view. Refs UIOR-886.
* Link title MCL is showing blank rows. Refs UIOR-1027.
* A user with certain permission gets 403 error when viewing order/order line. Refs UIOR-1032.
* Blanking "Quantity physical" or "Quantity electronic" from order template sets property to empty string. Refs UIOR-1029.

## [3.2.2](https://github.com/folio-org/ui-orders/tree/v3.2.2) (2022-08-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.2.1...v3.2.2)

* Orders (settings): View all settings not allowing user to see Instance matching area. Refs UIOR-1004.

## [3.2.1](https://github.com/folio-org/ui-orders/tree/v3.2.1) (2022-07-27)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.2.0...v3.2.1)

* Use BE validation of fund distributions total. Refs UIOR-978.
* Unable to select account number. Refs UIOR-1000.

## [3.2.0](https://github.com/folio-org/ui-orders/tree/v3.2.0) (2022-07-07)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.1.2...v3.2.0)

* Updated "Date ordered" label to "Date opened". Refs UIOR-908.
* Remove react-hot-loader - unmaintained, security (CVE-2021-44906). Refs UIOR-932.
* Select filter should announce the number of Results in Result List pane header. Refs UIOR-925.
* Remove "Folio invoice number" from display in invoice line column. Refs UIOR-957.
* Orders filter search results do not match "Date created" period specified. Refs UIOR-934.
* Renewal date and renewal interval no longer required. Refs UIOR-961.
* New Permission - "Orders: Approve purchase orders". Refs UIOR-933.
* Add cancel PO action and display indication that PO is canceled. Refs UIOR-889.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UIOR-962.
* Add cancel POL action and display indication that POL is canceled. Refs UIOR-740.
* Update Order Permission. Refs UIOR-963.
* Add organizations "Type" to order csv export. Refs UIOR-893.
* Edit instance connection of POL - create inventory set to Instance or none. Refs UIOR-936.
* Saving an order template can fail without a visible message. Refs UIOR-952.
* Edit instance connection of POL - create inventory set to `Instance, holding` or `Instance, holding, item`. Refs UIOR-594.
* Edit instance connection of POL - option to delete abandoned holdings. Refs UIOR-942.
* Display toast when Edit instance connection of POL is successful. Refs UIOR-937.
* ui-orders: module warnings analysis. Refs UIOR-969.
* Add copy icon to PO and POL number. Refs UIOR-966.
* Display "Renewal note" field on POL. Refs UIOR-965.
* Creating an order from instance record. Refs UIOR-973.
* Cancel creating an order or order line from instance record. Refs UIOR-975.
* Printing `Product IDs` on separate lines which makes them hard to read. Refs UIOR-912.
* Instance connection of POL (integration with back end). Refs UIOR-979.
* `Move` option is not disabled when holdings contain piece(s) and/or item(s) that are NOT related to the POLine. Refs UIOR-991.
* Error handling improvement. Refs UIOR-994.

## [3.1.2](https://github.com/folio-org/ui-orders/tree/v3.1.2) (2022-03-25)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.1.1...v3.1.2)

* Order: Error message does not indicate what Fund does not have money. Refs UIOR-919.
* Order duplicate verification is not made when saving PO line. Refs UIOR-929.
* Printing process of Order with no PO Lines can not be completed. Refs UIOR-928.

## [3.1.1](https://github.com/folio-org/ui-orders/tree/v3.1.1) (2022-03-22)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.1.0...v3.1.1)

* Orders csv export has errors in the location column when orders are linked to holdings. Refs UIOR-921.
* exportCsv is deprecated in stripes-utils. Refs UIOR-922.

## [3.1.0](https://github.com/folio-org/ui-orders/tree/v3.1.0) (2022-03-04)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.0.3...v3.1.0)

* Update agreement hyperlink on POL. Refs UIOR-796.
* Disable/enable instance matching for FOLIO tenant. Refs UIOR-763.
* Settings (Orders) | Apply baseline keyboard shortcuts. Refs UIOR-803.
* Remove pieces column from "Related invoice" accordion.Refs UIOR-817.
* Filter and identify POL by Acq unit. Refs UIOR-477.
* Add constraint for POL: physical POL should contain only Physical element and electronic only E-resource. Refs UIOR-825.
* Add "Package titles" accordion to package POL view. Refs UIOR-831.
* Allow user to add Package titles from POL view. Refs UIOR-832.
* Allow user to select instance for Title AND edit title from POL view. Refs UIOR-833.
* Display invoice line amount and comment on POL in related invoice table. Refs UIOR-851.
* Intercept user with confirmation when user unopens Order. Refs UIOR-808.
* Allow user to indicate in order template that specific fields should be hidden on order form. Refs UIOR-848.
* Order template is not saved without receiving workflow. Refs UIOR-862.
* Hide all fields in PO or POL that are set to hide in order template. Refs UIOR-850.
* Create area Settings->Orders->Acquisition methods. Refs UIOR-846.
* Allow user to show all hidden fields from PO or POL. Refs UIOR-849.
* Select Acquisition method from controlled vocabulary list. Refs UIOR-852.
* Rename collection field name for Acquisition method. Refs UIOR-872.
* Move "show all hidden fields" for PO or POL to Actions menu. Refs UIOR-871.
* Do not show ongoing order accordion for One-time orders. Refs UIOR-869.
* Allow user to show all hidden fields from PO or POL view. Refs UIOR-855.
* When Order template includes hidden fields they are also hidden from the view pane. Refs UIOR-856.
* Order - Allow user to choose what columns display for Order lines. Refs UIOR-878.
* Add estimated price to POL grid view on order record. Refs UIOR-868.
* Check for potential duplicate order lines. Refs UIOR-864.
* Add a return to Orders default search to app context menu dropdown. Refs UIOR-880.
* Add two additional "Resource identifier" types to the product id type selection for POL. Refs UIOR-843.
* Permission name discrepancies between `displayName` in `package.json` and translated values in `en_US.json`. Refs UIOR-734.
* Allow user to set Acq method EDIFACT export triggers for POL. Refs UIOR-371.
* Translations for orders lines filter by export date. Refs UIOR-883.
* Do not export order lines where Manual is true for the PO. Refs UIOR-890.
* Disable Check for potential duplicate order lines in Settings. Refs UIOR-888.
* Apply changes in Orders App from Plugin Find POL. Refs UIOR-900.
* Update unopened order "Delete piece" warning message. Refs UIOR-905.
* Validate All POLs on order that is set to export via EDIFACT have same account number. Refs UIOR-903.
* Adding tenant's timezone in UI. Refs UIOR-910.
* Settings > Orders > change focus. Refs UIOR-897.
* Only printing part of the primary address for orders. Refs UIOR-909.
* Search by product id ISBN is not working while adding invoice line based on POL. Refs UIOR-913.
* Exported date not removed when order is duplicated. Refs UIOR-914.
* Refactor psets away from backend ".all" permissions. Refs UIOR-810.
* Accessibility analysis. Refs UIOR-917.
* Replace deprecated permission search.instances.facets.collection.get. Refs UIOR-918.
* Grant budget permissions. Refs UIOR-981.
* Allow user to set "Must acknowledge receiving note" for title when creating POL. Refs UIOR-745.

## [3.0.3](https://github.com/folio-org/ui-orders/tree/v3.0.3) (2021-12-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.0.2...v3.0.3)

* POL Title selection overwriting Order template location. Refs UIOR-863.
* Order template not populating Holdings correctly.Refs UIOR-854.

## [3.0.2](https://github.com/folio-org/ui-orders/tree/v3.0.2) (2021-11-05)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.0.1...v3.0.2)

* Update manually add pieces for receiving field. Refs UIOR-836.
* Product ID search returning random results. Refs UIOR-830.
* Update "Unopen order" confirmation modal message when pieces are deleted. Refs UIOR-827.

## [3.0.1](https://github.com/folio-org/ui-orders/tree/v3.0.1) (2021-11-02)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v3.0.0...v3.0.1)

* Pieces are not displayed in POL Related invoices table. Refs UIOR-815.
* User can't edit opened POL when last piece is removed. Refs UIOR-824.
* Use a compatible version of `ui-plugin-find-po-line`. Refs UIOR-818.
* Permission - "Order: Create order lines" missing instance plugin perms. Refs UIOR-819.

## [3.0.0](https://github.com/folio-org/ui-orders/tree/v3.0.0) (2021-10-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.4.2...v3.0.0)

* Sorting of data in the "Title or package name" column is not performed in the POL list in the "Orders" app. Refs UIOR-742.
* Add a setting for Save and Add next PO line. Refs UIOR-694.
* Checking and unchecking isPackage can hide invalid data that prevents saving POL. Refs UIOR-737.
* Allow user to select holding rather than location at point of order. Refs UIOR-724.
* Restrict editing order location and quantity on POL. Refs UIOR-726.
* Allow user to sort "Related invoices" table by Invoice date. Refs UIOR-752.
* Support erm 5.0 interface in orders. Refs UIOR-765.
* Add vendor invoice number to 'Related invoices' section of PO/POL. Refs UIOR-771.
* Use mod-orders for piece queries. Refs UIOR-774.
* Fiscal year rollover amount not shown on POL after rollover. Refs UIOR-768.
* Lookup Package POL not considered an edit on edit form. Refs UIOR-779.
* HoldingsID not handled properly when duplicating order. Refs UIOR-770.
* UI tests replacement with RTL/Jest. Refs FAT-36.
* Display "Date Ordered" field on the PO details view pane. Refs UIOR-776.
* Searching by product ID in Orders app returning inconsistent results. Refs UIOR-772.
* Add translations for permission names. Refs UIOR-551.
* increment stripes to v7. Refs UIOR-769.
* `useLineHoldings` hook usage from stripes-acq-components. Refs UIOR-795.
* Order Tab - Implement MCL Next/Previous pagination. Refs UIOR-782.
* Location (holding) field adjustments for None or Instance Create inventory setting. Refs UIOR-781.
* Order lines Tab - Implement MCL Next/Previous pagination. Refs UIOR-783.
* "New" button active for user without permission to edit reason for closure in settings. Refs UIOR-797.
* Do not take user to Orders tab after edit of POL in POL tab. Refs UIOR-799.
* Filter label contains extra 's'. Refs UIOR-802.
* Settings (Order templates) | Apply baseline keyboard shortcuts. Refs UIOR-801.
* Create keyboard shortcut for "Add POL" action. Refs UIOR-812.
* Order lines tab - Resume Scroll position after edit. Refs UIOR-786.
* Order tab - Resume Scroll position after edit. Refs UIOR-785.
* Error message when trying to view order templates with order format set to "electronic" or "p/e mix" in POL details. Refs UIOR-758.

## [2.4.2](https://github.com/folio-org/ui-orders/tree/v2.4.2) (2021-09-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.4.1...v2.4.2)

* global CSS styles force landscape printing in other modules. Refs UIOR-775.

## [2.4.1](https://github.com/folio-org/ui-orders/tree/v2.4.1) (2021-07-28)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.4.0...v2.4.1)

* Prefix, suffix as well as PO and POL tags missing from export. Refs UIOR-755.
* Publication date not populated when using 'Title look up'. Refs UIOR-751.

## [2.4.0](https://github.com/folio-org/ui-orders/tree/v2.4.0) (2021-06-18)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.3.1...v2.4.0)

* Filter order lines by Expense class. Refs UIOR-678.
* Resizable Panes - Persistence. Refs UIOR-683.
* Apply Results list column chooser. Refs UIOR-691.
* Filter order by subscription = yes/no. Refs UIOR-710.
* Add linked instances accordion to the POL. Refs UIOR-689.
* Populate linked instances accordion with instance details. Refs UIOR-690.
* Keep Title visible on POL when scrolling down the page. Refs UIOR-661.
* Apply baseline keyboard shortcuts. Refs UIOR-677.
* Update Print order from HTML template. Refs UIOR-721.
* Possible to save POL with no location even when location is required. Refs UIOR-720.
* Implement Keyboard shortcuts modal. Refs UIOR-729.
* Multiple PO lines created when 'Save & Open' used on POL with fund distribution and no budget. Refs UIOR-723.
* Order export to CSV does not perform when attempting export of 50+ records. Refs UIOR-739.
* Update "Renewal Review period" filter label to match PO field label. Refs UIOR-715.
* Update filter label to match PO field label. Refs UIOR-714.
* Support new error codes of Order validation on UI. Refs UIOR-711.
* Compile Translation Files into AST Format. Refs UIOR-697.
* orders - Acquisition units no longer restrict edit create or delete actions from action menu. Refs UIOR-686.
* Print order from HTML template. Refs UIOR-674.
* Add Print action and icon to order actions menu. Refs UIOR-672.

## [2.3.1](https://github.com/folio-org/ui-orders/tree/v2.3.1) (2021-04-16)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.3.0...v2.3.1)

* Add Ongoing to the POL filters. Refs UIOR-688.
* Material type E and P Filters not working in POL search. Refs UIOR-679.
* With perm Orders: View order lines can not see order lines. Refs UIOR-699.
* Duplicate PO is created as "Approved". Refs UIOR-698.
* With perm "Orders: Create orders" user can NOT create orders. Refs UIOR-700.
* POL: Adjust the UI for account number to also display the account name. Refs UIOR-706.

## [2.3.0](https://github.com/folio-org/ui-orders/tree/v2.3.0) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.6...v2.3.0)

* Vendor ref number search is not working in the POL. Refs UIOR-668.
* Update labels for inventory interactions. Refs UIOR-665.
* Use "Total expended" and "Total encumbered" from composite order. Refs UIOR-658.
* Update view for Vendor reference number in POL list. Refs UIOR-662.
* Fix order templates list not refreshed after create new template. Refs UIOR-660.
* Fix cannot save template with renewal date. Refs UIOR-659.
* Make POL vendor reference number and type repeatable, paired fields. Refs UIOR-519.
* Add granular permissions for Order settings - order templates. Refs UIOR-649.
* Default sorting by updatedDate. UIOR-648.
* Fix orders date search format. Refs UISACQCOMP-16.
* Filter orders by Bill to & Ship to address. Refs UIOR-653.
* Filter order lines by acquisition units. Refs UIOR-654.
* Change label of "Clone" order to "Duplicate". Refs UIOR-652.
* Set exchange rate manually for purchase order line. Refs UIOR-610.
* Allow user to select data points for Export results to CSV. Refs UIOR-632.
* Clone PO does not set POL status to Pending. Refs UIOR-647.
* Export orders functionality - FE approach. Refs UIOR-645.
* Filter order/order lines by prefix or suffix. Refs UIOR-646.
* Update stripes to v6.0.0 in Thunderjet's modules. Refs UIOR-650.
* Add "Export results (CSV)" action to orders app - POL search. Refs UIOR-638.
* Fix order not loading when system cannot get exchange rate for chosen currency. Refs UIOR-642
* Add Update encumbrances order action. Refs UIOR-644
* Add personal data disclosure form. Refs UIOR-639
* Remove accessProvider field requirement. Refs UIOR-629
* Add "Export results (CSV)" action to orders app. Refs UIOR-631.

## [2.2.6](https://github.com/folio-org/ui-orders/tree/v2.2.6) (2020-11-20)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.5...v2.2.6)

* UIOR-627 fix for fix: remove extra spaces in `||` query filter param.


## [2.2.5](https://github.com/folio-org/ui-orders/tree/v2.2.5) (2020-11-19)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.4...v2.2.5)

* UIOR-627 fix for more than one related agreement

## [2.2.4](https://github.com/folio-org/ui-orders/tree/v2.2.4) (2020-11-18)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.3...v2.2.4)

* Fix improvement for unable to view PO Line when accessing via Agreements app. Refs UIOR-627

## [2.2.3](https://github.com/folio-org/ui-orders/tree/v2.2.3) (2020-11-13)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.2...v2.2.3)

* Unable to view PO Line when accessing via Agreements app. Refs UIOR-627

## [2.2.2](https://github.com/folio-org/ui-orders/tree/v2.2.2) (2020-11-12)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.1...v2.2.2)

* UIOR-609 revert - disable field location of order is not pending

## [2.2.1](https://github.com/folio-org/ui-orders/tree/v2.2.1) (2020-11-11)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.2.0...v2.2.1)

* Clone purchase order does not clone Prefix and suffix. Refs UIOR-626.
* Invoice date filters are off set by timezone somehow. Refs UINV-202.
* Add substring searching for orders and order lines search options. Refs UIOR-623
* "Orders: Can edit Order" doesn't allow me to view orders. Refs UIOR-625
* Activate "re-encumber' toggle by default when creating order. Refs UIOR-622
* Error message: Budget Expense Class not found. Refs UIOR-621.
* Orders and receiving - want to see that an order is closed in search result list. Refs UIOR-620

## [2.2.0](https://github.com/folio-org/ui-orders/tree/v2.2.0) (2020-10-09)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.1.1...v2.2.0)

* Can remove but can not edit location on Open POL. Refs UIOR-609
* Tags with ALL CAPS labels are not displayed in tag drop-down. Fix UIOR-619
* Display "Total expended" in PO summary. Refs UIOR-487
* Remove validation from fund distribution fields, leverage it to stripes-acq-components repo. Refs UIF-253
* Update POL Cost detail accordion. Refs UIOR-608
* Update create/edit form inactive fields - PO. Refs UIOR-606
* Make URL in e-resource accordion a hyperlink. Refs UIOR-600
* Update fund distribution UX. Refs UIF-245
* Update order record data layout. Refs UIOR-603
* Update layout of data on the POL. Refs UIOR-604
* Leverage common Notes route components. Refs UIORGS-184
* Fix set template values for existing order. Refs UIOR-601
* Add URL to Electronic format data. Refs UIOR-556
* Fix When adding tags to a PO or POL, the new tags do not display automatically. Refs UIOR-597
* Fix Orders: View orders permission doesn't give access to Orders app. Refs UIOR-589
* New icon for Receive. Refs UIREC-58
* New icon for "Clone". Refs UIOR-520
* Select expense class for Order & Invoice Fund distribution. Refs UIF-213
* remove duplicated id. Refs STCOM-655
* Fix Missing asterisk on location quantity fields. Refs UIOR-590

### Stories
* [UIOR-561](https://issues.folio.org/browse/UIOR-561) Migrate to react-final-form
* [UIOR-585](https://issues.folio.org/browse/UIOR-585) Add POL number to the POL details header
* [UISACQCOMP-3](https://issues.folio.org/browse/UISACQCOMP-3) Handle import of stripes-acq-components to modules and platform
* [UIOR-446](https://issues.folio.org/browse/UIOR-446) Populate linked agreement lines accordion with agreement line detail
* [UIOR-445](https://issues.folio.org/browse/UIOR-445) Add linked agreement lines accordion to the POL
* [UIOR-417](https://issues.folio.org/browse/UIOR-417) Retain filters when switching from PO to POL and back

### Bug fixes
* [UIOR-583](https://issues.folio.org/browse/UIOR-583) Can use invalid characters in prefix and suffix
* [UISACQCOMP-2](https://issues.folio.org/browse/UISACQCOMP-2) ACQ - CurrencySelect values are not translated
* [UIOR-577](https://issues.folio.org/browse/UIOR-577) Update agreement line accordion label
* [UIOR-524](https://issues.folio.org/browse/UIOR-524) Accessibility Error: Form elements must have labels

## [2.1.1](https://github.com/folio-org/ui-orders/tree/v2.1.1) (2020-07-08)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.1.0...v2.1.1)

### Stories
* [UIOR-569](https://issues.folio.org/browse/UIOR-569) Ability to change price and fund distribution information for Open order

### Bug fixes
* [UIOR-576](https://issues.folio.org/browse/UIOR-576) Reason for closure not removed from POL when reopened
* [UIOR-578](https://issues.folio.org/browse/UIOR-578) Claim filters not working
* [UIOR-572](https://issues.folio.org/browse/UIOR-572) Fund codes doesn't display in Order lines list
* [UIOR-570](https://issues.folio.org/browse/UIOR-570) Fund distributions link to existing encumbrance when order is cloned

## [2.1.0](https://github.com/folio-org/ui-orders/tree/v2.1.0) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.4...v2.1.0)

### Stories
* [UIOR-530](https://issues.folio.org/browse/UIOR-530) Improve Select location dropdown to use only select Location plugin
* [UIOR-433](https://issues.folio.org/browse/UIOR-433) Ability to change price and fund distribution information without closing order
* [UIOR-444](https://issues.folio.org/browse/UIOR-444) Ability to change quantity ordered without closing order
* [UIOR-564](https://issues.folio.org/browse/UIOR-564) Link title POL to Package POL
* [UIORGS-178](https://issues.folio.org/browse/UIORGS-178) Redirect API calls from mod-organizations-storage to mod-organzations
* [UIOR-456](https://issues.folio.org/browse/UIOR-456) Ability to "Unopen" and once again "Open" purchase orders
* [UIOR-559](https://issues.folio.org/browse/UIOR-559) Orders app: Update to Stripes v4
* [UIREC-42](https://issues.folio.org/browse/UIREC-42) Filter by Acq Unit
* [UIOR-453](https://issues.folio.org/browse/UIOR-453) Ability to change Vendor and Bill to and Ship to without closing order
* [UIOR-497](https://issues.folio.org/browse/UIOR-497) Prevent deletion of prefix/suffix values that are in use
* [UIOR-539](https://issues.folio.org/browse/UIOR-539) Disable Buttons after user clicks "Save and Close" or "Save and open purchase order"
* [UIOR-495](https://issues.folio.org/browse/UIOR-495) Populate poNumberPrefix & poNumberSuffix fields on order creation
* [UIOR-518](https://issues.folio.org/browse/UIOR-518) Display "Total encumbered" in PO summary
* [UIOR-531](https://issues.folio.org/browse/UIOR-531) Display order closed and reason for closure on POL
* [UINV-138](https://issues.folio.org/browse/UINV-138) Align actions icons in table to right hand side of view pane(s)
* [UIOR-540](https://issues.folio.org/browse/UIOR-540) Add loading indicator when selecting new records

### Bug fixes
* [UIOR-493](https://issues.folio.org/browse/UIOR-493) Display the PO Line record when a new PO Line is added
* [UIOR-567](https://issues.folio.org/browse/UIOR-567) Can not tell that order has been cloned successfully
* [UIOR-565](https://issues.folio.org/browse/UIOR-565) Ongoing order not saving when not using template

## [2.0.5](https://github.com/folio-org/ui-orders/tree/v2.0.5) (2020-05-13)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.4...v2.0.5)

### Bug fixes
* [UIOR-562](https://issues.folio.org/browse/UIOR-562) Created By shows last clicked User name

## [2.0.4](https://github.com/folio-org/ui-orders/tree/v2.0.4) (2020-04-24)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.3...v2.0.4)

### Bug fixes
* [UIOR-555](https://issues.folio.org/browse/UIOR-555) Refine styling of Title field at PO Line form
* [UIOR-554](https://issues.folio.org/browse/UIOR-554) Click on instance doesn't select it and plugin-find-instance doesn't close
* [UIOR-552](https://issues.folio.org/browse/UIOR-552) Can not remove product ID without disconnecting instance

## [2.0.3](https://github.com/folio-org/ui-orders/tree/v2.0.3) (2020-04-09)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.2...v2.0.3)

### Stories
* [UIOR-516](https://issues.folio.org/browse/UIOR-516) opt-in to Load More in Lists of orders and lines

## [2.0.2](https://github.com/folio-org/ui-orders/tree/v2.0.2) (2020-04-06)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.1...v2.0.2)

### Bug fixes
* [UIOR-543](https://issues.folio.org/browse/UIOR-543) Permission issue with Orders: create order
* [UIOR-537](https://issues.folio.org/browse/UIOR-537) 'Check-in Items' permission still shows in permissions list

## [2.0.1](https://github.com/folio-org/ui-orders/tree/v2.0.1) (2020-03-30)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v2.0.0...v2.0.1)

### Stories
* [UIOR-508](https://issues.folio.org/browse/UIOR-508) TECH-DEBT refactor PO list to not use SearchAndSort
* [UIOR-529](https://issues.folio.org/browse/UIOR-529) New icon for "Open order"

### Bug fixes
* [UIOR-536](https://issues.folio.org/browse/UIOR-536) Can not edit POL in testing or snapshot
* [UIOR-535](https://issues.folio.org/browse/UIOR-535) Cancel POL creation doesn't reload PO

## [2.0.0](https://github.com/folio-org/ui-orders/tree/v2.0.0) (2020-03-13)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.8.3...v2.0.0)

* bump the @folio/stripes peer to v3.0.0

### Stories
* [UIREC-60](https://issues.folio.org/browse/UIREC-60) Improve Location filter on the Titles list to use location look-up
* [UIOR-439](https://issues.folio.org/browse/UIOR-439) Migrate orders settings from mod-configuration
* [UIOR-521](https://issues.folio.org/browse/UIOR-521) New icon for "Close order"
* [UIOR-507](https://issues.folio.org/browse/UIOR-507) TECH-DEBT refactor PO Lines list to not use SearchAndSort
* [UIOR-471](https://issues.folio.org/browse/UIOR-471) Update purchase order "Renewal information" accordion
* [UIOR-506](https://issues.folio.org/browse/UIOR-506) Replace org selection components with organization lookup
* [UIOR-491](https://issues.folio.org/browse/UIOR-491) Cloning a PO and its POL(s)
* [UIOR-457](https://issues.folio.org/browse/UIOR-457) Ability to "Reopen" and once again "Close" purchase orders
* [UIOR-509](https://issues.folio.org/browse/UIOR-509) Move record action buttons into "Action" button UX pattern
* [UIOR-505](https://issues.folio.org/browse/UIOR-505) Use system default currency as default POL currency (Remove org limit)
* [UIOR-358](https://issues.folio.org/browse/UIOR-358) Vendor doesn't display in purchase order even though assigned
* [UIOR-486](https://issues.folio.org/browse/UIOR-486) Display purchase order "total estimated price" in system currency
* [UIOR-472](https://issues.folio.org/browse/UIOR-472) Display encumbered value on POL for orders made in currency other than system currency
* [UIOR-494](https://issues.folio.org/browse/UIOR-494) Update settings permission label
* [UIOR-499](https://issues.folio.org/browse/UIOR-499) Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1
* [UIOR-492](https://issues.folio.org/browse/UIOR-492) Update for new interface versions of circulation and inventory
* [UIOR-239](https://issues.folio.org/browse/UIOR-239) Add "Package" checkbox to POL
* [UIREC-38](https://issues.folio.org/browse/UIREC-38) Allow user to access receiving by Title area
* [UIOR-432](https://issues.folio.org/browse/UIOR-432) Add or update call number during receiving/checkin
* [UIOR-465](https://issues.folio.org/browse/UIOR-465) Error Message: No budget for this fund and fiscal year
* [UIOR-402](https://issues.folio.org/browse/UIOR-402) Display the Date received checked-in pieces

### Bug fixes
* [UIOR-333](https://issues.folio.org/browse/UIOR-333) Error not displayed, if close order fails
* [UIOR-303](https://issues.folio.org/browse/UIOR-303) Fix the ghost text placeholders for PO and POL searches
* [UIOR-504](https://issues.folio.org/browse/UIOR-504) Fix the alphabetical order of 3 order setting dropdowns
* [UIOR-503](https://issues.folio.org/browse/UIOR-503) Can not open package order with P/E Mix format
* [UIOR-501](https://issues.folio.org/browse/UIOR-501) Add "Package" checkbox to POL Details pane
* [UIOR-502](https://issues.folio.org/browse/UIOR-502) Plus action appears when POL isPackage = true

## [1.8.3](https://github.com/folio-org/ui-orders/tree/v1.8.3) (2020-01-04)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.8.2...v1.8.3)

* Handle more error codes on save PO and PO line to provide more meaningful messages

## [1.8.2](https://github.com/folio-org/ui-orders/tree/v1.8.2) (2019-12-18)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.8.1...v1.8.2)

### Bug fixes
* [UIOR-460](https://issues.folio.org/browse/UIOR-460) Capture cost information and fund distributions in the currency selected at POL
* [UIOR-381](https://issues.folio.org/browse/UIOR-381) Template fix: Currency
* [UIOR-478](https://issues.folio.org/browse/UIOR-478) Invoices from the previous order is shown
* [UIOR-485](https://issues.folio.org/browse/UIOR-485) "Check-in error" when using "Check-in" in "Add piece" modal
* [UIOR-482](https://issues.folio.org/browse/UIOR-482) Can't create more "closing purchase order reasons"
* [UIOR-483](https://issues.folio.org/browse/UIOR-483) Orders: Can't filter on 'reason for closure'

## [1.8.1](https://github.com/folio-org/ui-orders/tree/v1.8.1) (2019-12-12)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.8.0...v1.8.1)

### Bug fixes
* [UIOR-462](https://issues.folio.org/browse/UIOR-462) Cannot fill in any of the cost detail fields in Order Templates
* [UINV-96](https://issues.folio.org/browse/UINV-96) Closing reasons are not loaded
* [UIOR-464](https://issues.folio.org/browse/UIOR-464) Calculation of estimated price in cost details sometimes blocks POLs from being created/saved
* [UIOR-470](https://issues.folio.org/browse/UIOR-470) Users is requested with MAX_INT limit which requests all users

## [1.8.0](https://github.com/folio-org/ui-orders/tree/v1.8.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.7.1...v1.8.0)

### Stories
* [UIOR-431](https://issues.folio.org/browse/UIOR-431) Prevent encumbering with Funds that have insufficient amounts to cover distribution
* [UIOR-451](https://issues.folio.org/browse/UIOR-451) Item details: UUID not connected message
* [UIOR-376](https://issues.folio.org/browse/UIOR-376) For receiving and check-in of POLs, only display Item status = In process
* [UIOR-284](https://issues.folio.org/browse/UIOR-284) Infinite scroll for POL table on PO - add end of the list marker
* [UIOR-248](https://issues.folio.org/browse/UIOR-248) In receiving piece screen, keep copies for the same location next to each other
* [UIOR-231](https://issues.folio.org/browse/UIOR-231) Add setting for specifying loan-type to use when creating items in mod-orders
* [UIOR-229](https://issues.folio.org/browse/UIOR-229) Add setting for specifying instance-type to use when creating instances in mod-orders
* [UIOR-230](https://issues.folio.org/browse/UIOR-230) Add setting for specifying instance-status to use when creating instances in mod-orders
* [UIOR-452](https://issues.folio.org/browse/UIOR-452) Add Canceled as reason for closure
* [UIOR-435](https://issues.folio.org/browse/UIOR-435) Resequence the POL accordions in the Order template
* [UIOR-434](https://issues.folio.org/browse/UIOR-434) Resequence the accordions in the POL View and Create/Edit Screens
* [UIOR-285](https://issues.folio.org/browse/UIOR-285) Refine the POL notes handling
* [UIOR-430](https://issues.folio.org/browse/UIOR-430) POL item details: Replace instance UUID with user friendly message
* [UIOR-281](https://issues.folio.org/browse/UIOR-281) Save and open PO from POL create/edit
* [UIOR-210](https://issues.folio.org/browse/UIOR-210) Enhance PO number prefix and suffix CRUD
* [UIOR-341](https://issues.folio.org/browse/UIOR-341) Acq Unit handling in the PO when Template is used
* [UIOR-340](https://issues.folio.org/browse/UIOR-340) Add Acq Unit to the Order Template
* [UIOR-342](https://issues.folio.org/browse/UIOR-342) Add PO and PO Line tags to the Order Template
* [UIOR-379](https://issues.folio.org/browse/UIOR-379) Template fix: Account number
* [UIOR-414](https://issues.folio.org/browse/UIOR-414) Reduce the identifier types in the POL dropdown list
* [UIOR-420](https://issues.folio.org/browse/UIOR-420) Update POL layout for create and edit
* [UIOR-418](https://issues.folio.org/browse/UIOR-418) Orders: Update "save and close" and "Cancel" Buttons - UX
* [UIOR-377](https://issues.folio.org/browse/UIOR-377) Show indicator of open requests during receiving and check-in
* [UIOR-279](https://issues.folio.org/browse/UIOR-279) Filter Orders by Tags
* [UIOR-283](https://issues.folio.org/browse/UIOR-283) Have a setting allowing for save+open PO
* [UIOR-275](https://issues.folio.org/browse/UIOR-275) Filter order lines by Tags
* [UIOR-377](https://issues.folio.org/browse/UIOR-377) Show indicator of open requests during receiving and check-in
* [UIOR-370](https://issues.folio.org/browse/UIOR-370) Order: Create fund distributions based on percentage or amount
* [UIOR-4](https://issues.folio.org/browse/UIOR-4) Assign tags to Order Records
* [UIOR-375](https://issues.folio.org/browse/UIOR-375) For receiving and check-in of single-title POLs, only allow Item status = In process
* [UIOR-274](https://issues.folio.org/browse/UIOR-274) Normalize ISBNs for ISBN Product ID searching in Order lines
* [UIOR-332](https://issues.folio.org/browse/UIOR-332) Add validation to POL product id field if product id type is isbn
* [UIOR-406](https://issues.folio.org/browse/UIOR-406) Change the PO/POL default filters to be empty
* [UIOR-393](https://issues.folio.org/browse/UIOR-393) Change UI for POL Contributor and Product ID fields to grid format and add Qualifier
* [UIOR-392](https://issues.folio.org/browse/UIOR-392) Move ISBN Qualifier to separate field in UI Create/Edit screen
* [UIOR-383](https://issues.folio.org/browse/UIOR-383) Edit POL from view POL in the three pane POL search layout
* [UIOR-339](https://issues.folio.org/browse/UIOR-339) Expected receipt date for individual pieces
* [UIOR-373](https://issues.folio.org/browse/UIOR-373) Reduce the Resource identifier types that are added to the POL from an Instance
* [UIOR-374](https://issues.folio.org/browse/UIOR-374) Allow deletion of Product IDs from the POL without removing the link to the Instance
* [UIOR-348](https://issues.folio.org/browse/UIOR-348) Store/Retrieve order templates in new order-templates API

### Bug fixes
* [UIOR-459](https://issues.folio.org/browse/UIOR-459) Cannot save tenant address
* [UIOR-455](https://issues.folio.org/browse/UIOR-455) Cancel button on PO and POL form is now labeled "Close"
* [UIOR-442](https://issues.folio.org/browse/UIOR-442) Creating 2nd PO automatically does not work
* [UIOR-448](https://issues.folio.org/browse/UIOR-448) PO/POL fields are editable for closed orders
* [UIOR-428](https://issues.folio.org/browse/UIOR-428) Cannot remove Vendor ref number once it has been saved in POL
* [UIOR-443](https://issues.folio.org/browse/UIOR-443) Dirty form message appearing when clicking "Save and open order"
* [UIOR-423](https://issues.folio.org/browse/UIOR-423) Receiving data input modal is too dark
* [UIOR-416](https://issues.folio.org/browse/UIOR-416) Prefixes/Suffixes not in alpha order in settings or PO dropdown
* [UIOR-409](https://issues.folio.org/browse/UIOR-409) Filter Material type, electronic, does not support search on 'recording'
* [UIOR-391](https://issues.folio.org/browse/UIOR-391) T3232 Order templates are preventing the changing of POL order format
* [UIOR-404](https://issues.folio.org/browse/UIOR-404) Sort order for templates varies
* [UIOR-390](https://issues.folio.org/browse/UIOR-390) T3235 Template causing issues in creating Ongoing Order + PO Line
* [UIOR-380](https://issues.folio.org/browse/UIOR-380) Template fix: E-resource details accordion
* [UIOR-378](https://issues.folio.org/browse/UIOR-378) Template fix: Renewal Info accordion
* [UIOR-357](https://issues.folio.org/browse/UIOR-357) Template fix: 0 price in order template should carry over to POL
* [STCOM-590](https://issues.folio.org/browse/STCOM-590) ACQ Apps: MCL column width updates
* [UIOR-363](https://issues.folio.org/browse/UIOR-363) POL Column headers and results not aligned in 3 pane display
* [UIOR-336](https://issues.folio.org/browse/UIOR-336) Fix sentence capitalization in Orders app
* [UIOR-330](https://issues.folio.org/browse/UIOR-330) Inconsistent date formats in orders
* [UIOR-356](https://issues.folio.org/browse/UIOR-356) Locations in POL dropdown should be in alphabetical order

## [1.7.1](https://github.com/folio-org/ui-orders/tree/v1.7.1) (2019-09-25)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.7.0...v1.7.1)

### Bug Fixes
* [UIOR-386](https://issues.folio.org/browse/UIOR-386) POL check box is not displaying as active in receiving and receiving history
* [UIOR-405](https://issues.folio.org/browse/UIOR-405) Fix bug with reassign template when editing new PO
* [UIOP-404](https://issues.folio.org/browse/UIOR-404) Fix sort order for template varies

## [1.7.0](https://github.com/folio-org/ui-orders/tree/v1.7.0) (2019-09-11)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.6.0...v1.7.0)

### Stories
* [UIOR-316](https://issues.folio.org/browse/UIOR-316) Create Acq Unit secondary filter option for Orders
* [UIOR-310](https://issues.folio.org/browse/UIOR-310) Revise the Orders search results list columns to include "Acquisition units"
* [UIOR-300](https://issues.folio.org/browse/UIOR-300) Ability to assign acquisition unit(s) to order records
* [UIOR-235](https://issues.folio.org/browse/UIOR-235) Settings: require approval for orders to be opened
* [UIOR-234](https://issues.folio.org/browse/UIOR-234) Require order approval to "open" order
* [UIOR-123](https://issues.folio.org/browse/UIOR-123) PO and PO Line: Add "Related Invoices" accordion

### Bug Fixes
* [UIOR-367](https://issues.folio.org/browse/UIOR-367) POL Keyword search not working
* [UIOR-364](https://issues.folio.org/browse/UIOR-364) Order templates not in alphabetical order
* [UIOR-362](https://issues.folio.org/browse/UIOR-362) Bill-to Ship-to address not aligned properly
* [UIOR-345](https://issues.folio.org/browse/UIOR-345) Cannot select an inventory instance from a filter search
* [UIOR-337](https://issues.folio.org/browse/UIOR-337) Wrong order displaying when there are reference integrity problems with the record
* [UIOR-335](https://issues.folio.org/browse/UIOR-335) PO Template name not required
* [UIOR-328](https://issues.folio.org/browse/UIOR-328) Material type should have asterisk if required

## [1.6.0](https://github.com/folio-org/ui-orders/tree/v1.6.0) (2019-07-23)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.5.0...v1.6.0)

* [UIOR-301](https://issues.folio.org/browse/UIOR-301) Create PO and POL(s) using order templates
* [UIOR-318](https://issues.folio.org/browse/UIOR-318) poLine.source is an enum
* [UIOR-244](https://issues.folio.org/browse/UIOR-244) Allow user to specify a contributor-name-type for each contributor added to POL
* [UIOR-262](https://issues.folio.org/browse/UIOR-262) Create the secondary search options for Orders
* [UIOR-266](https://issues.folio.org/browse/UIOR-266) Create the secondary filter options for Orders
* [UIOR-268](https://issues.folio.org/browse/UIOR-268) Create the secondary filter options for Order Lines
* [UIOR-246](https://issues.folio.org/browse/UIOR-246) Automatically select the piece for receiving when adding barcode
* [UIOR-269](https://issues.folio.org/browse/UIOR-269) Revise the Orders search results list columns
* [UIOR-277](https://issues.folio.org/browse/UIOR-277) Change PO vendor lookup to filterable select list and filter out both non-vendors and inactive vendor
* [UIOR-238](https://issues.folio.org/browse/UIOR-238) View, Edit and delete "Order templates"
* [UIOR-264](https://issues.folio.org/browse/UIOR-264) Create the secondary search options for Order lines
* [UIOR-237](https://issues.folio.org/browse/UIOR-237) Create order templates in settings
* [UIOR-294](https://issues.folio.org/browse/UIOR-294) Allow select PO and POL fields to be edited when order is open
* [UIOR-302](https://issues.folio.org/browse/UIOR-302) Remove purchase-order.owner field
* [UIOR-256](https://issues.folio.org/browse/UIOR-256) Separate permission for deleting PO from view, create and edit PO perms
* [UIOR-245](https://issues.folio.org/browse/UIOR-245) When receiving a single line PO, automatically select the line for receipt

## [1.5.0](https://github.com/folio-org/ui-orders/tree/v1.5.0) (2019-06-12)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.4.0...v1.5.0)
### Story
* [UIOR-252](https://issues.folio.org/browse/UIOR-252) Allow edit and deletion of pending check-in pieces
* [UIOR-261](https://issues.folio.org/browse/UIOR-261) Create the primary search options for Orders
* [UIOR-255](https://issues.folio.org/browse/UIOR-255) Reconfigure the PO remove button and add confirmation modal
* [UIOR-257](https://issues.folio.org/browse/UIOR-257) UI fix: change "remove" buttons to trashcans in PO and POL
* [UIOR-258](https://issues.folio.org/browse/UIOR-258) Reconfigure the POL remove button and add confirmation modal
* [UIOR-27](https://issues.folio.org/browse/UIOR-27) Reorganize the search and filter pane on the Orders landing page
* [UIOR-91](https://issues.folio.org/browse/UIOR-91) Enhance Bill To and Ship addresses
* [UIOR-206](https://issues.folio.org/browse/UIOR-206) Search and filter by Date Ordered and Receipt Status
* [UIOR-212](https://issues.folio.org/browse/UIOR-212) Display "Piece format" in Check-in area and wizard table
* [UIOR-219](https://issues.folio.org/browse/UIOR-219) Add appropriate error message on missing instance-status
* [UIOR-220](https://issues.folio.org/browse/UIOR-220) Display owner column in PO result list
* [UIOR-222](https://issues.folio.org/browse/UIOR-222) Add appropriate error message on missing instance-type
* [UIOR-223](https://issues.folio.org/browse/UIOR-223) Add appropriate error message on missing loan-type
* [UIOR-226](https://issues.folio.org/browse/UIOR-226) Access Receiving/Checkin history for closed orders
* [UIOR-227](https://issues.folio.org/browse/UIOR-227) move "Owner" field to PO level
* [UIOR-228](https://issues.folio.org/browse/UIOR-228) Capture instance uuid and product id's when user selects instance
* [UIOR-240](https://issues.folio.org/browse/UIOR-240) Allow user to choose specific item status when receiving or checking in
* [UIOR-263](https://issues.folio.org/browse/UIOR-263) Create the primary search options for Order lines
* [UIOR-265](https://issues.folio.org/browse/UIOR-265) Create the primary filter options for Orders
* [UIOR-267](https://issues.folio.org/browse/UIOR-267) Create the primary filter options for Order Lines
* [UIOR-270](https://issues.folio.org/browse/UIOR-270) Revise the Order Lines search results list columns
* [UIOR-276](https://issues.folio.org/browse/UIOR-276) Support PoLine FundDistribution schema updates from UI
* [UIOR-288](https://issues.folio.org/browse/UIOR-288) PO Line: product id type is uuid
* [UIOR-289](https://issues.folio.org/browse/UIOR-289) Navigation to PO details from POL details (order lines screen)
### Bug
* [UIOR-296](https://issues.folio.org/browse/UIOR-296) Make the acquisitions addresses retain line breaks
* [UIOR-201](https://issues.folio.org/browse/UIOR-201) English words/phrases showing up in FOLIO Apps UI while in RTL - Requests App Settings
* [UIOR-218](https://issues.folio.org/browse/UIOR-218) UI validation is unsynced with back-end for location quantities
* [UIOR-225](https://issues.folio.org/browse/UIOR-225) PO Line number label is different on different screens
* [UIOR-241](https://issues.folio.org/browse/UIOR-241) To not fetch publication date from inventory if it's not a 4-char year
* [UIOR-292](https://issues.folio.org/browse/UIOR-292) Suppress up/down arrow for search results columns that cannot be sorted

## [1.4.0](https://github.com/folio-org/ui-orders/tree/v1.4.0) (2019-05-03)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.3.1...v1.4.0)
* UIOR-218 UI validation is unsynced with back-end for location quantities
* UIOR-214 Update PO search result list columns
* UIOR-215 Update POL table columns
* UIOR-213 move item details accordion to top of view
* UIOR-137 Error Modal: Order has inactive Vendor/Access Provider
* UIOR-209 Switch to mod-organizations-storage
* UIOR-207 allow user to add comment to Piece when receiving
* UIOR-184 Add data to POL based on vendor
* UIOR-167 Checkin: Add Pieces for a Purchase Order Line with newly added Item through plugin
* UIOR-147 Align POL Payment and Receipt status with PO Status
* UIOR-175 Infinite scroll in receiving history
* UIOR-193 update order error in modal window
* UIOR-120 Purchase Order Line - Material Type
* UIOR-192-added required attribute for Item Details title field
* UIOR-129 Settings: display system-supplied reasons for closure in settings area
* UIOR-159 Access Checkin History and Remove Items
* UIOR-173 Check-in Pieces for a Purchase Order Line
* UIOR-186 add piece modal
* UIOR-180 Ordering: Open Order action
* UIOR-161 Check-in button and Check-in items list
* UIOR-188 Filtering by status doesn't work for order results
* UIOR-185 Adjustments to piece and receivingHistory
* UIOR-132 Column sorting doesn't work for order results
* UIOR-149 Orders Settings Create Inventory

## [1.3.1](https://github.com/folio-org/ui-orders/tree/v1.3.1) (2019-03-22)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.3.0...v1.3.1)
* Translations updated

## [1.3.0](https://github.com/folio-org/ui-orders/tree/v1.3.0) (2019-03-22)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.2.0...v1.3.0)
* UIOR-134 Support on UI Refactoring of POLine model - Schemas
* UIOR-140 PO Line: Physical quantities validation error message
* UIOR-141 Purchase Order: Display Total estimated price and remove adjustments
* UIOR-142 Purchase Order Lines: Update cost information accordion to include additional costs and discount fields
* UIOR-155 Receiving: Access Receiving items pane from Orders
* UIOR-160 Receiving: View Receiving History for a Purchase Order
* UIOR-162 Receiving: Access the Piece Details Wizard
* UIOR-163 Receiving: Remove function Receiving History for a Purchase Order
* UIOR-164 Receiving: Access "Receiving History" for a PO
* UIOR-165 Order: Receiving Button logic Update
* UIOR-166 Receiving: Receiving items pane logic and update table columns
* UIOR-168 Receiving: Access Receiving items pane from Orders (PO Line pane)
* UIOR-169 Show info from inventory in Receiving list
* UIOR-170 Receiving: Access the Piece Details Wizard and update receiving workflow
* UIOR-171 Piece Details Wizard: Final review in modal and click receive
* UIOR-174 Receiving: Receive items from a PO Line quantity

## [1.2.0](https://github.com/folio-org/ui-orders/tree/v1.2.0) (2019-02-22)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.1.1...v1.2.0)

* UIOR-111 Adjustments to PO Line number field on create/edit PO Line forms
* UIOR-121 PO Line: add "Locations" accordion and associated fields
* UIOR-122 Create POL: Populate "Item Details" using Instance information when selecting an existing title
* UIOR-116 ui-orders needs to be made compatible with updated mod-vendors interfaces
* UIOR-71 Adjustments to po_number field on create/edit order forms
* UIOR-75 Show PO line limit exceeded error message
* UIREC-12 Receiving: Access Receiving items pane from Orders (PO Line pane)
* UIREC-11 Create new component 'Update Item Details'
* UIREC-1 Receiving: Access Receiving items pane from Orders
* UIREC-2 Receiving: Receive items from a PO Line quantity
* UIREC-7 Create Receive Button
* FOLIO-1720 bump up to 3.0 orders OKAPI

## [1.1.1](https://github.com/folio-org/ui-orders/tree/v1.1.1) (2019-01-16)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.1.0...v1.1.1)

* UIOR-101 bumped up version of OKAPI mod-orders to 2.0.1
* UIOR-84 Edit PO Line -> Labels for header and Delete button

## [1.1.0](https://github.com/folio-org/ui-orders/tree/v1.1.0) (2019-01-15)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.0.0...v1.1.0)

* UIOR-46 Close order
* UIOR-70 PO: identify a reason for closure
* UIOR-66 PO Line Item Details: Type new Title or select a Title from inventory instances
* UIOR-9, UIOR-13 Unit tests (BigTest Mirage config) /orders API
* UIOR-59 Integrate PO Line Edit and Details with back-end API
* UIOR-60 PO Line: Update Activation Due field view properties
* UIOR-52 PO Line Details: Update possible "Order Formats"
* fix UIOR-79 Setting for PO Line Limit not actually being saved
* fix UIOR-90 Edit Order: Unable to clear Assigned To field
* fix UIOR-82 Indicate empty required field within accordions while creating Purchase Order Lines
* fix UIOR-85 Create/Edit Purchase Order -> Empty Notes

## [1.0.0](https://github.com/folio-org/ui-orders/tree/v1.0.0) (2018-12-07)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v0.1.0...v1.0.0)

* Revise requirements of fields on PO and PO Line forms (UIOR-48).
* PO Line: Add "Physical Resource Details" accordion and associated fields (UIOR-45).
* PO Line: Add "e-Resource Details" accordion and associated fields (UIOR-44).
* PO Line: Add "Item Details" accordion and associated fields (UIOR-43).
* PO Line: Add "Vendor" accordion and associated fields (UIOR-41).
* PO Line: Add "Fund Distribution" accordion and associated fields (UIOR-40).
* PO Line: Add "Cost Details" accordion and associated fields (UIOR-39).
* PO Line: Align Editable "PO Line Details" fields with Mockup (UIOR-38).
* Align editable Purchase Order Fields with Mockup (UIOR-36).
* Create Adjustments block (UIOR-35).
* Update PO Line - Receipt Status list values (UIOR-28).
* Call mod-orders (/orders/id) to get Composite Purchase Order (UIOR-26).
* Settings - Limit number of Purchase Order Lines per purchase order (UIOR-11).

## 0.1.0

* New app created with stripes-cli
