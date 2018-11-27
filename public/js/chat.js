$(document).ready(() => {
    const socket = io();

    $('#chatButton').click((e) => {
        e.preventDefault();

        socket.emit('new_message', { message: $('#userInput').val() });
        $('#userInput').val('');
        return false;
    });

    socket.on('new_message', (data) => {
        $('#chatroom').append(`\
            <li class="left clearfix">\
                <div class="chat-body clearfix">\
                    <div class="header">\
                        <b>Anonymous</b><br>\
                    </div>\
                    <p>\
                        ${data.message}\
                    </p>\
                </div>\
            </li >`
        )
    });
});