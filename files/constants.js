const services = {
    'lettersStamped': {
        '1': 0.50,
        '2': 0.71,
        '3': 0.92,
        '3.5': 1.13
    },'lettersMetered': {
        '1': 0.47,
        '2': 0.68,
        '3': 0.89,
        '3.5': 1.10
    },'largeEnvelopesFlats': {
        '1': 1.00,
        '2': 1.21,
        '3': 1.42,
        '4': 1.63,
        '5': 1.84,
        '6': 2.05,
        '7': 2.26,
        '8': 2.47,
        '9': 2.68,
        '10': 2.89,
        '11': 3.10,
        '12': 3.31,
        '13': 3.52
    }, 'firstClassPackageRetail': {
        '1': 3.50,
        '2': 3.50,
        '3': 3.50,
        '4': 3.50,
        '5': 3.75,
        '6': 3.75,
        '7': 3.75,
        '8': 3.75,
        '9': 4.10,
        '10': 4.45,
        '11': 4.80,
        '12': 5.15,
        '13': 5.50
    }
}

const mapping = {
    'lettersStamped': 'Letters (Stamped)',
    'lettersMetered': 'Letters (Metered',
    'largeEnvelopesFlats': 'Large Envelopes (Flats)',
    'firstClassPackageRetail': 'First-Class Package - Retail'
}

module.exports = {
    services,
    mapping
}