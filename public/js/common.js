window.addEventListener('DOMContentLoaded', (event) => {
    const postTextArea = document.getElementById('postTextarea');
    const postModalTextArea = document.getElementById('replayTextarea');

    [postTextArea, postModalTextArea].forEach(element => {
        element.addEventListener('keyup', function(e) {
            const value = e.target.value.trim()
            const textbox = e.target

            let isModal = hasParentWithMatchingSelector(textbox, '.modal')
            let submitButton = isModal ? document.getElementById('submitModalButton') : document.getElementById('submitButton')
            if (submitButton.length == 0) return allert("No submit button found")

            if (value == "") {
                submitButton.disabled = true
                return
            }

            submitButton.disabled = false

        })
    });

    $('#replayModal').on('show.bs.modal', function(event) {
        var button = event.relatedTarget
        var postId = getPostIdFromElement(button)
        document.getElementById('submitModalButton').dataset.id = postId
        $.get(`/api/posts/${postId}`, (response) => {
            var newPostContainer = $('#originalPostContainer')
            outputPosts(response, newPostContainer)
        })
    })

    $('#replayModal').on('hidden.bs.modal', function(event) {
        document.getElementById('originalPostContainer').innerHTML = ''
    })

    const submitButton = document.getElementById('submitButton')
    const submitModalButton = document.getElementById('submitModalButton');
    [submitButton, submitModalButton].forEach(element => {
        element.addEventListener('click', function(event) {
            var button = event.target
            let isModal = hasParentWithMatchingSelector(button, '.modal')
            var textBox = isModal ? document.getElementById('replayTextarea') : document.getElementById('postTextarea')

            var data = {
                content: textBox.value
            }

            if (isModal) {
                var postId = button.dataset.id
                data.replayTo = postId
            }

            $.post("/api/posts", data, (postData, staus, xhr) => {
                if (postData.replayTo) {
                    location.reload();
                } else {
                    var html = createPostHtml(postData)
                    $('.postContainer').prepend(html)
                    textBox.value = ''
                    button.disabled = true
                }
            })

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
                // console.log(userLoggedIn)
                button.querySelector('span').innerText = postData.likes.length || ''

                if (postData.likes.includes(userLoggedIn._id)) {
                    button.classList.add('active')
                } else {
                    button.classList.remove('active')
                }
            }
        })
    })

    $(document).on('click', '.retweetButton', function(event) {
        var button = event.target;
        var postId = getPostIdFromElement(button)
        if (postId === undefined) return

        $.ajax({
            url: `/api/posts/${postId}/retweet`,
            type: 'POST',
            success: function(postData) {

                button.querySelector('span').innerText = postData.retweetUsers.length || ''

                if (postData.retweetUsers.includes(userLoggedIn._id)) {
                    button.classList.add('active')
                } else {
                    button.classList.remove('active')
                }
            }
        })
    })

    $(document).on('click', '.post', function(event) {
        var element = event.target;
        var postId = getPostIdFromElement(element)
        if (postId !== undefined && element.tagName != 'BUTTON') {
            console.log(element.tagName)
            window.location.href = `/posts/${postId}`
        }

    })
});

function hasParentWithMatchingSelector(target, selector) {
    return [...document.querySelectorAll(selector)].some(el =>
        el !== target && el.contains(target)
    )
}

function getPostIdFromElement(element) {
    var isRoot = element.classList.contains('post')
    var rootElement = isRoot ? element : element.closest(".post")
    return rootElement.dataset.id
}

function createPostHtml(postData) {
    // console.log(postData)
    if (postData == null) alert("post object is null")
    var isRetweet = postData.retweetData !== undefined;
    var retweetedBy = isRetweet ? postData.postedBy.userName : null;
    postData = isRetweet ? postData.retweetData : postData

    var postedBy = postData.postedBy

    if (postedBy._id === undefined) {
        return console.log('User object not populated')
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName
    var timeStamp = timeDifference(new Date, new Date(postData.createdAt))

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? 'active' : ''
    var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? 'active' : ''

    var retweetText = '';
    if (isRetweet) {
        retweetText = `<i class='fas fa-retweet'></i><span>retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`
    }

    var replyFlag = '';
    if (postData.replayTo) {
        if (!postData.replayTo._id) {
            return alert("Replay to is not poulated")
        }
        var replayUser = postData.replayTo.postedBy.userName
        replyFlag = `<div class='replayFlag'>
                            Replying to <a href='/profile/${replayUser}'>@${replayUser}</a>
                        </div>`
    }

    return `<div class='post' data-id='${postData._id}'>
    <div class='postRetweeted'>
        ${retweetText}
    </div>
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
            ${replyFlag}
            <div class='postBody'>
                <span>${postData.content}</span>
            </div>
            <div class='postFooter'>
                <div class='postButtonContainer'>
                    <button data-toggle='modal' data-target='#replayModal'>
                        <i class='fa fa-comment'></i>
                    </button>
                </div>
                <div class='postButtonContainer green'>
                    <button class='retweetButton ${retweetButtonActiveClass}'>
                        <i class='fas fa-retweet'></i>
                        <span>${postData.retweetUsers.length || ''}</span>
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

function outputPosts(results, container) {
    container.innerHtml = ''
    if (!Array.isArray(results))
        results = [results]
    results.forEach(post => {
        var html = createPostHtml(post);
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show</span>")
    }
}