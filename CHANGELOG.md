# Change history for ui-orders

## (IN PROGRESS)

* Filter order lines by Expense class. Refs UIOR-678.
* Resizable Panes - Persistence. Refs UIOR-683.
* Apply Results list column chooser. Refs UIOR-691.
* Filter order by subscription = yes/no. Refs UIOR-710.
* Add linked instances accordion to the POL. Refs UIOR-689.

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
