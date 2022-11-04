import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import Card from "react-bootstrap/Card";

export function FileDisplay({ picture }) {
  const imageRef = ref(storage, picture);
  const [urlName, setUrlName] = useState("");

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        setUrlName(url);
      })
      .catch((err) => {
        console.log("unable to download url", err);
      });
  },[urlName])
  
return (
  <Card style={{ width: '30vw', minHeight: "60vh", color: "black" }}>
      <Card.Img variant="top" src={urlName} />
      <Card.Body>
        <Card.Title>Cute dogs</Card.Title>
        <Card.Text>
          Don't you just love them?
        </Card.Text>
      </Card.Body>
    </Card>
  // <div >
  //   <img src={urlName} alt="photos" style={{ maxWidth: "200px" }} />
  // </div>
);
  
}
