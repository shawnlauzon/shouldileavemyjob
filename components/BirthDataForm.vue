<template>
  <v-container>
    <div class="mb-6 mt-16">
      <div class="text-h4 text-md-h2 mb-6">Birth information</div>
      <div>To start, we need to know when and where you were born.</div>
    </div>
    <v-row class="mx-2">
      <v-menu
        ref="isDatePickerVisible"
        v-model="isDatePickerVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Date of birth"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          :active-picker="activeDatePicker"
          :max="
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .substr(0, 10)
          "
          min="1900-01-01"
          @change="saveDate"
        ></v-date-picker>
      </v-menu>
      <v-menu
        ref="isTimePickerVisible"
        v-model="isTimePickerVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="time"
            label="Time of birth"
            prepend-icon="mdi-clock"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-model="time" format="ampm">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="saveTime"> OK </v-btn>
        </v-time-picker>
      </v-menu>
    </v-row>
    <v-row class="mx-2">
      <v-select
        v-model="country"
        :items="countries"
        item-text="name"
        item-value="abbr"
        label="Country"
        persistent-hint
        return-object
      ></v-select>
      <span v-if="isUsa">
        <v-select
          v-model="state"
          :items="states"
          item-text="name"
          item-value="abbr"
          label="State"
          persistent-hint
          return-object
        ></v-select>
      </span>
    </v-row>
    <v-row class="mx-2">
      <v-text-field
        v-model="city"
        label="City"
        :error-messages="cityErrors"
        @input="cityErrors = []"
      ></v-text-field>
    </v-row>
    <v-btn
      class="mt-6"
      block
      :loading="isLoading"
      color="primary"
      :disabled="isLoading || !isComplete"
      @click="handleNext"
      >Next</v-btn
    >
  </v-container>
</template>

<script setup></script>

<script type="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
const countries = [
  { name: 'Afghanistan', abbr: 'AF' },
  { name: 'Åland Islands', abbr: 'AX' },
  { name: 'Albania', abbr: 'AL' },
  { name: 'Algeria', abbr: 'DZ' },
  { name: 'American Samoa', abbr: 'AS' },
  { name: 'AndorrA', abbr: 'AD' },
  { name: 'Angola', abbr: 'AO' },
  { name: 'Anguilla', abbr: 'AI' },
  { name: 'Antarctica', abbr: 'AQ' },
  { name: 'Antigua and Barbuda', abbr: 'AG' },
  { name: 'Argentina', abbr: 'AR' },
  { name: 'Armenia', abbr: 'AM' },
  { name: 'Aruba', abbr: 'AW' },
  { name: 'Australia', abbr: 'AU' },
  { name: 'Austria', abbr: 'AT' },
  { name: 'Azerbaijan', abbr: 'AZ' },
  { name: 'Bahamas', abbr: 'BS' },
  { name: 'Bahrain', abbr: 'BH' },
  { name: 'Bangladesh', abbr: 'BD' },
  { name: 'Barbados', abbr: 'BB' },
  { name: 'Belarus', abbr: 'BY' },
  { name: 'Belgium', abbr: 'BE' },
  { name: 'Belize', abbr: 'BZ' },
  { name: 'Benin', abbr: 'BJ' },
  { name: 'Bermuda', abbr: 'BM' },
  { name: 'Bhutan', abbr: 'BT' },
  { name: 'Bolivia', abbr: 'BO' },
  { name: 'Bosnia and Herzegovina', abbr: 'BA' },
  { name: 'Botswana', abbr: 'BW' },
  { name: 'Bouvet Island', abbr: 'BV' },
  { name: 'Brazil', abbr: 'BR' },
  { name: 'British Indian Ocean Territory', abbr: 'IO' },
  { name: 'Brunei Darussalam', abbr: 'BN' },
  { name: 'Bulgaria', abbr: 'BG' },
  { name: 'Burkina Faso', abbr: 'BF' },
  { name: 'Burundi', abbr: 'BI' },
  { name: 'Cambodia', abbr: 'KH' },
  { name: 'Cameroon', abbr: 'CM' },
  { name: 'Canada', abbr: 'CA' },
  { name: 'Cape Verde', abbr: 'CV' },
  { name: 'Cayman Islands', abbr: 'KY' },
  { name: 'Central African Republic', abbr: 'CF' },
  { name: 'Chad', abbr: 'TD' },
  { name: 'Chile', abbr: 'CL' },
  { name: 'China', abbr: 'CN' },
  { name: 'Christmas Island', abbr: 'CX' },
  { name: 'Cocos (Keeling) Islands', abbr: 'CC' },
  { name: 'Colombia', abbr: 'CO' },
  { name: 'Comoros', abbr: 'KM' },
  { name: 'Congo', abbr: 'CG' },
  { name: 'Congo, The Democratic Republic of the', abbr: 'CD' },
  { name: 'Cook Islands', abbr: 'CK' },
  { name: 'Costa Rica', abbr: 'CR' },
  { name: "Cote D'Ivoire", abbr: 'CI' },
  { name: 'Croatia', abbr: 'HR' },
  { name: 'Cuba', abbr: 'CU' },
  { name: 'Cyprus', abbr: 'CY' },
  { name: 'Czech Republic', abbr: 'CZ' },
  { name: 'Denmark', abbr: 'DK' },
  { name: 'Djibouti', abbr: 'DJ' },
  { name: 'Dominica', abbr: 'DM' },
  { name: 'Dominican Republic', abbr: 'DO' },
  { name: 'Ecuador', abbr: 'EC' },
  { name: 'Egypt', abbr: 'EG' },
  { name: 'El Salvador', abbr: 'SV' },
  { name: 'Equatorial Guinea', abbr: 'GQ' },
  { name: 'Eritrea', abbr: 'ER' },
  { name: 'Estonia', abbr: 'EE' },
  { name: 'Ethiopia', abbr: 'ET' },
  { name: 'Falkland Islands (Malvinas)', abbr: 'FK' },
  { name: 'Faroe Islands', abbr: 'FO' },
  { name: 'Fiji', abbr: 'FJ' },
  { name: 'Finland', abbr: 'FI' },
  { name: 'France', abbr: 'FR' },
  { name: 'French Guiana', abbr: 'GF' },
  { name: 'French Polynesia', abbr: 'PF' },
  { name: 'French Southern Territories', abbr: 'TF' },
  { name: 'Gabon', abbr: 'GA' },
  { name: 'Gambia', abbr: 'GM' },
  { name: 'Georgia', abbr: 'GE' },
  { name: 'Germany', abbr: 'DE' },
  { name: 'Ghana', abbr: 'GH' },
  { name: 'Gibraltar', abbr: 'GI' },
  { name: 'Greece', abbr: 'GR' },
  { name: 'Greenland', abbr: 'GL' },
  { name: 'Grenada', abbr: 'GD' },
  { name: 'Guadeloupe', abbr: 'GP' },
  { name: 'Guam', abbr: 'GU' },
  { name: 'Guatemala', abbr: 'GT' },
  { name: 'Guernsey', abbr: 'GG' },
  { name: 'Guinea', abbr: 'GN' },
  { name: 'Guinea-Bissau', abbr: 'GW' },
  { name: 'Guyana', abbr: 'GY' },
  { name: 'Haiti', abbr: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', abbr: 'HM' },
  { name: 'Holy See (Vatican City State)', abbr: 'VA' },
  { name: 'Honduras', abbr: 'HN' },
  { name: 'Hong Kong', abbr: 'HK' },
  { name: 'Hungary', abbr: 'HU' },
  { name: 'Iceland', abbr: 'IS' },
  { name: 'India', abbr: 'IN' },
  { name: 'Indonesia', abbr: 'ID' },
  { name: 'Iran, Islamic Republic Of', abbr: 'IR' },
  { name: 'Iraq', abbr: 'IQ' },
  { name: 'Ireland', abbr: 'IE' },
  { name: 'Isle of Man', abbr: 'IM' },
  { name: 'Israel', abbr: 'IL' },
  { name: 'Italy', abbr: 'IT' },
  { name: 'Jamaica', abbr: 'JM' },
  { name: 'Japan', abbr: 'JP' },
  { name: 'Jersey', abbr: 'JE' },
  { name: 'Jordan', abbr: 'JO' },
  { name: 'Kazakhstan', abbr: 'KZ' },
  { name: 'Kenya', abbr: 'KE' },
  { name: 'Kiribati', abbr: 'KI' },
  { name: "Korea, Democratic People'S Republic of", abbr: 'KP' },
  { name: 'Korea, Republic of', abbr: 'KR' },
  { name: 'Kuwait', abbr: 'KW' },
  { name: 'Kyrgyzstan', abbr: 'KG' },
  { name: "Lao People'S Democratic Republic", abbr: 'LA' },
  { name: 'Latvia', abbr: 'LV' },
  { name: 'Lebanon', abbr: 'LB' },
  { name: 'Lesotho', abbr: 'LS' },
  { name: 'Liberia', abbr: 'LR' },
  { name: 'Libyan Arab Jamahiriya', abbr: 'LY' },
  { name: 'Liechtenstein', abbr: 'LI' },
  { name: 'Lithuania', abbr: 'LT' },
  { name: 'Luxembourg', abbr: 'LU' },
  { name: 'Macao', abbr: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', abbr: 'MK' },
  { name: 'Madagascar', abbr: 'MG' },
  { name: 'Malawi', abbr: 'MW' },
  { name: 'Malaysia', abbr: 'MY' },
  { name: 'Maldives', abbr: 'MV' },
  { name: 'Mali', abbr: 'ML' },
  { name: 'Malta', abbr: 'MT' },
  { name: 'Marshall Islands', abbr: 'MH' },
  { name: 'Martinique', abbr: 'MQ' },
  { name: 'Mauritania', abbr: 'MR' },
  { name: 'Mauritius', abbr: 'MU' },
  { name: 'Mayotte', abbr: 'YT' },
  { name: 'Mexico', abbr: 'MX' },
  { name: 'Micronesia, Federated States of', abbr: 'FM' },
  { name: 'Moldova, Republic of', abbr: 'MD' },
  { name: 'Monaco', abbr: 'MC' },
  { name: 'Mongolia', abbr: 'MN' },
  { name: 'Montserrat', abbr: 'MS' },
  { name: 'Morocco', abbr: 'MA' },
  { name: 'Mozambique', abbr: 'MZ' },
  { name: 'Myanmar', abbr: 'MM' },
  { name: 'Namibia', abbr: 'NA' },
  { name: 'Nauru', abbr: 'NR' },
  { name: 'Nepal', abbr: 'NP' },
  { name: 'Netherlands', abbr: 'NL' },
  { name: 'Netherlands Antilles', abbr: 'AN' },
  { name: 'New Caledonia', abbr: 'NC' },
  { name: 'New Zealand', abbr: 'NZ' },
  { name: 'Nicaragua', abbr: 'NI' },
  { name: 'Niger', abbr: 'NE' },
  { name: 'Nigeria', abbr: 'NG' },
  { name: 'Niue', abbr: 'NU' },
  { name: 'Norfolk Island', abbr: 'NF' },
  { name: 'Northern Mariana Islands', abbr: 'MP' },
  { name: 'Norway', abbr: 'NO' },
  { name: 'Oman', abbr: 'OM' },
  { name: 'Pakistan', abbr: 'PK' },
  { name: 'Palau', abbr: 'PW' },
  { name: 'Palestinian Territory, Occupied', abbr: 'PS' },
  { name: 'Panama', abbr: 'PA' },
  { name: 'Papua New Guinea', abbr: 'PG' },
  { name: 'Paraguay', abbr: 'PY' },
  { name: 'Peru', abbr: 'PE' },
  { name: 'Philippines', abbr: 'PH' },
  { name: 'Pitcairn', abbr: 'PN' },
  { name: 'Poland', abbr: 'PL' },
  { name: 'Portugal', abbr: 'PT' },
  { name: 'Puerto Rico', abbr: 'PR' },
  { name: 'Qatar', abbr: 'QA' },
  { name: 'Reunion', abbr: 'RE' },
  { name: 'Romania', abbr: 'RO' },
  { name: 'Russian Federation', abbr: 'RU' },
  { name: 'RWANDA', abbr: 'RW' },
  { name: 'Saint Helena', abbr: 'SH' },
  { name: 'Saint Kitts and Nevis', abbr: 'KN' },
  { name: 'Saint Lucia', abbr: 'LC' },
  { name: 'Saint Pierre and Miquelon', abbr: 'PM' },
  { name: 'Saint Vincent and the Grenadines', abbr: 'VC' },
  { name: 'Samoa', abbr: 'WS' },
  { name: 'San Marino', abbr: 'SM' },
  { name: 'Sao Tome and Principe', abbr: 'ST' },
  { name: 'Saudi Arabia', abbr: 'SA' },
  { name: 'Senegal', abbr: 'SN' },
  { name: 'Serbia and Montenegro', abbr: 'CS' },
  { name: 'Seychelles', abbr: 'SC' },
  { name: 'Sierra Leone', abbr: 'SL' },
  { name: 'Singapore', abbr: 'SG' },
  { name: 'Slovakia', abbr: 'SK' },
  { name: 'Slovenia', abbr: 'SI' },
  { name: 'Solomon Islands', abbr: 'SB' },
  { name: 'Somalia', abbr: 'SO' },
  { name: 'South Africa', abbr: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', abbr: 'GS' },
  { name: 'Spain', abbr: 'ES' },
  { name: 'Sri Lanka', abbr: 'LK' },
  { name: 'Sudan', abbr: 'SD' },
  { name: 'Suriname', abbr: 'SR' },
  { name: 'Svalbard and Jan Mayen', abbr: 'SJ' },
  { name: 'Swaziland', abbr: 'SZ' },
  { name: 'Sweden', abbr: 'SE' },
  { name: 'Switzerland', abbr: 'CH' },
  { name: 'Syrian Arab Republic', abbr: 'SY' },
  { name: 'Taiwan, Province of China', abbr: 'TW' },
  { name: 'Tajikistan', abbr: 'TJ' },
  { name: 'Tanzania, United Republic of', abbr: 'TZ' },
  { name: 'Thailand', abbr: 'TH' },
  { name: 'Timor-Leste', abbr: 'TL' },
  { name: 'Togo', abbr: 'TG' },
  { name: 'Tokelau', abbr: 'TK' },
  { name: 'Tonga', abbr: 'TO' },
  { name: 'Trinidad and Tobago', abbr: 'TT' },
  { name: 'Tunisia', abbr: 'TN' },
  { name: 'Turkey', abbr: 'TR' },
  { name: 'Turkmenistan', abbr: 'TM' },
  { name: 'Turks and Caicos Islands', abbr: 'TC' },
  { name: 'Tuvalu', abbr: 'TV' },
  { name: 'Uganda', abbr: 'UG' },
  { name: 'Ukraine', abbr: 'UA' },
  { name: 'United Arab Emirates', abbr: 'AE' },
  { name: 'United Kingdom', abbr: 'GB' },
  { name: 'United States', abbr: 'US' },
  { name: 'United States Minor Outlying Islands', abbr: 'UM' },
  { name: 'Uruguay', abbr: 'UY' },
  { name: 'Uzbekistan', abbr: 'UZ' },
  { name: 'Vanuatu', abbr: 'VU' },
  { name: 'Venezuela', abbr: 'VE' },
  { name: 'Viet Nam', abbr: 'VN' },
  { name: 'Virgin Islands, British', abbr: 'VG' },
  { name: 'Virgin Islands, U.S.', abbr: 'VI' },
  { name: 'Wallis and Futuna', abbr: 'WF' },
  { name: 'Western Sahara', abbr: 'EH' },
  { name: 'Yemen', abbr: 'YE' },
  { name: 'Zambia', abbr: 'ZM' },
  { name: 'Zimbabwe', abbr: 'ZW' },
]

const states = [
  {
    name: 'Alabama',
    abbr: 'AL',
  },
  {
    name: 'Alaska',
    abbr: 'AK',
  },
  {
    name: 'American Samoa',
    abbr: 'AS',
  },
  {
    name: 'Arizona',
    abbr: 'AZ',
  },
  {
    name: 'Arkansas',
    abbr: 'AR',
  },
  {
    name: 'California',
    abbr: 'CA',
  },
  {
    name: 'Colorado',
    abbr: 'CO',
  },
  {
    name: 'Connecticut',
    abbr: 'CT',
  },
  {
    name: 'Delaware',
    abbr: 'DE',
  },
  {
    name: 'District Of Columbia',
    abbr: 'DC',
  },
  {
    name: 'Federated States Of Micronesia',
    abbr: 'FM',
  },
  {
    name: 'Florida',
    abbr: 'FL',
  },
  {
    name: 'Georgia',
    abbr: 'GA',
  },
  {
    name: 'Guam',
    abbr: 'GU',
  },
  {
    name: 'Hawaii',
    abbr: 'HI',
  },
  {
    name: 'Idaho',
    abbr: 'ID',
  },
  {
    name: 'Illinois',
    abbr: 'IL',
  },
  {
    name: 'Indiana',
    abbr: 'IN',
  },
  {
    name: 'Iowa',
    abbr: 'IA',
  },
  {
    name: 'Kansas',
    abbr: 'KS',
  },
  {
    name: 'Kentucky',
    abbr: 'KY',
  },
  {
    name: 'Louisiana',
    abbr: 'LA',
  },
  {
    name: 'Maine',
    abbr: 'ME',
  },
  {
    name: 'Marshall Islands',
    abbr: 'MH',
  },
  {
    name: 'Maryland',
    abbr: 'MD',
  },
  {
    name: 'Massachusetts',
    abbr: 'MA',
  },
  {
    name: 'Michigan',
    abbr: 'MI',
  },
  {
    name: 'Minnesota',
    abbr: 'MN',
  },
  {
    name: 'Mississippi',
    abbr: 'MS',
  },
  {
    name: 'Missouri',
    abbr: 'MO',
  },
  {
    name: 'Montana',
    abbr: 'MT',
  },
  {
    name: 'Nebraska',
    abbr: 'NE',
  },
  {
    name: 'Nevada',
    abbr: 'NV',
  },
  {
    name: 'New Hampshire',
    abbr: 'NH',
  },
  {
    name: 'New Jersey',
    abbr: 'NJ',
  },
  {
    name: 'New Mexico',
    abbr: 'NM',
  },
  {
    name: 'New York',
    abbr: 'NY',
  },
  {
    name: 'North Carolina',
    abbr: 'NC',
  },
  {
    name: 'North Dakota',
    abbr: 'ND',
  },
  {
    name: 'Northern Mariana Islands',
    abbr: 'MP',
  },
  {
    name: 'Ohio',
    abbr: 'OH',
  },
  {
    name: 'Oklahoma',
    abbr: 'OK',
  },
  {
    name: 'Oregon',
    abbr: 'OR',
  },
  {
    name: 'Palau',
    abbr: 'PW',
  },
  {
    name: 'Pennsylvania',
    abbr: 'PA',
  },
  {
    name: 'Puerto Rico',
    abbr: 'PR',
  },
  {
    name: 'Rhode Island',
    abbr: 'RI',
  },
  {
    name: 'South Carolina',
    abbr: 'SC',
  },
  {
    name: 'South Dakota',
    abbr: 'SD',
  },
  {
    name: 'Tennessee',
    abbr: 'TN',
  },
  {
    name: 'Texas',
    abbr: 'TX',
  },
  {
    name: 'Utah',
    abbr: 'UT',
  },
  {
    name: 'Vermont',
    abbr: 'VT',
  },
  {
    name: 'Virgin Islands',
    abbr: 'VI',
  },
  {
    name: 'Virginia',
    abbr: 'VA',
  },
  {
    name: 'Washington',
    abbr: 'WA',
  },
  {
    name: 'West Virginia',
    abbr: 'WV',
  },
  {
    name: 'Wisconsin',
    abbr: 'WI',
  },
  {
    name: 'Wyoming',
    abbr: 'WY',
  },
]

export default defineComponent({
  props: { value: { type: Object, default: null } },
  data: () => ({
    date: undefined,
    time: undefined,
    country: ref({ name: 'United States', abbr: 'US' }),
    city: undefined,
    state: undefined,
    isLoading: false,
    activeDatePicker: null,
    isTimePickerVisible: false,
    isDatePickerVisible: false,
    chart: undefined,
    cityErrors: [],
  }),
  computed: {
    isUsa() {
      return this.country.abbr === 'US'
    },
    isComplete() {
      return this.date && this.time && this.country && this.city
    },
  },
  emit: ['chart', 'user'],
  watch: {
    isDatePickerVisible(val) {
      val && setTimeout(() => (this.activeDatePicker = 'YEAR'))
    },
  },
  mounted() {
    this.$plausible.trackPageview({
      url: '/views/birth-data',
    })
  },
  methods: {
    handleNext: async function () {
      const params = {
        date: this.date,
        time: this.time,
        country: this.country?.name,
        city: this.city,
        state: this.isUsa ? this.state?.name : null,
      }
      console.log('clicked for ', params)
      console.log('sending', JSON.stringify(params))

      // FIXME Handle city not found
      this.isLoading = true

      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json; q=0.01')

      try {
        const resp = await fetch('/api/career-design', {
          method: 'POST',
          headers,
          body: JSON.stringify(params),
        })
        if (resp.status !== 200) {
          if (resp.status === 400) {
            const respError = await resp.json()
            if (respError.error === 'PlaceNotFound') {
              this.cityErrors.push(
                'City not found; please choose another city in the same time zone.'
              )
            }
          }
        }
        const respData = await resp.json()
        console.log('Response', respData)
        this.chart = {
          careerType: respData.type,
          interactionStyle: respData.strategy,
          keyIndicators: respData.theme.split(' or '),
          decisionMakingStrategy: respData.innerAuthority,
          publicRole: respData.profile.split(' / '),
          assimilation: respData.definition,
          lifeWork: respData.cross,
          traits: respData.traits,
          image: respData.image,
        }
        console.log('Got chart', this.chart)
      } catch (e) {
        console.log('Failed to get chart; please retry')
        this.isLoading = false
      }

      if (this.chart) {
        try {
          // Store an empty user to reserve the user_id
          const storeUserResp = await fetch('/api/store-user', {
            method: 'POST',
            headers,
            body: '{}',
          })
          const newUser = await storeUserResp.json()
          console.log('newUser', newUser)

          this.chart.userId = newUser.id

          const storeBirthData = fetch('/api/store-birth-data', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              userId: newUser.id,
              datetime: this.date + ' ' + this.time,
              country: this.country.abbr,
              city: this.city,
              state: this.isUsa ? this.state.abbr : null,
            }),
          })

          // const birthData = await storeBirthDataResp.json()
          // console.log('birthData', birthData)

          const storeChart = fetch('/api/store-chart', {
            method: 'POST',
            headers,
            body: JSON.stringify(this.chart),
          }).then(async (resp) => await resp.json())

          const responses = await Promise.all([storeBirthData, storeChart])

          // console.log('storeChart response', storeChartResp)
          // const newChart = await storeChartResp.json()
          console.log('newChart', responses[1])
          this.$emit('chart', responses[1])
        } catch (e) {
          console.log('Could not save', e)
          this.$emit('chart', this.chart)
        }
        this.isLoading = false
      }
    },
    saveDate(date) {
      this.$refs.isDatePickerVisible.save(date)
      this.isDatePickerVisible = false
    },
    saveTime(time) {
      this.$refs.isTimePickerVisible.save(time)
      this.isTimePickerVisible = false
    },
  },
})
</script>
