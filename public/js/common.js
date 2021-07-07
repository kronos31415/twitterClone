window.addEventListener('DOMContentLoaded', (event) => {
    const postTextArea = document.getElementById('postTextarea');

    postTextArea.addEventListener('keyup', e => {
        const value = e.target.value.trim()

        const submitButton = document.getElementById('submitButton')
        if (submitButton.length == 0) return allert("No submit button found")

        if (value == "") {
            submitButton.disabled = true
            return
        }

        submitButton.disabled = false
    })

    const submitButton = document.getElementById('submitButton')
    submitButton.addEventListener('click', () => {
        var button = document.getElementById('submitButton')
        var textbox = document.getElementById('postTextarea')

        var data = {
            content: textbox.value
        }

        $.post("/api/posts", data, (postData, staus, xhr) => {
            var html = createPostHtml(postData)
            $('.postContainer').prepend(html)
            textbox.value = ''
            button.disabled = true
        })
    })

    function createPostHtml(postData) {
        console.log(postData)
        var postedBy = postData.postedBy
        var displayName = postedBy.firstName + " " + postedBy.lastName
        var timeStamp = "to do later"
        return `<div class='post'>

        <div class='mainContentContainer'>
            <div class='userImageContainer'>
                <img src='${postedBy.profilePic}'>
            </div>
            <div class='postContentContainer'>
                <div class='header'>
                    <a href='/profile/${postedBy.userName}' class='displayName'>${displayName}</a>
                    <span class='username'>${postedBy.userName}</span>
                    <span class='date'>${timeStamp}</span>
                </div>
                <div class='postBody'>
                    <span>${postData.content}</span>
                </div>
                <div class='postFooter'>
                    <div class='postButtonContainer'>
                        <button>
                            <i class='fa fa-comment'></i>
                        </button>
                        <button>
                            <i class='fas fa-retweet'></i>
                        </button>
                        <button>
                            <i class='far fa-heart'></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    }

});