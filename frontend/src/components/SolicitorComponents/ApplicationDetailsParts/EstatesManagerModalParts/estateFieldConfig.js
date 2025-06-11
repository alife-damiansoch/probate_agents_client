// estateFieldConfig.js
export const estateFieldMap = {
  real_and_leasehold: [
    { name: 'address', label: 'Address', type: 'textarea' },
    {
      name: 'county',
      label: 'County',
      type: 'select',
      options: [
        { value: '', label: 'Select County' },
        // Dublin Postal Districts
        { value: 'Dublin 1', label: 'Dublin 1' },
        { value: 'Dublin 2', label: 'Dublin 2' },
        { value: 'Dublin 3', label: 'Dublin 3' },
        { value: 'Dublin 4', label: 'Dublin 4' },
        { value: 'Dublin 5', label: 'Dublin 5' },
        { value: 'Dublin 6', label: 'Dublin 6' },
        { value: 'Dublin 6W', label: 'Dublin 6W' },
        { value: 'Dublin 7', label: 'Dublin 7' },
        { value: 'Dublin 8', label: 'Dublin 8' },
        { value: 'Dublin 9', label: 'Dublin 9' },
        { value: 'Dublin 10', label: 'Dublin 10' },
        { value: 'Dublin 11', label: 'Dublin 11' },
        { value: 'Dublin 12', label: 'Dublin 12' },
        { value: 'Dublin 13', label: 'Dublin 13' },
        { value: 'Dublin 14', label: 'Dublin 14' },
        { value: 'Dublin 15', label: 'Dublin 15' },
        { value: 'Dublin 16', label: 'Dublin 16' },
        { value: 'Dublin 17', label: 'Dublin 17' },
        { value: 'Dublin 18', label: 'Dublin 18' },
        { value: 'Dublin 20', label: 'Dublin 20' },
        { value: 'Dublin 22', label: 'Dublin 22' },
        { value: 'Dublin 24', label: 'Dublin 24' },
        // County Dublin (for areas outside numbered districts)
        { value: 'Co. Dublin', label: 'Co. Dublin' },
        // Other Counties (alphabetical)
        { value: 'Antrim', label: 'Antrim' },
        { value: 'Armagh', label: 'Armagh' },
        { value: 'Carlow', label: 'Carlow' },
        { value: 'Cavan', label: 'Cavan' },
        { value: 'Clare', label: 'Clare' },
        { value: 'Cork', label: 'Cork' },
        { value: 'Derry', label: 'Derry' },
        { value: 'Donegal', label: 'Donegal' },
        { value: 'Down', label: 'Down' },
        { value: 'Fermanagh', label: 'Fermanagh' },
        { value: 'Galway', label: 'Galway' },
        { value: 'Kerry', label: 'Kerry' },
        { value: 'Kildare', label: 'Kildare' },
        { value: 'Kilkenny', label: 'Kilkenny' },
        { value: 'Laois', label: 'Laois' },
        { value: 'Leitrim', label: 'Leitrim' },
        { value: 'Limerick', label: 'Limerick' },
        { value: 'Longford', label: 'Longford' },
        { value: 'Louth', label: 'Louth' },
        { value: 'Mayo', label: 'Mayo' },
        { value: 'Meath', label: 'Meath' },
        { value: 'Monaghan', label: 'Monaghan' },
        { value: 'Offaly', label: 'Offaly' },
        { value: 'Roscommon', label: 'Roscommon' },
        { value: 'Sligo', label: 'Sligo' },
        { value: 'Tipperary', label: 'Tipperary' },
        { value: 'Tyrone', label: 'Tyrone' },
        { value: 'Waterford', label: 'Waterford' },
        { value: 'Westmeath', label: 'Westmeath' },
        { value: 'Wexford', label: 'Wexford' },
        { value: 'Wicklow', label: 'Wicklow' },
      ],
    },
    {
      name: 'nature',
      label: 'Nature of Property',
      type: 'multiselect',
      options: [
        // Lands
        { value: 'Agricultural', label: 'Agricultural', category: 'Lands' },
        { value: 'Development', label: 'Development', category: 'Lands' },
        {
          value: 'Residential (Lands)',
          label: 'Residential',
          category: 'Lands',
        },
        { value: 'Commercial (Lands)', label: 'Commercial', category: 'Lands' },
        { value: 'Mix (Lands)', label: 'Mix', category: 'Lands' },
        { value: 'Single Site', label: 'Single Site', category: 'Lands' },
        // Buildings
        {
          value: 'Residential (Buildings)',
          label: 'Residential',
          category: 'Buildings',
        },
        {
          value: 'Commercial (Buildings)',
          label: 'Commercial',
          category: 'Buildings',
        },
        { value: 'Retail', label: 'Retail', category: 'Buildings' },
        { value: 'Industrial', label: 'Industrial', category: 'Buildings' },
        {
          value: 'Agricultural (Buildings)',
          label: 'Agricultural',
          category: 'Buildings',
        },
        { value: 'Mix (Buildings)', label: 'Mix', category: 'Buildings' },
        { value: 'Office', label: 'Office', category: 'Buildings' },
      ],
    },
    { name: 'value', label: 'Value', type: 'number' },
  ],
  household_contents: [{ name: 'value', label: 'Value', type: 'number' }],
  cars_boats: [{ name: 'value', label: 'Value', type: 'number' }],
  business_farming: [{ name: 'value', label: 'Value', type: 'number' }],
  business_other: [{ name: 'value', label: 'Value', type: 'number' }],
  unpaid_purchase_money: [{ name: 'value', label: 'Value', type: 'number' }],
  financial_assets: [
    {
      name: 'institution',
      label: 'Institution',
      type: 'select',
      options: [
        { value: '', label: 'Select Institution' },
        // Major Banks
        {
          value: 'Allied Irish Banks (AIB)',
          label: 'Allied Irish Banks (AIB)',
        },
        { value: 'Bank of Ireland', label: 'Bank of Ireland' },
        { value: 'Permanent TSB', label: 'Permanent TSB' },
        { value: 'Ulster Bank', label: 'Ulster Bank' },
        // Building Society
        { value: 'EBS Building Society', label: 'EBS Building Society' },
        // Credit Union
        { value: 'Credit Union', label: 'Credit Union' },
        // Post Office
        { value: 'An Post', label: 'An Post (Post Office)' },
        // Insurance Companies
        { value: 'Irish Life', label: 'Irish Life' },
        { value: 'Zurich Life', label: 'Zurich Life' },
        { value: 'Aviva', label: 'Aviva' },
        // Other
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      name: 'other_institution',
      label: 'Other Institution Name',
      type: 'text',
      showWhen: { field: 'institution', value: 'Other' },
    },
    { name: 'account_number', label: 'Account Number', type: 'text' },
    { name: 'value', label: 'Value', type: 'number' },
  ],
  life_insurance: [
    {
      name: 'insurer',
      label: 'Insurer',
      type: 'select',
      options: [
        { value: '', label: 'Select Insurer' },
        // Major Life Insurance Companies in Ireland
        { value: 'Irish Life', label: 'Irish Life' },
        { value: 'Zurich Life', label: 'Zurich Life' },
        { value: 'Aviva', label: 'Aviva' },
        { value: 'New Ireland Assurance', label: 'New Ireland Assurance' },
        { value: 'Standard Life', label: 'Standard Life' },
        { value: 'Friends First', label: 'Friends First' },
        { value: 'Cornmarket', label: 'Cornmarket' },
        { value: 'Royal London', label: 'Royal London' },
        { value: 'Allianz', label: 'Allianz' },
        { value: 'Canada Life', label: 'Canada Life' },
        // Other
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      name: 'other_insurer',
      label: 'Other Insurer Name',
      type: 'text',
      showWhen: { field: 'insurer', value: 'Other' },
    },
    { name: 'policy_number', label: 'Policy Number', type: 'text' },
    { name: 'value', label: 'Value', type: 'number' },
  ],
  debts_owing: [
    { name: 'debtor', label: 'Debtor', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'value', label: 'Value', type: 'number' },
  ],
  securities_quoted: [
    {
      name: 'description',
      label:
        'Description (including unit of quotation, size of holding and quoted price per unit)',
      type: 'textarea',
    },
    {
      name: 'value',
      label: 'Gross Market Value at Date of Death',
      type: 'number',
    },
  ],
  securities_unquoted: [
    {
      name: 'description',
      label: 'Description (including type and class of share/security)',
      type: 'textarea',
    },
    {
      name: 'value',
      label: 'Gross Market Value at Date of Death',
      type: 'number',
    },
  ],
  other_property: [
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'value', label: 'Value', type: 'number' },
  ],
  irish_debts: [
    {
      name: 'creditor',
      label: 'Creditor Type',
      type: 'select',
      options: [
        { value: '', label: 'Select creditor type...' },
        // Funeral & Administration
        { value: 'Funeral Director', label: 'Funeral Director' },
        { value: 'Solicitor (Legal Fees)', label: 'Solicitor (Legal Fees)' },
        { value: 'Probate Registry', label: 'Probate Registry' },
        { value: 'Valuation Services', label: 'Valuation Services' },
        {
          value: 'Estate Administration Costs',
          label: 'Estate Administration Costs',
        },
        { value: 'Court Fees', label: 'Court Fees' },
        // Financial Institutions
        { value: 'Bank/Building Society', label: 'Bank/Building Society' },
        { value: 'Credit Union', label: 'Credit Union' },
        { value: 'Credit Card Company', label: 'Credit Card Company' },
        { value: 'Personal Loan Company', label: 'Personal Loan Company' },
        { value: 'Mortgage Provider', label: 'Mortgage Provider' },
        { value: 'Finance Company', label: 'Finance Company' },
        // Utilities & Services
        { value: 'ESB (Electricity)', label: 'ESB (Electricity)' },
        { value: 'Gas Networks Ireland', label: 'Gas Networks Ireland' },
        { value: 'Irish Water', label: 'Irish Water' },
        { value: 'Waste Management', label: 'Waste Management' },
        { value: 'Telecommunications', label: 'Telecommunications' },
        { value: 'Insurance Company', label: 'Insurance Company' },
        // Government & Revenue
        { value: 'Revenue Commissioners', label: 'Revenue Commissioners' },
        { value: 'Local Authority (Rates)', label: 'Local Authority (Rates)' },
        {
          value: 'Health Service Executive',
          label: 'Health Service Executive',
        },
        {
          value: 'Department of Social Protection',
          label: 'Department of Social Protection',
        },
        {
          value: 'Property Registration Authority',
          label: 'Property Registration Authority',
        },
        // Healthcare & Professional
        {
          value: 'Medical/Healthcare Provider',
          label: 'Medical/Healthcare Provider',
        },
        { value: 'Dental Practice', label: 'Dental Practice' },
        { value: 'Private Hospital', label: 'Private Hospital' },
        { value: 'Nursing Home', label: 'Nursing Home' },
        { value: 'Professional Services', label: 'Professional Services' },
        // Trade & Personal
        { value: 'Trade Creditor', label: 'Trade Creditor' },
        {
          value: 'Personal Loan (Individual)',
          label: 'Personal Loan (Individual)',
        },
        { value: 'Contractor/Builder', label: 'Contractor/Builder' },
        { value: 'Maintenance Services', label: 'Maintenance Services' },
        { value: 'Other Creditor', label: 'Other Creditor' },
      ],
    },
    {
      name: 'creditor_name',
      label: 'Creditor Name',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description of Debt/Expense',
      type: 'textarea',
    },
    {
      name: 'value',
      label: 'Amount Owed',
      type: 'number',
    },
  ],
};
