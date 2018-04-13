function navigatePage() {
    this.each(pages, function(self, page_link) {
        self.thenOpen(page_link, function() {
            var job_links = getJobLinks();

            extractJobInfoFromLinks(job_links);
        });
    });
}

function extractJobInfoFromLinks(job_links) {
    this.each(job_links, function( self, job_link) {
        self.thenOpen(job_link, function() {
            // @TODO code to handle scraping of the page
            // @TODO code to save job data to json file
        });
    });
}

function getJobLinks() {
}

function getPages() {
}

casper.then(function() {
    var pages = getPages();

    // For the first page we're going to have to get the job links and initialize the navigation
    var job_links = getJobLinks();
    extractJobInfoFromLinks(job_links);
    navigatePage();
});