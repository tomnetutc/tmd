// Consistent color palette for Survey Sample page charts
const SURVEY_SAMPLE_PALETTE = [
    '#507DBC', // Blue
    '#F9A875', // Soft Orange
    '#6DAFA0', // Teal
    '#9D83A7', // Muted Purple
    '#EBC823', // Yellow
    '#657383'  // Slate Gray
];

export interface AttributeCategory {
    label: string;
    field: string;
    value: string;
}

export interface AttributeConfig {
    name: string;
    categories: AttributeCategory[];
    colors: string[];
}

export const ATTRIBUTE_CONFIG: Record<string, AttributeConfig> = {
    gender: {
        name: 'Gender',
        categories: [
            { label: 'Male', field: 'female', value: '0.0' },
            { label: 'Female', field: 'female', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 2)
    },
    age: {
        name: 'Age',
        categories: [
            { label: '15 to 19 years', field: 'age_15_19', value: '1.0' },
            { label: '20 to 29 years', field: 'age_20_29', value: '1.0' },
            { label: '30 to 49 years', field: 'age_30_49', value: '1.0' },
            { label: '50 to 64 years', field: 'age_50_64', value: '1.0' },
            { label: '65 years or older', field: 'age_65p', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 5)
    },
    race: {
        name: 'Race',
        categories: [
            { label: 'White', field: 'white', value: '1.0' },
            { label: 'Black', field: 'black', value: '1.0' },
            { label: 'Asian', field: 'asian', value: '1.0' },
            { label: 'Other', field: 'race_other', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 4)
    },
    education: {
        name: 'Education',
        categories: [
            { label: 'Less than high school', field: 'less_than_hs', value: '1.0' },
            { label: 'High school', field: 'hs_grad', value: '1.0' },
            { label: 'Some college degree', field: 'some_col_assc_deg', value: '1.0' },
            { label: "Bachelor's degree", field: 'bachelor', value: '1.0' },
            { label: 'Graduate degree(s)', field: 'grad_sch', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 5)
    },
    employment: {
        name: 'Employment',
        categories: [
            { label: 'Full-time worker', field: 'full_time', value: '1.0' },
            { label: 'Part-time worker', field: 'part_time', value: '1.0' },
            { label: 'Non-worker', field: 'unemployed', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 3)
    },
    income: {
        name: 'Household Income',
        categories: [
            { label: '<$35K', field: 'inc_up35', value: '1.0' },
            { label: '≥$35K, <$50K', field: 'inc_35_50', value: '1.0' },
            { label: '≥$50K, <$75K', field: 'inc_50_75', value: '1.0' },
            { label: '≥$75K, <$100K', field: 'inc_75_100', value: '1.0' },
            { label: '≥$100K', field: 'inc_100p', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 5)
    },
    household_size: {
        name: 'Household Size',
        categories: [
            { label: 'One', field: 'hhsize_1', value: '1.0' },
            { label: 'Two', field: 'hhsize_2', value: '1.0' },
            { label: 'Three or more', field: 'hhsize_3p', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 3)
    },
    location: {
        name: 'Household Location',
        categories: [
            { label: 'Metropolitan', field: 'non_metropolitan', value: '0.0' },
            { label: 'Non-metropolitan', field: 'non_metropolitan', value: '1.0' }
        ],
        colors: SURVEY_SAMPLE_PALETTE.slice(0, 2)
    }
};

export type AttributeKey = keyof typeof ATTRIBUTE_CONFIG;
