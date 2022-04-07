import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import "./App.css";

const Video = () => {
  const [stream, setStream] = useState();
  const [sdp, setSdp] = useState();
  const inputRef = useRef();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },

      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      setSdp(JSON.stringify(data));
      console.log("Calluser signal", data);
    });

    peer.on("stream", (stream) => {
      console.log("Calluser stream", stream);
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      setSdp(JSON.stringify(data));
      console.log("answerCall signal", data);
    });

    peer.on("stream", (stream) => {
      console.log("answerCall stream", stream);
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const submitRef = () => {
    console.log("Sdp Value is ", JSON.parse(inputRef.current.value));
    connectionRef.current.signal(JSON.parse(inputRef.current.value));
  };

  return (
    <div className="App">
      <button onClick={callUser}>Caller</button>
      <button onClick={answerCall}>answerCall</button>
      <textarea placeholder="copy given text" value={sdp} rows="5"></textarea>
      <input type="text" ref={inputRef} />
      <button onClick={submitRef}>Submit</button>
      <div className="videodiv">
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "300px" }}
        />

        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
};

export default Video;
