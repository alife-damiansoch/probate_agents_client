// estateFieldConfig.js
import Cookies from 'js-cookie';

// County options for Ireland
const COUNTY_OPTIONS_IE = [
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
  { value: 'Co. Dublin', label: 'Co. Dublin' },
  // Irish Counties
  { value: 'Carlow', label: 'Carlow' },
  { value: 'Cavan', label: 'Cavan' },
  { value: 'Clare', label: 'Clare' },
  { value: 'Cork', label: 'Cork' },
  { value: 'Donegal', label: 'Donegal' },
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
  { value: 'Waterford', label: 'Waterford' },
  { value: 'Westmeath', label: 'Westmeath' },
  { value: 'Wexford', label: 'Wexford' },
  { value: 'Wicklow', label: 'Wicklow' },
];

// County options for UK
const COUNTY_OPTIONS_UK = [
  { value: '', label: 'Select County' },
  // England
  { value: 'Bedfordshire', label: 'Bedfordshire' },
  { value: 'Berkshire', label: 'Berkshire' },
  { value: 'Bristol', label: 'Bristol' },
  { value: 'Buckinghamshire', label: 'Buckinghamshire' },
  { value: 'Cambridgeshire', label: 'Cambridgeshire' },
  { value: 'Cheshire', label: 'Cheshire' },
  { value: 'City of London', label: 'City of London' },
  { value: 'Cornwall', label: 'Cornwall' },
  { value: 'County Durham', label: 'County Durham' },
  { value: 'Cumbria', label: 'Cumbria' },
  { value: 'Derbyshire', label: 'Derbyshire' },
  { value: 'Devon', label: 'Devon' },
  { value: 'Dorset', label: 'Dorset' },
  { value: 'East Riding of Yorkshire', label: 'East Riding of Yorkshire' },
  { value: 'East Sussex', label: 'East Sussex' },
  { value: 'Essex', label: 'Essex' },
  { value: 'Gloucestershire', label: 'Gloucestershire' },
  { value: 'Greater London', label: 'Greater London' },
  { value: 'Greater Manchester', label: 'Greater Manchester' },
  { value: 'Hampshire', label: 'Hampshire' },
  { value: 'Herefordshire', label: 'Herefordshire' },
  { value: 'Hertfordshire', label: 'Hertfordshire' },
  { value: 'Isle of Wight', label: 'Isle of Wight' },
  { value: 'Kent', label: 'Kent' },
  { value: 'Lancashire', label: 'Lancashire' },
  { value: 'Leicestershire', label: 'Leicestershire' },
  { value: 'Lincolnshire', label: 'Lincolnshire' },
  { value: 'Merseyside', label: 'Merseyside' },
  { value: 'Norfolk', label: 'Norfolk' },
  { value: 'North Yorkshire', label: 'North Yorkshire' },
  { value: 'Northamptonshire', label: 'Northamptonshire' },
  { value: 'Northumberland', label: 'Northumberland' },
  { value: 'Nottinghamshire', label: 'Nottinghamshire' },
  { value: 'Oxfordshire', label: 'Oxfordshire' },
  { value: 'Rutland', label: 'Rutland' },
  { value: 'Shropshire', label: 'Shropshire' },
  { value: 'Somerset', label: 'Somerset' },
  { value: 'South Yorkshire', label: 'South Yorkshire' },
  { value: 'Staffordshire', label: 'Staffordshire' },
  { value: 'Suffolk', label: 'Suffolk' },
  { value: 'Surrey', label: 'Surrey' },
  { value: 'Tyne and Wear', label: 'Tyne and Wear' },
  { value: 'Warwickshire', label: 'Warwickshire' },
  { value: 'West Midlands', label: 'West Midlands' },
  { value: 'West Sussex', label: 'West Sussex' },
  { value: 'West Yorkshire', label: 'West Yorkshire' },
  { value: 'Wiltshire', label: 'Wiltshire' },
  { value: 'Worcestershire', label: 'Worcestershire' },
  // Wales
  { value: 'Anglesey', label: 'Anglesey' },
  { value: 'Blaenau Gwent', label: 'Blaenau Gwent' },
  { value: 'Bridgend', label: 'Bridgend' },
  { value: 'Caerphilly', label: 'Caerphilly' },
  { value: 'Cardiff', label: 'Cardiff' },
  { value: 'Carmarthenshire', label: 'Carmarthenshire' },
  { value: 'Ceredigion', label: 'Ceredigion' },
  { value: 'Conwy', label: 'Conwy' },
  { value: 'Denbighshire', label: 'Denbighshire' },
  { value: 'Flintshire', label: 'Flintshire' },
  { value: 'Gwynedd', label: 'Gwynedd' },
  { value: 'Merthyr Tydfil', label: 'Merthyr Tydfil' },
  { value: 'Monmouthshire', label: 'Monmouthshire' },
  { value: 'Neath Port Talbot', label: 'Neath Port Talbot' },
  { value: 'Newport', label: 'Newport' },
  { value: 'Pembrokeshire', label: 'Pembrokeshire' },
  { value: 'Powys', label: 'Powys' },
  { value: 'Rhondda Cynon Taf', label: 'Rhondda Cynon Taf' },
  { value: 'Swansea', label: 'Swansea' },
  { value: 'Torfaen', label: 'Torfaen' },
  { value: 'Vale of Glamorgan', label: 'Vale of Glamorgan' },
  { value: 'Wrexham', label: 'Wrexham' },
  // Scotland
  { value: 'Aberdeen City', label: 'Aberdeen City' },
  { value: 'Aberdeenshire', label: 'Aberdeenshire' },
  { value: 'Angus', label: 'Angus' },
  { value: 'Argyll and Bute', label: 'Argyll and Bute' },
  { value: 'Clackmannanshire', label: 'Clackmannanshire' },
  { value: 'Dumfries and Galloway', label: 'Dumfries and Galloway' },
  { value: 'Dundee City', label: 'Dundee City' },
  { value: 'East Ayrshire', label: 'East Ayrshire' },
  { value: 'East Dunbartonshire', label: 'East Dunbartonshire' },
  { value: 'East Lothian', label: 'East Lothian' },
  { value: 'East Renfrewshire', label: 'East Renfrewshire' },
  { value: 'Edinburgh', label: 'Edinburgh' },
  { value: 'Falkirk', label: 'Falkirk' },
  { value: 'Fife', label: 'Fife' },
  { value: 'Glasgow City', label: 'Glasgow City' },
  { value: 'Highland', label: 'Highland' },
  { value: 'Inverclyde', label: 'Inverclyde' },
  { value: 'Midlothian', label: 'Midlothian' },
  { value: 'Moray', label: 'Moray' },
  { value: 'North Ayrshire', label: 'North Ayrshire' },
  { value: 'North Lanarkshire', label: 'North Lanarkshire' },
  { value: 'Orkney Islands', label: 'Orkney Islands' },
  { value: 'Perth and Kinross', label: 'Perth and Kinross' },
  { value: 'Renfrewshire', label: 'Renfrewshire' },
  { value: 'Scottish Borders', label: 'Scottish Borders' },
  { value: 'Shetland Islands', label: 'Shetland Islands' },
  { value: 'South Ayrshire', label: 'South Ayrshire' },
  { value: 'South Lanarkshire', label: 'South Lanarkshire' },
  { value: 'Stirling', label: 'Stirling' },
  { value: 'West Dunbartonshire', label: 'West Dunbartonshire' },
  { value: 'West Lothian', label: 'West Lothian' },
  { value: 'Western Isles', label: 'Western Isles' },
  // Northern Ireland
  { value: 'Antrim', label: 'Antrim' },
  { value: 'Armagh', label: 'Armagh' },
  { value: 'Down', label: 'Down' },
  { value: 'Fermanagh', label: 'Fermanagh' },
  { value: 'Londonderry', label: 'Londonderry' },
  { value: 'Tyrone', label: 'Tyrone' },
];

// Export both county options for direct access
export { COUNTY_OPTIONS_IE, COUNTY_OPTIONS_UK };

// Function to get county options based on user country (passed as parameter)
export const getCountyOptions = (userCountry) => {
  if (userCountry === 'IE') {
    return COUNTY_OPTIONS_IE;
  } else if (userCountry === 'UK') {
    return COUNTY_OPTIONS_UK;
  }
  return [];
};

// Function to get county options based on cookies (for backward compatibility)
const getCountyOptionsFromCookies = () => {
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';
  return countrySolicitors === 'IE' ? COUNTY_OPTIONS_IE : COUNTY_OPTIONS_UK;
};

// Function to get financial institutions based on country
const getFinancialInstitutions = () => {
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';

  if (countrySolicitors === 'IE') {
    return [
      { value: '', label: 'Select Institution' },
      // Major Irish Banks
      { value: 'Allied Irish Banks (AIB)', label: 'Allied Irish Banks (AIB)' },
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
    ];
  } else {
    return [
      { value: '', label: 'Select Institution' },
      // Major UK Banks
      { value: 'Barclays', label: 'Barclays' },
      { value: 'HSBC', label: 'HSBC' },
      { value: 'Lloyds Banking Group', label: 'Lloyds Banking Group' },
      { value: 'NatWest', label: 'NatWest' },
      { value: 'Santander UK', label: 'Santander UK' },
      { value: 'TSB', label: 'TSB' },
      { value: 'Metro Bank', label: 'Metro Bank' },
      { value: 'Monzo', label: 'Monzo' },
      { value: 'Starling Bank', label: 'Starling Bank' },
      // Building Societies
      {
        value: 'Nationwide Building Society',
        label: 'Nationwide Building Society',
      },
      {
        value: 'Yorkshire Building Society',
        label: 'Yorkshire Building Society',
      },
      // Post Office
      { value: 'Post Office', label: 'Post Office' },
      // Insurance Companies
      { value: 'Aviva UK', label: 'Aviva UK' },
      { value: 'Legal & General', label: 'Legal & General' },
      { value: 'Prudential', label: 'Prudential' },
      // Other
      { value: 'Other', label: 'Other' },
    ];
  }
};

// Function to get life insurance companies based on country
const getLifeInsuranceCompanies = () => {
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';

  if (countrySolicitors === 'IE') {
    return [
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
    ];
  } else {
    return [
      { value: '', label: 'Select Insurer' },
      // Major Life Insurance Companies in UK
      { value: 'Aviva UK', label: 'Aviva UK' },
      { value: 'Legal & General', label: 'Legal & General' },
      { value: 'Prudential', label: 'Prudential' },
      { value: 'Scottish Widows', label: 'Scottish Widows' },
      { value: 'Standard Life Aberdeen', label: 'Standard Life Aberdeen' },
      { value: 'Phoenix Group', label: 'Phoenix Group' },
      { value: 'Zurich UK', label: 'Zurich UK' },
      { value: 'Canada Life UK', label: 'Canada Life UK' },
      { value: 'Royal London', label: 'Royal London' },
      { value: 'LV=', label: 'LV=' },
      // Other
      { value: 'Other', label: 'Other' },
    ];
  }
};

export const estateFieldMap = {
  real_and_leasehold: [
    { name: 'address', label: 'Address', type: 'textarea' },
    {
      name: 'county',
      label: 'County',
      type: 'select',
      options: getCountyOptionsFromCookies(),
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
      options: getFinancialInstitutions(),
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
      options: getLifeInsuranceCompanies(),
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

// Export the utility functions for use in other components
export { getFinancialInstitutions, getLifeInsuranceCompanies };
