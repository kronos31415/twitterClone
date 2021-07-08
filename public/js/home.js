window.addEventListener('DOMContentLoaded', function(event) {
    $.get("/api/posts", (response) => {
        console.log(response);
        outputPosts(response, $('.postContainer'))
    })
});

function outputPosts(results, container) {
    container.innerHtml = ''
    results.forEach(post => {
        var html = createPostHtml(post);
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show</span>")
    }
}