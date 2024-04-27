const MessageContainer = ({messages}) => {
    return <div>
        {
            messages.map((message, index) => {
                <table striped bordered>
                    <tr key={index}>
                        <td>{message.msg} - {message.username}</td>
                    </tr>
                </table>
            })
        }
    </div>
}

export default MessageContainer;