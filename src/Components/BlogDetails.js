import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Button, Card } from "react-bootstrap";

const BlogDetails = () => {
  const { id = null } = useParams();
  const [data, setData] = useState([]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [id]);

  return (
    <React.Fragment>
      <div className="cards">
            <div className="cards-inner">
              <Card style={{ width: "18rem", textAlign: "center" }}>
                <Card.Body>
                  <Card.Title>{data.Title}</Card.Title>
                  <Card.Text>{data.Description}</Card.Text>
                  <Button
                    variant="primary me-2"
                  >
                    Add To Cart
                  </Button>
                  <Button
                    variant="primary"
                  >
                    Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </div>
      </div>
    </React.Fragment>
  );
};

export default BlogDetails;
