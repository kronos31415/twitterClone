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
        var postedBy = postData.postedBy
        return `<div class='post'>

        <div class='mainContentContainer'>
            <div class='userImageContainer'>
                <img src='${postedBy.profilePic}'>
            </div>
            <div class='postContentContainer'>
                <div class='header'>
                </div>
                <div class='postBody'>
                    <span>${postData.content}</span>
                </div>
                <div class='postFooter'>
                </div>
            </div>
        </div>
    </div>`;
    }

});