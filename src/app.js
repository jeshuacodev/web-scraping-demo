var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        clearMemoryCaches: true
    },
    waitTimeout: 100,
});
var pages = [];
var jobs = [];

casper.start('https://cebu.mynimo.com/jobs');
casper.page.settings.clearMemoryCaches = true;
casper.page.settings.resourceTimeout = 3000;

function getJobLinks() {
    return casper.evaluate(function() {
        var links = document.querySelectorAll('a.jobTitleLink');

        return [].slice.call(links).map(function(link) {
            return link.href;
        });;
    });
}

function getPages() {
    return casper.evaluate(function() {
        var links = [].slice.call(
            document.querySelector('ul.paginator')
                .querySelectorAll('li a')
        ).map(function(item) {
            return item.href;
        });

        return links.slice(0, links.length-2);
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

function navigatePage() {
    var currentPage = 2;
    casper.each(pages, function(self, page_link) {
        self.thenOpen(page_link, function() {
            var job_links = getJobLinks();

            extractJobInfoFromLinks(job_links);
            // casper.capture('page'+currentPage+'.jpg');
            currentPage++;
        });
    });
}

function extractJobInfoFromLinks(job_links) {
    casper.each(job_links, function( self, job_link) {
        self.thenOpen(job_link, function() {
            // @TODO code to handle scraping of the page
            // @TODO code to save job data to json file
            var title = casper.getTitle();

            title = title.replace(/\s/g, '-');
            title = title.replace(/([^a-z0-9])/g, '');

            casper.capture(title+'.jpg');
        });
    });
}

casper.then(function() {
    this.capture('landing page.png');
    pages = getPages();

    navigatePage();
});

casper.run(function() {
    console.log('done');
    casper.exit(0);
});