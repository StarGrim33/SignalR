import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import WaitingRoom from "./components/waitingroom";
import {useState} from "react";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import ChatRoom from "./components/chatroom";

function App() {
    const [conn, setConnection] = useState();
    const [messages, setMessages] = useState();
    const joinChatroom = async (username, chatroom) => {
        try {
            const conn = new HubConnectionBuilder().withUrl("http://localhost:5236/chat").configureLogging(LogLevel.Information).build();
            conn.on("JoinSpecificChatRoom", (username, msg) => {
                console.log("msg: ", msg);
            });
            conn.on("ReceiveSpecificMessage", (username, msg) => {
                setMessages(messages => [...messages, {username, msg}]);
            });

            await conn.start();
            await conn.invoke("JoinSpecificChatRoom", {username, chatroom});

            setConnection(conn);
        } catch (e) {
            console.log(e);
        }
    }
    
    const sendMessage = async(message) => {
        try{
            await conn.invoke("SendMessage", message);
        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <div>
            <main>
                <Container>
                    <Row class='px-5 my-5'>
                        <Col sm='12'>
                            <h1 className='font-weight-light'>Welcome to the Twilight ChatApp</h1>
                        </Col>
                    </Row>
                    {!conn ?
                        <WaitingRoom joinChatRoom={joinChatroom}></WaitingRoom>
                        : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
                    }
                </Container>
            </main>
        </div>
    );
}

export default App;
