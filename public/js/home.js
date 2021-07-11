window.addEventListener('DOMContentLoaded', function(event) {
    $.get("/api/posts", (response) => {
        console.log(response);
        outputPosts(response, $('.postContainer'))
    })
});