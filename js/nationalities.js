const pesIndieNationalities = {
    'Afghanistan': 'Afghan',
    'Albania': 'Albanian',
    'Algeria': 'Algerian',
    'American Samoa': 'American Samoan',
    'Andorra': 'Andorran',
    'Angola': 'Angolan',
    'Anguilla': 'Anguillian',
    'Antigua and Barbuda': 'Antiguan, Barbudan',
    'Argentina': 'Argentinian',
    'Armenia': 'Armenian',
    'Aruba': 'Aruban',
    'Australia': 'Australian',
    'Austria': 'Austrian',
    'Azerbaijan': 'Azerbaijani',
    'Bahrain': 'Bahraini',
    'Bangladesh': 'Bangladeshi',
    'Barbados': 'Barbadian',
    'Belarus': 'Belarusian',
    'Belgium': 'Belgian',
    'Belize': 'Belizean',
    'Benin': 'Beninese',
    'Bermuda': 'Bermudian',
    'Bhutan': 'Bhutanese',
    'Bolivia': 'Bolivian',
    'Bonaire': 'Bonairean',
    'Borneo Malay': 'Bornean',
    'Bosnia and Herzegovina': 'Bosnian',
    'Botswana': 'Motswana',
    'Brazil': 'Brazilian',
    'British Virgin Islands': 'Virgin Islander',
    'Brunei Darussalam': 'Bruneian',
    'Bulgaria': 'Bulgarian',
    'Burkina Faso': 'Burkinabe',
    'Burma': 'Burmese',
    'Burundi': 'Burundian',
    'Cambodia': 'Cambodian',
    'Cameroon': 'Cameroonian',
    'Canada': 'Canadian',
    'Cape Verde Islands': 'Cape Verdean',
    'Cayman Islands': 'Caymanian',
    'Central African Republic': 'Central African',
    'Chad': 'Chadian',
    'Chile': 'Chilean',
    'China PR': 'Chinese',
    'Chinese Taipei (China PR)': 'Chinese',
    'Colombia': 'Colombian',
    'Comoros': 'Comoran',
    'Congo': 'Congolese',
    'Cook Islands': 'Cook Islander',
    'Costa Rica': 'Costa Rican',
    'Croatia': 'Croatian',
    'Cuba': 'Cuban',
    'Curaçao': 'Curaçaoan',
    'Cyprus': 'Cypriot',
    'Czech Republic': 'Czech',
    'Democratic Republic of Congo': 'Congolese',
    'Denmark': 'Danish',
    'Djibouti': 'Djibouti',
    'Dominica': 'Dominican',
    'Dominican Republic': 'Dominican',
    'East Timor': 'East Timorese',
    'Ecuador': 'Ecuadorian',
    'Egypt': 'Egyptian',
    'El Salvador': 'Salvadoran',
    'England': 'English',
    'Equatorial Guinea': 'Equatorial Guinean',
    'Eritrea': 'Eritrean',
    'Estonia': 'Estonian',
    'Ethiopia': 'Ethiopian',
    'Faroe Islands': 'Faroese',
    'Fiji': 'Fijian',
    'Finland': 'Finnish',
    'France': 'French',
    'French Guiana': 'Guianan',
    'Gabon': 'Gabonese',
    'Georgia': 'Georgian',
    'Germany': 'German',
    'Ghana': 'Ghanaian',
    'Gibraltar': 'Gibraltar',
    'Great Britain': 'British',
    'Greece': 'Greek',
    'Grenada': 'Grenadian',
    'Guadeloupe': 'Guadeloupian',
    'Guam': 'Guamanian',
    'Guatemala': 'Guatemalan',
    'Guinea': 'Guinean',
    'Guinea-Bissau': 'Guinea-Bissauan',
    'Guyana': 'Guyanese',
    'Haiti': 'Haitian',
    'Honduras': 'Honduran',
    'Hong Kong (China PR)': 'Chinese',
    'Hungary': 'Hungarian',
    'Iceland': 'Icelander',
    'India': 'Indian',
    'Indonesia': 'Indonesian',
    'Iran': 'Iranian',
    'Iraq': 'Iraqi',
    'Israel': 'Israeli',
    'Italy': 'Italian',
    'Ivory Coast': 'Ivorian',
    'Jamaica': 'Jamaican',
    'Japan': 'Japanese',
    'Jordan': 'Jordanian',
    'Kazakhstan': 'Kazakhstani',
    'Kenya': 'Kenyan',
    'Kiribati': 'I-Kiribati',
    'Kosovo': 'Kosovar',
    'Kuwait': 'Kuwaiti',
    'Kyrgyzstan': 'Kirghiz',
    'Laos': 'Laotian',
    'Latvia': 'Latvia',
    'Lebanon': 'Lebanese',
    'Lesotho': 'Mosotho',
    'Liberia': 'Liberian',
    'Libya': 'Libyan',
    'Liechtenstein': 'Liechtensteiner',
    'Lithuania': 'Lithuanian',
    'Luxembourg': 'Luxembourger',
    'Macau (China PR)': 'Chinese',
    'Madagascar': 'Malagasy',
    'Malawi': 'Malawian',
    'Malaysia': 'Malaysian',
    'Maldives': 'Maldivan',
    'Mali': 'Malian',
    'Malta': 'Maltese',
    'Martinique': 'Martinican',
    'Mauritania': 'Mauritanian',
    'Mauritius': 'Mauritian',
    'Mayotte': 'Mahoran',
    'Mexico': 'Mexican',
    'Micronesia': 'Micronesian',
    'Moldova': 'Moldovan',
    'Monaco': 'Monegasque',
    'Mongolia': 'Mongolian',
    'Montenegro': 'Montenegrin',
    'Montserrat': 'Montserratian',
    'Morocco': 'Moroccan',
    'Mozambique': 'Mozambican',
    'Myanmar': 'Burmese',
    'Namibia': 'Namibian',
    'Nepal': 'Nepalese',
    'Netherlands': 'Dutch',
    'New Caledonia': 'New Caledonian',
    'New Zealand': 'New Zealander',
    'Nicaragua': 'Nicaraguan',
    'Niger': 'Nigerien',
    'Nigeria': 'Nigerian',
    'North Korea': 'North Korean',
    'North Macedonia': 'Macedonian',
    'Northern Ireland': 'Northern Irish',
    'Northern Mariana Islands': 'American',
    'Norway': 'Norwegian',
    'Oman': 'Omani',
    'Pakistan': 'Pakistani',
    'Palestine': 'Palestinian',
    'Panama': 'Panamanian',
    'Papua New Guinea': 'Papua New Guinean',
    'Paraguay': 'Paraguayan',
    'Pays Basque': 'Basque',
    'Peru': 'Peruvian',
    'Philippines': 'Filipino',
    'Poland': 'Polish',
    'Portugal': 'Portuguese',
    'Puerto Rico': 'Puerto Rican',
    'Qatar': 'Qatari',
    'Republic of Ireland': 'Irish',
    'Réunion': 'Réunionese',
    'Romania': 'Romanian',
    'Russia': 'Russian',
    'Rwanda': 'Rwandan',
    'Saint Barthélemy': 'Saint Barthélemy Islander',
    'Saint Kitts and Nevis': 'Kittitian or Nevisian',
    'Saint Lucia': 'Saint Lucian',
    'Saint Martin': 'Saint Martin Islander',
    'Saint Pierre and Miquelon': 'Saint-Pierrais, Miquelonnais',
    'Saint Vincent and the Grenadines': 'Saint Vincentian',
    'Samoa': 'Samoan',
    'San Marino': 'Sammarinese',
    'São Tomé and Príncipe': 'Sao Tomean',
    'Saudi Arabia': 'Saudi Arabian',
    'Scotland': 'Scottish',
    'SEA Chinese': 'Chinese',
    'Senegal': 'Senegalese',
    'Serbia': 'Serbian',
    'Seychelles': 'Seychellois',
    'Sierra Leone': 'Sierra Leonean',
    'Singapore': 'Singaporean',
    'Singh Indian': 'Indian',
    'Sint Maarten': 'St. Maartener',
    'Slovakia': 'Slovak',
    'Slovenia': 'Slovenian',
    'Solomon Islands': 'Solomon Islander',
    'Somalia': 'Somali',
    'South Africa': 'South African',
    'South Korea': 'South Korean',
    'South Sudan': 'South Sudanese',
    'South Vietnam': 'Vietnamese',
    'Spain': 'Spanish',
    'Sri Lanka': 'Sri Lankan',
    'Sudan': 'Sudanese',
    'Suriname': 'Surinamer',
    'Swaziland': 'Swazi',
    'Sweden': 'Swedish',
    'Switzerland': 'Swiss',
    'Syria': 'Syrian',
    'Tahiti': 'Tahitian',
    'Tajikistan': 'Tadzhik',
    'Tanzania': 'Tanzanian',
    'Thailand': 'Thai',
    'The Bahamas': 'Bahamian',
    'The Gambia': 'Gambian',
    'Togo': 'Togolese',
    'Tonga': 'Tongan',
    'Trinidad and Tobago': 'Trinidadian',
    'Tunisia': 'Tunisian',
    'Turkey': 'Turkish',
    'Turkmenistan': 'Turkmen',
    'Turks and Caicos Islands': 'Turks and Caicos Islander',
    'Tuvalu': 'Tuvaluan',
    'Uganda': 'Ugandan',
    'Ukraine': 'Ukrainian',
    'United Arab Emirates': 'Emirati',
    'United Kingdom': 'British',
    'United States': 'American',
    'Uruguay': 'Uruguayan',
    'US Virgin Islands': 'American Virgin Islander',
    'Uzbekistan': 'Uzbekistani',
    'Vanuatu': 'Ni-Vanuatu',
    'Venezuela': 'Venezuelan',
    'Vietnam': 'Vietnamese',
    'Wales': 'Welsh',
    'Wallis and Futuna Islands': 'Wallisian Futunan',
    'West Germany': 'West German',
    'Yemen': 'Yemeni',
    'Zambia': 'Zambian',
    'Zimbabwe': 'Zimbabwean'
}