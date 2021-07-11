window.addEventListener('DOMContentLoaded', function(event) {
    var splitURL = window.location.href.split('/')
    var id = splitURL[splitURL.length - 1]
    $.get("/api/posts/" + id, (response) => {
        outputPostsWithReplies(response, $('.postContainer'))
    })
});