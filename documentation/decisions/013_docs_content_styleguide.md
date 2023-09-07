---
status: Approved
date: 2023-09-01
deciders: nwithan8
---

### Inter-section linking

- Any reference to an EasyPost object structure (e.g. `Address`, `Shipment`, `Order`) is linked to the corresponding section.
  - References to an EasyPost object as a type in a definition table (e.g. the `to_address` field of a `Shipment` is an `Address`) are linked to that object's definition table (e.g. the `Address` object definition table on the Address page).
  - References to an EasyPost object in a text paragraph (e.g. "Check out the `to_address` field.") are linked to the API documentation section for that object (e.g. the top of the Address page).

- Any reference to another function (e.g. mentioning buying a shipment in the Refund section) is linked to that function's section.

- No section is linked to itself.
  - The first mention of an EasyPost object in its own section is linked to its definition table.

- Avoid excessive linking by linking only the first mention of an EasyPost object or function in a section.
  - For example, if `Shipment` is mentioned multiple times in the same paragraph, only the first mention is linked.
  - This rule does not apply to object definition tables, which should link every mention of an EasyPost object (e.g. both `to_address` and `from_address` of a `Shipment` should link to the `Address` definition table)


### Naming and styling

- There are several places where the same word is used in two different contexts (e.g. a "shipment", meaning the action of a package moving, versus a "Shipment", the EasyPost object that a developer would interact with).
  - Only capitalize the word when referring to the EasyPost object (and link to the object's section accordingly).

- EasyPost object names should be pascal-cased, wrapped in backticks (\`) to render them as inline code and (as needed) linked to the appropriate section.
  - For example, "TaxIdentifier", not "Tax Identifier"

- Use the singular form of the object name (e.g. "Shipment", not "Shipments") whenever possible.
  - If the plural form is needed, attempt to use the singular form (e.g. "a list of `Shipment` objects" instead of "a list of `Shipments`").
  - If the plural form is unavoidable, include the plural modifier inside the backticks (e.g. `Shipments`, not `Shipment`s).

- Do not include possessive modifiers inside the backticks (e.g. "the `Shipment`'s element", not "the `Shipment's` element").

#### Punctuation

- Use the Oxford comma (e.g. "a, b, and c" instead of "a, b and c").

- Always end a paragraph sentence with a period, even if it is a single sentence.

- Do not use a period at the end of a bulleted list item, unless the item is a grammatically-complete sentence.
  - If the bulleted list item is more than one sentence, use a period at the end of each sentence.


### Common inconsistencies:

- Use "list", not "List" when referring to the verb (e.g. "list shipments") or noun (e.g. "a list of shipments").
  - Use "retrieve all" when referring to the action of retrieving all objects (listing) of a certain type (e.g. "retrieve all shipments"). Do not use the verb "list" in this context.

- API keys should be referred to as "Production API Key" and "Test API Key" (case-sensitive).

- Use "ID" when referring to an object's identifier (e.g. "check the `Shipment`'s ID"). Use `id` when referring to the `id` field of an object (e.g. "the `Shipment`'s `id` field"). Do not use "Id" in any context.
