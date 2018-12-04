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

        console.log(`Value: ${$('#userNameChat').val()}`);
        socket.emit('new_message', { message: $('#userInput').val(), user: $('#userNameChat').val() });
        $('#userInput').val('');
        // $("#scrollbar").scrollTop($("#scrollbar")[0].scrollHeight);
        return false;
    });

    socket.on('new_message', ({message, username}) => {
        // let username = $('#usernameWhole').html();
        // let username = $('#userNameChat').val();
        console.log(`Data obj: `, message, username);

        if (message !== '' && username) {
            $('#chatroom').append(`\
                <li class="left clearfix">\
                    <div class="chat-body clearfix">\
                        <div class="header">\
                            <b>${username}</b><br>\
                        </div>\
                        <p>\
                            ${message}\
                        </p>\
                    </div>\
                </li >`
            )
        }
    });
});