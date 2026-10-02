import React, { useState, useRef } from 'react'

import "../styles/VideoComponent.css";

const server_url = "http://localhost:8000";

const peerConfigConnections = {
    "iceServers" : [
        {"urls": "stun:stun.l.google.com"}
    ]
}

export default function VideoMeet() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let[videoAvailable, setVideoAvailable] = useState(true);

    let[audioAvailable, setAudioAvailable] = useState(true);

    let[video, setVideo] = useState();

    let[audio, setAudio] = useState();

    let[screen, setScreen] = useState();

    let [showModel , setModel] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message , setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    //TODO
    // if(isChrome() === false){

    // }



  return (
    <div>
        {askForUsername === true ?
        <div></div> : <></>
        }
    </div>
  )
}
