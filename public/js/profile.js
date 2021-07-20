$(document).ready(() => {
    if (selectedTab == 'replies') {
        loadReplies()
    } else {
        loadPosts()
    }

})

function loadPosts() {
    $.get("/api/posts", { postedBy: profileUserId, isReplay: false }, (response) => {
        outputPosts(response, $('.postContainer'))
    })
}

function loadReplies() {
    $.get("/api/posts", { postedBy: profileUserId, isReplay: true }, (response) => {
        outputPosts(response, $('.postContainer'))
    })
}