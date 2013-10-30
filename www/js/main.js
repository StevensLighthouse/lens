var tours = [
  { title: 'Stevens Tour', distance: '0.3mi' },
  { title: 'Hoboken Bread Tour', distance: '0.3mi' },
  { title: 'Stevens Family Tour', distance: '0.3mi' },
  { title: 'Baseball History Tour', distance: '0.3mi' },
  { title: 'Sinatra Tour', distance: '0.3mi' },
  { title: 'Stevens Athletics Tour', distance: '0.3mi' },
  { title: 'Hoboken Garden Tour', distance: '0.3mi' }
];

function buildTourMenu(tours) {
  var listingElement = document.querySelector('script[name="tour-menu-listing"]');
  var menuElement = document.querySelector('script[name="tour-menu"]');

  var listingTemplate = Handlebars.compile(listingElement.innerHTML);
  var menuTemplate = Handlebars.compile(menuElement.innerHTML);

  var items = [], i;

  for (i = 0; i < tours.length; i++) {
    items.push(listingTemplate(tours[i]));
  }

  document.querySelector('#overlay').innerHTML = menuTemplate({ items: items });
}

// Go, go, go!
app.initialize();
initialize();

buildTourMenu(tours);
