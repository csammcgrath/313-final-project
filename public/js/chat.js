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

        console.log($('#usernameWhole').html());

        socket.emit('new_message', { 
            message: $('#userInput').val(),
            username: $('#usernameWhole').html()
        });
        $('#userInput').val('');
        $("#scrollbar").scrollTop($("#scrollbar")[0].scrollHeight);
        return false;
    });

    socket.on('new_message', (data) => {
        if (data.message !== '') {
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