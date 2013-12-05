// taken from comment by lazd (https://github.com/wycats/handlebars.js/issues/249)
Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    if (number === 1)
        return singular;
    else
        return (typeof plural === 'string' ? plural : singular + 's');
});

Handlebars.registerHelper('pluralCount', function(number, singular, plural) {
    return number+' '+Handlebars.helpers.pluralize.apply(this, arguments);
});