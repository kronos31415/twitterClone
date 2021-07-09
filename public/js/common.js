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

    $(document).on('click', '.likeButton', function(event) {
        var button = event.target;
        var postId = getPostIdFromElement(button)
        if (postId === undefined) return

        $.ajax({
            url: `/api/posts/${postId}/like`,
            type: 'PUT',
            success: function(postData) {
                console.log(userLoggedIn)
                button.querySelector('span').innerText = postData.likes.length || ''

                if (postData.likes.includes(userLoggedIn._id)) {
                    button.classList.add('active')
                } else {
                    button.classList.remove('active')
                }
            }
        })
    })
});

function getPostIdFromElement(element) {
    var isRoot = element.classList.contains('post')
    var rootElement = isRoot ? element : element.closest(".post")
    return rootElement.dataset.id
}

function createPostHtml(postData) {
    var postedBy = postData.postedBy

    if (postedBy._id === undefined) {
        return console.log('User object not populated')
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName
    var timeStamp = timeDifference(new Date, new Date(postData.createdAt))

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? 'active' : ''
    return `<div class='post' data-id='${postData._id}'>

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
                </div>
                <div class='postButtonContainer'>
                    <button class='reteet'>
                        <i class='fas fa-retweet'></i>
                    </button>
                </div>
                <div class='postButtonContainer red'>
                    <button class='likeButton ${likeButtonActiveClass}'>
                        <i class='far fa-heart'></i>
                        <span>${postData.likes.length || ''}</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now"
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}