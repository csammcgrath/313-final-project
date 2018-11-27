const { services, mapping } = require('./constants');

function rexburgOffice(req, res) {
    let w = req.body.weight;
    let t = req.body.serviceType;
    let total = calculateRate(w, t);

    res.render('pages/postal', {total:total, weight:w, type:mapping[t]});
}

function calculateRate(weight, type) {
    let typeRegex = type.replace(/(\(|\)|\-|\s)/g, '');
    let typeMatch = type.charAt(0).toLowerCase() + typeRegex.slice(1);
    
    return services[typeMatch][weight.toString()];
}

module.exports = {
    rexburgOffice,
}