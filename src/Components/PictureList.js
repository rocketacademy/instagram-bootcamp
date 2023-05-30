import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

const REALTIME_DATABASE_KEY = "pics";

export default class PictureList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pics: [],
    };
  }

  componentDidMount() {
    const picListRef = ref(database, REALTIME_DATABASE_KEY);

    onChildAdded(picListRef, (data) => {
      this.setState((state) => ({
        pics: [...state.pics, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.pics && this.state.pics.length > 0 ? (
            this.state.pics.map((picItem) => (
              <li key={picItem.key}>
                <div>
                  
                  
                  <h4>User posted: {picItem.val.description}</h4>
                  {picItem.val.url ? (
                    <img src={picItem.val.url} width="50%vw"  alt="pic"/>
                  ) : (
                    <p>No images</p>
                  )}
                  <h5>
                    on {picItem.val.date}
                  </h5>
                </div>
              </li>
            ))
          ) : (
            <p>No pic here</p>
          )}
        </ul>
      </div>
    );
  }
}
