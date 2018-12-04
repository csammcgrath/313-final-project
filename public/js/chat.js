$(document).ready(() => {
    const socket = io();

    $('#userInput').keyup((event) => {
        event.preventDefault();

        if (event.keyCode === 13) {
            $('#chatButton').click();
        }
    }); 

    $('#chatButton').click((e) => {
        e.preventDefault();

        socket.emit('new_message', { message: $('#userInput').val(), user: $('#userNameChat').val() });
        $('#userInput').val('');
        // $("#scrollbar").scrollTop($("#scrollbar")[0].scrollHeight);
        return false;
    });

    socket.on('new_message', (data) => {
        // let username = $('#usernameWhole').html();
        // let username = $('#userNameChat').val();
        console.log(`Data obj: ${data}`);

        if (data.message !== '' && data.username) {
            $('#chatroom').append(`\
                <li class="left clearfix">\
                    <div class="chat-body clearfix">\
                        <div class="header">\
                            <b>${data.username}</b><br>\
                        </div>\
                        <p>\
                            ${data.message}\
                        </p>\
                    </div>\
                </li >`
            )
        }
    });
});