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

        let msg = $('#userInput').val();
        let usr = $('#userNameChat').val();

        console.log(`Message: `, msg, ` Type: ${typeof msg}`);
        console.log(`Username: `, usr, ` Type: ${typeof usr}`);
        console.log(`JSON: `, );
        socket.emit('new_message', JSON.stringify({ message: msg, username: usr }));
        $('#userInput').val('');
        // $("#scrollbar").scrollTop($("#scrollbar")[0].scrollHeight);
        return false;
    });

    socket.on('new_message', (obj) => {
        // let username = $('#usernameWhole').html();
        // let username = $('#userNameChat').val();
        let data = JSON.parse(obj);
        console.log(`Data obj: `, data.message, data.username);

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