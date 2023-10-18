export default {
  constructParams: function(query) {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
          var data = param.split('='),
            key = data[0],
            value = data[1];
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {})
      : {};
  },
};
