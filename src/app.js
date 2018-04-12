var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        clearMemoryCaches: true
    },
    waitTimeout: 100,
});
var jobs = [];

casper.start('https://cebu.mynimo.com/jobs');
casper.page.settings.clearMemoryCaches = true;

function getJobLinks() {
    return casper.evaluate(function() {
        var links = document.querySelectorAll('a.jobTitleLink');

        return [].slice.call(links).map(function(link) {
            return link.href;
        });;
    });
}

function getJobData() {
    return casper.evaluate(function() {
        var obj =  {
            'title' : '',
            'company' : '',
            'location' : '',
            'job_description' : '',
            'salary' : '',
        };

        try {
            obj.title = document.querySelector('h1.search_highlight').innerText;
        } catch(ex) {}

        try {
            obj.company = document.querySelector('span.search_highlight').innerText;
        } catch(ex) {}

        try {
            obj.location = document.querySelector('div.location.search_highlight').innerText;
        } catch(ex) {}

        try {
            obj.job_description = document.querySelector('div#contentBody').innerHTML;
        } catch(ex) {}

        try {
            obj.salary = document.querySelector('div.job-level small').innerHTML;
        } catch(ex) {}

        return obj;
    });
}

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());

    var links = getJobLinks();
    console.log('link count:' + links.length);

    this.each(links, function(self, link) {
        self.thenOpen(link, function() {
            // var name = link.replace(/[^0-9]/g, '') + '.jpg';
            var data = getJobData();

            // this.capture(name);

            if(data) {
                console.log(data.title);
                jobs.push(data);
            }
        });

    });

});

casper.then(function() {
    console.log('done scraping all the jobs');
    console.log(jobs);
});

casper.run(function() {
    console.log('done');
    casper.exit(0);
});