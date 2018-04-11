var casper = require('casper').create();
casper.start('https://cebu.mynimo.com/jobs');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());

    this.capture('jobs.png');
});

casper.run();